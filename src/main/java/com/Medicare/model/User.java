package com.Medicare.model;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.Medicare.Enums.EGender;
import com.Medicare.Enums.EBloodType;

import java.sql.Date;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "userId")
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
    private Integer userId;
    private String username;
    @JsonIgnore
    private String Password;
    private String email;
    private String FullName;
    private String phoneNumber;
    private String nationalId;

    @Enumerated(EnumType.STRING)
    private EGender gender;

    @Enumerated(EnumType.STRING)
    private EBloodType bloodType;

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
    private String imageUrl;

    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "city_id")
    private City city ;

    @Lob
    @JsonIgnore
    @Column(columnDefinition = "LONGTEXT")
    private String pushSubscription;


    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChronicDisease> chronicDiseases;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MedicalHistory> MedicalHistory;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Allergy> Allergy;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DrugHistory> DrugHistory;


    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL) // ✅ This keeps the relationship bidirectional
//    @JsonManagedReference("user-doctor")
    private Doctor doctor;

    @JsonIgnore
    @OneToMany(mappedBy = "user")
//    @JsonBackReference("user-reservations")
    private List<Reservation> reservations;



    public User(){}

    public User(String username, String password, String fullName , String email, EGender gender, EBloodType bloodType, String address, Date dateOfBirth, Integer age ,City city ,String imageUrl, String pushSubscription , String phoneNumber, String nationalId, String emergencyContactName, String emergencyContactPhone, String emergencyContactRelation) {
        this.username = username;
        Password = password;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.nationalId = nationalId;
        this.gender = gender;
        this.bloodType = bloodType;
        Address = address;
        this.city= city;
        this.imageUrl = imageUrl;
        this.dateOfBirth = dateOfBirth;
        Age = age;
        FullName = fullName;
        this.pushSubscription = pushSubscription;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactPhone = emergencyContactPhone;
        this.emergencyContactRelation = emergencyContactRelation;

    }




}



