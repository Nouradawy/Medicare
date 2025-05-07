package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;

@Setter
@Getter
@Entity
public class MedicalHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Date date;
    private String description;
    @ManyToOne
    @JsonBackReference
    private User user;

    public MedicalHistory() {}
    public MedicalHistory(Date date, String description, User user ) {
        this.date = date;
        this.description = description;
        this.user = user;

    }
}
