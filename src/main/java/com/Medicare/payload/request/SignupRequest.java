package com.Medicare.payload.request;


import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.Set;

import com.Medicare.Enums.EGender;

@Getter
@Setter
public class SignupRequest {
    private String username;
    private String email;
    private String fullName;
    private Set<String> role;
    private String password;
    private EGender gender;
    private String Address;
    private Date dateOfBirth;
    private Integer Age;
    private Integer CityId ;


}