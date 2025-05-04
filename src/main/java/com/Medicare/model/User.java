package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.List;
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

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;
    private String username;
    private String Password;
    private String email;
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "city_id")
    private City city ;



    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChronicDisease> chronicDiseases;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicalHistory> MedicalHistory;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Allergy> Allergy;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DrugHistory> DrugHistory;


    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL) // ✅ This keeps the relationship bidirectional
    @JsonManagedReference
    private Doctor doctor;

    public User(){}

    public User(String username, String password, String fullName , String email, EGender gender, String address, Date dateOfBirth, Integer age ,City city) {
        this.username = username;
        Password = password;
        this.email = email;
        this.gender = gender;
        Address = address;
        this.city= city;
        this.dateOfBirth = dateOfBirth;
        Age = age;
        FullName = fullName;
    }




}



