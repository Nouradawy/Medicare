package com.Medicare.model;

import com.Medicare.config.StringListJsonConverter;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalTime;
import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "userId")
@Setter
@Getter
@Entity
public class Doctor {
    @Id
    private Integer userId;

    @JsonIgnore
    @OneToOne()
    @MapsId
    @JoinColumn(name = "userId", referencedColumnName = "userId")
//    @JsonBackReference("user-doctor")
    private User user;
    private String specialty;
    private String specialityDetails;
    private float Fees;
    private double Rating;
    @Column(name = "bio")
    private String Bio;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer servingNumber;
    private Integer visitDuration; // in minutes
    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "json")
    private List<String> workingDays;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "json")
    private List<String> Vacations;



    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PreVisits> preVisits;



    @JsonIgnore
    @OneToMany(mappedBy = "doctor", fetch = FetchType.EAGER)
//    @JsonManagedReference
    private List<Reservation> reservations;

    public Doctor() {}
    public Doctor( User user, String specialty, LocalTime startTime, LocalTime endTime, List<String> workingDays, List<Reservation> reservations , List<String> Vacations , String specialityDetails , float Fees ,Integer servingNumber, Integer visitDuration ,  double Rating) {

        this.user = user;
        this.specialty = specialty;
        this.specialityDetails = specialityDetails;
        this.Fees = Fees;
        this.Rating = Rating;
        this.startTime = startTime;
        this.endTime = endTime;
        this.workingDays = workingDays;
        this.Vacations = Vacations;
        this.servingNumber = servingNumber;

        this.reservations = reservations;
        this.visitDuration = visitDuration;
    }

    // Getters and Setters
}