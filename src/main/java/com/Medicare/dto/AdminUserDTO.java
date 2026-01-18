package com.Medicare.dto;

import java.util.Set;

public class AdminUserDTO {
    private Integer userId;
    private String username;
    private String fullName;
    private String email;
    private Integer age;
    private String cityName;
    private String role;
    private String phoneNumber;
    private String gender;

    public AdminUserDTO() {}

    public AdminUserDTO(Integer userId, String username, String fullName, String email, 
                        Integer age, String cityName, String role, String phoneNumber, String gender) {
        this.userId = userId;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.age = age;
        this.cityName = cityName;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
    }

    // Getters and Setters
    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }
}
