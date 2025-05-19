package com.ecommerce.controller.user;

import com.ecommerce.dto.CartDto;
import com.ecommerce.exception.CartException;
import com.ecommerce.exception.CartItemException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.exception.ProductException;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;
import com.ecommerce.request.CartRequest;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.service.CartService;
import com.ecommerce.service.UserService;

@RestController
@AllArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private UserService userService;
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> fetchUserCart(@RequestHeader("Authorization") String jwt) throws UserException, CartException {

        User user = userService.findUserProfileByJwt(jwt);
        CartDto cartDto = cartService.fetchCart(user.getId());
        return new ResponseEntity<>(cartDto, HttpStatus.OK);

    }

    @PostMapping
    public ResponseEntity<ApiResponse> addItemToCart(@RequestHeader("Authorization") String jwt, @RequestBody CartRequest cartRequest)
            throws UserException, ProductException, CartException, CartItemException {

        User user = userService.findUserProfileByJwt(jwt);
        cartService.addToCart(user.getId(), cartRequest);
        ApiResponse res = new ApiResponse("Item Added To Cart Successfully", true);
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);

    }

    @PatchMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse> updateCartItemHandler(@RequestHeader("Authorization") String jwt,
                                                             @PathVariable Long cartItemId, @RequestBody CartRequest cartRequest)
            throws UserException, ProductException, CartItemException {

        User user = userService.findUserProfileByJwt(jwt);
        cartService.updateCartItem(user.getId(), cartItemId, cartRequest);
        ApiResponse res = new ApiResponse("Item updated from cart", true);
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);

    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> clearUserCart(@RequestHeader("Authorization") String jwt) throws UserException, CartException {

        User user = userService.findUserProfileByJwt(jwt);
        cartService.clearCart(user.getId());
        ApiResponse res = new ApiResponse("Cart Cleared Successfully", true);
        return new ResponseEntity<>(res, HttpStatus.OK);

    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse> deleteCartItemHandler(@RequestHeader("Authorization") String jwt, @PathVariable Long cartItemId)
            throws CartItemException, UserException {

        User user = userService.findUserProfileByJwt(jwt);
        cartService.removeCartItem(user.getId(), cartItemId);
        ApiResponse res = new ApiResponse("Item removed from cart", true);
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);

    }

}
