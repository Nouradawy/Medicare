package com.Medicare.service;

import com.Medicare.dto.DoctorDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.Patient;
import com.Medicare.model.User;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DoctorServiceImpl  implements DoctorService{

    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private UserRepository userRepository;


    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor CreateDoctor(DoctorDTO doctorDTO) {
        // Fetch the logged-in user ID
        Long userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Fetch the Patient entity associated with the User
        Doctor existingDoctor = user.getDoctor();
        if (existingDoctor == null) {
//            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found for the logged-in user");
            // If no Patient entity is found, create a new one
            existingDoctor = new Doctor();
        } else {
            // If a Patient entity is found, update it with the new data
            existingDoctor.setUser(user);
            existingDoctor.setSpecialty(doctorDTO.getSpecialty());
            existingDoctor.setStartTime(doctorDTO.getStartTime());
            existingDoctor.setEndTime(doctorDTO.getEndTime());
            existingDoctor.setWorkingDays(doctorDTO.getWorkingDays());
            existingDoctor.setStatus(doctorDTO.getStatus());
        }



        return doctorRepository.save(existingDoctor);
    }


}

