package com.ecommerce.service;

import java.util.List;

import com.ecommerce.dto.*;
import org.springframework.data.domain.Page;

import com.ecommerce.exception.ProductException;
import com.ecommerce.model.Product;
import com.ecommerce.request.ProductRequest;

public interface ProductService {

    Product createProduct(ProductRequest req) throws ProductException;

    String deleteProduct(Long productId) throws ProductException;

    Product fullUpdate(Long productId, ProductRequest product) throws ProductException;

    Product partialUpdate(Long productId, ProductRequest req) throws ProductException;

    ProductDto findProductById(Long id) throws ProductException;

    Page<Product> getAllProducts(Integer pageNumber, Integer pageSize);

    Page<ProductMLDto> getLimitedProducts(Integer pageNumber, Integer pageSize);

    Page<Product> searchProductByCategory(String category, Integer pageNumber, Integer pageSize);

    Page<SearchDto> findSimilarProducts(Long productId, Integer pageNumber, Integer pageSize) throws ProductException;

    Page<SearchDto> findLikeProducts(Long productId, Integer pageNumber, Integer pageSize) throws ProductException;

    Page<SearchDto> searchProducts(String query, List<String> category, Integer minPrice, Integer maxPrice,
                                   List<String> brand, List<String> size, List<String> color, Integer discount,
                                   Double rating, String sort, Integer pageNumber, Integer pageSize) throws ProductException;

    ReviewsDto getReviews(Long productId) throws ProductException;

    List<SearchHistoryDto> fetchSearchAutocomplete(String query) throws Exception;

}
