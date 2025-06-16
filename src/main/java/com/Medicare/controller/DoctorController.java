package com.Medicare.controller;
import com.Medicare.dto.DoctorDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.PreVisits;
import com.Medicare.model.User;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import com.Medicare.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import com.Medicare.Enums.DoctorStatus;

@RestController
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping("/api/public/doctor")
    @Tag(name = "Doctor")
    @Operation(
            summary = "Create a new Doctor takes current logged in user_id",
            description = "Create a new Doctor takes current logged in user_id",
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
            description = "Retrieve all registered Doctors"

    )
    public ResponseEntity<?> getAllDoctors() {
        List<DoctorDTO> doctor = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctor);
    }

    @PostMapping("/api/public/uploadDocument/{PatientID}")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile files[] ,@RequestParam("ReportText") String reportText ,@RequestParam("PatientIssue") String patientIssue, @PathVariable Integer PatientID) throws IOException {
        String uploadDir = "C:\\Users\\Nouradawy\\Desktop\\Java_app\\vite-medicare\\src\\assets\\Documents\\"+ PatientID;
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Integer userID = JwtUtils.getLoggedInUserId();
        User user = userRepository.findById(userID).orElse(null);
        Doctor doctor = user.getDoctor();
        List<PreVisits> preVisitsList = doctor.getPreVisits();
        PreVisits preVisit = new PreVisits();
//        PreVisits preVisit = preVisitsList.stream().findFirst().orElse(new PreVisits());  use this if youu want to edit a previsit
        List<String> patientDocs = preVisit.getReportFiles();
            if (patientDocs == null) {
                patientDocs = new ArrayList<>();
            }

            preVisit.setDoctor(doctor);
            preVisit.setPatientId(PatientID);
            preVisit.setReportText(reportText);
            preVisit.setDate(new java.sql.Date(System.currentTimeMillis()));
            preVisit.setPatientIssue(patientIssue);

            for (MultipartFile file : files) {
                String fileName = file.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                String dbPath = "src/assets/Documents/"+ PatientID +"/"+ fileName;
                patientDocs.add(dbPath);
            }
            preVisit.setReportFiles(patientDocs);

            preVisitsList.add(preVisit);
            doctor.setPreVisits(preVisitsList);
            doctorRepository.save(doctor);

        return ResponseEntity.ok("File uploaded and path saved:");
    }
    @GetMapping("/api/public/doctors-by-status/{status}")
    public ResponseEntity<?> getDoctorsByStatus(@PathVariable DoctorStatus status) {
        List<DoctorDTO> doctors = doctorService.getDoctorsByStatus(status);
        return ResponseEntity.ok(doctors);
    }

    @PutMapping("/api/public/doctor/status/{id}")
    public ResponseEntity<?> updateDoctorStatus(@PathVariable Integer id, @RequestParam DoctorStatus status) {
        Doctor updatedDoctor = doctorService.updateDoctorStatus(id, status);
        return ResponseEntity.ok(updatedDoctor);
    }

}