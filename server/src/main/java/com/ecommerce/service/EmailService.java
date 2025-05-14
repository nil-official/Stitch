package com.ecommerce.service;

import com.ecommerce.dto.EmailProductDto;
import com.ecommerce.model.User;
import jakarta.mail.MessagingException;

import java.util.List;

public interface EmailService {

    void sendOtpEmail(User user, String otp, String purpose);

    void sendPromotionalEmail(User user, List<EmailProductDto> products, String purpose);

    void sendVerificationEmail(String toEmail, String verifyLink) throws MessagingException;

    void sendResetPasswordEmail(String toEmail, String resetLink) throws MessagingException;

}
