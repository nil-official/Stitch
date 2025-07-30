package com.ecommerce.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeProductDto {

    private Long id;
    private String title;
    private int price;
    private int discountedPrice;
    private int discountPercent;
    private String brand;
    private boolean onSale;
    private String preview;
    private double averageRating;

}
