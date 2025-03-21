package com.Medicare.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.Date;


@Entity
@Table(
        name = "reservation",
        indexes = {
                @Index(name = "idx_patient_id", columnList = "PatientId"),
                @Index(name = "idx_doctor_id", columnList = "DoctorId")
        }
)
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;
    private Integer PatientId;
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
        PatientId = patientId;
        DoctorId = doctorId;
        Date = date;
        Duration = duration;
        this.status = status;
        this.visitPurpose = visitPurpose;
        CreatedAt = createdAt;
    }



    public Integer getId() {
        return Id;
    }



    public void setId(Integer id) {
        Id = id;
    }

    public Integer getPatientId() {
        return PatientId;
    }

    public void setPatientId(Integer patientId) {
        PatientId = patientId;
    }

    public Integer getDoctorId() {
        return DoctorId;
    }

    public void setDoctorId(Integer doctorId) {
        DoctorId = doctorId;
    }

    public Date getDate() {
        return Date;
    }

    public void setDate(Date date) {
        Date = date;
    }

    public Integer getDuration() {
        return Duration;
    }

    public void setDuration(Integer duration) {
        Duration = duration;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getVisitPurpose() {
        return visitPurpose;
    }

    public void setVisitPurpose(String visitPurpose) {
        this.visitPurpose = visitPurpose;
    }

    public Timestamp getCreatedAt() {
        return CreatedAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        CreatedAt = createdAt;
    }


}

enum Status{Postponed,Confirmed,Pending,Completed,Canceled}