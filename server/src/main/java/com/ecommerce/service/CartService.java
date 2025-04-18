package com.ecommerce.service;

import com.ecommerce.dto.CartDto;
import com.ecommerce.exception.CartException;
import com.ecommerce.exception.CartItemException;
import com.ecommerce.exception.ProductException;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.User;
import com.ecommerce.request.CartRequest;

public interface CartService {

    void createCart(User user);

    Cart findCart(Long userId) throws CartException;

    CartDto fetchCart(Long userId) throws CartException;

    void addToCart(Long userId, CartRequest req) throws ProductException, CartException, CartItemException;

    void clearCart(Long userId) throws CartException;

    CartItem findCartItemById(Long cartItemId) throws CartItemException;

    CartItem createCartItem(CartItem cartItem);

    void updateCartItem(Long userId, Long cartItemId, CartRequest cartRequest) throws UserException, ProductException, CartItemException;

    void removeCartItem(Long userId, Long cartItemId) throws CartItemException, UserException;

}
