package com.ecommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {

    private Long id;
    private double rating;
    private String review;
    private int likes;
    private int dislikes;
    private Long productId;
    private Long userId;
    private String firstName;
    private String lastName;
    private boolean isLiked;
    private boolean isDisliked;
    private String createdAt;
    private String updatedAt;

}
