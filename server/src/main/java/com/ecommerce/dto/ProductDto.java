package com.ecommerce.dto;

import com.ecommerce.model.Category;
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
public class ProductDto {

    private Long id;
    private String title;
    private String description;
    private int price;
    private int discountedPrice;
    private int discountPercent;
    private int quantity;
    private String brand;
    private String color;
    private boolean isFeatured;
    private boolean onSale;
    private String preview;
    private List<String> images;
    private Set<Size> sizes;
    private double averageRating;
    private int totalReviews;
    private double rankScore;
    private Category category;

}
