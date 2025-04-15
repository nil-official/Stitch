package com.ecommerce.service;

import com.ecommerce.dto.WishlistDto;
import com.ecommerce.exception.ProductException;
import com.ecommerce.exception.WishlistException;
import com.ecommerce.model.User;

public interface WishlistService {

    void createWishlist(User user) throws WishlistException;

    WishlistDto findUserWishlist(Long userId) throws WishlistException;

    void addToWishlist(Long userId, Long productId) throws WishlistException, ProductException;

    void removeFromWishlist(Long userId, Long productId) throws WishlistException, ProductException;

    void removeWishlistItem(Long userId, Long wishlistItemId) throws WishlistException;

}
