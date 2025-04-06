package com.ecommerce.service.impl;

import com.ecommerce.request.RankScoreRequest;
import com.ecommerce.response.RankScoreResponse;
import com.ecommerce.service.MLService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@AllArgsConstructor
public class MLServiceImplementation implements MLService {

    private RestTemplate restTemplate;

    private final String ML_API_URL = "http://localhost:8000/api/ml/rank";

    @Override
    public double getRankScore(RankScoreRequest request) {
        try {
            ResponseEntity<RankScoreResponse> response = restTemplate.postForEntity(
                    ML_API_URL, request, RankScoreResponse.class
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

}
