package com.Medicare.model;

import com.Medicare.Enums.ReservationStatus;
import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.Date;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
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
    private Integer queueNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "doctorId" ,referencedColumnName = "userId" , insertable = false, updatable = false )
    private Doctor doctor;


    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "patientId" ,referencedColumnName = "userId" , insertable = false, updatable = false )
    private User user;



    private Date date;
    private Integer Duration;
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
    private String visitPurpose;
    private Timestamp CreatedAt;


    public Reservation(){}
    public Reservation(Integer id, Integer patientId,Integer doctor_id, Doctor doctor, Date date, Integer duration, ReservationStatus status, String visitPurpose , Timestamp createdAt , Integer queueNumber) {
        Id = id;
        this.patientId = patientId;
        this.doctor = doctor;
        this.doctorId = doctor_id;
        this.date = date;
        this.queueNumber = queueNumber;
        Duration = duration;
        this.status = status;
        this.visitPurpose = visitPurpose;
        CreatedAt = createdAt;
    }




}
