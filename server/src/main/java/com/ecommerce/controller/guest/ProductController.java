package com.ecommerce.controller.guest;

import java.util.List;

import com.ecommerce.dto.ProductDto;
import com.ecommerce.dto.ReviewsDto;
import com.ecommerce.dto.SearchDto;
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
import com.ecommerce.service.ProductService;

@RestController
@AllArgsConstructor
@RequestMapping("/api/products")
public class ProductController {

    private ProductService productService;

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDto> findProductByIdHandler(@PathVariable Long productId) throws ProductException {

        ProductDto product = productService.findProductById(productId);
        return new ResponseEntity<>(product, HttpStatus.ACCEPTED);

    }

    @GetMapping("/similar/{productId}")
    public ResponseEntity<Page<SearchDto>> findSimilarProductsHandler(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) throws ProductException {

        Page<SearchDto> products = productService.findSimilarProducts(productId, pageNumber, pageSize);
        return new ResponseEntity<>(products, HttpStatus.OK);

    }

    @GetMapping("/like/{productId}")
    public ResponseEntity<Page<SearchDto>> findLikeProductsHandler(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "1") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) throws ProductException {

        Page<SearchDto> products = productService.findLikeProducts(productId, pageNumber, pageSize);
        return new ResponseEntity<>(products, HttpStatus.OK);

    }

    @GetMapping("/search")
    public ResponseEntity<Page<SearchDto>> searchProducts(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false) List<String> size,
            @RequestParam(required = false) List<String> color,
            @RequestParam(required = false) Integer discount,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) throws ProductException {

        Page<SearchDto> products = productService.searchProducts(query, category, minPrice,
                maxPrice, brand, size, color, discount, rating, sort, pageNumber, pageSize);
        return new ResponseEntity<>(products, HttpStatus.OK);

    }

    @GetMapping("/reviews/{productId}")
    public ResponseEntity<ReviewsDto> findReviews(@PathVariable Long productId) throws ProductException {

        ReviewsDto reviewsDto = productService.getReviews(productId);
        return new ResponseEntity<>(reviewsDto, HttpStatus.OK);

    }

}
