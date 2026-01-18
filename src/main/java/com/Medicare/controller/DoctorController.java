package com.Medicare.controller;
import com.Medicare.dto.DoctorDTO;
import com.Medicare.dto.MedicalHistoryDTO;
import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.MedicalHistory;
import com.Medicare.model.PreVisits;
import com.Medicare.model.User;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import com.Medicare.service.DoctorService;
import com.Medicare.service.GoogleDriveUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

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
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile files[] ,
                                            @RequestParam("ReportText") String reportText ,
                                            @RequestParam("ReservationId") Integer ReservationId,
                                            @PathVariable Integer PatientID) throws IOException {


        String uploadDir = "C:\\Users\\Nouradawy\\Desktop\\Java_app\\vite-medicare\\src\\assets\\Documents\\"+ PatientID;
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Integer userID = JwtUtils.getLoggedInUserId();
        User user = userRepository.findById(userID).orElse(null);
        Doctor doctor = user.getDoctor();

        // make sure list is not null
        List<PreVisits> preVisitsList = doctor.getPreVisits();
        if (preVisitsList == null) {
            preVisitsList = new ArrayList<>();
        }

        // try to find existing preVisit by ReservationId
        PreVisits preVisit = preVisitsList.stream()
                .filter(pv -> ReservationId.equals(pv.getReservationId()))
                .findFirst()
                .orElse(null);

        if (preVisit == null) {
            // no existing record for this reservation, create new
            preVisit = new PreVisits();
            preVisit.setDoctor(doctor);
            preVisit.setPatientId(PatientID);
            preVisit.setReservationId(ReservationId);
            preVisit.setDate(new java.sql.Date(System.currentTimeMillis()));
            preVisitsList.add(preVisit);
        }

        // update report text and files
        preVisit.setReportText(reportText);

        // reuse existing list or create new
        List<String> patientDocs = preVisit.getReportFiles();
        if (patientDocs == null) {
            patientDocs = new ArrayList<>();
        } else {
            // if you want to replace old files instead of appending, clear the list
            patientDocs.clear();
        }

        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            String dbPath = "src/assets/Documents/"+ PatientID +"/"+ fileName;
            patientDocs.add(dbPath);
        }

        preVisit.setReportFiles(patientDocs);
        doctor.setPreVisits(preVisitsList);
        doctorRepository.save(doctor);

        return ResponseEntity.ok("File uploaded and path saved:");
    }


    @GetMapping("/api/public/doctors-by-status/{status}")
    public ResponseEntity<?> getDoctorsByStatus(@PathVariable DoctorStatus status) {
        List<DoctorDTO> doctors = doctorService.getDoctorsByStatus(status);
        return ResponseEntity.ok(doctors);
    }

    @PostMapping("/api/public/doctor/status/{id}")
    public ResponseEntity<?> updateDoctorStatus(@PathVariable Integer id, @RequestParam DoctorStatus status) {
        Doctor updatedDoctor = doctorService.updateDoctorStatus(id, status);
        return ResponseEntity.ok(updatedDoctor);

    }

    @PostMapping("/api/public/doctor/add-medical-history")
    @Tag(name = "Doctor")
    @Operation(summary = "Add medical history entry to a patient", description = "Allows a doctor to add a medical history entry to a patient's record")
    public ResponseEntity<?> addMedicalHistory(@RequestBody MedicalHistoryDTO medicalHistoryDTO) {
        // Verify the logged-in user is a doctor
        Integer doctorId = JwtUtils.getLoggedInUserId();
        if (doctorId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Find the patient
        User patient = userRepository.findById(medicalHistoryDTO.getPatientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found"));

        // Create new medical history entry
        MedicalHistory medicalHistory = new MedicalHistory();
        medicalHistory.setDate(medicalHistoryDTO.getDate());
        medicalHistory.setDescription(medicalHistoryDTO.getDescription());
        medicalHistory.setUser(patient);

        // Add to patient's medical history
        patient.getMedicalHistory().add(medicalHistory);
        userRepository.save(patient);

        return ResponseEntity.ok(Collections.singletonMap("message", "Medical history added successfully"));
    }

    @Tag(name = "Doctor")
    @Operation(summary = "edit patient info ex: allergies, drug histories",
            description = "POST method For Editing Patient information based  ex: allergies, chronic diseases, drug histories, medical histories")
    @PostMapping("/api/public/doctor/edit-patient-info")
    public ResponseEntity<?> EditPatientInfo(@RequestBody UserRequestDTO userRequestDTO ) {
        User savedPatient = doctorService.EditPatientInfo(userRequestDTO );
        return ResponseEntity.ok(savedPatient);
    }

    @Tag(name = "Doctor")
    @Operation(summary = "delete Medical Record ex: allergies, drug histories",
            description = "Delete method For deleting medical record based  ex: allergies, chronic diseases, drug histories, medical histories")
    @CrossOrigin(origins = "http://localhost:5173")
    @DeleteMapping("/api/public/doctor/delete-medical-record")
    public ResponseEntity<?> DeleteMedicalRecord(
            @RequestParam Integer id ,
            @RequestParam String Type ,
            @RequestParam Integer patientId) {
        doctorService.DeleteMedicalRecord(id,Type, patientId);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Collections.singletonMap("message", "Deleted successfully!"));
    }

    @Tag(name = "Doctor")
    @Operation(summary = "Update doctor serving number",
            description = "POST method For Updating service number for Managing Queues")
    @PostMapping("/api/public/doctor/update-serving-number/{ServingNumber}")
    public ResponseEntity<?> UpdateServingNumber(@PathVariable Integer ServingNumber ) {
        Doctor savedDoctor = doctorService.UpdateServingNumber(ServingNumber );
        return ResponseEntity.ok(savedDoctor);
    }
}