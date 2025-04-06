package com.ecommerce.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecommerce.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("Select r from Review r where r.product.id=:productId")
    List<Review> getAllProductsReview(@Param("productId") Long productId);

    @Query("SELECT r FROM Review r WHERE r.userId = :userId AND r.product.id = :productId")
    Review getReviewByUserAndProduct(@Param("userId") Long userId, @Param("productId") Long productId);

    List<Review> findByProductId(Long productId);

}
