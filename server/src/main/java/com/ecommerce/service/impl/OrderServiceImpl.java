package com.ecommerce.service.impl;

import com.ecommerce.dto.AnalyticsDataDto;
import com.ecommerce.dto.OrderAnalyticsDto;
import com.ecommerce.dto.OrderDto;
import com.ecommerce.request.OrderRequest;
import com.ecommerce.request.OrderItemRequest;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.model.Order;
import com.ecommerce.model.OrderItem;
import com.ecommerce.model.PaymentDetails;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.PaymentService;
import com.ecommerce.enums.OrderStatus;
import com.ecommerce.mapper.OrderMapper;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService {

    private UserRepository userRepository;
    private OrderRepository orderRepository;
    private ProductRepository productRepository;
    private PaymentService paymentService;

    @Override
    @Transactional
    public OrderDto createOrder(User user, OrderRequest orderRequest) {
        Order order = new Order();
        order.setOrderId(generateOrderId());
        order.setUser(user);
        order.setDeliveryDate(LocalDateTime.now().plusDays(5));
        order.setOrderStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        // Set address details
        if (orderRequest.getAddress() != null) {
            order.getOrderAddress().setFirstName(orderRequest.getAddress().getFirstName());
            order.getOrderAddress().setLastName(orderRequest.getAddress().getLastName());
            order.getOrderAddress().setStreetAddress(orderRequest.getAddress().getStreetAddress());
            order.getOrderAddress().setCity(orderRequest.getAddress().getCity());
            order.getOrderAddress().setState(orderRequest.getAddress().getState());
            order.getOrderAddress().setZipCode(orderRequest.getAddress().getZipCode());
            order.getOrderAddress().setMobile(orderRequest.getAddress().getMobile());
        }

        // Initialize payment details
        PaymentDetails paymentDetails = new PaymentDetails();
        paymentDetails.setPaymentMethod(orderRequest.getPaymentMethod());
        paymentDetails.setStatus(OrderStatus.PENDING.toString());
        order.setPaymentDetails(paymentDetails);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalPrice = 0.0;
        int totalDiscountedPrice = 0;
        int totalItems = 0;

        for (OrderItemRequest itemRequest : orderRequest.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemRequest.getProduct().getId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setSize(itemRequest.getSize());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(itemRequest.getPrice());
            orderItem.setDiscountedPrice(itemRequest.getDiscountedPrice());
            orderItem.setDiscountPercent(itemRequest.getDiscountPercent());
            orderItem.setUserId(user.getId());

            orderItems.add(orderItem);
            totalPrice += itemRequest.getPrice() * itemRequest.getQuantity();
            totalDiscountedPrice += (itemRequest.getDiscountedPrice() != null ? itemRequest.getDiscountedPrice() : itemRequest.getPrice()) * itemRequest.getQuantity();
            totalItems += itemRequest.getQuantity();
        }

        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setTotalDiscountedPrice(totalDiscountedPrice);
        order.setDiscount((int) (totalPrice - totalDiscountedPrice));
        order.setTotalItem(totalItems);

        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toOrderDto(savedOrder);
    }

    @Override
    @Transactional
    public OrderDto createRazorpayOrder(User user, OrderRequest orderRequest) {
        // First create the order with PENDING status
        OrderDto createdOrder = createOrder(user, orderRequest);

        // Then create a Razorpay order and update our order with the Razorpay order ID
        try {
            double amount = createdOrder.getTotalDiscountedPrice() != null ?
                    createdOrder.getTotalDiscountedPrice() : createdOrder.getTotalPrice();

            // Create payment order through Razorpay
            paymentService.createPaymentOrder(createdOrder.getOrderId(), amount);

            return getOrderByOrderId(createdOrder.getOrderId());
        } catch (Exception e) {
            // If anything fails, update the order status to PAYMENT_FAILED
            updateOrderStatus(createdOrder.getId(), OrderStatus.PAYMENT_FAILED);
            throw e;
        }
    }

    @Override
    @Transactional
    public OrderDto updatePaymentDetails(String orderId, String razorpayPaymentId, String razorpaySignature) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));

        // Update payment details
        order.getPaymentDetails().setPaymentId(razorpayPaymentId);
        order.getPaymentDetails().setSignature(razorpaySignature);
        order.getPaymentDetails().setStatus("COMPLETED");
        order.getPaymentDetails().setPaymentDate(LocalDateTime.now());

        // Update order status
        order.setOrderStatus(OrderStatus.PLACED);

        Order updatedOrder = orderRepository.save(order);
        return OrderMapper.toOrderDto(updatedOrder);
    }

    @Override
    public OrderDto getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));
        return OrderMapper.toOrderDto(order);
    }

    @Override
    public OrderDto getOrderByOrderId(String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        return OrderMapper.toOrderDto(order);
    }

    @Override
    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderMapper::toOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getLastFiveOrders() {
        List<OrderDto> allOrders = getAllOrders();
        Collections.reverse(allOrders);
        return allOrders.stream()
                .limit(Math.min(allOrders.size(), 5))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getOrdersByUser(User user) {
        List<Order> orders = orderRepository.findByUserId(user.getId());
        return orders.stream()
                .map(OrderMapper::toOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderAnalyticsDto getOrderAnalytics() {
        LocalDate today = LocalDate.now();

        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());

        LocalDate startOfYear = today.withDayOfYear(1);
        LocalDate endOfYear = today.withDayOfYear(today.lengthOfYear());

        LocalDateTime startOfWeekTime = startOfWeek.atStartOfDay();
        LocalDateTime endOfWeekTime = endOfWeek.atTime(LocalTime.MAX);

        LocalDateTime startOfMonthTime = startOfMonth.atStartOfDay();
        LocalDateTime endOfMonthTime = endOfMonth.atTime(LocalTime.MAX);

        LocalDateTime startOfYearTime = startOfYear.atStartOfDay();
        LocalDateTime endOfYearTime = endOfYear.atTime(LocalTime.MAX);

        List<Order> weeklyOrders = orderRepository.findByCreatedAtBetween(startOfWeekTime, endOfWeekTime);
        List<Order> monthlyOrders = orderRepository.findByCreatedAtBetween(startOfMonthTime, endOfMonthTime);
        List<Order> yearlyOrders = orderRepository.findByCreatedAtBetween(startOfYearTime, endOfYearTime);

        Map<DayOfWeek, Long> dailyCountMap = weeklyOrders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getCreatedAt().getDayOfWeek(),
                        Collectors.counting()
                ));

        List<String> days = Arrays.asList("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun");

        Map<String, DayOfWeek> dayMap = Map.of(
                "Mon", DayOfWeek.MONDAY,
                "Tue", DayOfWeek.TUESDAY,
                "Wed", DayOfWeek.WEDNESDAY,
                "Thu", DayOfWeek.THURSDAY,
                "Fri", DayOfWeek.FRIDAY,
                "Sat", DayOfWeek.SATURDAY,
                "Sun", DayOfWeek.SUNDAY
        );

        List<AnalyticsDataDto> dailyData = days.stream()
                .map(day -> {
                    DayOfWeek dow = dayMap.get(day);
                    long count = dailyCountMap.getOrDefault(dow, 0L);
                    return new AnalyticsDataDto(day, (int) count);
                })
                .collect(Collectors.toList());

        Map<Integer, Long> weekCountMap = monthlyOrders.stream()
                .collect(Collectors.groupingBy(
                        order -> {
                            int day = order.getCreatedAt().getDayOfMonth();
                            return (day - 1) / 7 + 1; // Week 1: day 1-7, Week 2: 8-14, etc.
                        },
                        Collectors.counting()
                ));

        List<AnalyticsDataDto> weeklyData = IntStream.rangeClosed(1, 5)
                .mapToObj(week -> {
                    long count = weekCountMap.getOrDefault(week, 0L);
                    return new AnalyticsDataDto("Week " + week, (int) count);
                })
                .collect(Collectors.toList());

        Map<Integer, Long> monthlyCountMap = yearlyOrders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getCreatedAt().getMonthValue(),
                        Collectors.counting()
                ));

        List<String> monthNames = List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

        List<AnalyticsDataDto> monthlyData = IntStream.rangeClosed(1, 12)
                .mapToObj(month -> {
                    long count = monthlyCountMap.getOrDefault(month, 0L);
                    return new AnalyticsDataDto(monthNames.get(month - 1), (int) count);
                })
                .collect(Collectors.toList());

        // ===== Final Response =====
        return new OrderAnalyticsDto(dailyData, weeklyData, monthlyData);

    }

    @Override
    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setOrderStatus(status);

        if (status == OrderStatus.DELIVERED) {
            order.setDeliveryDate(LocalDateTime.now());
        }

        Order updatedOrder = orderRepository.save(order);
        return OrderMapper.toOrderDto(updatedOrder);
    }

    @Override
    @Transactional
    public OrderDto cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setOrderStatus(OrderStatus.CANCELLED);
        Order cancelledOrder = orderRepository.save(order);
        return OrderMapper.toOrderDto(cancelledOrder);
    }

    @Override
    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        orderRepository.delete(order);
    }

    private String generateOrderId() {
        return "ORD-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();
    }

