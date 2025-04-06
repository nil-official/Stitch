package com.ecommerce.service;

import com.ecommerce.dto.ReviewDto;
import com.ecommerce.dto.ReviewsDto;
import com.ecommerce.exception.ProductException;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.request.ReviewRequest;

public interface ReviewService {

    Review createReview(ReviewRequest req, User user) throws ProductException;

    ReviewsDto getProductReviews(Long productId, User user) throws ProductException;

    ReviewDto toggleLike(Long reviewId, User user) throws ProductException;

    ReviewDto toggleDislike(Long reviewId, User user) throws ProductException;

}
