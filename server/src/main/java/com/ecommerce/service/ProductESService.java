package com.ecommerce.service;

import com.ecommerce.exception.ProductException;
import com.ecommerce.model.ProductES;

import java.io.IOException;
import java.util.List;

public interface ProductESService {

    ProductES createProduct(ProductES product) throws ProductException;

    Iterable<ProductES> getProducts() throws ProductException;

    ProductES updateProduct(Long productId, ProductES product) throws ProductException;

    String deleteProduct(Long productId) throws ProductException;

    List<String> autocompleteSearch(String query) throws IOException;

}
