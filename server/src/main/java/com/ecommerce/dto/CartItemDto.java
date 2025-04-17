package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {

    private Long id;
    private CartProductDto product;
    private String size;
    private int quantity;
    private int price;
    private int discountedPrice;
    private LocalDateTime createdAt;

}
