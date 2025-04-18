package com.ecommerce.dto;

import com.ecommerce.model.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartProductDto {

    private Long id;
    private String title;
    private String brand;
    private String color;
    private Set<Size> sizes;
    private int price;
    private int discountedPrice;
    private int discountPercent;
    private String preview;

}
