package com.Medicare.controller;
import com.Medicare.dto.DoctorDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.User;
import com.Medicare.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/api/public/doctor")
    @Tag(name = "Doctor")
    @Operation(summary = "Create a new Doctor takes current logged in user_id", description = "Create a new Doctor takes current logged in user_id")
    public ResponseEntity<?> CreateDoctor(@RequestBody DoctorDTO doctorDTO) {
        Doctor savedDoctor = doctorService.CreateDoctor(doctorDTO);
        return ResponseEntity.ok(savedDoctor);// Template for doctor dashboard
    }

    @GetMapping("/api/public/doctor")
    @Tag(name = "Doctor")
    @Operation(summary = "Retrieve current Doctor information", description = "Retrieve current Doctor information.")
    public ResponseEntity<?> GetDoctorInformation() {
        Optional<Doctor> doctor = doctorService.GetDoctorInformation();
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/api/public/alldoctors")
    @Tag(name = "Admin-Doctor")
    @Operation(summary = "Retrieve all registered Doctors", description = "Retrieve all registered Doctors.")
    public ResponseEntity<?> getAllDoctors() {
        List<Doctor> doctor = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctor);
    }

}