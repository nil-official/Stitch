package com.ecommerce.controller.user;

import com.ecommerce.dto.PaymentDto;
import com.ecommerce.dto.PaymentVerificationDto;
import com.ecommerce.service.PaymentService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<PaymentDto> createPaymentOrder(@RequestParam String orderId, @RequestParam double amount) {
        PaymentDto paymentDto = paymentService.createPaymentOrder(orderId, amount);
        return ResponseEntity.ok(paymentDto);
    }

    @PostMapping("/verify")
    public ResponseEntity<PaymentDto> verifyPayment(@RequestBody PaymentVerificationDto verificationDto) {
        PaymentDto paymentDto = paymentService.verifyPayment(verificationDto);
        return ResponseEntity.ok(paymentDto);
    }

    @PostMapping("/failed")
    public ResponseEntity<Void> handleFailedPayment(@RequestParam String orderId) {
        paymentService.handleFailedPayment(orderId);
        return ResponseEntity.ok().build();
    }

//    @PostMapping("/payments/{orderId}")
//    public ResponseEntity<PaymentLinkResponse> createPaymentLink(@PathVariable @NotNull Long orderId, @RequestHeader("Authorization") String jwt)
//            throws RazorpayException, UserException, OrderException {
//        PaymentLinkResponse response = paymentService.createPaymentLink(orderId, jwt);
//        return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
//    }
//
//    @PostMapping("/webhook/payment")
//    public ResponseEntity<ApiResponse> handlePaymentWebhook(@RequestBody String payload) {
//        try {
//            paymentService.processPaymentWebhook(payload);
//            return new ResponseEntity<>(new ApiResponse("Webhook processed successfully", true), HttpStatus.OK);
//        } catch (Exception e) {
//            logger.error("Error processing webhook: {}", e.getMessage(), e);
//            return new ResponseEntity<>(new ApiResponse("Webhook processing failed", false), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @GetMapping("/payments/callback")
//    public ResponseEntity<Void> handlePaymentCallback(@RequestParam Map<String, String> params) {
//        paymentService.processPaymentCallback(params);
//        return ResponseEntity.status(HttpStatus.FOUND).build();
//    }

}
