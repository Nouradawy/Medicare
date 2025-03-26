package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity

public class Patient {
    @Id
    private Long UserId;

    private String PatientName;
    private String PatientAddress;

    @MapsId
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Patient() {}

    public Patient( String patientName, String patientAddress , User user) {
        PatientName = patientName;
        PatientAddress = patientAddress;
        this.user = user;

    }

}

