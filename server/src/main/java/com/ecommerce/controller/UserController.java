package com.ecommerce.controller;

import com.ecommerce.dto.UserProfileDto;
import com.ecommerce.mapper.UserMapper;
import com.ecommerce.request.UserRequest;
import com.ecommerce.response.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;
import com.ecommerce.service.UserService;

@RestController
@AllArgsConstructor
@RequestMapping("/api/user")
public class UserController {

    private UserService userService;

    @GetMapping
    public ResponseEntity<UserProfileDto> getUserProfileHandler(@RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        return new ResponseEntity<>(UserMapper.toUserProfileDto(user), HttpStatus.OK);

    }

    @PatchMapping
    public ResponseEntity<UserProfileDto> updateUserProfileHandler(@RequestBody UserRequest userRequest,
                                                                   @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        UserProfileDto userProfileDto = userService.updateUser(user.getId(), userRequest);
        return new ResponseEntity<>(userProfileDto, HttpStatus.OK);

    }

    @DeleteMapping
    public ResponseEntity<ApiResponse> deleteUserHandler(@RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfileByJwt(jwt);
        String res = userService.deleteUserById(user.getId());
        return new ResponseEntity<>(new ApiResponse(res, true), HttpStatus.OK);

    }

}
