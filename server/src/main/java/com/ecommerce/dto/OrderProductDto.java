package com.ecommerce.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderProductDto {

    private Long id;
    private String title;
    private String brand;
    private String color;
    private String size;
    private int quantity;
    private int price;
    private int discountedPrice;
    private int discountPercent;
    private String preview;

}
