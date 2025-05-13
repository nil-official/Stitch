package com.ecommerce.controller;

import com.ecommerce.exception.ProductException;
import com.ecommerce.model.ProductES;
import com.ecommerce.service.ProductESService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/ES/products")
public class ProductESController {

    private ProductESService productESService;

    @GetMapping
    public ResponseEntity<Iterable<ProductES>> getProducts() throws ProductException {
        Iterable<ProductES> products = productESService.getProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ProductES> createProduct(@RequestBody ProductES product) throws ProductException {
        ProductES createdProduct = productESService.createProduct(product);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<ProductES> updateProduct(@PathVariable Long productId, @RequestBody ProductES product) throws ProductException {
        ProductES updatedProduct = productESService.updateProduct(productId, product);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAllProducts() throws ProductException {
        String response = productESService.deleteAllProducts();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long productId) throws ProductException {
        String response = productESService.deleteProduct(productId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> autocompleteSearch(@RequestParam String query) throws IOException {
        List<String> suggestions = productESService.autocompleteSearch(query);
        return new ResponseEntity<>(suggestions, HttpStatus.OK);
    }

}
