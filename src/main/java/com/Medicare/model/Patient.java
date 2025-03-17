package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity

public class Patient {
    @Id
    private Integer PatientId;
    private String PatientName;
    private String PatientAddress;



    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    public Patient() {}

    public Patient(Integer patientId, String patientName, String patientAddress, List<Reservation> reservations) {
        PatientId = patientId;
        PatientName = patientName;
        PatientAddress = patientAddress;
        this.reservations = reservations;
    }


    public Integer getPatientId() {
        return PatientId;
    }

    public void setPatientId(Integer patientId) {
        PatientId = patientId;
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

    public List<Reservation> getReservations() {
        return reservations;
    }




//    @OneToMany(mappedBy = "patient")


    // Getters and Setters
}

