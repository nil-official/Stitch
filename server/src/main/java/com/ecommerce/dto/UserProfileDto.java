package com.ecommerce.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private Date dob;
    private String gender;
    private int age;
    private int height;
    private int weight;
    private LocalDateTime createdAt;

}
