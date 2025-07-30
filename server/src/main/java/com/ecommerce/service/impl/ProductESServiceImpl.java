package com.ecommerce.service.impl;

import com.ecommerce.exception.ProductException;
import com.ecommerce.model.ProductES;
import com.ecommerce.service.ProductESService;
import lombok.RequiredArgsConstructor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.elasticsearch.action.get.GetRequest;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.*;
import org.elasticsearch.index.query.MatchPhrasePrefixQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductESServiceImpl implements ProductESService {

    private final RestHighLevelClient client;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String INDEX = "products";

    @Override
    public void createProduct(ProductES productES) throws Exception {
        // Step 1: Check if product already exists
        GetRequest getRequest = new GetRequest(INDEX, productES.getId().toString());
        boolean exists = client.exists(getRequest, RequestOptions.DEFAULT);

        if (exists) {
            throw new ProductException("Product already exists in Elasticsearch with ID: " + productES.getId());
        }

        // Step 2: Convert and index
        Map<String, Object> jsonMap = objectMapper.convertValue(productES, Map.class);

        IndexRequest request = new IndexRequest(INDEX)
                .id(productES.getId().toString())
                .source(jsonMap);

        client.index(request, RequestOptions.DEFAULT);
    }

    @Override
    public List<ProductES> getProducts() throws Exception {
        SearchRequest searchRequest = new SearchRequest("products");
        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder();
        sourceBuilder.query(QueryBuilders.matchAllQuery());
        sourceBuilder.size(1000);
        searchRequest.source(sourceBuilder);

        SearchResponse response = client.search(searchRequest, RequestOptions.DEFAULT);

        List<ProductES> products = new ArrayList<>();

        for (SearchHit hit : response.getHits().getHits()) {
            Map<String, Object> source = hit.getSourceAsMap();
            ProductES product = objectMapper.convertValue(source, ProductES.class);
            product.setId(Long.valueOf(hit.getId())); // set ID from ES document ID if needed
            products.add(product);
        }

        if (products.isEmpty()) {
            throw new ProductException("No products found in Elasticsearch.");
        }

        return products;
    }

    @Override
    public List<String> autocompleteSearch(String query) throws Exception {
        // Prevent empty query
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        // Build match_phrase_prefix query
        MatchPhrasePrefixQueryBuilder matchPhrasePrefixQuery = QueryBuilders
                .matchPhrasePrefixQuery("title", query);

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder()
                .query(matchPhrasePrefixQuery)
                .size(50); // fetch a bit more, we'll trim ourselves

        SearchRequest searchRequest = new SearchRequest(INDEX)
                .source(sourceBuilder);

        SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);

        String lowerQuery = query.toLowerCase().trim();
        String[] queryWords = lowerQuery.split("\\s+");
        Set<String> resultSet = new LinkedHashSet<>();

        for (SearchHit hit : searchResponse.getHits().getHits()) {
            Map<String, Object> source = hit.getSourceAsMap();
            String title = (String) source.get("title");
            if (title == null) continue;

            String lowerTitle = title.toLowerCase();
            String[] words = lowerTitle.split("\\s+");

            // ---- Sequence matching ----
            int matchIndex = -1;
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
            // ---- Fallback single-word match ----
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

            // ---- Trim from matched index ----
            String trimmed = matchIndex >= 0
                    ? String.join(" ", Arrays.copyOfRange(words, matchIndex, words.length))
                    : lowerTitle;

            resultSet.add(trimmed);
        }

        return resultSet.stream()
                .sorted(Comparator.comparingInt(String::length))
                .limit(10)
                .collect(Collectors.toList());
    }

}
