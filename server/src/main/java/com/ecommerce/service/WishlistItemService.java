package com.ecommerce.service;

import com.ecommerce.exception.WishlistException;
import com.ecommerce.model.*;

public interface WishlistItemService {

    WishlistItem isWishlistItemExist(Wishlist wishlist, Product product, Long userId);

    WishlistItem createWishlistItem(WishlistItem wishlistItem);

    void deleteWishlistItem(Long wishlistId) throws WishlistException;

}
