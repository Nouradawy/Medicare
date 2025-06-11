package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class ChronicDisease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;


    @ManyToOne
    @JsonBackReference
    private User user;

    public ChronicDisease() {}

    public ChronicDisease(String name, User user ) {
        this.name = name;
        this.user = user;

    }
}