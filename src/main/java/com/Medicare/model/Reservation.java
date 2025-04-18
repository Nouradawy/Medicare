package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Date;


@Entity
@Data
@Table(
        name = "reservation",
        indexes = {
                @Index(name = "idx_patient_id", columnList = "patientId"),
                @Index(name = "idx_doctor_id", columnList = "doctorId")
        }
)
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;
    private Integer patientId;
    private Integer DoctorId;
    private Date Date;
    private Integer Duration;
    @Enumerated(EnumType.STRING)
    private Status status;
    private String visitPurpose;
    private Timestamp CreatedAt;
    public Reservation(){}
    public Reservation(Integer id, Integer patientId, Integer doctorId, Date date, Integer duration, Status status, String visitPurpose , Timestamp createdAt ) {
        Id = id;
        this.patientId = patientId;
        DoctorId = doctorId;
        Date = date;
        Duration = duration;
        this.status = status;
        this.visitPurpose = visitPurpose;
        CreatedAt = createdAt;
    }



}

enum Status{Postponed,Confirmed,Pending,Completed,Canceled}