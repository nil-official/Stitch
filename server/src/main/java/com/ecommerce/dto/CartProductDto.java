package com.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartProductDto {

    private Long id;
    private String title;
    private String brand;
    private String color;
    private int price;
    private int discountedPrice;
    private int discountPercent;
    private String preview;

}
