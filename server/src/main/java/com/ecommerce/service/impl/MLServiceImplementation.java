package com.ecommerce.service.impl;

import com.ecommerce.dto.ProductMLDto;
import com.ecommerce.mapper.ProductMapper;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.request.RankScoreRequest;
import com.ecommerce.response.RankScoreResponse;
import com.ecommerce.service.MLService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class MLServiceImplementation implements MLService {

    private RestTemplate restTemplate;
    private final ProductRepository productRepository;
    private final String ML_RANK_API_URL = "http://localhost:8000/api/ml/rank";
    private final String ML_RECOMMEND_API_URL = "http://localhost:8000/api/ml/recommend";

    @Override
    public double getRankScore(RankScoreRequest request) {
        try {
            ResponseEntity<RankScoreResponse> response = restTemplate.postForEntity(
                    ML_RANK_API_URL, request, RankScoreResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().getRankScore();
            } else {
                System.err.println("⚠️ ML API did not return a valid response");
            }
        } catch (Exception e) {
            System.err.println("🚨 Exception calling ML API: " + e.getMessage());
        }

        return 0.0;
    }

    @Override
    public List<Long> getRecommendedProducts(Long productId, int limit) {
        try {
            // Fetch all products and map them to ML DTOs
            List<ProductMLDto> products = ProductMapper.toProductMLDtoList(productRepository.findAll());

            // Create the request payload
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("product_id", productId);
            requestBody.put("top_n", limit);
            requestBody.put("products", products);

            // Call the ML recommend API
            ResponseEntity<Long[]> response = restTemplate.postForEntity(
                    ML_RECOMMEND_API_URL,
                    requestBody,
                    Long[].class
            );

            // Return the response if successful
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return Arrays.asList(response.getBody());
            } else {
                System.err.println("⚠️ ML Recommend API did not return a valid response");
            }
        } catch (Exception e) {
            System.err.println("🚨 Exception calling ML Recommend API: " + e.getMessage());
        }

        return List.of();
    }

}
