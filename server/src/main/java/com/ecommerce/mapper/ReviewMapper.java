package com.ecommerce.mapper;

import com.ecommerce.dto.ReviewDto;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;

public class ReviewMapper {

    public static ReviewDto mapToDto(Review review, User user) {
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
                review.getLikedUsers().contains(user),
                review.getDislikedUsers().contains(user),
                review.getCreatedAt().toString(),
                review.getUpdatedAt().toString()
        );
    }

}
