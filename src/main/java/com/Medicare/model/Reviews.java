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

    private Integer reservationId;

    private Integer rating;
    private String comment;
    private String doc_comment;

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

    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(
            name = "reservationId",
            referencedColumnName = "id",
            insertable = false,
            updatable = false,
            unique = true
    )
    private Reservation reservation;

    public Reviews() {
    }

    public Reviews(Integer id, Integer patientId, Integer doctorId,Integer reservationId, Integer rating, String comment, String doc_comment, Timestamp createdAt) {
        Id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.reservationId = reservationId;
        this.rating = rating;
        this.comment = comment;
        this.doc_comment = doc_comment;
        CreatedAt = createdAt;
    }

}
