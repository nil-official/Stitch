package com.ecommerce.controller;

import com.ecommerce.dto.ReviewDto;
import com.ecommerce.dto.ReviewsDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.exception.ProductException;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.request.ReviewRequest;
import com.ecommerce.service.ReviewService;
import com.ecommerce.service.UserService;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;
    private UserService userService;

    @GetMapping("/{productId}")
    public ResponseEntity<ReviewsDto> getProductReviewsHandler(@PathVariable Long productId,
                                                               @RequestHeader("Authorization") String jwt) throws ProductException, UserException {

        User user = userService.findUserProfileByJwt(jwt);
        ReviewsDto reviews = reviewService.getProductReviews(productId, user);
        return new ResponseEntity<>(reviews, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<Review> createReviewHandler(@RequestBody ReviewRequest req,
                                                      @RequestHeader("Authorization") String jwt) throws ProductException, UserException {

        User user = userService.findUserProfileByJwt(jwt);
        Review review = reviewService.createReview(req, user);
        return new ResponseEntity<>(review, HttpStatus.ACCEPTED);

    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReviewHandler(@PathVariable String reviewId, @RequestBody ReviewRequest req,
                                                      @RequestHeader("Authorization") String jwt) throws ProductException, UserException {

        User user = userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Review> deleteReviewHandler(@PathVariable String reviewId,
                                                      @RequestHeader("Authorization") String jwt) throws ProductException, UserException {

        User user = userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<>(HttpStatus.NOT_IMPLEMENTED);

    }

    @PostMapping("/{reviewId}/like")
    public ResponseEntity<ReviewDto> likeReview(@PathVariable Long reviewId,
                                                @RequestHeader("Authorization") String jwt) throws ProductException, UserException {

        User user = userService.findUserProfileByJwt(jwt);
        ReviewDto updatedReview = reviewService.toggleLike(reviewId, user);
        return new ResponseEntity<>(updatedReview, HttpStatus.OK);

    }

    @PostMapping("/{reviewId}/dislike")
    public ResponseEntity<ReviewDto> dislikeReview(@PathVariable Long reviewId,
                                                   @RequestHeader("Authorization") String jwt) throws ProductException, UserException {

        User user = userService.findUserProfileByJwt(jwt);
        ReviewDto updatedReview = reviewService.toggleDislike(reviewId, user);
        return new ResponseEntity<>(updatedReview, HttpStatus.OK);

    }

}
