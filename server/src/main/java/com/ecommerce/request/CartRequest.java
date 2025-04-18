package com.ecommerce.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {

    private Long productId;
    private String size;
    private Integer quantity;

}
