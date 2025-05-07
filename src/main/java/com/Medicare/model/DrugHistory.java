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

    private Integer User_id;

    @ManyToOne
    @JsonBackReference
    private User user;
    public DrugHistory(){}

    public DrugHistory(String drugName, User user ) {
        this.drugName = drugName;
        this.user = user;

    }
}
