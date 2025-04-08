package com.ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecommerce.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsFeaturedTrue();

    List<Product> findAllByOrderByDiscountPercentDesc();

    @Query(value = """
            SELECT p
            FROM Product p
            JOIN p.category c
            WHERE LOWER(c.name) = LOWER(:categoryName)
            AND p.quantity > 0
            """)
    List<Product> findProductsByCategoryName(@Param("categoryName") String categoryName);

}
