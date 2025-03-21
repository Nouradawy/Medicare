package com.Medicare.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity

public class Patient {
    @Id
    private Integer PatientId;
    private String PatientName;
    private String PatientAddress;

    public Patient() {}

    public Patient(Integer patientId, String patientName, String patientAddress) {
        PatientId = patientId;
        PatientName = patientName;
        PatientAddress = patientAddress;

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




//    @OneToMany(mappedBy = "patient")


    // Getters and Setters
}

