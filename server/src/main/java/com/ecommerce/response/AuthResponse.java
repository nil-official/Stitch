package com.ecommerce.response;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.ecommerce.dto.UserAuthDto;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private boolean status;
    private String message;
    private UserAuthDto user;
    private String token;

}
