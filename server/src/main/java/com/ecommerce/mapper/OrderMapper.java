package com.ecommerce.mapper;

import com.ecommerce.dto.AddressDto;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.dto.OrderItemDto;
import com.ecommerce.dto.OrderProductDto;
import com.ecommerce.dto.PaymentDetailsDto;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;

import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    public static OrderDto toOrderDto(Order order) {
        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setOrderId(order.getOrderId());
        orderDto.setUserId(order.getUser().getId());
        orderDto.setDeliveryDate(order.getDeliveryDate());
        orderDto.setTotalPrice(order.getTotalPrice());
        orderDto.setTotalDiscountedPrice(order.getTotalDiscountedPrice());
        orderDto.setDiscount(order.getDiscount());
        orderDto.setOrderStatus(order.getOrderStatus());
        orderDto.setTotalItem(order.getTotalItem());
        orderDto.setCreatedAt(order.getCreatedAt());
        orderDto.setRazorpayOrderId(order.getRazorpayOrderId());

        // Map address
        AddressDto addressDto = new AddressDto();
        addressDto.setFirstName(order.getOrderAddress().getFirstName());
        addressDto.setLastName(order.getOrderAddress().getLastName());
        addressDto.setStreetAddress(order.getOrderAddress().getStreetAddress());
        addressDto.setCity(order.getOrderAddress().getCity());
        addressDto.setState(order.getOrderAddress().getState());
        addressDto.setZipCode(order.getOrderAddress().getZipCode());
        addressDto.setMobile(order.getOrderAddress().getMobile());
        orderDto.setAddress(addressDto);

        // Map payment details
        PaymentDetailsDto paymentDetailsDto = new PaymentDetailsDto();
        paymentDetailsDto.setPaymentMethod(order.getPaymentDetails().getPaymentMethod());
        paymentDetailsDto.setStatus(order.getPaymentDetails().getStatus());
        paymentDetailsDto.setPaymentId(order.getPaymentDetails().getPaymentId());
        paymentDetailsDto.setSignature(order.getPaymentDetails().getSignature());
        paymentDetailsDto.setPaymentDate(order.getPaymentDetails().getPaymentDate());
        orderDto.setPaymentDetails(paymentDetailsDto);

        // Map order items
        List<OrderItemDto> orderItemDtos = order.getOrderItems().stream()
                .map(OrderMapper::toOrderItemDto)
                .collect(Collectors.toList());
        orderDto.setOrderItems(orderItemDtos);

        return orderDto;
    }

    public static OrderItemDto toOrderItemDto(OrderItem orderItem) {
        OrderItemDto orderItemDto = new OrderItemDto();
        orderItemDto.setId(orderItem.getId());
        orderItemDto.setUserId(orderItem.getUserId());
        orderItemDto.setProduct(toOrderProductDto(orderItem));
        return orderItemDto;
    }

    public static OrderProductDto toOrderProductDto(OrderItem orderItem) {
        OrderProductDto orderProductDto = new OrderProductDto();
        orderProductDto.setId(orderItem.getProduct().getId());
        orderProductDto.setTitle(orderItem.getProduct().getTitle());
        orderProductDto.setBrand(orderItem.getProduct().getBrand());
        orderProductDto.setColor(orderItem.getProduct().getColor());
        orderProductDto.setSize(orderItem.getSize());
        orderProductDto.setQuantity(orderItem.getQuantity());
        orderProductDto.setPrice(orderItem.getPrice());
        orderProductDto.setDiscountedPrice(orderItem.getDiscountedPrice());
        orderProductDto.setDiscountPercent(orderItem.getDiscountPercent());
        orderProductDto.setPreview(orderItem.getProduct().getPreview());
        return orderProductDto;
    }

//    public static OrderDto toOrderDto(Order order) {
//        OrderDto orderDto = new OrderDto();
//        orderDto.setId(order.getId());
//        orderDto.setOrderId(order.getOrderId());
//        orderDto.setOrderDate(order.getOrderDate());
//        orderDto.setDeliveryDate(order.getDeliveryDate());
//        orderDto.setShippingAddress(AddressMapper.toAddress(order.getOrderAddress()));
//        orderDto.setOrderAddress(order.getOrderAddress());
//        orderDto.setPaymentDetails(order.getPaymentDetails());
//        orderDto.setTotalPrice(order.getTotalPrice());
//        orderDto.setTotalDiscountedPrice(order.getTotalDiscountedPrice());
//        orderDto.setOrderStatus(order.getOrderStatus());
//        orderDto.setTotalItem(order.getTotalItem());
//        orderDto.setCreatedAt(order.getCreatedAt());
//        orderDto.setUserDto(UserMapper.toUserDto(order.getUser()));
//        orderDto.setOrderItems(order.getOrderItems());
//        return orderDto;
//    }

}
