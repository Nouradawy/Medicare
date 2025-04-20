package com.Medicare.controller;
import com.Medicare.dto.DoctorDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.User;
import com.Medicare.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/api/public/doctor")
    public ResponseEntity<?> CreateDoctor(@RequestBody DoctorDTO doctorDTO) {


        Doctor savedDoctor = doctorService.CreateDoctor(doctorDTO);
        return ResponseEntity.ok(savedDoctor);// Template for doctor dashboard
    }

}