package com.ecommerce.repository;

import com.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Optional<Order> findByOrderId(String orderId);

    List<Order> findByUserId(Long userId);

    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);

//	@Query("SELECT o FROM Order o WHERE o.user.id = :userId AND (o.orderStatus = PLACED OR o.orderStatus = CONFIRMED OR o.orderStatus = SHIPPED OR o.orderStatus = DELIVERED)")
//	@Query("SELECT o FROM Order o WHERE o.user.id = :userId")
//	List<Order> getUsersOrders(@Param("userId") Long userId);
//
//	Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
//
//	@Query("SELECT o FROM Order o WHERE o.orderId = :orderId")
//	Optional<Order> findOrderByOrderId(String orderId);

}
