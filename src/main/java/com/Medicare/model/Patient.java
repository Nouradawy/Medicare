package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


public class Patient {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long PatientId;
    private String PatientName;
    private String PatientAddress;
    @JsonProperty("reservations")
    private List<Reservation> reservations;

    public Patient(Long patientId, String patientName, String patientAddress, List<Reservation> reservations) {
        PatientId = patientId;
        PatientName = patientName;
        PatientAddress = patientAddress;
        this.reservations = reservations;
    }

    public Long getPatientId() {
        return PatientId;
    }

    public void setPatientId(Long patientId) {
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

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }

//    @OneToMany(mappedBy = "patient")


    // Getters and Setters
}

