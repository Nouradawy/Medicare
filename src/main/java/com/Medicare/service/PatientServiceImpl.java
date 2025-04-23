//package com.Medicare.service;
//
//import com.Medicare.dto.UserRequestDTO;
//import com.Medicare.model.*;
//import com.Medicare.repository.PatientRepository;
//import com.Medicare.repository.UserRepository;
//import com.Medicare.security.jwt.JwtUtils;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.List;
//
//@Service
//public class PatientServiceImpl implements  PatientService
//{
////    private List<Patient> PatientsList = new ArrayList<>();
//
//    @Autowired
//    private PatientRepository patientRepository;
//    @Autowired
//    private UserRepository userRepository;
//
//    @Override
//    public List<Patient> getAllPatients() {
//        Integer userId = JwtUtils.getLoggedInUserId();
//        if (userId == null) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
//        }
//        return patientRepository.findAll();
//    }
//
//    @Override
//    public Patient UpdatePatientById(Patient patient, Integer Id) {
//        if(GetPatientById(Id) != null) {
//            Patient existingPatient = GetPatientById(Id);
//            return patientRepository.save(existingPatient);
//        }
//        return null;
//    }
//
//    @Override
//    public String DeletePatient(Integer Id) {
//        return "";
//    }
//
//    @Override
//    public Patient GetPatientById(Integer Id) {
//        return patientRepository.findById(Id)
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Patient not found"));
//    }
//
//
//    @Override
//    public Patient CreatePatients(Patient patient ) {
//        return patientRepository.save(patient);
//
//}
//
//
//}
