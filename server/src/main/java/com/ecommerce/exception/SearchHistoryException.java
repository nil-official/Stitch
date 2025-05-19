package com.ecommerce.exception;

import com.ecommerce.enums.SearchHistoryCodes;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class SearchHistoryException extends RuntimeException {

    private final HttpStatus status;
    private final String errorCode;

    public SearchHistoryException(String message, String errorCode, HttpStatus status) {
        super(message);
        this.errorCode = errorCode;
        this.status = status;
    }

    public SearchHistoryException(SearchHistoryCodes codeEnum, HttpStatus status) {
        super(codeEnum.getMessage());
        this.status = status;
        this.errorCode = codeEnum.getCode();
    }

}
