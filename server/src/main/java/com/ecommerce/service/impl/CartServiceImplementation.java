package com.ecommerce.service.impl;

import com.ecommerce.dto.CartDto;
import com.ecommerce.exception.CartException;
import com.ecommerce.exception.CartItemException;
import com.ecommerce.exception.UserException;
import com.ecommerce.mapper.CartMapper;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.CartService;
import com.ecommerce.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.ecommerce.exception.ProductException;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.model.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.request.CartRequest;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartServiceImplementation implements CartService {

    private UserService userService;
    private CartRepository cartRepository;
    private ProductRepository productRepository;
    private CartItemRepository cartItemRepository;

    @Override
    public void createCart(User user) throws CartException {

        // Check if the user already has a cart
        Cart existingCart = cartRepository.findByUserId(user.getId());
        if (existingCart != null) {
            throw new CartException("Cart already exists for user ID: " + user.getId());
        }

        // Create a new cart for the user
        Cart cart = new Cart();
        cart.setUser(user);
        cartRepository.save(cart);

    }

    @Override
    public Cart findCart(Long userId) throws CartException {

        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            throw new CartException("Cart not found for user ID: " + userId);
        }

        int totalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;
        for (CartItem cartsItem : cart.getCartItems()) {
            totalPrice += cartsItem.getPrice();
            totalDiscountedPrice += cartsItem.getDiscountedPrice();
            totalItem += cartsItem.getQuantity();
        }
        cart.setTotalPrice(totalPrice);
        cart.setTotalItem(cart.getCartItems().size());
        cart.setTotalDiscountedPrice(totalDiscountedPrice);
        cart.setDiscount(totalPrice - totalDiscountedPrice);
        cart.setTotalItem(totalItem);

        return cartRepository.save(cart);

    }

    @Override
    public CartDto fetchCart(Long userId) throws CartException {

        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            throw new CartException("Cart not found for user ID: " + userId);
        }

        int totalPrice = 0;
        int totalDiscountedPrice = 0;
        int totalItem = 0;
        for (CartItem cartsItem : cart.getCartItems()) {
            totalPrice += cartsItem.getPrice();
            totalDiscountedPrice += cartsItem.getDiscountedPrice();
            totalItem += cartsItem.getQuantity();
        }
        cart.setTotalPrice(totalPrice);
        cart.setTotalItem(cart.getCartItems().size());
        cart.setTotalDiscountedPrice(totalDiscountedPrice);
        cart.setDiscount(totalPrice - totalDiscountedPrice);
        cart.setTotalItem(totalItem);

        return CartMapper.toCartDto(cartRepository.save(cart));

    }

    @Override
    public void addToCart(Long userId, CartRequest req) throws ProductException, CartException, CartItemException {

        try {
            // Validate inputs
            if (req == null || req.getProductId() == null || req.getSize() == null) {
                throw new ProductException("Invalid request: Product ID and Size must not be null.");
            }

            // Retrieve the user's cart and the product to be added
            Cart cart = cartRepository.findByUserId(userId);
            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new ProductException("Product not found."));

            // Handle quantities
            int quantities = req.getQuantity();
            if (quantities == 0) {
                quantities = 1;
            } else if (quantities < 0) {
                throw new ProductException("Quantity cannot be negative!");
            } else if (quantities > 5) {
                throw new ProductException("Maximum five units are allowed!");
            }

            // Check if the requested size is available
            checkSizeAvailability(product, req.getSize(), quantities);

            // Check if the cart already contains the item
            CartItem existingCartItem = cartItemRepository.isCartItemExist(cart, product, req.getSize(), userId);

            if (existingCartItem == null) {
                // If the item is not in the cart, create a new CartItem
                CartItem cartItem = new CartItem();
                cartItem.setCart(cart);
                cartItem.setProduct(product);
                cartItem.setSize(req.getSize());
                cartItem.setQuantity(quantities);
                cartItem.setUserId(userId);
                cartItem.setDiscountPercent(product.getDiscountPercent());
                cartItem.setCreatedAt(LocalDateTime.now());

                // Set price for the new item
                int price = quantities * product.getDiscountedPrice();
                cartItem.setPrice(price);

                // Save and add the new CartItem to the cart
                CartItem createdCartItem = createCartItem(cartItem);
                cart.getCartItems().add(createdCartItem);
            } else {
                // If the item is already in the cart, update its quantity and price
                int updatedQuantity = existingCartItem.getQuantity() + quantities;

                if (updatedQuantity > 5) {
                    throw new ProductException("Maximum five units are allowed!");
                }

                // Check if the requested size is available
                checkSizeAvailability(product, req.getSize(), updatedQuantity);

                existingCartItem.setQuantity(updatedQuantity);

                int updatedPrice = updatedQuantity * product.getDiscountedPrice();
                existingCartItem.setPrice(updatedPrice);

                // Saving the cart item
                cartItemRepository.save(existingCartItem);
            }

        } catch (Exception e) {
            throw new ProductException("Failed to process the cart: " + e.getMessage());
        }

    }

    private void checkSizeAvailability(Product product, String size, int quantity) throws ProductException {
        boolean sizeAvailable = product.getSizes().stream()
                .anyMatch(s -> s.getName().toString().equalsIgnoreCase(size) && s.getQuantity() >= quantity);

        if (!sizeAvailable) {
            throw new ProductException("The requested size '" + size + "' with quantity '"
                    + quantity + "' is out of stock or unavailable.");
        }
    }

    @Override
    public void clearCart(Long userId) throws CartException {

        Cart cart = cartRepository.findByUserId(userId);
        if (cart == null) {
            throw new CartException("Cart not found for user ID: " + userId);
        }

        cart.getCartItems().clear();
        cart.setTotalPrice(0);
        cart.setTotalItem(0);
        cart.setTotalDiscountedPrice(0);
        cart.setDiscount(0);
        cartRepository.save(cart);

    }

    @Override
    public CartItem findCartItemById(Long cartItemId) throws CartItemException {

        Optional<CartItem> opt = cartItemRepository.findById(cartItemId);

        if (opt.isEmpty()) {
            throw new CartItemException("cartItem not found with id : " + cartItemId);
        }
        return opt.get();

    }

    @Override
    public CartItem createCartItem(CartItem cartItem) {

        cartItem.setPrice(cartItem.getProduct().getPrice() * cartItem.getQuantity());
        cartItem.setDiscountedPrice(cartItem.getProduct().getDiscountedPrice() * cartItem.getQuantity());
        return cartItemRepository.save(cartItem);

    }

    @Override
    public void updateCartItem(Long userId, Long cartItemId, CartRequest cartRequest) throws UserException, ProductException, CartItemException {

        CartItem item = findCartItemById(cartItemId);
        User user = userService.findUserById(item.getUserId());

        // Authorize that the requesting user owns this cart item
        if (!user.getId().equals(userId)) {
            throw new CartItemException("You can't update another user's cart item");
        }

        // Only update size if it's present in the request
        if (cartRequest.getSize() != null) {
            // Check size availability only if updating size or quantity
            int quantityToCheck = cartRequest.getQuantity() != null ? cartRequest.getQuantity() : item.getQuantity();
            checkSizeAvailability(item.getProduct(), cartRequest.getSize(), quantityToCheck);
            item.setSize(cartRequest.getSize());
        }

        // Only update quantity if it's present in the request
        if (cartRequest.getQuantity() != null) {
            if (cartRequest.getQuantity() > 5) {
                throw new CartItemException("Maximum five units are allowed!");
            }
            // If only quantity is changing, check availability with current size
            if (cartRequest.getSize() == null) {
                checkSizeAvailability(item.getProduct(), item.getSize(), cartRequest.getQuantity());
            }
            item.setQuantity(cartRequest.getQuantity());
        }

        // Recalculate prices based on the updated quantity
        item.setPrice(item.getQuantity() * item.getProduct().getPrice());
        item.setDiscountedPrice(item.getQuantity() * item.getProduct().getDiscountedPrice());

        // Save the updated cart item
        cartItemRepository.save(item);
    }

    @Override
    public void removeCartItem(Long userId, Long cartItemId) throws CartItemException, UserException {

        System.out.println("userId- " + userId + " cartItemId " + cartItemId);

        CartItem cartItem = findCartItemById(cartItemId);

        User user = userService.findUserById(cartItem.getUserId());
        User reqUser = userService.findUserById(userId);

        if (user.getId().equals(reqUser.getId())) {
            cartItemRepository.deleteById(cartItem.getId());
        } else {
            throw new UserException("you can't remove another users item");
        }

    }

}
