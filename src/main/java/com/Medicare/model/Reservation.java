package com.Medicare.model;

import com.Medicare.Enums.ReservationStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
    private Integer doctorId;


    @ManyToOne
    @JoinColumn(name = "doctorId" ,referencedColumnName = "userId" , insertable = false, updatable = false )
    @JsonBackReference
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "patientId" ,referencedColumnName = "userId" , insertable = false, updatable = false )
    @JsonBackReference
    private User user;



    private Date Date;
    private Integer Duration;
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
    private String visitPurpose;
    private Timestamp CreatedAt;


    public Reservation(){}
    public Reservation(Integer id, Integer patientId,Integer doctor_id, Doctor doctor, Date date, Integer duration, ReservationStatus status, String visitPurpose , Timestamp createdAt ) {
        Id = id;
        this.patientId = patientId;
        this.doctor = doctor;
        this.doctorId = doctor_id;
        Date = date;
        Duration = duration;
        this.status = status;
        this.visitPurpose = visitPurpose;
        CreatedAt = createdAt;
    }




}
