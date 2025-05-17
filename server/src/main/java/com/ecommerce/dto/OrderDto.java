package com.ecommerce.dto;

import com.ecommerce.enums.OrderStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {

    private Long id;
    private String orderId;
    private Long userId;
    private List<OrderItemDto> orderItems;
    private LocalDateTime orderDate;
    private LocalDateTime deliveryDate;
    private AddressDto address;
    private PaymentDetailsDto paymentDetails;
    private double totalPrice;
    private Integer totalDiscountedPrice;
    private Integer discount;
    private OrderStatus orderStatus;
    private int totalItem;
    private LocalDateTime createdAt;
    private String razorpayOrderId;

//    private Long id;
//    private String orderId;
//    private LocalDateTime orderDate;
//    private LocalDateTime deliveryDate;
//    private Address shippingAddress;
//    private OrderAddress orderAddress = new OrderAddress();
//    private PaymentDetails paymentDetails = new PaymentDetails();
//    private double totalPrice;
//    private Integer totalDiscountedPrice;
//    private Integer discount;
//    private OrderStatus orderStatus;
//    private int totalItem;
//    private LocalDateTime createdAt;
//    private UserDto userDto;
//    private List<OrderItem> orderItems = new ArrayList<>();

}
