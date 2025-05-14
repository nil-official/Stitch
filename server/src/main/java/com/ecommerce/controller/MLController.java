package com.ecommerce.controller;

import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;
import com.ecommerce.request.RecommendProductRequest;
import com.ecommerce.request.SizePredictionRequest;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.service.MLService;
import com.ecommerce.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/ml")
public class MLController {

    private final MLService mlService;
    private final UserService userService;

    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse> sendRecommendationEmail(@RequestHeader("Authorization") String jwt,
                                                               @RequestBody RecommendProductRequest request) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        mlService.sendRecommendationEmailToUser(user, request.getProductId(), request.getLimit());
        ApiResponse apiResponse = new ApiResponse("Recommendation email has been sent successfully to user's email!", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @PostMapping("/recommend/ids")
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