//    private CartService cartService;
//    private AddressRepository addressRepository;
//    private OrderItemRepository orderItemRepository;

//    private OrderDto generateOrder(User user, OrderAddress orderAddress) throws OrderException {
//        // Get the cart of the user
//        Cart cart = cartService.findCart(user.getId());
//
//        if (cart.getCartItems().isEmpty()) {
//            throw new OrderException("Cart is empty");
//        }
//
//        // Create a new empty order items list
//        List<OrderItem> orderItems = new ArrayList<>();
//
//        // Loop through the cart items and create order items
//        for (CartItem item : cart.getCartItems()) {
//            OrderItem orderItem = new OrderItem();
//
//            orderItem.setPrice(item.getPrice());
//            orderItem.setProduct(item.getProduct());
//            orderItem.setQuantity(item.getQuantity());
//            orderItem.setSize(item.getSize());
//            orderItem.setUserId(item.getUserId());
//            orderItem.setDiscountedPrice(item.getDiscountedPrice());
//
//            OrderItem createdOrderItem = orderItemRepository.save(orderItem);
//            orderItems.add(createdOrderItem);
//
//            // Get the associated product from the order item
//            Product product = item.getProduct();
//
//            // Get the ordered item's size
//            Size orderedSize = product.getSizes().stream()
//                    .filter(size -> size.getName().toString().equals(item.getSize()))
//                    .findFirst()
//                    .orElseThrow(() -> new OrderException("Invalid size: " + item.getSize()));
//
//            // Check if there's enough quantity available to fulfill the order
//            if (orderedSize.getQuantity() < item.getQuantity()) {
//                throw new OrderException("Not enough stock for size: " + orderedSize.getName());
//            }
//
//            // Reduce the available quantity of the size
//            orderedSize.setQuantity(orderedSize.getQuantity() - item.getQuantity());
//
//            // Save the updated sizes in the product
//            product.setSizes(product.getSizes());
//
//            // Update the total quantity of the product
//            product.setQuantity(QuantityCalculatorUtil.getTotalQuantity(product.getSizes()));
//
//            // Save the updated product
//            productRepository.save(product);
//
//        }
//
//        // Generate a unique order ID
//        String orderId = "ORD" + System.currentTimeMillis();
//
//        // Create a new order object
//        Order createdOrder = new Order();
//        createdOrder.setUser(user);
//        createdOrder.setOrderId(orderId);
//        createdOrder.setOrderItems(orderItems);
//        createdOrder.setDeliveryDate(LocalDateTime.now().plusDays(5));
//        createdOrder.setTotalPrice(cart.getTotalPrice());
//        createdOrder.setTotalDiscountedPrice(cart.getTotalDiscountedPrice());
//        createdOrder.setDiscount(cart.getDiscount());
//        createdOrder.setTotalItem(cart.getTotalItem());
//        createdOrder.setOrderAddress(orderAddress);
//        createdOrder.setOrderDate(LocalDateTime.now());
//        createdOrder.setOrderStatus(OrderStatus.PENDING);
//        createdOrder.getPaymentDetails().setRazorpayPaymentStatus(PaymentStatus.PENDING);
//        createdOrder.setCreatedAt(LocalDateTime.now());
//
//        // Save the order
//        Order savedOrder = orderRepository.save(createdOrder);
//        // Map the saved order to OrderDto
//        OrderDto resOrder = OrderMapper.toOrderDto(savedOrder);
//        for (OrderItem item : orderItems) {
//            item.setOrder(savedOrder);
//            orderItemRepository.save(item);
//        }
//
//        return resOrder;
//    }
//
//    @Override
//    public OrderDto createOrder(User user, AddressDto addressDto) throws OrderException {
//
//        // Validate the address
//        DtoValidatorUtil.validate(addressDto);
//
//        OrderAddress orderAddress = new OrderAddress(
//                addressDto.getFirstName(),
//                addressDto.getLastName(),
//                addressDto.getStreetAddress(),
//                addressDto.getCity(),
//                addressDto.getState(),
//                addressDto.getZipCode(),
//                addressDto.getMobile()
//        );
//
//        Address reqAddress = AddressMapper.toAddress(addressDto);
//        reqAddress.setUser(user);
//        Address address = addressRepository.save(reqAddress);
//        user.getAddresses().add(address);
//        userRepository.save(user);
//
//        return generateOrder(user, orderAddress);
//    }
//
//    @Override
//    public OrderDto createOrder(User user, Long addressId) throws OrderException {
//        // Get the address from the addressId
//        Address address = addressRepository.findById(addressId)
//                .orElseThrow(() -> new OrderException("Address not found with Address ID: " + addressId));
//
//        OrderAddress orderAddress = new OrderAddress(
//                address.getFirstName(),
//                address.getLastName(),
//                address.getStreetAddress(),
//                address.getCity(),
//                address.getState(),
//                address.getZipCode(),
//                address.getMobile()
//        );
//
//        return generateOrder(user, orderAddress);
//
//    }
//
//    @Override
//    public OrderDto findOrderByOrderId(User user, String orderId) throws UserException, OrderException {
//
//        if (user == null) {
//            throw new UserException("Invalid User");
//        }
//        if (orderId.isEmpty()) {
//            throw new OrderException("Invalid Order ID");
//        }
//        return OrderMapper.toOrderDto(orderRepository.findOrderByOrderId(orderId)
//                .orElseThrow(() -> new OrderException("Order not found with Order ID: " + orderId)));
//
//    }
//
//    @Override
//    public Order findOrderByRazorpayOrderId(String razorpayOrderId) throws OrderException {
//        return orderRepository.findByRazorpayOrderId(razorpayOrderId)
//                .orElseThrow(() -> new OrderException("Order not found with Razorpay Order ID: " + razorpayOrderId));
//    }
//
//    @Override
//    public OrderDto confirmedOrder(Long orderId) throws OrderException {
//        Order order = findOrderById(orderId);
//        order.setOrderStatus(OrderStatus.CONFIRMED);
//
//        Order saveOrder = orderRepository.save(order);
//        return OrderMapper.toOrderDto(saveOrder);
//    }
//
//    @Override
//    public OrderDto shippedOrder(Long orderId) throws OrderException {
//        Order order = findOrderById(orderId);
//        order.setOrderStatus(OrderStatus.SHIPPED);
//
//        Order saveOrder = orderRepository.save(order);
//        return OrderMapper.toOrderDto(saveOrder);
//    }
//
//    @Override
//    public OrderDto deliveredOrder(Long orderId) throws OrderException {
//        Order order = findOrderById(orderId);
//        order.setOrderStatus(OrderStatus.DELIVERED);
//
//        Order saveOrder = orderRepository.save(order);
//        return OrderMapper.toOrderDto(saveOrder);
//    }
//
//    @Override
//    public OrderDto cancelOrder(Long orderId) throws OrderException {
//        Order order = findOrderById(orderId);
//        order.setOrderStatus(OrderStatus.CANCELLED);
//
//        Order saveOrder = orderRepository.save(order);
//        return OrderMapper.toOrderDto(saveOrder);
//    }
//
//    @Override
//    public Order findOrderById(Long orderId) throws OrderException {
//        Optional<Order> opt = orderRepository.findById(orderId);
//
//        if (opt.isPresent()) {
//            return opt.get();
//        }
//        throw new OrderException("order not exist with id " + orderId);
//    }
//
//    @Override
//    public OrderDto viewOrderById(Long orderId) throws OrderException {
//        Optional<Order> opt = orderRepository.findById(orderId);
//        if (opt.isPresent()) {
//            return OrderMapper.toOrderDto(opt.get());
//        }
//        throw new OrderException("order not exist with id " + orderId);
//    }
//
//    @Override
//    public List<OrderDto> usersOrderHistory(Long userId) {
//        List<Order> saveOrder = orderRepository.getUsersOrders(userId);
//        List<OrderDto> orderDto = new ArrayList<>();
//        for (Order order : saveOrder) {
//            orderDto.add(OrderMapper.toOrderDto(order));
//        }
//        return orderDto;
//        //return orderRepository.getUsersOrders(userId);
//    }
//
//    @Override
//    public List<OrderDto> getAllOrders() {
//        List<Order> saveOrder = orderRepository.findAll();
//        List<OrderDto> orderDto = new ArrayList<>();
//        for (Order order : saveOrder) {
//            orderDto.add(OrderMapper.toOrderDto(order));
//        }
//        return orderDto;
//    }
//
//    @Override
//    public void deleteOrder(Long orderId) throws OrderException {
//        Order order = findOrderById(orderId);
//        if (order == null) {
//            throw new OrderException("order not exist with id " + orderId);
//        }
//        orderRepository.deleteById(orderId);
//
//    }

}
