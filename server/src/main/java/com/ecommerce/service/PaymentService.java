package com.ecommerce.service;

import com.ecommerce.dto.PaymentDto;
import com.ecommerce.dto.PaymentVerificationDto;

public interface PaymentService {

    PaymentDto createPaymentOrder(String orderId, double amount);

    PaymentDto verifyPayment(PaymentVerificationDto verificationDto);

    void handleFailedPayment(String orderId);

//    PaymentLinkResponse createPaymentLink(Long orderId, String jwt) throws RazorpayException, UserException, OrderException;
//
//    void processPaymentWebhook(String payload) throws Exception;
//
//    void processPaymentCallback(Map<String, String> params);

}
