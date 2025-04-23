//package com.Medicare.model;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.Getter;
//import lombok.Setter;
//import java.util.List;
//
//
//@Setter
//@Getter
//@Entity
//
//public class Patient {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer PatientId;
//
//
//    @OneToOne
//    @JoinColumn(name = "user_id", nullable = true)
//    private User user;
//
//    @JsonIgnore
//    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<ChronicDisease> chronicDiseases;
//
//    @JsonIgnore
//    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<MedicalHistory> MedicalHistory;
//
//    @JsonIgnore
//    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Allergy> Allergy;
//
//    @JsonIgnore
//    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<DrugHistory> DrugHistory;
//
//    public Patient() {}
//
//    public Patient( User user) {
//        this.user = user;
//    }
//
//}
//
