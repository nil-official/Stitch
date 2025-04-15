package com.ecommerce.mapper;

import com.ecommerce.dto.WishlistDto;
import com.ecommerce.dto.WishlistItemDto;
import com.ecommerce.dto.WishlistProductDto;
import com.ecommerce.model.Product;
import com.ecommerce.model.Wishlist;
import com.ecommerce.model.WishlistItem;

import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.stream.Collectors;

public class WishlistMapper {

    public static WishlistDto toWishlistDto(Wishlist wishlist) {
        WishlistDto wishlistDto = new WishlistDto();
        wishlistDto.setId(wishlist.getId());
        wishlistDto.setWishlistItems(
                wishlist.getWishlistItems().stream()
                        .sorted(Comparator.comparing(WishlistItem::getCreatedAt))
                        .map(WishlistMapper::toWishlistItemDto)
                        .collect(Collectors.toCollection(LinkedHashSet::new))
        );
        return wishlistDto;
    }

    public static WishlistItemDto toWishlistItemDto(WishlistItem wishlistItem) {
        WishlistItemDto wishlistItemDto = new WishlistItemDto();
        wishlistItemDto.setId(wishlistItem.getId());
        wishlistItemDto.setProduct(toWishlistProductDto(wishlistItem.getProduct()));
        wishlistItemDto.setCreatedAt(wishlistItem.getCreatedAt());
        return wishlistItemDto;
    }

    public static WishlistProductDto toWishlistProductDto(Product product) {
        WishlistProductDto wishlistProductDto = new WishlistProductDto();
        wishlistProductDto.setId(product.getId());
        wishlistProductDto.setTitle(product.getTitle());
        wishlistProductDto.setPrice(product.getPrice());
        wishlistProductDto.setDiscountedPrice(product.getDiscountedPrice());
        wishlistProductDto.setDiscountPercent(product.getDiscountPercent());
        wishlistProductDto.setQuantity(product.getQuantity());
        wishlistProductDto.setBrand(product.getBrand());
        wishlistProductDto.setPreview(product.getPreview());
        wishlistProductDto.setAverageRating(product.getAverageRating());
        return wishlistProductDto;
    }

}
