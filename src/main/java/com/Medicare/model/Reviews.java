package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity

public class Reviews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;
    private Integer patientId;
    private Integer doctorId;
    private Integer rating;
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "doctorId" ,referencedColumnName = "userId" , insertable = false, updatable = false )
    private Doctor doctor;


    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "patientId" ,referencedColumnName = "userId" , insertable = false, updatable = false )
    private User user;

    public Reviews() {
    }

    public Reviews(Integer id, Integer patientId, Integer doctorId, Integer rating, String comment) {
        Id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.rating = rating;
        this.comment = comment;
    }
}
