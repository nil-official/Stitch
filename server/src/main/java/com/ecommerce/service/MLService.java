package com.ecommerce.service;

import com.ecommerce.request.RankScoreRequest;
import com.ecommerce.request.SizePredictionRequest;

import java.util.List;

public interface MLService {

    double getRankScore(RankScoreRequest request);

    List<Long> getRecommendedProducts(Long productId, int limit);

    List<String> predictSize(SizePredictionRequest request);

}
