package com.ecommerce.exception;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetails {

    private String error;
    private String details;
    private LocalDateTime timestamp;

}
