package com.Medicare.model;

import javax.persistence.*;
import java.util.List;


public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialty;

    @OneToMany(mappedBy = "doctor")
    private List<Reservation> reservations;

    // Getters and Setters
}