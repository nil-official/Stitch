package com.ecommerce.mapper;

import com.ecommerce.dto.CartDto;
import com.ecommerce.dto.CartItemDto;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;

import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class CartMapper {

    public static CartDto toCartDto(Cart cart) {
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        cartDto.setTotalPrice(cart.getTotalPrice());
        cartDto.setTotalItem(cart.getTotalItem());
        cartDto.setTotalDiscountedPrice(cart.getTotalDiscountedPrice());
        cartDto.setDiscount(cart.getDiscount());
        cartDto.setCartItems(toCartItemDtos(cart.getCartItems()));
        return cartDto;
    }

    public static Set<CartItemDto> toCartItemDtos(Set<CartItem> cartItems) {
        return cartItems.stream()
                .sorted(Comparator.comparing(CartItem::getCreatedAt))
                .map(cartItem -> {
                    CartItemDto cartItemDto = new CartItemDto();
                    cartItemDto.setId(cartItem.getId());
                    cartItemDto.setProduct(ProductMapper.toCartProductDto(cartItem.getProduct()));
                    cartItemDto.setSize(cartItem.getSize());
                    cartItemDto.setQuantity(cartItem.getQuantity());
                    cartItemDto.setPrice(cartItem.getPrice());
                    cartItemDto.setDiscountedPrice(cartItem.getDiscountedPrice());
                    cartItemDto.setCreatedAt(cartItem.getCreatedAt());
                    return cartItemDto;
                })
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

}
