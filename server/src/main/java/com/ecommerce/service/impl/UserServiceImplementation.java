package com.ecommerce.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.ecommerce.dto.UserDto;
import com.ecommerce.dto.UserProfileDto;
import com.ecommerce.mapper.UserMapper;
import com.ecommerce.model.Role;
import com.ecommerce.repository.*;
import com.ecommerce.request.UserRequest;
import com.ecommerce.service.UserService;
import com.ecommerce.utility.DtoValidatorUtil;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.ecommerce.config.JwtTokenProvider;
import com.ecommerce.exception.UserException;
import com.ecommerce.model.User;

@Service
@AllArgsConstructor
public class UserServiceImplementation implements UserService {

    private UserRepository userRepository;
    private JwtTokenProvider jwtTokenProvider;
    private RoleRepository roleRepository;
    private VerifyTokenRepository verifyTokenRepository;

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
    public UserProfileDto updateUser(Long userId, UserRequest userRequest) throws UserException {
        DtoValidatorUtil.validate(userRequest);

        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            throw new UserException("User not found with id " + userId);
        }

        User user = optionalUser.get();

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
        if (userRequest.getDob() != null) {
            user.setDob(userRequest.getDob());
        }
        if (userRequest.getGender() != null) {
            user.setGender(userRequest.getGender());
        }
        if (userRequest.getHeight() != null) {
            user.setHeight(userRequest.getHeight());
        }
        if (userRequest.getWeight() != null) {
            user.setWeight(userRequest.getWeight());
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
            existingUser.get().getPaymentInformation().clear();
            existingUser.get().getCart().getCartItems().clear();
            existingUser.get().getOrders().forEach(order -> order.getOrderItems().clear());
            existingUser.get().getWishlists().forEach(wishlist -> wishlist.getWishlistItems().clear());
            verifyTokenRepository.deleteByUserId(existingUser.get().getId());
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

}
