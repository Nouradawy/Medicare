package com.Medicare.model;

import jakarta.persistence.*;
import lombok.Getter; 
import lombok.Setter;
import java.util.HashSet;
import java.util.Set;
import com.Medicare.Enums.EGender;

import java.sql.Date;


@Entity
@Table(name = "users", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "username"),
           @UniqueConstraint(columnNames = "email")
       })
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;
    private String UserName;
    private String Password;
    private String Email;
    private String FullName;

    @Enumerated(EnumType.STRING)
    private EGender gender;

   // @Enumerated(EnumType.STRING)
   // private Role role;

   @ManyToMany(fetch = FetchType.EAGER)
   @JoinTable(name = "user_roles", 
              joinColumns = @JoinColumn(name = "user_id"),
              inverseJoinColumns = @JoinColumn(name = "role_id"))
   private Set<Role> roles = new HashSet<>();

    private String Address;
    private Date dateOfBirth;
    private Integer Age;
    private Integer CityId ;


    public User(){}

    public User(String userName, String password,String fullName , String email, EGender gender,  String address, Date dateOfBirth, Integer age, Integer cityId) {
        
        UserName = userName;
        Password = password;
        Email = email;
        this.gender = gender;
        Address = address;
        this.dateOfBirth = dateOfBirth;
        Age = age;
        CityId = cityId;
        FullName = fullName;
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    

    public String getUserName() {
        return UserName;
    }

    public String getFullName() {
        return FullName;
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

    public EGender getGender() {
        return gender;
    }

    public void setGender(EGender gender) {
        this.gender = gender;
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

// enum EGender {
//     male , Female
// }
// enum Role {
//     Doctor , Patient , Admin
// }
