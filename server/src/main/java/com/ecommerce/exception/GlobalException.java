package com.ecommerce.exception;

import java.net.http.HttpHeaders;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import com.ecommerce.response.ApiResponse;
import com.ecommerce.response.ErrorResponse;
import com.ecommerce.response.ResponseBuilder;
import com.ecommerce.utility.RequestDetailsUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;


@ControllerAdvice
public class GlobalException {

    @ExceptionHandler(UserException.class)
    public ResponseEntity<ErrorDetails> UserExceptionHandler(UserException ex, WebRequest req) {

        ErrorDetails err = new ErrorDetails(ex.getMessage(), req.getDescription(false), LocalDateTime.now());
        return new ResponseEntity<>(err, ex.getStatus());

    }

    @ExceptionHandler(ProductException.class)
    public ResponseEntity<ErrorDetails> ProductExceptionHandler(ProductException ue, WebRequest req) {

        ErrorDetails err = new ErrorDetails(ue.getMessage(), req.getDescription(false), LocalDateTime.now());
        return new ResponseEntity<ErrorDetails>(err, HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(CartItemException.class)
    public ResponseEntity<ErrorDetails> CartItemExceptionHandler(CartItemException ue, WebRequest req) {

        ErrorDetails err = new ErrorDetails(ue.getMessage(), req.getDescription(false), LocalDateTime.now());
        return new ResponseEntity<ErrorDetails>(err, HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(OrderException.class)
    public ResponseEntity<ErrorDetails> OrderExceptionHandler(OrderException ue, WebRequest req) {

        ErrorDetails err = new ErrorDetails(ue.getMessage(), req.getDescription(false), LocalDateTime.now());
        return new ResponseEntity<ErrorDetails>(err, HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorDetails> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException me) {

        ErrorDetails err = new ErrorDetails(me.getBindingResult().getFieldError().getDefaultMessage(), "validation error", LocalDateTime.now());
        return new ResponseEntity<ErrorDetails>(err, HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "Endpoint not found");
        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> otherExceptionHandler(Exception e, WebRequest req) {

        ErrorDetails error = new ErrorDetails(e.getMessage(), req.getDescription(false), LocalDateTime.now());
        return new ResponseEntity<ErrorDetails>(error, HttpStatus.BAD_REQUEST);

    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorDetails> InvalidTokenExceptionHandler(InvalidTokenException ie, WebRequest req) {
        ErrorDetails err = new ErrorDetails(ie.getMessage(), req.getDescription(false), LocalDateTime.now());
        return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<ErrorDetails> TokenExpiredExceptionHandler(TokenExpiredException te, WebRequest req) {
        ErrorDetails err = new ErrorDetails(te.getMessage(), req.getDescription(false), LocalDateTime.now());
        return new ResponseEntity<>(err, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TokenException.class)
    public ResponseEntity<ErrorDetails> handleTokenException(TokenException ex, HttpServletRequest req) {
        ErrorDetails err = new ErrorDetails(ex.getMessage(), RequestDetailsUtil.buildDetailedRequestInfo(req), LocalDateTime.now());
        return new ResponseEntity<>(err, ex.getStatus());
    }

    @ExceptionHandler(UnauthenticatedException.class)
    public ResponseEntity<ApiResponse> handleUnauthenticated(UnauthenticatedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ApiResponse(ex.getMessage(), false));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ApiResponse(ex.getMessage(), false));
    }

    @ExceptionHandler(SearchHistoryException.class)
    public ResponseEntity<ErrorResponse> handleSearchHistoryException(SearchHistoryException ex, HttpServletRequest req) {
        ErrorResponse errorResponse = ResponseBuilder.error(ex.getMessage(), ex.getErrorCode(), RequestDetailsUtil.buildDetailedRequestInfo(req));
        return new ResponseEntity<>(errorResponse, ex.getStatus());
    }

}
