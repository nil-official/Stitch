package com.ecommerce.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class UserException extends RuntimeException {

    private final HttpStatus status;

    public UserException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }

    public UserException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

}
