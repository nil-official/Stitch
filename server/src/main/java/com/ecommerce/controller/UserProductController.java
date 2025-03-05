package com.ecommerce.controller;

import java.util.List;
import java.util.Map;

import com.ecommerce.utility.PaginationUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.exception.ProductException;
import com.ecommerce.model.Product;
import com.ecommerce.service.ProductService;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class UserProductController {

    private ProductService productService;

    @GetMapping("/products")
    public ResponseEntity<Page<Product>> findProductByCategoryHandler(@RequestParam String query, @RequestParam List<String> color,
                                                                      @RequestParam Integer minPrice,
                                                                      @RequestParam Integer maxPrice, @RequestParam Integer minDiscount,
                                                                      @RequestParam String sort, @RequestParam String stock,
                                                                      @RequestParam Integer pageNumber, @RequestParam Integer pageSize) {

        Page<Product> res = productService.getAllProduct(query, color, minPrice, maxPrice, minDiscount, sort, stock, pageNumber, pageSize);
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);

    }

    @GetMapping("/products/id/{productId}")
    public ResponseEntity<Product> findProductByIdHandler(@PathVariable Long productId) throws ProductException {

        Product product = productService.findProductById(productId);
        return new ResponseEntity<>(product, HttpStatus.ACCEPTED);

    }

    @GetMapping("/products/search")
    public ResponseEntity<Page<Product>> searchProductHandler(@RequestParam String query,
                                                              @RequestParam Integer pageNumber, @RequestParam Integer pageSize) {

        Page<Product> products = productService.searchProduct(query, pageNumber, pageSize);
        return new ResponseEntity<>(products, HttpStatus.OK);

    }

    @GetMapping("/products/search/category")
    public ResponseEntity<Page<Product>> searchProductByCategoryHandler(@RequestParam String category,
                                                                        @RequestParam Integer pageNumber, @RequestParam Integer pageSize) {

        Page<Product> products = productService.searchProductByCategory(category, pageNumber, pageSize);
        return new ResponseEntity<>(products, HttpStatus.OK);

    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) Integer discount,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) throws ProductException {

        Page<Product> products = productService.searchProducts(query, category, brand, size, color, minRating,
                minPrice, maxPrice, discount, sort, pageNumber, pageSize);
        return new ResponseEntity<>(products, HttpStatus.OK);

    }

}
