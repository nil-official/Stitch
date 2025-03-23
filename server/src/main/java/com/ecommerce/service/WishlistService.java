package com.ecommerce.service;

import com.ecommerce.dto.WishlistDto;
import com.ecommerce.exception.ProductException;
import com.ecommerce.exception.WishlistException;
import com.ecommerce.model.Wishlist;
import com.ecommerce.request.AddToWishlistRequest;

public interface WishlistService {

    Wishlist findUserWishlist(Long userId) throws WishlistException;

    void addToWishlist(Long id, AddToWishlistRequest addToWishlistRequest) throws WishlistException;

    void removeFromWishlist(Long userId, Long wishlistItemId) throws WishlistException;

    void removeProductFromWishlist(Long userId, Long productId) throws WishlistException, ProductException;

}
