package com.ecommerce.service;

import com.ecommerce.model.User;
import com.ecommerce.request.RankScoreRequest;
import com.ecommerce.request.SizePredictionRequest;

import java.util.List;

public interface MLService {

    void sendRecommendationEmailToUser(User user, Long baseProductId, int limit);

    List<Long> getRecommendedProducts(Long productId, int limit);

    double getRankScore(RankScoreRequest request);

    List<String> predictSize(SizePredictionRequest request);

}
