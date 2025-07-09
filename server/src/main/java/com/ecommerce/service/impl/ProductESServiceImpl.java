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
        MatchPhrasePrefixQueryBuilder matchPhrasePrefixQuery = QueryBuilders
                .matchPhrasePrefixQuery("title", query);

        SearchSourceBuilder sourceBuilder = new SearchSourceBuilder()
                .query(matchPhrasePrefixQuery)
                .size(10);

        SearchRequest searchRequest = new SearchRequest(INDEX)
                .source(sourceBuilder);

        SearchResponse searchResponse = client.search(searchRequest, RequestOptions.DEFAULT);

        Set<String> suggestions = new LinkedHashSet<>();

        for (SearchHit hit : searchResponse.getHits().getHits()) {
            Map<String, Object> source = hit.getSourceAsMap();
            String title = (String) source.get("title");

            if (title == null) continue;

            // Do the word-level filtering like before
            String[] words = title.split("\\s+");
            String lowerQuery = query.toLowerCase();

            for (int i = 0; i < words.length; i++) {
                if (words[i].toLowerCase().startsWith(lowerQuery)) {
                    StringBuilder sb = new StringBuilder();
                    for (int j = i; j < words.length; j++) {
                        sb.append(words[j]).append(" ");
                    }
                    suggestions.add(sb.toString().trim());
                    break;
                }
            }
        }

        return suggestions.stream()
                .map(String::toLowerCase)
                .sorted(Comparator.comparingInt(String::length))
                .limit(10)
                .collect(Collectors.toList());
    }

}
