package com.ecommerce.mapper;

import com.ecommerce.dto.UserReviewDto;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.dto.ReviewDto;

public class ReviewMapper {

    public static UserReviewDto mapToUserDto(Review review, User user) {
        return new UserReviewDto(
                review.getId(),
                review.getRating(),
                review.getReview(),
                review.getLikes(),
                review.getDislikes(),
                review.getProduct().getId(),
                review.getUserId(),
                review.getFirstName(),
                review.getLastName(),
                review.getLikedUsers().contains(user),
                review.getDislikedUsers().contains(user),
                review.getCreatedAt().toString(),
                review.getUpdatedAt().toString()
        );
    }

    public static ReviewDto mapToDto(Review review) {
        return new ReviewDto(
                review.getId(),
                review.getRating(),
                review.getReview(),
                review.getLikes(),
                review.getDislikes(),
                review.getProduct().getId(),
                review.getUserId(),
                review.getFirstName(),
                review.getLastName(),
                review.getCreatedAt().toString(),
                review.getUpdatedAt().toString()
        );
    }

}
