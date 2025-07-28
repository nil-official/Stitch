package com.ecommerce.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import com.ecommerce.exception.ProductException;
import com.ecommerce.model.ProductES;
import com.ecommerce.repository.ProductESRepository;
import com.ecommerce.service.ProductESService;
import com.ecommerce.utility.ESUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductESServiceImpl implements ProductESService {

    private final ProductESRepository productESRepository;
    private final ElasticsearchClient elasticsearchClient;

    @Override
    public ProductES createProduct(ProductES product) throws ProductException {
        try {
            boolean exists = productESRepository.existsById(product.getId());
            if (exists) {
                throw new ProductException("Product already exists with id " + product.getId() + " in Elasticsearch.");
            }
            return productESRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create product in Elasticsearch: " + e.getMessage());
        }
    }

    @Override
    public Iterable<ProductES> getProducts() throws ProductException {
        try {
            return productESRepository.findAll();
        } catch (Exception e) {
            throw new ProductException("Failed to fetch products from Elasticsearch: " + e.getMessage());
        }
    }

    @Override
    public ProductES updateProduct(Long productId, ProductES product) throws ProductException {
        try {
            boolean exists = productESRepository.existsById(productId);
            if (!exists) {
                throw new ProductException("Product with ID " + productId + " not found in Elasticsearch.");
            }
            return productESRepository.save(product);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update product in Elasticsearch: " + e.getMessage());
        }
    }

    @Override
    public String deleteProduct(Long productId) throws ProductException {
        try {
            boolean exists = productESRepository.existsById(productId);
            if (!exists) {
                throw new ProductException("Product with ID " + productId + " not found in Elasticsearch.");
            }
            productESRepository.deleteById(productId);
            return "Product with ID " + productId + " deleted successfully.";
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete product in Elasticsearch: " + e.getMessage());
        }
    }

    @Override
    public String deleteAllProducts() throws ProductException {
        try {
            productESRepository.deleteAll();
            return "All products deleted successfully.";
        } catch (Exception e) {
            throw new ProductException("Failed to delete all products from Elasticsearch: " + e.getMessage());
        }
    }

    @Override
    public List<String> autocompleteSearch(String query) throws IOException {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        Supplier<Query> supplier = ESUtil.createSupplierAutoSuggest(query);
        SearchResponse<ProductES> searchResponse = elasticsearchClient
                .search(s -> s.index("products").query(supplier.get()), ProductES.class);

        String lowerQuery = query.toLowerCase().trim();
        String[] queryWords = lowerQuery.split("\\s+");

        Set<String> resultSet = new LinkedHashSet<>();

        for (Hit<ProductES> hit : searchResponse.hits().hits()) {
            ProductES product = hit.source();
            if (product == null || product.getTitle() == null) continue;

            String title = product.getTitle().toLowerCase();
            String[] words = title.split("\\s+");

            int matchIndex = -1;
            // Try sequence match
            for (int i = 0; i <= words.length - queryWords.length; i++) {
                boolean sequenceMatch = true;
                for (int j = 0; j < queryWords.length; j++) {
                    if (!words[i + j].startsWith(queryWords[j])) {
                        sequenceMatch = false;
                        break;
                    }
                }
                if (sequenceMatch) {
                    matchIndex = i;
                    break;
                }
            }
            // Fallback: single word
            if (matchIndex == -1) {
                outer:
                for (int i = 0; i < words.length; i++) {
                    for (String qWord : queryWords) {
                        if (words[i].startsWith(qWord)) {
                            matchIndex = i;
                            break outer;
                        }
                    }
                }
            }

            // Trim from matched index
            String trimmed = matchIndex >= 0
                    ? String.join(" ", Arrays.copyOfRange(words, matchIndex, words.length))
                    : title;

            // Highlight exact query substring inside trimmed string
            int idx = trimmed.indexOf(lowerQuery);
            if (idx >= 0) {
                String highlighted = trimmed.substring(0, idx)
                        + "**" + trimmed.substring(idx, idx + lowerQuery.length()) + "**"
                        + trimmed.substring(idx + lowerQuery.length());
                resultSet.add(highlighted);
            } else {
                resultSet.add(trimmed);
            }
        }

        return resultSet.stream()
                .sorted(Comparator.comparingInt(String::length))
                .limit(10)
                .collect(Collectors.toList());
    }

}
