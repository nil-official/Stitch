package com.ecommerce.user.domain;

public enum OrderStatus {
    PENDING,
    PLACED,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    CANCELLED,
    RETURNED,
    REFUNDED,
    PAYMENT_FAILED
}
