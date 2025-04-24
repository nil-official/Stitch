package com.ecommerce.service.impl;

import com.ecommerce.dto.PaymentDto;
import com.ecommerce.dto.PaymentVerificationDto;
import com.ecommerce.exception.PaymentException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Order;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.service.PaymentService;
import com.ecommerce.user.domain.OrderStatus;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Value("${razorpay.api.key}")
    private String razorpayKeyId;

    @Value("${razorpay.api.secret}")
    private String razorpayKeySecret;

    @Autowired
    private OrderRepository orderRepository;

    @Override
    @Transactional
    public PaymentDto createPaymentOrder(String orderId, double amount) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", orderId);

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            // Update the order with Razorpay order ID
            Order order = orderRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));

            order.getPaymentDetails().setPaymentDate(LocalDateTime.now());
            order.setRazorpayOrderId(razorpayOrder.get("id"));
            orderRepository.save(order);

            PaymentDto paymentDto = new PaymentDto();
            paymentDto.setOrderId(orderId);
            paymentDto.setRazorpayOrderId(razorpayOrder.get("id"));
            paymentDto.setAmount(amount);

            return paymentDto;

        } catch (RazorpayException e) {
            throw new PaymentException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public PaymentDto verifyPayment(PaymentVerificationDto verificationDto) {
        try {
            // Verify the payment signature
            String data = verificationDto.getRazorpayOrderId() + "|" + verificationDto.getRazorpayPaymentId();
            boolean isValidSignature = Utils.verifySignature(
                    data,
                    verificationDto.getRazorpaySignature(),
                    razorpayKeySecret
            );

            if (!isValidSignature) {
                throw new PaymentException("Payment verification failed: Invalid signature");
            }

            // Update order with payment details
            Order order = orderRepository.findByOrderId(verificationDto.getOrderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", verificationDto.getOrderId()));

            order.getPaymentDetails().setPaymentId(verificationDto.getRazorpayPaymentId());
            order.getPaymentDetails().setSignature(verificationDto.getRazorpaySignature());
            order.getPaymentDetails().setStatus("COMPLETED");
            order.setOrderStatus(OrderStatus.PLACED);

            orderRepository.save(order);

            PaymentDto paymentDto = new PaymentDto();
            paymentDto.setOrderId(verificationDto.getOrderId());
            paymentDto.setRazorpayOrderId(verificationDto.getRazorpayOrderId());
            paymentDto.setRazorpayPaymentId(verificationDto.getRazorpayPaymentId());
            paymentDto.setStatus("COMPLETED");

            return paymentDto;

        } catch (Exception e) {
            throw new PaymentException("Payment verification failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void handleFailedPayment(String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));

        order.getPaymentDetails().setStatus("FAILED");
        order.setOrderStatus(OrderStatus.PAYMENT_FAILED);

        orderRepository.save(order);
    }

//    @Override
//    public PaymentLinkResponse createPaymentLink(Long orderId, String jwt) throws RazorpayException, UserException, OrderException {
//
//        Order order = orderService.findOrderById(orderId);
//        if (order.getOrderStatus() != OrderStatus.PENDING) {
//            throw new OrderException("Order already placed! No need to pay again.");
//        }
//
//        JSONObject paymentLinkRequest = new JSONObject();
//        paymentLinkRequest.put("amount", order.getTotalDiscountedPrice() * 100);
//        paymentLinkRequest.put("currency", "INR");
//
//        JSONObject notes = new JSONObject();
//        notes.put("orderId", orderId);
//        paymentLinkRequest.put("notes", notes);
//
//        JSONObject customer = new JSONObject();
//        customer.put("name", order.getUser().getFirstName() + " " + order.getUser().getLastName());
//        customer.put("contact", order.getUser().getMobile());
//        customer.put("email", order.getUser().getEmail());
//        paymentLinkRequest.put("customer", customer);
//
//        JSONObject notify = new JSONObject();
//        notify.put("sms", true);
//        notify.put("email", true);
//        paymentLinkRequest.put("notify", notify);
//        paymentLinkRequest.put("reminder_enable", true);
//
//        paymentLinkRequest.put("callback_url", backendBaseUrl + "/api/payments/callback?orderId=" + order.getOrderId());
//        paymentLinkRequest.put("callback_method", "get");
//
//        PaymentLink payment = razorpayClient.paymentLink.create(paymentLinkRequest);
//
//        String paymentLinkId = payment.get("id");
//        String paymentLinkUrl = payment.get("short_url");
//        logger.info("Payment id: {}, Payment link: {}", paymentLinkId, paymentLinkUrl);
//
//        order.getPaymentDetails().setRazorpayPaymentLinkId(paymentLinkId);
//        order.getPaymentDetails().setRazorpayPaymentLinkUrl(paymentLinkUrl);
//        orderRepository.save(order);
//
//        return new PaymentLinkResponse(paymentLinkUrl, paymentLinkId);
//    }
//
//    @Override
//    public void processPaymentWebhook(String payload) throws Exception {
//        logger.info("Processing payment webhook: {}", payload);
//
//        JSONObject jsonPayload = new JSONObject(payload);
//        String eventType = jsonPayload.getString("event");
//
//        if ("payment.captured".equals(eventType)) {
//            JSONObject paymentDetails = jsonPayload.getJSONObject("payload").getJSONObject("payment").getJSONObject("entity");
//
//            JSONObject notes = paymentDetails.getJSONObject("notes");
//            Long orderId = notes.getLong("orderId");
//
//            Order order = orderService.findOrderById(orderId);
//            order.getPaymentDetails().setRazorpayAccountId(jsonPayload.getString("account_id"));
//            order.getPaymentDetails().setRazorpayPaymentId(paymentDetails.getString("id"));
//            order.setRazorpayOrderId(paymentDetails.getString("order_id"));
//            order.getPaymentDetails().setRazorpayPaymentMethod(PaymentMethod.valueOf(paymentDetails.getString("method").toUpperCase()));
//            order.getPaymentDetails().setRazorpayPaymentDescription(paymentDetails.getString("description"));
//            order.getPaymentDetails().setRazorpayPaymentStatus(PaymentStatus.COMPLETED);
//            order.setOrderStatus(OrderStatus.PLACED);
//
//            orderRepository.save(order);
//            logger.info("Payment processed successfully for orderId: {}", orderId);
//
//        } else {
//            logger.warn("Unsupported event type: {}", eventType);
//        }
//
//    }
//
//    @Override
//    public void processPaymentCallback(Map<String, String> params) {
//        try {
//            // Extract necessary parameters
//            String orderId = params.get("orderId"); // Razorpay order ID in callback URL
//
//            // Construct the clean redirect URL (exclude unnecessary query parameters)
//            String redirectUrl = frontendBaseUrl + "/orders/" + orderId;
//
//            // Perform the redirection
//            HttpServletResponse response = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
//            if (response != null) {
//                response.sendRedirect(redirectUrl);
//            }
//        } catch (Exception ex) {
//            logger.error("Error handling payment callback: {}", ex.getMessage());
//            throw new RuntimeException("Failed to process payment callback.", ex);
//        }
//    }

}
