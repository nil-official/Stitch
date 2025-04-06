package com.ecommerce.service.impl;

import java.util.Comparator;
import java.util.List;
import java.time.LocalDateTime;

import com.ecommerce.dto.ReviewDto;
import com.ecommerce.dto.ReviewStatsDto;
import com.ecommerce.dto.ReviewsDto;
import com.ecommerce.mapper.ReviewMapper;
import com.ecommerce.request.RankScoreRequest;
import com.ecommerce.service.MLService;
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

    private ReviewRepository reviewRepository;
    private ProductRepository productRepository;
    private MLService mlService;

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
            review.setProduct(product);
            review.setRating(req.getRating());
            review.setReview(req.getReview());
            review.setUserId(user.getId());
            review.setFirstName(user.getFirstName());
            review.setLastName(user.getLastName());
            review.setUpdatedAt(LocalDateTime.now());
            review = reviewRepository.save(review);
        }

        // Recalculate and update the average rating
        updateProductAverageRating(req, product);
        return review;
    }

    private void updateProductAverageRating(ReviewRequest req, Product product) {
        // Fetch all reviews of the product
        List<Review> reviews = reviewRepository.findByProductId(product.getId());

        int totalRatings = reviews.size();

        // Calculate the new average rating
        double avgRating = reviews.stream()
                .mapToDouble(Review::getRating)
                .average()
                .orElse(0.0);
        avgRating = Math.round(avgRating * 10.0) / 10.0;

        // Call ML service
        double newRankScore = mlService.getRankScore(
                new RankScoreRequest(req.getReview(), req.getRating(), totalRatings, avgRating)
        );

        double previousRankScore = product.getRankScore();
        double updatedRankScore = (previousRankScore + newRankScore) / 2;

        // Update product fields
        product.setAverageRating(avgRating);
        product.setRankScore(updatedRankScore);

        // Save product
        productRepository.save(product);
    }

    @Override
    public ReviewsDto getProductReviews(Long productId, User user) throws ProductException {
        // Getting the product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found"));

        // Get all the reviews of the product
        List<Review> reviews = reviewRepository.findByProductId(productId);

        // Sort by Date & Map Review entities to ReviewDto using ReviewMapper
        List<ReviewDto> reviewDtos = reviews.stream()
                .sorted(Comparator.comparing(Review::getCreatedAt).reversed())
                .map(review -> ReviewMapper.mapToDto(review, user))
                .toList();

        // Calculate review stats
        int total = reviews.size();
        double average = product.getAverageRating();

        int fiveStar = 0, fourStar = 0, threeStar = 0, twoStar = 0, oneStar = 0;
        for (Review review : reviews) {
            int rating = (int) Math.floor(review.getRating());
            if (rating >= 1 && rating <= 5) {
                switch (rating) {
                    case 5 -> fiveStar++;
                    case 4 -> fourStar++;
                    case 3 -> threeStar++;
                    case 2 -> twoStar++;
                    case 1 -> oneStar++;
                }
            }
        }

        ReviewStatsDto stats = new ReviewStatsDto(total, average, fiveStar, fourStar, threeStar, twoStar, oneStar);

        // Create and return the ReviewsDto
        return new ReviewsDto(reviewDtos, stats);
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

    @Override
    public ReviewDto createFakeReview(ReviewRequest req) throws ProductException {
        // Getting the product
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ProductException("Product not found"));

        // Create a new review
        Review review = new Review();
        review.setProduct(product);
        review.setRating(req.getRating());
        review.setReview(req.getReview());
        review.setUserId(req.getUserId());
        review.setFirstName(req.getFirstName());
        review.setLastName(req.getLastName());
        review.setUpdatedAt(LocalDateTime.now());
        review = reviewRepository.save(review);

        // Recalculate and update the average rating
        updateProductAverageRating(req, product);
        return ReviewMapper.mapToDto(review, null);
    }

}
