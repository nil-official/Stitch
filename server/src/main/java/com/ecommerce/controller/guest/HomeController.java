package com.ecommerce.controller.guest;

import com.ecommerce.dto.ProductDto;
import com.ecommerce.dto.UserReviewDto;
import com.ecommerce.exception.ProductException;
import com.ecommerce.request.ReviewRequest;
import com.ecommerce.response.HomeResponse;
import com.ecommerce.service.HomeService;
import com.ecommerce.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.response.ApiResponse;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/public")
public class HomeController {

    private final HomeService homeService;
    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<ApiResponse> welcome() {
        ApiResponse res = new ApiResponse("Welcome To E-Commerce Backend", true);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @GetMapping("/home/products")
    public ResponseEntity<HomeResponse> getHomeProducts(
            @RequestParam(defaultValue = "1") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) throws ProductException {

        HomeResponse products = homeService.getHomeProducts(pageNumber, pageSize);
        return new ResponseEntity<>(products, HttpStatus.OK);

    }

    @GetMapping("/featured-products")
    public ResponseEntity<List<ProductDto>> getFeaturedProducts() throws ProductException {
        List<ProductDto> featuredProducts = homeService.getFeaturedProducts();
        return new ResponseEntity<>(featuredProducts, HttpStatus.OK);
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<List<ProductDto>> getNewArrivals() throws ProductException {
        List<ProductDto> newArrivals = homeService.getNewArrivals();
        return new ResponseEntity<>(newArrivals, HttpStatus.OK);
    }

    @GetMapping("/exclusive-discounts")
    public ResponseEntity<List<ProductDto>> getExclusive() throws ProductException {
        List<ProductDto> discountedProducts = homeService.getExclusiveDiscounts();
        return new ResponseEntity<>(discountedProducts, HttpStatus.OK);
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<ProductDto>> getTopRated() throws ProductException {
        List<ProductDto> topRatedProducts = homeService.getTopRatedProducts();
        return new ResponseEntity<>(topRatedProducts, HttpStatus.OK);
    }

    @GetMapping("/best-seller")
    public ResponseEntity<List<ProductDto>> getBestSeller() throws ProductException {
        List<ProductDto> bestSellerProducts = homeService.getBestSellerProducts();
        return new ResponseEntity<>(bestSellerProducts, HttpStatus.OK);
    }

    @PostMapping("/review/fake/create")
    public ResponseEntity<UserReviewDto> createFakeReview(@RequestBody ReviewRequest req) throws ProductException {
        UserReviewDto reviewDto = reviewService.createFakeReview(req);
        return new ResponseEntity<>(reviewDto, HttpStatus.OK);
    }

}
