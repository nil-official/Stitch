package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeProductDto {

    private Long id;
    private String title;
    private int price;
    private int discountedPrice;
    private int discountPercent;
    private int quantity;
    private String brand;
    private boolean isFeatured;
    private boolean onSale;
    private String preview;
    private double averageRating;
    private double rankScore;

}
