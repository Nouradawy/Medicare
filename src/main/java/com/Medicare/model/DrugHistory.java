package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;




@Getter
@Setter
@Entity
public class DrugHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String drugName;
    private String dosage;
    private String frequency;
    private String duration;
    private String PrescribingPhysician;
    private String Route;
    private Integer User_id;

    @ManyToOne
    @JsonBackReference
    private User user;
    public DrugHistory(){}

    public DrugHistory(String drugName, User user , String dosage, String frequency, String duration, String prescribingPhysician, String route) {
        this.drugName = drugName;
        this.user = user;
        dosage = dosage;
        frequency = frequency;
        duration = duration;
        PrescribingPhysician = prescribingPhysician;
        Route = route;

    }
}
