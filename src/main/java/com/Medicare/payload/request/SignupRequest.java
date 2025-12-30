package com.Medicare.payload.request;


import com.Medicare.model.City;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.Set;

import com.Medicare.Enums.EGender;
import com.Medicare.Enums.EBloodType;

@Getter
@Setter
public class SignupRequest {
    private String userName;
    private String email;
    private String fullName;
    private Set<String> role;
    private String password;
    private EGender gender;
    private EBloodType bloodType;
    private String Address;
    private Date dateOfBirth;
    private Integer Age;
    private Integer cityId ;
    private String phoneNumber;
    private String nationalId;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;


}