package com.ecommerce.service;

import com.ecommerce.exception.UserException;
import com.ecommerce.request.LoginRequest;
import com.ecommerce.request.RegisterRequest;
import com.ecommerce.response.AuthResponse;

public interface AuthService {

    void register(RegisterRequest registerRequest) throws UserException;

    AuthResponse login(LoginRequest loginRequest);

    void verifyAccount(String token);

    void forgotPassword(String email) throws UserException;

    void resetPassword(String otp, String newPassword);

}
