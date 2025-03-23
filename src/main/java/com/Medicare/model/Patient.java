package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity

public class Patient {
    @Id
    private Integer UserId;
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


    public Integer getUserId() {
        return user.getId();
    }

    public void setUserId(Integer patientId) {
        this.UserId = patientId;
    }

    public String getPatientName() {
        return PatientName;
    }

    public void setPatientName(String patientName) {
        PatientName = patientName;
    }

    public String getPatientAddress() {
        return PatientAddress;
    }

    public void setPatientAddress(String patientAddress) {
        PatientAddress = patientAddress;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }





//    @OneToMany(mappedBy = "patient")


    // Getters and Setters
}

