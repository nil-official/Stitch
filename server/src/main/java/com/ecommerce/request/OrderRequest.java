package com.ecommerce.request;

import com.ecommerce.dto.AddressDto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private List<OrderItemRequest> orderItems;
    private AddressDto address;
    private String paymentMethod;

}
