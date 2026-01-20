package com.Medicare.dto;

import java.util.Date;

public class AdminReservationDTO {
    private Integer id;
    private String patientName;
    private String doctorName;
    private String doctorSpecialty;
    private Date date;
    private Integer duration;
    private String status;
    private String visitPurpose;
    private Integer queueNumber;

    public AdminReservationDTO() {}

    public AdminReservationDTO(Integer id, String patientName, String doctorName, String doctorSpecialty,
                               Date date, Integer duration, String status, String visitPurpose, Integer queueNumber) {
        this.id = id;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.doctorSpecialty = doctorSpecialty;
        this.date = date;
        this.duration = duration;
        this.status = status;
        this.visitPurpose = visitPurpose;
        this.queueNumber = queueNumber;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorSpecialty() {
        return doctorSpecialty;
    }

    public void setDoctorSpecialty(String doctorSpecialty) {
        this.doctorSpecialty = doctorSpecialty;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getVisitPurpose() {
        return visitPurpose;
    }

    public void setVisitPurpose(String visitPurpose) {
        this.visitPurpose = visitPurpose;
    }

    public Integer getQueueNumber() {
        return queueNumber;
    }

    public void setQueueNumber(Integer queueNumber) {
        this.queueNumber = queueNumber;
    }
}
