package com.ecommerce.controller;

import com.ecommerce.dto.WishlistDto;
import com.ecommerce.exception.ProductException;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.service.UserService;
import com.ecommerce.service.WishlistService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user/wishlist")
public class WishlistController {

    private UserService userService;
    private WishlistService wishlistService;

    @GetMapping()
    public ResponseEntity<WishlistDto> getUserWishlist(@RequestHeader("Authorization") String jwt) throws UserException, ProductException {

        User user = userService.findUserProfileByJwt(jwt);
        WishlistDto wishlistDto = wishlistService.findUserWishlist(user.getId());
        return new ResponseEntity<>(wishlistDto, HttpStatus.OK);

    }

    @PostMapping("/{productId}")
    public ResponseEntity<ApiResponse> addToWishlist(@RequestHeader("Authorization") String jwt,
                                                     @PathVariable Long productId) throws UserException, ProductException {

        User user = userService.findUserProfileByJwt(jwt);
        wishlistService.addToWishlist(user.getId(), productId);
        ApiResponse res = new ApiResponse("Product added to wishlist successfully!", true);
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);

    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse> removeFromWishlist(@RequestHeader("Authorization") String jwt,
                                                          @PathVariable Long productId) throws UserException, ProductException {

        User user = userService.findUserProfileByJwt(jwt);
        wishlistService.removeFromWishlist(user.getId(), productId);
        ApiResponse res = new ApiResponse("Product removed from wishlist successfully!", true);
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);

    }

    @DeleteMapping("/id/{wishlistItemId}")
    public ResponseEntity<ApiResponse> removeWishlistItem(@RequestHeader("Authorization") String jwt,
                                                          @PathVariable Long wishlistItemId) throws UserException, ProductException {

        User user = userService.findUserProfileByJwt(jwt);
        wishlistService.removeWishlistItem(user.getId(), wishlistItemId);
        ApiResponse res = new ApiResponse("Wishlist item removed from wishlist successfully!", true);
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);

    }

}
