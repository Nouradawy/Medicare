package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

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
    @CreationTimestamp
    private Timestamp CreatedAt;

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

    public Reviews(Integer id, Integer patientId, Integer doctorId, Integer rating, String comment, Timestamp createdAt) {
        Id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.rating = rating;
        this.comment = comment;
        CreatedAt = createdAt;
    }

}
