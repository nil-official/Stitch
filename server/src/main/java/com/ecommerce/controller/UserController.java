package com.ecommerce.controller;

import com.ecommerce.annotation.CurrentUser;
import com.ecommerce.dto.UserProfileDto;
import com.ecommerce.mapper.UserMapper;
import com.ecommerce.request.UserRequest;
import com.ecommerce.response.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.model.User;
import com.ecommerce.service.UserService;
import com.ecommerce.exception.UserException;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private UserService userService;

    @GetMapping
    public ResponseEntity<UserProfileDto> getUserProfileHandler(@CurrentUser User user) {

        return new ResponseEntity<>(UserMapper.toUserProfileDto(user), HttpStatus.OK);

    }

    @PatchMapping
    public ResponseEntity<UserProfileDto> updateUserProfileHandler(@CurrentUser User user, @RequestBody UserRequest userRequest)
            throws UserException {

        UserProfileDto userProfileDto = userService.updateUser(user.getId(), userRequest);
        return new ResponseEntity<>(userProfileDto, HttpStatus.OK);

    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteUserHandler(@CurrentUser User user) {

        String res = userService.deleteUserById(user.getId());
        return new ResponseEntity<>(new ApiResponse(res, true), HttpStatus.OK);

    }

    @GetMapping("/email/update/init")
    public ResponseEntity<ApiResponse> initiateEmailUpdate(@CurrentUser User user) {

        userService.initiateEmailUpdate(user);
        ApiResponse apiResponse = new ApiResponse("Email update OTP has been sent to your current email.", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.ACCEPTED);

    }

    @GetMapping("/email/update/confirm")
    public ResponseEntity<ApiResponse> confirmEmailUpdate(@CurrentUser User user, @RequestParam String otp,
                                                          @RequestParam String newEmail) throws UserException {

        userService.updateEmail(user, otp, newEmail);
        ApiResponse apiResponse = new ApiResponse("Email updated successfully. Please verify your new email to login!", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

}
