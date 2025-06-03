package com.ecommerce.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SearchHistoryCodes {

    EMPTY_PHRASE("SH001", "Search phrase cannot be null or empty."),
    FETCH_FAILED("SH002", "Error while fetching search history."),
    SAVE_FAILED("SH003", "Failed to save search history."),
    INVALID_IDENTIFIER("SH004", "Provided ID is invalid."),
    NOT_FOUND("SH005", "Search history could not be found."),
    UNAUTHORIZED_ACCESS("SH006", "Unauthorized access."),
    DELETE_FAILED("SH007", "Failed to delete search history."),
    CLEAR_FAILED("SH008", "Failed to clear search history."),
    UNKNOWN_ERROR("SH999", "An unexpected error occurred. Please try again later.");

    private final String code;
    private final String message;

}
