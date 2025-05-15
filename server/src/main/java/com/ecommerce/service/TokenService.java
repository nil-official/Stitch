package com.ecommerce.service;

import com.ecommerce.model.User;

public interface OtpService {

    void generateAndSendOtp(User user, Integer otpLength, String purpose);

    boolean validateOtp(User user, String otp);

}
