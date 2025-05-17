package com.ecommerce.service;

import com.ecommerce.model.User;

public interface TokenService {

    void generateAndSendToken(User user, String type, Integer otpLength, Integer expiryInMin, String purpose);

    void validateToken(String type, String token);

}
