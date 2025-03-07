package com.ecommerce.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.ecommerce.exception.ProductException;
import com.ecommerce.model.Product;
import com.ecommerce.request.ProductRequest;

public interface ProductService {

    Product createProduct(ProductRequest req) throws ProductException;

    String deleteProduct(Long productId) throws ProductException;

    Product fullUpdate(Long productId, ProductRequest product) throws ProductException;

    Product partialUpdate(Long productId, ProductRequest req) throws ProductException;

    Product findProductById(Long id) throws ProductException;

    Page<Product> getAllProducts(Integer pageNumber, Integer pageSize);

    Page<Product> searchProduct(String query, Integer pageNumber, Integer pageSize);

    Page<Product> searchProductByCategory(String category, Integer pageNumber, Integer pageSize);

    Page<Product> getAllProduct(String query, List<String> colors,
                                Integer minPrice, Integer maxPrice, Integer minDiscount,
                                String sort, String stock, Integer pageNumber, Integer pageSize);

//    Page<Product> getAllProduct(String category, List<String> colors, List<String> sizes,
//                                Integer minPrice, Integer maxPrice, Integer minDiscount,
//                                String sort, String stock, Integer pageNumber, Integer pageSize);

    public Page<Product> searchProducts(String query, List<String> category, Integer minPrice, Integer maxPrice,
                                        List<String> brand, List<String> size, List<String> color, Integer discount,
                                        Double rating, String sort, Integer pageNumber, Integer pageSize) throws ProductException;

}
