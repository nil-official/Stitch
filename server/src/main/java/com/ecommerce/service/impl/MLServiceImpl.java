package com.ecommerce.service.impl;

import com.ecommerce.dto.EmailProductDto;
import com.ecommerce.dto.ProductMLDto;
import com.ecommerce.exception.MLException;
import com.ecommerce.exception.UserException;
import com.ecommerce.mapper.ProductMapper;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.request.RankScoreRequest;
import com.ecommerce.request.SizePredictionRequest;
import com.ecommerce.response.RankScoreResponse;
import com.ecommerce.response.SizePredictionResponse;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.MLService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class MLServiceImpl implements MLService {

    private final RestTemplate restTemplate;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final String ML_RANK_API_URL = "http://localhost:8000/api/ml/rank";
    private final String ML_RECOMMEND_API_URL = "http://localhost:8000/api/ml/recommend";
    private final String ML_PREDICT_API_URL = "http://localhost:8000/api/ml/predict-size";

    @Override
    public void sendRecommendationEmailToUser(Long userId, Long baseProductId, int limit) throws UserException {
        // Getting user by ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found with ID: " + userId));

        // Step 1: Get recommended product IDs from ML service
        List<Long> recommendedProductIds = getRecommendedProducts(baseProductId, limit);

        if (recommendedProductIds.isEmpty()) {
            System.out.println("⚠️ No recommended products found for product ID: " + baseProductId);
            return;
        }

        // Step 2: Fetch Product entities by ID
        List<Product> recommendedProducts = recommendedProductIds.stream()
                .map(productRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        if (recommendedProducts.isEmpty()) {
            System.out.println("⚠️ No valid products found for the recommended IDs.");
            return;
        }

        // Step 3: Map products to EmailProductDto
        List<EmailProductDto> productDtos = ProductMapper.toEmailProductDtoList(recommendedProducts);

        // Step 4: Send promotional email using email service
        emailService.sendPromotionalEmail(user, productDtos, "recommendation");
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
            throw new MLException("Failed to get recommended products: " + e.getMessage());
        }

        return List.of();
    }

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
    public List<String> predictSize(SizePredictionRequest request) {
        try {
            ResponseEntity<SizePredictionResponse> response = restTemplate.postForEntity(
                    ML_PREDICT_API_URL, request, SizePredictionResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                int index = response.getBody().getIndex();

                // Map index to sizes
                String[][] sizeMappings = {
                        {"XS", "28"},
                        {"S", "30"},
                        {"M", "32"},
                        {"L", "34"},
                        {"XL", "36"},
                        {"XXL", "38"}
                };

                if (index >= 0 && index < sizeMappings.length) {
                    return Arrays.asList(sizeMappings[index]);
                } else {
                    System.err.println("⚠️ Invalid index received: " + index);
                }
            } else {
                System.err.println("⚠️ ML Predict API did not return a valid response");
            }
        } catch (Exception e) {
            System.err.println("🚨 Exception calling ML Predict API: " + e.getMessage());
        }

        return List.of("Unknown", "Unknown");
    }

}
