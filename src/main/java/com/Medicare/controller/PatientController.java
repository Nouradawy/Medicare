package com.Medicare.controller;


import com.Medicare.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping("/patient/dashboard")
    public String patientDashboard() {
        return "patient/dashboard"; // Template for patient dashboard
    }

    @GetMapping("/patient/reservations")
    public String patientReservations() {
        return "patient/reservations"; // Template for patient reservations
    }

    @GetMapping("/patient/profile")
    public String patientProfile() {
        return "patient/profile"; // Template for patient profile
    }
}