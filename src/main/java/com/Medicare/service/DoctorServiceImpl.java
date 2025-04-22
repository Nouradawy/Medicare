package com.Medicare.service;

import com.Medicare.Enums.ERole;
import com.Medicare.dto.DoctorDTO;
import com.Medicare.model.Doctor;
import com.Medicare.model.Role;
import com.Medicare.model.User;
import com.Medicare.repository.DoctorRepository;
import com.Medicare.repository.RoleRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl  implements DoctorService{

    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;


    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor CreateDoctor(DoctorDTO doctorDTO) {
        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
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
        }
            // If a Patient entity is found, update it with the new data
            existingDoctor.setUser(user);
            existingDoctor.setSpecialty(doctorDTO.getSpecialty());
            existingDoctor.setStartTime(doctorDTO.getStartTime());
            existingDoctor.setEndTime(doctorDTO.getEndTime());
            existingDoctor.setWorkingDays(doctorDTO.getWorkingDays());
            existingDoctor.setStatus(doctorDTO.getStatus());

            //ensures that the ROLE_DOCTOR is added only if the user does not already have it.
            if(user.getRoles().stream().noneMatch(role -> role.getName().equals(ERole.ROLE_DOCTOR.name()))){
            Role doctorRole = roleRepository.findByName(ERole.ROLE_DOCTOR)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));
            user.getRoles().add(doctorRole);
        }


        return doctorRepository.save(existingDoctor);
    }

    @Override
    public Optional<Doctor> GetDoctorInformation() {
        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Fetch the Patient entity associated with the User
        Doctor existingDoctor = user.getDoctor();
        if (existingDoctor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doctor not found for the logged-in user");
        }


        return doctorRepository.findById(existingDoctor.getDoctorId());
    }


}

