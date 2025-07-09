package com.ecommerce.controller.admin;

import lombok.AllArgsConstructor;
import com.ecommerce.model.ProductES;
import com.ecommerce.service.ProductESService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/ES/products")
public class ProductESController {

    private ProductESService productESService;

    @GetMapping
    public ResponseEntity<List<ProductES>> getProducts() throws Exception {
        List<ProductES> products = productESService.getProducts();
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<String> createProduct(@RequestBody ProductES product) throws Exception {
        productESService.createProduct(product);
        return new ResponseEntity<>("Product Created at Elasticsearch.", HttpStatus.CREATED);
    }

    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> autocompleteSearch(@RequestParam String query) throws Exception {
        List<String> suggestions = productESService.autocompleteSearch(query);
        return new ResponseEntity<>(suggestions, HttpStatus.OK);
    }

}
