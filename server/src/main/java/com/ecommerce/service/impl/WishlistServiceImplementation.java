package com.ecommerce.service.impl;

import com.ecommerce.dto.WishlistDto;
import com.ecommerce.exception.ProductException;
import com.ecommerce.exception.WishlistException;
import com.ecommerce.mapper.WishlistMapper;
import com.ecommerce.model.*;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.WishlistRepository;
import com.ecommerce.service.WishlistItemService;
import com.ecommerce.service.WishlistService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class WishlistServiceImplementation implements WishlistService {

    private WishlistRepository wishlistRepository;
    private ProductRepository productRepository;
    private WishlistItemService wishlistItemService;

    @Override
    public void createWishlist(User user) throws WishlistException {
        // Check if the user already has a wishlist
        Wishlist existingWishlist = wishlistRepository.findByUserId(user.getId());
        if (existingWishlist != null) {
            throw new WishlistException("Wishlist already exists for user ID: " + user.getId());
        }

        // Create a new wishlist for the user
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlistRepository.save(wishlist);
    }

    @Override
    public WishlistDto findUserWishlist(Long userId) throws WishlistException {
        Wishlist wishlist = wishlistRepository.findByUserId(userId);
        return WishlistMapper.toWishlistDto(wishlist);
    }

    @Override
    public void addToWishlist(Long userId, Long productId) throws WishlistException, ProductException {
        try {
            // Find the product to be added
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ProductException("Product not found."));

            // Find the user's wishlist or create a new one if it doesn't exist
            Wishlist wishlist = wishlistRepository.findByUserId(userId);
            if (wishlist == null) {
                wishlist = new Wishlist();
                User user = new User();
                user.setId(userId);
                wishlist.setUser(user);
                wishlist = wishlistRepository.save(wishlist);
            }

            // Check if the wishlist already contains the product with the specified size
            WishlistItem isPresent = wishlistItemService.isWishlistItemExist(wishlist, product, userId);

            if (isPresent == null) {
                // If the item is not in the wishlist, create a new WishlistItem
                WishlistItem wishlistItem = new WishlistItem();
                wishlistItem.setWishlist(wishlist);
                wishlistItem.setProduct(product);
                wishlistItem.setUserId(userId);
                wishlistItem.setCreatedAt(LocalDateTime.now());

                // Save and add the new WishlistItem to the wishlist
                WishlistItem createdWishlistItem = wishlistItemService.createWishlistItem(wishlistItem);
                wishlist.getWishlistItems().add(createdWishlistItem);
            } else {
                throw new ProductException("Product already exists in the wishlist.");
            }
        } catch (Exception e) {
            throw new WishlistException(e.getMessage());
        }
    }

    @Override
    public void removeFromWishlist(Long userId, Long productId) throws WishlistException, ProductException {

        Wishlist wishlist = wishlistRepository.findByUserId(userId);
        if (wishlist == null) {
            throw new WishlistException("Wishlist not found for user with ID: " + userId);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductException("Product not found."));

        WishlistItem wishlistItem = wishlistItemService.isWishlistItemExist(wishlist, product, userId);

        if (wishlistItem == null) {
            throw new WishlistException("Product not found in the wishlist.");
        }

        wishlistItemService.deleteWishlistItem(wishlistItem.getId());

    }

    @Override
    public void removeWishlistItem(Long userId, Long wishlistItemId) throws WishlistException {

        Wishlist wishlist = wishlistRepository.findByUserId(userId);
        if (wishlist == null) {
            throw new WishlistException("Wishlist not found for user with ID: " + userId);
        }
        wishlistItemService.deleteWishlistItem(wishlistItemId);

    }

}
