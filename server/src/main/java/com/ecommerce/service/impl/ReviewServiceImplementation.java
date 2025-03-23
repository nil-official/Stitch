package com.ecommerce.service.impl;

import java.util.Comparator;
import java.util.List;
import java.time.LocalDateTime;

import com.ecommerce.dto.ReviewDto;
import com.ecommerce.dto.ReviewsDto;
import com.ecommerce.mapper.ReviewMapper;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.ecommerce.exception.ProductException;
import com.ecommerce.model.Product;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.request.ReviewRequest;

@Service
@AllArgsConstructor
public class ReviewServiceImplementation implements ReviewService {

    private ProductService productService;
    private ReviewRepository reviewRepository;
    private ProductRepository productRepository;

    @Override
    public Review createReview(ReviewRequest req, User user) throws ProductException {
        // Getting the product
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ProductException("Product not found"));
        // Getting the review by user
        Review reviewByUser = reviewRepository.getReviewByUserAndProduct(user.getId(), product.getId());

        Review review;

        // If review by user exists, update it
        if (reviewByUser != null) {
            reviewByUser.setRating(req.getRating());
            reviewByUser.setReview(req.getReview());
            review = reviewRepository.save(reviewByUser);
        } else {
            // Otherwise, add a new review
            review = new Review();
            review.setUser(user);
            review.setProduct(product);
            review.setRating(req.getRating());
            review.setReview(req.getReview());
            review.setUpdatedAt(LocalDateTime.now());
            review = reviewRepository.save(review);
        }

        // Recalculate and update the average rating
        updateProductAverageRating(product);
        return review;
    }

    private void updateProductAverageRating(Product product) {
        // Fetch all reviews of the product
        List<Review> reviews = reviewRepository.findByProductId(product.getId());

        // Calculate the new average rating
        double avgRating = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);

        // Update the product's average rating
        product.setAverageRating(avgRating);
        productRepository.save(product);
    }

    @Override
    public ReviewsDto getAllReview(Long productId, User user) {
        // Get all the reviews of the product
        List<Review> reviews = reviewRepository.findByProductId(productId);

        // Sort by Date & Map Review entities to ReviewDto using ReviewMapper
        List<ReviewDto> reviewDtos = reviews.stream()
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .map(review -> ReviewMapper.mapToDto(review, user))
                .toList();

        // Create and return the ReviewsDto
        return new ReviewsDto(reviewDtos, reviews.size());
    }

    @Override
    public ReviewDto toggleLike(Long reviewId, User user) throws ProductException {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ProductException("Review not found"));

        if (review.getLikedUsers().contains(user)) {
            // User already liked it, so remove like
            review.getLikedUsers().remove(user);
            review.setLikes(review.getLikes() - 1);
        } else {
            // Add like
            review.getLikedUsers().add(user);
            review.setLikes(review.getLikes() + 1);

            // If user had disliked before, remove the dislike
            if (review.getDislikedUsers().contains(user)) {
                review.getDislikedUsers().remove(user);
                review.setDislikes(review.getDislikes() - 1);
            }
        }

        // Save updated review
        Review updatedReview = reviewRepository.save(review);

        // Convert to DTO
        return ReviewMapper.mapToDto(updatedReview, user);
    }

    @Override
    public ReviewDto toggleDislike(Long reviewId, User user) throws ProductException {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ProductException("Review not found"));

        if (review.getDislikedUsers().contains(user)) {
            // User already disliked it, so remove dislike
            review.getDislikedUsers().remove(user);
            review.setDislikes(review.getDislikes() - 1);
        } else {
            // Add dislike
            review.getDislikedUsers().add(user);
            review.setDislikes(review.getDislikes() + 1);

            // If user had liked before, remove the like
            if (review.getLikedUsers().contains(user)) {
                review.getLikedUsers().remove(user);
                review.setLikes(review.getLikes() - 1);
            }
        }

        // Save updated review
        Review updatedReview = reviewRepository.save(review);

        // Convert to DTO
        return ReviewMapper.mapToDto(updatedReview, user);
    }

}
