package com.ecommerce.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class TokenException extends RuntimeException {

    private final HttpStatus status;

    public TokenException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

}
