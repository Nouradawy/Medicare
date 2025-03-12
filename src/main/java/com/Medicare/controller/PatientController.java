package com.Medicare.controller;


import com.Medicare.model.Patient;
import com.Medicare.service.PatientService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class PatientController {

private PatientService patientService;

public PatientController(PatientService patientService){
    this.patientService = patientService;
}
    @GetMapping("/api/public/patient")
    public List<Patient> getAllPatients(){
        return patientService.getAllPatients();
    }
    @PostMapping("/api/public/patient")
    public String CreatePatient(@RequestBody Patient patient){
        patientService.CreatePatients(patient);
        return "Patient added successfully ";
    }
//    @GetMapping("/patient/dashboard")
//    public String patientDashboard() {
//        return "patient/dashboard"; // Template for patient dashboard
//    }
//
//    @GetMapping("/patient/reservations")
//    public String patientReservations() {
//        return "patient/reservations"; // Template for patient reservations
//    }
//
//    @GetMapping("/patient/profile")
//    public String patientProfile() {
//        return "patient/profile"; // Template for patient profile
//    }
}