package com.ecommerce.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RankScoreRequest {

    private String review;
    private double rating;
    private int totalRatings;
    private double avgRating;

}
