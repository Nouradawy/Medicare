package com.Medicare.model;

import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;


@Getter
@Setter
@Entity
public class Allergy {

    @Id
    @Column(name = "patient_id")
    private Integer id;

    private String allergy;
    private String Description;

    @MapsId
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    public Allergy() {}

    public Allergy(String allergy, String description, Patient patient) {
        this.allergy = allergy;
        Description = description;
        this.patient = patient;
    }
}
