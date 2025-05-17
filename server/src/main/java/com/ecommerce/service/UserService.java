package com.ecommerce.service;

import com.ecommerce.dto.UserDto;
import com.ecommerce.dto.UserProfileDto;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;
import com.ecommerce.request.UserRequest;

import java.util.List;

public interface UserService {

    User findUserById(Long userId) throws UserException;

    User findUserProfileByJwt(String jwt) throws UserException;

    UserProfileDto updateUser(Long userId, UserRequest userRequest) throws UserException;

    User updateUserById(Long userId, UserDto userDto) throws UserException;

    String deleteUserById(Long userId);

    List<User> findAllUsers();

    User updateUserRoleById(Long userId, boolean promote) throws UserException;

    void initiateEmailUpdate(User user);

    void updateEmail(User user, String otp, String newEmail) throws UserException;

}
