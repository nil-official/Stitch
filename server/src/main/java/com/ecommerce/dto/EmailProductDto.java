package com.ecommerce.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailProductDto {

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

}
