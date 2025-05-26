package com.Medicare.model;


import com.Medicare.config.StringListJsonConverter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@Entity
public class PreVisits {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Id;
    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "json")
    private List<String> ReportFiles;
    private String PatientIssue;
    private Integer PatientId;
    private Date Date;
    private String ReportText;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    public  PreVisits() {}
    public PreVisits(Integer id, List<String> reportFiles, String patientIssue, Integer patientId, String reportText, Doctor doctor) {
        Id = id;
        ReportFiles = reportFiles;
        PatientIssue = patientIssue;
        PatientId = patientId;
        ReportText = reportText;
        this.doctor = doctor;
    }
}
