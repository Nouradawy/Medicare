package com.Medicare.service;
import com.Medicare.Enums.ECity;
import com.Medicare.dto.UserRequestDTO;
import com.Medicare.dto.UserUpdateDTO;
import com.Medicare.model.*;
import com.Medicare.repository.CityRepository;
import com.Medicare.repository.RoleRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{


    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CityRepository cityRepository;

    @Override
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }

    //Get user by id for Admin purpose
    @Override
    public User GetUserById(Integer Id) {
        return userRepository.findById(Id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    @Override
    public Optional<User> GetCurrentUser() {
        Integer userId = JwtUtils.getLoggedInUserId();
        return userRepository.findById(userId);
    }


    // Delete user by id for Admin purpose
    @Override
    public String DeleteUser(Integer Id) {
        List<User> users = userRepository.findAll();
        User user = users.stream()
                .filter(u ->u.getUserId().equals(Id))
                .findFirst()
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        users.remove(user);
        return "user with Id: "+Id+" deleted successfully";
    }

    // Update user by id for Admin purpose
    @Override
    public User UpdateUserById(User user, Integer Id) {
        Optional<User> optionalUser = userRepository.findById(Id);

        // Update user details
        if(optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            if (user.getUsername() != null &&!Objects.equals(existingUser.getUsername(), user.getUsername())) {
                existingUser.setUsername(user.getUsername());
            }
            if(user.getPassword() !=null &&!Objects.equals(existingUser.getPassword(), user.getPassword())) {
                existingUser.setPassword(user.getPassword());
            }


            if(user.getFullName() != null &&!Objects.equals(existingUser.getFullName(), user.getFullName())) {
                existingUser.setFullName(user.getFullName());
            }


            if(user.getGender() != null &&!Objects.equals(existingUser.getGender(), user.getGender())) {
                existingUser.setGender(user.getGender());
            }

            if(user.getDateOfBirth() != null &&!Objects.equals(existingUser.getDateOfBirth(), user.getDateOfBirth())) {
                existingUser.setDateOfBirth(user.getDateOfBirth());
            }
            if(user.getAddress() != null &&!Objects.equals(existingUser.getAddress(), user.getAddress())) {
                existingUser.setAddress(user.getAddress());
            }

            if(user.getEmail() != null &&!Objects.equals(existingUser.getEmail(), user.getEmail())) {
                existingUser.setEmail(user.getEmail());
            }
            if(user.getCity().getCityId() != null && !Objects.equals(existingUser.getCity().getCityId(), user.getCity().getCityId())) {
                existingUser.setCity(user.getCity());
            }
            if(user.getAge() != null && !Objects.equals(existingUser.getAge(), user.getAge())) {
                existingUser.setAge(user.getAge());
            }


            // Update patient details
//            if(optionalPatient.isPresent()) {
//
//                Patient existingPatient = optionalPatient.get();
//
//                patientRepository.save(existingPatient);
//            }
            return userRepository.save(existingUser);
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found");
        }
    }

    @Override
    public ResponseEntity<?> UpdateUser(UserUpdateDTO UpdateDTO) {
        Integer userId = JwtUtils.getLoggedInUserId();
            User existingUser = userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            if(userRepository.existsByEmail(UpdateDTO.getEmail()) && !UpdateDTO.getEmail().equals(existingUser.getEmail())) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("message", "Email is already in use!"));
            } else {
                existingUser.setEmail(UpdateDTO.getEmail());
            }
            if(userRepository.existsByUsername(UpdateDTO.getUsername()) && !UpdateDTO.getUsername().equals(existingUser.getUsername())) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("message", "Username is already in use!"));
            } else {
                existingUser.setUsername(UpdateDTO.getUsername());
            }


            existingUser.setFullName(UpdateDTO.getFullName());

            existingUser.setGender(UpdateDTO.getGender());
            existingUser.setDateOfBirth(UpdateDTO.getDateOfBirth());
            existingUser.setAge(UpdateDTO.getAge());

            existingUser.setAddress(UpdateDTO.getAddress());
            City city = cityRepository.findById(UpdateDTO.getCityId())
                    .orElseThrow(() -> new RuntimeException("Error: City not found."));
            existingUser.setCity(city);

            userRepository.save(existingUser);

            return ResponseEntity.status(HttpStatus.ACCEPTED).body(Collections.singletonMap("message", "Username updated successfuly!"));


    }


    // Add or edit patient info ex: allergies, drug histories
    @Override
    public User AddPatientInfo(UserRequestDTO userRequestDTO) {
        // Fetch the logged-in user ID
        Integer userId = JwtUtils.getLoggedInUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not logged in");
        }

        // Fetch the User object from the database
        User existtingUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        try {
            // Clear existing collections
            existtingUser.getAllergy().clear();
            existtingUser.getMedicalHistory().clear();
            existtingUser.getChronicDiseases().clear();
            existtingUser.getDrugHistory().clear();

            // Add new items to the existing collections
            for (Allergy allergy : userRequestDTO.getAllergies()) {
//            allergy.setId(userId);
                allergy.setUser(existtingUser);
                existtingUser.getAllergy().add(allergy);
            }
            for (DrugHistory drugHistory : userRequestDTO.getDrugHistories()) {
//            drugHistory.setId(userId);
                drugHistory.setUser(existtingUser);
                existtingUser.getDrugHistory().add(drugHistory);
            }
            for (MedicalHistory medicalHistory : userRequestDTO.getMedicalHistories()) {
//            medicalHistory.setId(userId);
                medicalHistory.setUser(existtingUser);

                existtingUser.getMedicalHistory().add(medicalHistory);
            }
            for (ChronicDisease chronicDisease : userRequestDTO.getChronicDiseases()) {
//            chronicDisease.setId(userId);
                chronicDisease.setUser(existtingUser);
                existtingUser.getChronicDiseases().add(chronicDisease);
            }

            return userRepository.save(existtingUser);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }

    }


}
