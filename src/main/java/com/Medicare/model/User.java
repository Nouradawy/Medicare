package com.Medicare.model;

import jakarta.persistence.*;

import java.sql.Date;


@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;
    private String UserName;
    private String Password;
    private String Email;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private Role role;
    private String Address;
    private Date dateOfBirth;
    private Integer Age;
    private Integer CityId ;
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL) // ✅ This keeps the relationship bidirectional
    private Patient patient;

    public User(){}

    public User( String userName, String password, String email, Gender gender, Role role, String address, Date dateOfBirth, Integer age, Integer cityId) {
        UserName = userName;
        Password = password;
        Email = email;
        this.gender = gender;
        this.role = role;
        Address = address;
        this.dateOfBirth = dateOfBirth;
        Age = age;
        CityId = cityId;
    }

    public Integer getId() {
        return Id;
    }

    public void setId(Integer id) {
        Id = id;
    }

    public String getUserName() {
        return UserName;
    }

    public void setUserName(String userName) {
        UserName = userName;
    }

    public String getPassword() {
        return Password;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getAddress() {
        return Address;
    }

    public void setAddress(String address) {
        Address = address;
    }

    public Date getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(Date dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getAge() {
        return Age;
    }

    public void setAge(Integer age) {
        Age = age;
    }

    public Integer getCityId() {
        return CityId;
    }

    public void setCityId(Integer cityId) {
        CityId = cityId;
    }


}

enum Gender {
    male , Female
}
