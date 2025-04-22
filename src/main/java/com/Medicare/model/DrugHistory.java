package com.Medicare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;




@Getter
@Setter
@Entity
public class DrugHistory {

    @Id
    @Column(name = "patient_id")
    private Integer id;
    private String drugName;

    @MapsId
    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;
    public DrugHistory(){}

    public DrugHistory(String drugName, Patient patient) {
        this.drugName = drugName;
        this.patient = patient;
    }
}
