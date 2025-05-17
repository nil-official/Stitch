package com.ecommerce.service.impl;

import com.ecommerce.dto.EmailProductDto;
import com.ecommerce.exception.EmailSendingException;
import com.ecommerce.model.User;
import com.ecommerce.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final String frontendBaseUrl;

    public EmailServiceImpl(JavaMailSender mailSender,
                            TemplateEngine templateEngine,
                            @Qualifier("frontendBaseUrl") String frontendBaseUrl) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
        this.frontendBaseUrl = frontendBaseUrl;
    }

    public void sendEmail(String to, String subject, String templatePath, Map<String, Object> templateModel) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            // Set email properties
            helper.setTo(to);
            helper.setSubject(subject);

            // Process template
            Context context = new Context();
            context.setVariables(templateModel);
            String htmlContent = templateEngine.process(templatePath, context);

            helper.setText(htmlContent, true);

            // Send email
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailSendingException("Email Service Implementation: Failed to send email", e);
        }

    }

    @Override
    public void sendOtpEmail(User user, String otp, Integer expiry, String purpose) {

        String subject;
        String heading;
        String greeting = "Hello " + user.getFirstName() + ",";
        String mainMessage;
        String expiration = "This OTP will expire in " + expiry + " minutes.";
        String additionalInfo = "If this wasn’t you, please secure your account immediately by resetting your password.";
        String templatePath = "email/otp";

        switch (purpose.toLowerCase()) {
            case "password-reset":
                subject = "OTP for Password Reset";
                heading = "Reset Your Password";
                mainMessage = "We received a request to reset your password. Please use the following OTP to verify your identity and continue the reset process.";
                break;

            case "email-update":
                subject = "OTP for Email Change Verification";
                heading = "Verify Your New Email";
                mainMessage = "You’ve requested to change your email address. Please enter the OTP below to confirm this change and help us keep your account secure.";
                break;

            default:
                subject = "Your OTP Code";
                heading = "Verify Your Action";
                mainMessage = "Please use the following OTP to complete your verification. This step helps us ensure the security of your account and verify your identity.";
        }

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("heading", heading);
        templateModel.put("greeting", greeting);
        templateModel.put("mainMessage", mainMessage);
        templateModel.put("otp", otp);
        templateModel.put("expiration", expiration);
        templateModel.put("additionalInfo", additionalInfo);

        sendEmail(user.getEmail(), subject, templatePath, templateModel);

    }

    @Override
    public void sendTokenEmail(User user, String token, Integer expiry, String purpose) {

        String subject;
        String heading;
        String greeting = "Hello " + user.getFirstName() + ",";
        String mainMessage;
        String actionText;
        String actionUrl = "verify?token=" + token;
        String expiration = "This link will expire in " + expiry + " minutes.";
        String additionalInfo = "If this wasn’t you, please secure your account immediately by resetting your password.";
        String templatePath = "email/token";

        switch (purpose.toLowerCase()) {
            case "register":
                subject = "Account Registration Confirmation";
                heading = "Activate Your New Account";
                mainMessage = "Thank you for signing up. To activate your account and begin using our services, please confirm your registration by clicking the button below.";
                actionText = "Confirm Registration";
                break;

            case "resend-token":
                subject = "Verify Your Email Address";
                heading = "Complete Your Registration";
                mainMessage = "We noticed you haven't verified your email yet. To activate your account, please click the button below.";
                actionText = "Verify Email";
                break;

            case "email-update":
                subject = "Email Address Change Verification";
                heading = "Verify Your New Email Address";
                mainMessage = "You have requested to update the email address associated with your account. Please verify this change by clicking the button below.";
                actionText = "Verify Email Address";
                break;

            default:
                subject = "Action Required: Verify Your Request";
                heading = "Confirm Your Action";
                mainMessage = "We have received a request that requires your confirmation. Please click the button below to proceed.";
                actionText = "Verify Now";
                break;
        }

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("heading", heading);
        templateModel.put("greeting", greeting);
        templateModel.put("mainMessage", mainMessage);
        templateModel.put("frontendBaseUrl", frontendBaseUrl);
        templateModel.put("actionUrl", actionUrl);
        templateModel.put("actionText", actionText);
        templateModel.put("expiration", expiration);
        templateModel.put("additionalInfo", additionalInfo);

        sendEmail(user.getEmail(), subject, templatePath, templateModel);
    }

    @Override
    public void sendPromotionalEmail(User user, List<EmailProductDto> products, String purpose) {

        String subject;
        String heading;
        String mainMessage;
        String actionText;
        String actionUrl;
        String additionalInfo = null;
        String templatePath = "email/products";

        switch (purpose.toLowerCase()) {
            case "recommendation":
                subject = "Products Recommended Just For You";
                heading = "Top Picks Just for You - Discover Your Next Favorite";
                mainMessage = "We’ve curated a selection of products we think you’ll love based on your recent activity. Dive in and discover something special.";
                actionText = "Explore More";
                actionUrl = "/products/recommendation";
                additionalInfo = "These recommendations are based on your browsing history and previous purchases.";
                break;
            case "sale":
                subject = "Special Sale: Up to 50% OFF!";
                heading = "Limited Time Sale!";
                mainMessage = "Don't miss out on these amazing discounts. Limited time only!";
                actionText = "Shop Now";
                actionUrl = "/products/sale";
                additionalInfo = "Sale ends soon. While stocks last.";
                break;
            case "new-arrivals":
                subject = "New Arrivals Just Dropped!";
                heading = "Check Out What's New";
                mainMessage = "We've just added these exciting new products to our collection.";
                actionText = "Explore New Arrivals";
                actionUrl = "/products/new";
                break;
            default:
                subject = "Products Picked For You";
                heading = "Products You Might Like";
                mainMessage = "We thought you might be interested in these products:";
                actionText = "Browse More";
                actionUrl = "/products";
        }

        String greeting = "Hello " + user.getFirstName() + ",";

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("heading", heading);
        templateModel.put("greeting", greeting);
        templateModel.put("mainMessage", mainMessage);
        templateModel.put("products", products);
        templateModel.put("frontendBaseUrl", frontendBaseUrl);
        templateModel.put("currency", "INR");
        templateModel.put("actionUrl", actionUrl);
        templateModel.put("actionText", actionText);
        templateModel.put("additionalInfo", additionalInfo);

        sendEmail(user.getEmail(), subject, templatePath, templateModel);

    }

}
