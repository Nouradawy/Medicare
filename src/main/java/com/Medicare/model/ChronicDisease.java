package com.Medicare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ChronicDisease {

    @Id
    @Column(name = "patient_id")
    private Integer id;

    private String name;

    @MapsId
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    public ChronicDisease() {}

    public ChronicDisease(String name, Patient patient) {
        this.name = name;
        this.patient = patient;
    }
}