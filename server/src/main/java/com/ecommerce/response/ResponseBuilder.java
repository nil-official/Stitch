package com.ecommerce.response;

public class ResponseBuilder {

    public static <T> SuccessResponse<T> success(String message, T data) {
        return new SuccessResponse<>(true, message, data);
    }

    public static <T> SuccessResponse<T> success(T data) {
        return new SuccessResponse<>(true, "Request processed successfully.", data);
    }

    public static SuccessResponse<Void> successMessage(String message) {
        return new SuccessResponse<>(true, message, null);
    }

    public static <T> SuccessResponse<T> failure(String message, T data) {
        return new SuccessResponse<>(false, message, data);
    }

    public static <T> SuccessResponse<T> failure(T data) {
        return new SuccessResponse<>(false, "Request processed but failed due to business constraints.", data);
    }

    public static SuccessResponse<Void> failureMessage(String message) {
        return new SuccessResponse<>(false, message, null);
    }

    public static ErrorResponse error(String message, String code, String details) {
        return new ErrorResponse(message, code, details);
    }

    public static ErrorResponse error(String code, String details) {
        return new ErrorResponse("Request could not be processed due to server error.", code, details);
    }

    public static ErrorResponse errorMessage(String message, String details) {
        return new ErrorResponse(message, null, details);
    }

}
