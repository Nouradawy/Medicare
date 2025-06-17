package com.Medicare.model;

import com.Medicare.Enums.DoctorStatus;
import com.Medicare.config.StringListJsonConverter;
import com.Medicare.dto.MapStringListJsonConverter;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.time.LocalTime;
import java.util.List;
import java.util.Map;

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
    private Integer Rating;
    private String Bio;
    private LocalTime startTime;
    private LocalTime endTime;
    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "json")
    private List<String> workingDays;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "json")
    private List<String> Vacations;

    @Enumerated(EnumType.STRING)
    private DoctorStatus status = DoctorStatus.Pending;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PreVisits> preVisits;

    @JsonIgnore
    @OneToMany(mappedBy = "doctor", fetch = FetchType.EAGER)
//    @JsonManagedReference
    private List<Reservation> reservations;

    public Doctor() {}
    public Doctor( User user, String specialty, LocalTime startTime, LocalTime endTime, List<String> workingDays, DoctorStatus status, List<Reservation> reservations , List<String> Vacations , String specialityDetails , float Fees ) {

        this.user = user;
        this.specialty = specialty;
        this.specialityDetails = specialityDetails;
        this.Fees = Fees;
        this.Rating = 0;
        this.startTime = startTime;
        this.endTime = endTime;
        this.workingDays = workingDays;
        this.Vacations = Vacations;

        this.status = status;
        this.reservations = reservations;
    }

    // Getters and Setters
}