package com.Medicare.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ch.qos.logback.core.util.SystemInfo;
import com.Medicare.model.Patient;
import com.Medicare.model.Role;
import com.Medicare.model.User;
import com.Medicare.repository.PatientRepository;
import com.Medicare.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{
    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User CreateUser(User user) {
        if (user.getRole() != Role.Patient && user.getRole() != Role.Doctor) {
            throw new IllegalArgumentException("Invalid role! Only PATIENT or DOCTOR are allowed.");
        }
        User savedUser = userRepo.save(user);
        log.info("✅ User saved successfully with ID: {}", savedUser.getId());
        if (user.getRole()== Role.Patient) {

            savePatient(savedUser);


        }
        return savedUser;


    }


    public void savePatient(User user) {
        userRepo.flush();
        log.info("Creating Patient for user ID: " + user.getId());
        Patient patient = new Patient(user.getUserName(), user.getAddress(), user);
        patientRepository.save(patient);
        log.info("Patient saved successfully with user ID: " + patient.getUser().getId());
    }

    @Override
    public String DeleteUser(Integer Id) {
        List<User> users = userRepo.findAll();
        User user = users.stream()
                .filter(u ->u.getId().equals(Id))
                .findFirst()
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        users.remove(user);
        return "user with Id: "+Id+" deleted successfully";
    }

    @Override
    public User UpdateUser(User user, Integer Id) {
        List<User> users = userRepo.findAll();
        Optional<User> optionalUser = users.stream()
                .filter(u-> u.getId().equals(Id))
                .findFirst();

        if(optionalUser.isPresent()){
            User existingUser = optionalUser.get();
            existingUser.setUserName(user.getUserName());
            existingUser.setGender(user.getGender());
            existingUser.setDateOfBirth(user.getDateOfBirth());
            existingUser.setAddress(user.getAddress());
            existingUser.setEmail(user.getEmail());
            existingUser.setCityId(user.getCityId());
            existingUser.setAge(user.getAge());

            return userRepo.save(existingUser);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found");
        }
    }

}
