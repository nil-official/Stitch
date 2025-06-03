package com.ecommerce.controller.user;

import java.util.List;

import com.ecommerce.annotation.CurrentUser;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;
import com.ecommerce.request.OrderRequest;
import com.ecommerce.enums.OrderStatus;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.service.OrderService;
import com.ecommerce.service.UserService;

@RestController
@AllArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private OrderService orderService;
    private UserService userService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(@RequestHeader("Authorization") String jwt,
                                                @RequestBody OrderRequest orderRequest) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        OrderDto createdOrder = orderService.createRazorpayOrder(user, orderRequest);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);

    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId) {
        OrderDto order = orderService.getOrderById(orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/by-order-id/{orderId}")
    public ResponseEntity<OrderDto> getOrderByOrderId(@PathVariable String orderId) {
        OrderDto order = orderService.getOrderByOrderId(orderId);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderDto>> getOrdersByUser(@CurrentUser User user) {
        List<OrderDto> orders = orderService.getOrdersByUser(user);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        OrderDto updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(@PathVariable Long orderId) {
        OrderDto cancelledOrder = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(cancelledOrder);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }

//    @PostMapping("/")
//    public ResponseEntity<OrderDto> createOrderHandler(@RequestBody AddressDto shippingAddress,
//                                                       @RequestHeader("Authorization") String jwt) throws UserException, OrderException {
//
//        User user = userService.findUserProfileByJwt(jwt);
//        OrderDto order = orderService.createOrder(user, shippingAddress);
//        return new ResponseEntity<>(order, HttpStatus.OK);
//
//    }
//
//    // Overloaded method
//    @PostMapping("/{addressId}")
//    public ResponseEntity<OrderDto> createOrderHandler(@PathVariable Long addressId,
//                                                       @RequestHeader("Authorization") String jwt) throws UserException, OrderException {
//
//        User user = userService.findUserProfileByJwt(jwt);
//        OrderDto order = orderService.createOrder(user, addressId);
//        return new ResponseEntity<>(order, HttpStatus.OK);
//
//    }
//
//    @GetMapping("/user")
//    public ResponseEntity<List<OrderDto>> usersOrderHistoryHandler(@RequestHeader("Authorization") String jwt)
//            throws OrderException, UserException {
//
//        User user = userService.findUserProfileByJwt(jwt);
//        List<OrderDto> orders = orderService.usersOrderHistory(user.getId());
//        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
//
//    }
//
//    @GetMapping("/{orderId}")
//    public ResponseEntity<OrderDto> findOrderHandler(@RequestHeader("Authorization") String jwt,
//                                                     @PathVariable String orderId) throws UserException, OrderException {
//
//        User user = userService.findUserProfileByJwt(jwt);
//        OrderDto orders = orderService.findOrderByOrderId(user, orderId);
//        return new ResponseEntity<>(orders, HttpStatus.ACCEPTED);
//
//    }

}
