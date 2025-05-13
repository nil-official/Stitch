package com.ecommerce.controller;

import com.ecommerce.request.RecommendProductRequest;
import com.ecommerce.request.SizePredictionRequest;
import com.ecommerce.service.MLService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/ml")
public class MLController {

    private final MLService mlService;

    @PostMapping("/recommend")
    public ResponseEntity<List<Long>> getRecommendedProducts(@RequestBody RecommendProductRequest request) {

        List<Long> recommendedProducts = mlService.getRecommendedProducts(request.getProductId(), request.getLimit());
        return new ResponseEntity<>(recommendedProducts, HttpStatus.OK);

    }

    @PostMapping("/size")
    public ResponseEntity<List<String>> predictSize(@RequestBody SizePredictionRequest request) {

        List<String> predictedSizes = mlService.predictSize(request);
        return new ResponseEntity<>(predictedSizes, HttpStatus.OK);

    }

}
