package com.ecommerce.model;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDetails {

    private String paymentMethod;
    private String status;
    private String paymentId;
    private String signature;
    private LocalDateTime paymentDate;

//    private String razorpayAccountId;
//    private String razorpayPaymentId;
//    private PaymentMethod razorpayPaymentMethod;
//    private String razorpayPaymentDescription;
//    private PaymentStatus razorpayPaymentStatus;
//    private String razorpayPaymentLinkId;
//    private String razorpayPaymentLinkUrl;

}
