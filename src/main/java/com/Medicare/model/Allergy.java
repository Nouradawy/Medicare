package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

import jakarta.persistence.*;


@Getter
@Setter
@Entity
public class Allergy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String allergy;
    private String Description;

    @ManyToOne
    @JsonBackReference
    private User user;
    public Allergy() {}

    public Allergy(String allergy, String description, User user ) {
        this.allergy = allergy;
        Description = description;
        this.user = user;

    }
}
