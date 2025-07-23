package com.ecommerce.service;

import com.ecommerce.dto.UserReviewDto;
import com.ecommerce.dto.UserReviewsDto;
import com.ecommerce.exception.ProductException;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.request.ReviewRequest;

public interface ReviewService {

    Review createReview(ReviewRequest req, User user) throws ProductException;

    UserReviewDto createFakeReview(ReviewRequest req) throws ProductException;

    UserReviewsDto getProductReviews(Long productId, User user) throws ProductException;

    UserReviewDto toggleLike(Long reviewId, User user) throws ProductException;

    UserReviewDto toggleDislike(Long reviewId, User user) throws ProductException;

}
