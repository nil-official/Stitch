package com.ecommerce.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetailsDto {

    private String paymentMethod;
    private String status;
    private String paymentId;
    private String signature;
    private LocalDateTime paymentDate;

}
