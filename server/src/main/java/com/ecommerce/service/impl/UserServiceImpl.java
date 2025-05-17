package com.ecommerce.service.impl;

import java.util.*;

import com.ecommerce.dto.UserDto;
import com.ecommerce.dto.UserProfileDto;
import com.ecommerce.mapper.UserMapper;
import com.ecommerce.model.Role;
import com.ecommerce.repository.*;
import com.ecommerce.request.SizePredictionRequest;
import com.ecommerce.request.UserRequest;
import com.ecommerce.service.MLService;
import com.ecommerce.service.TokenService;
import com.ecommerce.service.UserService;
import com.ecommerce.utility.AgeUtil;
import com.ecommerce.utility.DtoValidatorUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.ecommerce.config.JwtTokenProvider;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RoleRepository roleRepository;
    private final VerifyTokenRepository verifyTokenRepository;
    private final TokenService tokenService;
    private final MLService mlService;

    @Override
    public User findUserById(Long userId) throws UserException {

        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return user.get();
        }
        throw new UserException("user not found with id " + userId);

    }

    @Override
    public User findUserProfileByJwt(String jwt) throws UserException {

        String email = jwtTokenProvider.getEmailFromJwtToken(jwt);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException("User not found with email: " + email);
        }
        return user;

    }

    @Override
    public List<User> findAllUsers() {

        return userRepository.findAll();

    }

    @Override
    public User updateUserById(Long userId, UserDto userDto) throws UserException {

        DtoValidatorUtil.validate(userDto);
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            UserMapper.updateUser(user.get(), userDto);
            return userRepository.save(user.get());
        }
        throw new UserException("user not found with id " + userId);

    }

    @Override
    @Transactional
    public UserProfileDto updateUser(Long userId, UserRequest userRequest) throws UserException {
        DtoValidatorUtil.validate(userRequest);

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new UserException("User not found with id " + userId);
        }

        User user = optionalUser.get();

        // Track previous values
        Date existingDob = user.getDob();
        Integer existingHeight = user.getHeight();
        Integer existingWeight = user.getWeight();

        // Flags to detect what is updated
        boolean isDobUpdated = userRequest.getDob() != null;
        boolean isHeightUpdated = userRequest.getHeight() != null;
        boolean isWeightUpdated = userRequest.getWeight() != null;

        // Apply updates to fields
        if (userRequest.getFirstName() != null) {
            user.setFirstName(userRequest.getFirstName());
        }
        if (userRequest.getLastName() != null) {
            user.setLastName(userRequest.getLastName());
        }
        if (userRequest.getEmail() != null) {
            user.setEmail(userRequest.getEmail());
        }
        if (userRequest.getMobile() != null) {
            user.setMobile(userRequest.getMobile());
        }
        if (isDobUpdated) {
            user.setDob(userRequest.getDob());
            user.setAge(AgeUtil.calculateAge(userRequest.getDob()));
        }
        if (userRequest.getGender() != null) {
            user.setGender(userRequest.getGender());
        }
        if (isHeightUpdated) {
            user.setHeight(userRequest.getHeight());
        }
        if (isWeightUpdated) {
            user.setWeight(userRequest.getWeight());
        }

        // Prediction logic condition
        boolean anyPreviouslyExists = existingDob != null || existingHeight > 0 || existingWeight > 0;
        boolean anyNewlyUpdated = isDobUpdated || isHeightUpdated || isWeightUpdated;
        boolean allNewlyProvided = isDobUpdated && isHeightUpdated && isWeightUpdated;

        if ((anyPreviouslyExists && anyNewlyUpdated) || allNewlyProvided) {
            // Ensure all values are available for prediction
            int age = isDobUpdated ? AgeUtil.calculateAge(userRequest.getDob()) : user.getAge();
            int height = isHeightUpdated ? userRequest.getHeight() : user.getHeight();
            int weight = isWeightUpdated ? userRequest.getWeight() : user.getWeight();

            SizePredictionRequest sizePredictionRequest = new SizePredictionRequest(
                    height, weight, age
            );

            List<String> predictedSizes = mlService.predictSize(sizePredictionRequest);
            user.setPredictedSizes(new ArrayList<>(predictedSizes));
        }

        return UserMapper.toUserProfileDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public String deleteUserById(Long userId) {

        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            existingUser.get().getRoles().clear();
            existingUser.get().getAddresses().clear();
            existingUser.get().getCart().getCartItems().clear();
            existingUser.get().getOrders().forEach(order -> order.getOrderItems().clear());
            existingUser.get().getWishlists().forEach(wishlist -> wishlist.getWishlistItems().clear());
            verifyTokenRepository.deleteByUser(existingUser.get());
            userRepository.delete(existingUser.get());
            return "User deleted successfully!";
        }
        return "No user found with the given id: " + userId;

    }

    @Override
    public User updateUserRoleById(Long userId, boolean promote) throws UserException {

        Optional<User> existingUser = userRepository.findById(userId);
        if (existingUser.isPresent()) {
            User user = existingUser.get();
            Set<Role> roles = new HashSet<>();
            Role userRole;
            if (promote) {
                userRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow(() -> new RuntimeException("Role not found"));
            } else {
                userRole = roleRepository.findByName("ROLE_USER").orElseThrow(() -> new RuntimeException("Role not found"));
            }
            roles.add(userRole);
            user.setRoles(roles);
            return userRepository.save(user);
        }
        throw new UserException("user not found with id " + userId);

    }

    @Override
    public void initiateEmailUpdate(User user) {

        // Generating and sending OTP
        tokenService.generateAndSendToken(user, "OTP", 6, 10, "email-update");

    }

    @Override
    @Transactional
    public void updateEmail(User user, String otp, String newEmail) throws UserException {

        User isEmailExist = userRepository.findByEmail(newEmail);
        if (isEmailExist != null) {
            throw new UserException("Authentication failed: Account already exists with new email " + newEmail);
        }

        // Validating the OTP
        tokenService.validateToken("OTP", otp);

        // Saving the user with new email
        user.setEmail(newEmail);
        user.setVerified(false);
        User savedUser = userRepository.save(user);

        // Generating and Sending Verification Token
        tokenService.generateAndSendToken(savedUser, "UUID", null, 10, "email-update");

    }

}
