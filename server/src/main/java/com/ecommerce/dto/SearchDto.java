package com.ecommerce.dto;

import com.ecommerce.model.Rating;
import com.ecommerce.model.Review;
import com.ecommerce.model.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SearchDto {

    private Long id;
    private String title;
    private int price;
    private int discountedPrice;
    private int discountPercent;
    private int quantity;
    private String brand;
    private String preview;
    private double averageRating;
    private double rankScore;

}
