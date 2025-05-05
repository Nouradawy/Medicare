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

    @Operation(
            summary = "Retrieve all registered Doctors",
            description = "Retrieve all registered Doctors",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User object to be created",

                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "Register User Example",
                                    value = "{\n" +
                                            "  \"specialty\": \"Cardiology\",\n" +
                                            "  \"specialityDetails\": \"Expert in heart-related treatments\",\n" +
                                            "  \"startTime\": \"09:00\",\n" +
                                            "  \"endTime\": \"17:00\",\n" +
                                            "  \"workingDays\": [\"SUN\",\"FRI\"],\n" +
                                            "  \"status\": \"Pending\",\n" +
                                            "  \"vacations\": [\"MON\",\"TUE\"],\n" +
                                            "  \"fees\": 150,\n" +
                                            "  \"rating\": 4.5,\n" +
                                            "  \"bio\": \"Experienced cardiologist with over 10 years of practice.\"\n" +
                                            "}"
                            )
                    )
            )
    )
    public ResponseEntity<?> getAllDoctors() {
        List<DoctorDTO> doctor = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctor);
    }

}