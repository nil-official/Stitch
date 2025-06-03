package com.ecommerce.service;

import java.util.List;

import com.ecommerce.dto.OrderAnalyticsDto;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.model.User;
import com.ecommerce.request.OrderRequest;
import com.ecommerce.enums.OrderStatus;

public interface OrderService {

    OrderDto createOrder(User user, OrderRequest orderRequest);

    OrderDto getOrderById(Long orderId);

    OrderDto getOrderByOrderId(String orderId);

    List<OrderDto> getAllOrders();

    List<OrderDto> getLastFiveOrders();

    List<OrderDto> getOrdersByUser(User user);

    OrderDto updateOrderStatus(Long orderId, OrderStatus status);

    OrderDto cancelOrder(Long orderId);

    void deleteOrder(Long orderId);

    OrderDto createRazorpayOrder(User user, OrderRequest orderRequest);

    OrderDto updatePaymentDetails(String orderId, String razorpayPaymentId, String razorpaySignature);

    OrderAnalyticsDto getOrderAnalytics();

//    OrderDto createOrder(User user, AddressDto shippingAddress) throws OrderException;
//
//    OrderDto createOrder(User user, Long addressId) throws OrderException;
//
//    Order findOrderById(Long orderId) throws OrderException;
//
//    OrderDto findOrderByOrderId(User user, String orderId) throws UserException, OrderException;
//
//    OrderDto viewOrderById(Long orderId) throws OrderException;
//
//    List<OrderDto> usersOrderHistory(Long userId);
//
//    OrderDto confirmedOrder(Long orderId) throws OrderException;
//
//    OrderDto shippedOrder(Long orderId) throws OrderException;
//
//    OrderDto deliveredOrder(Long orderId) throws OrderException;
//
//    OrderDto cancelOrder(Long orderId) throws OrderException;
//
//    List<OrderDto> getAllOrders();
//
//    void deleteOrder(Long orderId) throws OrderException;
//
//    Order findOrderByRazorpayOrderId(String razorpayOrderId) throws OrderException;

}
