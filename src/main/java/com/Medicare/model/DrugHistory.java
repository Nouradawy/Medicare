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
    @Column(name = "user_id")
    private Integer id;
    private String drugName;

    @MapsId
    @ManyToOne
    @JsonBackReference
    private User user;
    public DrugHistory(){}

    public DrugHistory(String drugName, User user) {
        this.drugName = drugName;
        this.user = user;
    }
}
