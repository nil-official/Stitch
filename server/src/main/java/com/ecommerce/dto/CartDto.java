package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {

    private Long id;
    private Set<CartItemDto> cartItems;
    private double totalPrice;
    private int totalItem;
    private int totalDiscountedPrice;
    private int discount;

}
