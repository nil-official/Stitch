package com.ecommerce.service;

import com.ecommerce.request.RankScoreRequest;

public interface MLService {

    double getRankScore(RankScoreRequest request);

}
