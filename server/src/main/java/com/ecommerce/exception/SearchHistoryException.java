package com.ecommerce.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class SearchHistoryException extends RuntimeException {

    private final HttpStatus status;

    public SearchHistoryException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

}
