package com.Medicare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
@Entity
public class MedicalHistory {
    @Id
    @Column(name= "patient_id")
    private Integer id;

    private Date date;
    private String description;

    @MapsId
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    public MedicalHistory() {}
    public MedicalHistory(Date date, String description, Patient patient) {
        this.date = date;
        this.description = description;
        this.patient = patient;
    }
}
