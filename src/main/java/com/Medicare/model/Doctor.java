package com.Medicare.model;

import com.Medicare.Enums.DoctorStatus;
import com.Medicare.dto.StringListJsonConverter;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import java.sql.Timestamp;
import java.time.LocalTime;
import java.util.List;

@Setter
@Getter
@Entity
public class Doctor {


    @Id
    private Integer userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    @JsonBackReference
    private User user;

    private String specialty;

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



    @OneToMany(mappedBy = "doctor")
    @JsonManagedReference
    private List<Reservation> reservations;

    public Doctor() {}
    public Doctor( User user, String specialty, LocalTime startTime, LocalTime endTime, List<String> workingDays, DoctorStatus status, List<Reservation> reservations , List<String> Vacations) {

        this.user = user;
        this.specialty = specialty;
        this.startTime = startTime;
        this.endTime = endTime;
        this.workingDays = workingDays;
        this.Vacations = Vacations;
        this.status = status;
        this.reservations = reservations;
    }

    // Getters and Setters
}