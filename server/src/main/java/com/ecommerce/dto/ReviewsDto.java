package com.ecommerce.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewsDto {

    private List<ReviewDto> reviews;
    private int totalReviews;

}
