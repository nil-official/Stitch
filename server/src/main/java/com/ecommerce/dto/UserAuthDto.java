package com.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserAuthDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String role;

}
