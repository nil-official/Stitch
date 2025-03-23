package com.ecommerce.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecommerce.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Getting all featured products
    List<Product> findByIsFeaturedTrue();

    // Getting the most recent products added to the catalog
    @Query("SELECT p FROM Product p WHERE p.createdAt >= :fromDate ORDER BY p.createdAt DESC")
    List<Product> findNewArrivals(@Param("fromDate") LocalDateTime fromDate);

    // Getting all discounted products
    @Query("SELECT p FROM Product p WHERE p.discountPercent > 0 ORDER BY p.discountPercent DESC")
    List<Product> findDiscountedProducts();

    // Getting all top-rated products
    @Query("SELECT p FROM Product p WHERE p.averageRating > 0 ORDER BY p.averageRating DESC")
    List<Product> findTopRatedProducts();

    @Query(value = """
            SELECT * FROM product
            WHERE
                title ~* CONCAT('\\y', :query, '\\y') OR
                description ~* CONCAT('\\y', :query, '\\y') OR
                brand ~* CONCAT('\\y', :query, '\\y') OR
                color ~* CONCAT('\\y', :query, '\\y') OR
                EXISTS (
                    SELECT 1 FROM categories
                    WHERE categories.id = product.category_id
                    AND categories.name ~* CONCAT('\\y', :query, '\\y')
                )
            """, nativeQuery = true)
    List<Product> searchProduct(@Param("query") String query);

    @Query(value = """
            SELECT p
            FROM Product p
            JOIN p.category c
            WHERE LOWER(c.name) = LOWER(:categoryName)
            AND p.quantity > 0
            """)
    List<Product> findProductsByCategoryName(@Param("categoryName") String categoryName);

}
