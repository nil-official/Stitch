package com.ecommerce.controller;

import com.ecommerce.request.RegisterRequest;
import com.ecommerce.response.ApiResponse;
import com.ecommerce.service.AuthService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.exception.UserException;
import com.ecommerce.request.LoginRequest;
import com.ecommerce.response.AuthResponse;

import jakarta.validation.Valid;

@RestController
@AllArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerHandler(@Valid @RequestBody RegisterRequest registerRequest) throws UserException {

        authService.register(registerRequest);
        ApiResponse apiResponse = new ApiResponse("User Registered Successfully! Please verify your email to login!", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(@Valid @RequestBody LoginRequest loginRequest) {

        AuthResponse authResponse = authService.login(loginRequest);
        return new ResponseEntity<>(authResponse, HttpStatus.OK);

    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse> verifyHandler(@RequestParam String token) {

        authService.verifyAccount(token);
        ApiResponse apiResponse = new ApiResponse("Email Verified Successfully! Please login to continue..", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @PostMapping("/password/forgot")
    public ResponseEntity<ApiResponse> forgotPasswordHandler(@RequestParam String email) throws UserException {

        authService.forgotPassword(email);
        ApiResponse apiResponse = new ApiResponse("An One Time Password (OTP) has been sent to your registered email address to reset your password.", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @PostMapping("/password/reset")
    public ResponseEntity<ApiResponse> resetPasswordHandler(@RequestParam String otp, @RequestParam String newPassword) {

        authService.resetPassword(otp, newPassword);
        ApiResponse apiResponse = new ApiResponse("Your password has been reset successfully. You may now log in using your new password.", true);
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

}
