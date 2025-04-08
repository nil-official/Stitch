package com.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductMLDto {

    private Long id;
    private String title;
    private String description;
    private String brand;
    private String color;
    private double rankScore;
    private String category;

}
