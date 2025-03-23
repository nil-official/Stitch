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
                review.getUser().getId(),
                review.getUser().getFirstName(),
                review.getUser().getLastName(),
                review.getLikedUsers().contains(user),
                review.getDislikedUsers().contains(user),
                review.getCreatedAt().toString(),
                review.getUpdatedAt().toString()
        );
    }

}
