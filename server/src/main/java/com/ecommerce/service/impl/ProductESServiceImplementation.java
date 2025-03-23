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
import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

@Service
@AllArgsConstructor
public class ProductESServiceImplementation implements ProductESService {

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

        Supplier<Query> supplier = ESUtil.createSupplierAutoSuggest(query);
        SearchResponse<ProductES> searchResponse = elasticsearchClient
                .search(s -> s.index("products").query(supplier.get()), ProductES.class);

        List<Hit<ProductES>> hitList = searchResponse.hits().hits();
        List<ProductES> productList = new ArrayList<>();
        for (Hit<ProductES> hit : hitList) {
            productList.add(hit.source());
        }

        List<String> listOfProductNames = new ArrayList<>();
        for (ProductES product : productList) {
            listOfProductNames.add(product.getTitle());
        }

        return listOfProductNames;
    }

}
