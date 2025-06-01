package com.ecommerce.service;

import com.ecommerce.exception.UserException;
import com.ecommerce.request.RankScoreRequest;
import com.ecommerce.request.SizePredictionRequest;

import java.util.List;

public interface MLService {

    void sendRecommendationEmailToUser(Long userId, Long baseProductId, int limit) throws UserException;

    List<Long> getRecommendedProducts(Long productId, int limit);

    double getRankScore(RankScoreRequest request);

    List<String> predictSize(SizePredictionRequest request);

}
