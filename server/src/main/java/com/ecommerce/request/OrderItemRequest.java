package com.ecommerce.request;

import com.ecommerce.dto.OrderProductDto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {

    private OrderProductDto product;
    private String size;
    private int quantity;
    private Integer price;
    private Integer discountedPrice;
    private Integer discountPercent;

}
