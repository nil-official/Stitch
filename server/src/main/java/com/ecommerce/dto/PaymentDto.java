package com.ecommerce.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDto {

    private String orderId;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private double amount;
    private String status;

}
