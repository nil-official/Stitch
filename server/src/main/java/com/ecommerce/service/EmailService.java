package com.ecommerce.service;

import com.ecommerce.model.User;
import com.ecommerce.dto.EmailProductDto;

import java.util.List;

public interface EmailService {

    void sendOtpEmail(User user, String otp, Integer expiry, String purpose);

    void sendTokenEmail(User user, String token, Integer expiry, String purpose);

    void sendPromotionalEmail(User user, List<EmailProductDto> products, String purpose);

}
