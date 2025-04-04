package com.Medicare.controller;

import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.Patient;
import com.Medicare.service.PatientService;
import com.Medicare.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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

    @PostMapping("/api/public/patient/Info")
    public ResponseEntity<?> AddPatientInfo(@RequestBody UserRequestDTO userRequestDTO ) {
        Patient savedPatient = patientService.AddPatientInfo(userRequestDTO );
        return ResponseEntity.ok(savedPatient);
    }

}

