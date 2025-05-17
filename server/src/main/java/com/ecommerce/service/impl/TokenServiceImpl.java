package com.ecommerce.service.impl;

import com.ecommerce.exception.TokenException;
import com.ecommerce.model.User;
import com.ecommerce.model.VerifyToken;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.repository.VerifyTokenRepository;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.TokenService;
import com.ecommerce.utility.TokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenServiceImpl implements TokenService {

    private final EmailService emailService;
    private final UserRepository userRepository;
    private final VerifyTokenRepository verifyTokenRepository;

    @Override
    @Transactional
    public void generateAndSendToken(User user, String type, Integer otpLength, Integer expiryInMin, String purpose) {

        String token;

        // Determine type: OTP or TOKEN
        if ("OTP".equalsIgnoreCase(type)) {
            token = TokenUtil.generateOtp(otpLength);
        } else if ("UUID".equalsIgnoreCase(type)) {
            token = TokenUtil.generateToken();
        } else {
            throw new RuntimeException("Invalid token type " + type + ". Supported types are OTP, UUID");
        }

        // Calculate expiry time
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(expiryInMin);

        // Check if user already has a token
        Optional<VerifyToken> existingToken = verifyTokenRepository.findByUser(user);

        VerifyToken verifyToken;
        if (existingToken.isPresent()) {
            // Update existing token
            verifyToken = existingToken.get();
            verifyToken.setToken(token);
            verifyToken.setExpiryDate(expiryTime);
        } else {
            // Create new token
            verifyToken = new VerifyToken();
            verifyToken.setToken(token);
            verifyToken.setExpiryDate(expiryTime);
            verifyToken.setUser(user);
        }

        // Save token to database
        verifyTokenRepository.save(verifyToken);

        // Send email accordingly
        if ("OTP".equalsIgnoreCase(type)) {
            emailService.sendOtpEmail(user, token, expiryInMin, purpose);
        } else if ("UUID".equalsIgnoreCase(type)) {
            emailService.sendTokenEmail(user, token, expiryInMin, purpose);
        } else {
            throw new RuntimeException("Invalid token type " + type + ". Supported types are OTP, UUID");
        }

    }

    @Override
    public void validateToken(String type, String token) {

        Optional<VerifyToken> tokenOpt = verifyTokenRepository.findByToken(token);

        if (tokenOpt.isEmpty()) {
            throw new TokenException("No token found. Please initiate the verification process again.", HttpStatus.NOT_FOUND);
        }

        VerifyToken userToken = tokenOpt.get();

        // Check if token is expired
        if (userToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            verifyTokenRepository.delete(userToken);
            throw new TokenException("Your token has expired. Please request a new one.", HttpStatus.GONE);
        }

        if ("UUID".equalsIgnoreCase(type)) {
            User user = userToken.getUser();
            user.setVerified(true);
            userRepository.save(user);
        }

        // Valid token, delete after use
        verifyTokenRepository.delete(userToken);

    }

}
