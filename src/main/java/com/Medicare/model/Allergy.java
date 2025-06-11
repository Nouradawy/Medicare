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
    private String Reaction;
    private String Severity;

    @ManyToOne
    @JsonBackReference
    private User user;
    public Allergy() {}

    public Allergy(String allergy, String reaction, User user , String severity) {
        this.allergy = allergy;
        Reaction = reaction;
        Severity = severity;

        this.user = user;

    }
}
