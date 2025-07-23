package com.ecommerce.service.impl;

import com.ecommerce.config.JwtTokenProvider;
import com.ecommerce.exception.*;
import com.ecommerce.mapper.UserMapper;
import com.ecommerce.model.Role;
import com.ecommerce.model.User;
import com.ecommerce.model.VerifyToken;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.VerifyTokenRepository;
import com.ecommerce.request.LoginRequest;
import com.ecommerce.request.RegisterRequest;
import com.ecommerce.response.AuthResponse;
import com.ecommerce.security.CustomUserDetailsService;
import com.ecommerce.service.*;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final VerifyTokenRepository verifyTokenRepository;
    private final CartService cartService;
    private final WishlistService wishlistService;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetails;

    @Override
    public void register(RegisterRequest registerRequest) throws UserException {

        // Check if user with the given email already exists
        User isEmailExist = userRepository.findByEmail(registerRequest.getEmail());
        if (isEmailExist != null) {
            throw new UserException(
                    "Registration failed: Email already exists!",
                    HttpStatus.CONFLICT
            );
        }

        // Creating a User object
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // Adding roles
        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow(() -> new RuntimeException("Role not found"));
        roles.add(userRole);
        user.setRoles(roles);

        // Saving the object into DB
        User savedUser = userRepository.save(user);

        // Creating a cart for the new user
        cartService.createCart(savedUser);

        // Creating a wishlist for the new user
        wishlistService.createWishlist(savedUser);

        // Creating and Sending Verification Token
        tokenService.generateAndSendToken(savedUser, "UUID", null, 10, "register");

    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {

        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        User existingUser = userRepository.findByEmail(loginRequest.getEmail());

        if (existingUser == null) {
            throw new UserException(
                    "Authentication failed: User not found!",
                    HttpStatus.NOT_FOUND
            );
        }

        if (!existingUser.isVerified()) {
            Optional<VerifyToken> tokenOpt = verifyTokenRepository.findByUser(existingUser);

            if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().isBefore(LocalDateTime.now())) {
                tokenOpt.ifPresent(verifyTokenRepository::delete);

                // Generate and send a new token
                tokenService.generateAndSendToken(existingUser, "UUID", null, 10, "resend-token");

                throw new UserException(
                        "Your account is not verified. A new verification link has been sent to your email.",
                        HttpStatus.FORBIDDEN
                );
            }
            throw new UserException(
                    "Authentication failed: User is not verified!",
                    HttpStatus.FORBIDDEN
            );
        }

        Authentication authentication = authenticate(email, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new AuthResponse(
                true,
                "Login success",
                UserMapper.toUserAuthDto(existingUser),
                jwtTokenProvider.generateToken(authentication)
        );

    }

    private Authentication authenticate(String email, String password) {

        UserDetails userDetails = customUserDetails.loadUserByUsername(email);
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new UserException(
                    "Authentication failed: Password is incorrect!",
                    HttpStatus.UNAUTHORIZED
            );
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

    }

    @Override
    public void verifyAccount(String token) {

        // Validating the token received
        tokenService.validateToken("UUID", token);

    }

    @Override
    public void forgotPassword(String email) throws UserException {

        // Check if user exists
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserException(
                    "No account found with this email!",
                    HttpStatus.NOT_FOUND
            );
        }

        // Generating OTP and sending email
        tokenService.generateAndSendToken(user, "OTP", 6, 10, "password-reset");

    }

    @Override
    public void resetPassword(String otp, String newPassword) {

        // Getting the token
        VerifyToken verifyToken = verifyTokenRepository.findByToken(otp)
                .orElseThrow(() -> new TokenException("No token found. Please initiate the verification process again.", HttpStatus.NOT_FOUND));

        // Getting the user
        User user = verifyToken.getUser();

        // Checking the old password
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new UserException(
                    "Authentication failed: Password can't be the same as old password!",
                    HttpStatus.BAD_REQUEST
            );
        }

        // Validating the OTP
        tokenService.validateToken("OTP", otp);

        // Setting new password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Deleting the token
        verifyTokenRepository.delete(verifyToken);

    }

}
