package com.ecommerce.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponse {

    private String message;
    private String code;
    private String details;
    private LocalDateTime timestamp;

    public ErrorResponse(String message, String code, String details) {
        this.message = message;
        this.code = code;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

}
