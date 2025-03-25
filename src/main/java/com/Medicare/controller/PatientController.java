package com.Medicare.controller;


import com.Medicare.model.Patient;
import com.Medicare.service.PatientService;
import com.Medicare.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class PatientController {

    private PatientService patientService;
    private UserService userService;


    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }


    @GetMapping("/api/public/patient")
    @Tag(name = "get patients", description = "GET methods of patients APIs")
    @Operation(summary = "Get All patients",
            description = "The response is Retrieve all patients list .")
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }


    @PostMapping("/api/public/patient")
    public ResponseEntity<?> CreatePatient(@RequestBody Patient patient) {
        Patient savedPatient = patientService.CreatePatients(patient);
        return ResponseEntity.ok(savedPatient);
    }


}

