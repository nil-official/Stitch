package com.ecommerce.service;

import com.ecommerce.model.ProductES;

import java.util.List;

public interface ProductESService {

    void createProduct(ProductES productES) throws Exception;

    List<ProductES> getProducts() throws Exception;

    List<String> autocompleteSearch(String query) throws Exception;

}
