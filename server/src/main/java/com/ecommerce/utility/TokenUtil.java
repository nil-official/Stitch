package com.ecommerce.utility;

import java.security.SecureRandom;
import java.util.UUID;

public class TokenUtil {

    public static String generateOtp(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("OTP length must be greater than 0");
        }

        SecureRandom random = new SecureRandom();
        StringBuilder otp = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int digit = random.nextInt(10);
            otp.append(digit);
        }

        return otp.toString();
    }

    public static String generateToken() {
        return UUID.randomUUID().toString();
    }

}
