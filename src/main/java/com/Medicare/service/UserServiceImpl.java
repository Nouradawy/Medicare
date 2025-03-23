package com.Medicare.service;
import com.Medicare.model.Patient;
import com.Medicare.model.Role;
import com.Medicare.model.User;
import com.Medicare.repository.PatientRepository;
import com.Medicare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

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

        if (user.getRole()== Role.Patient) {

            savePatient(savedUser);


        }
        return savedUser;


    }


    public void savePatient(User user) {

        Patient patient = new Patient(user.getUserName(), user.getAddress(), user);
        patientRepository.save(patient);
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
        Optional<User> optionalUser = userRepo.findById(Id);
        Optional<Patient> optionalPatient = patientRepository.findById(Id);

        if(optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            if (user.getUserName() != null &&!Objects.equals(existingUser.getUserName(), user.getUserName())) {
                existingUser.setUserName(user.getUserName());
            }
            if(user.getPassword() !=null &&!Objects.equals(existingUser.getPassword(), user.getPassword())) {
                existingUser.setPassword(user.getPassword());
            }
            if(user.getGender() != null &&!Objects.equals(existingUser.getGender(), user.getGender())) {
                existingUser.setGender(user.getGender());}
            if(!Objects.equals(existingUser.getDateOfBirth(), user.getDateOfBirth())) {
                existingUser.setDateOfBirth(user.getDateOfBirth());
            }
            if(user.getAddress() != null &&!Objects.equals(existingUser.getAddress(), user.getAddress())) {
                existingUser.setAddress(user.getAddress());
            }

            if (user.getDateOfBirth() != null && !Objects.equals(existingUser.getDateOfBirth(), user.getDateOfBirth())) {
                existingUser.setDateOfBirth(user.getDateOfBirth());
            }
            if(user.getEmail() != null &&!Objects.equals(existingUser.getEmail(), user.getEmail())) {
                existingUser.setEmail(user.getEmail());
            }
            if(user.getCityId() != null && !Objects.equals(existingUser.getCityId(), user.getCityId())) {
                existingUser.setCityId(user.getCityId());
            }
            if(user.getAge() != null && !Objects.equals(existingUser.getAge(), user.getAge())) {
                existingUser.setAge(user.getAge());
            }
            Patient existingPatient = optionalPatient.get();

            if(user.getUserName() != null &&!Objects.equals(existingPatient.getPatientName(), user.getUserName())){
                existingPatient.setPatientName(user.getUserName());
            }
            if(user.getAddress() != null &&!Objects.equals(existingPatient.getPatientAddress(), user.getAddress())){
                existingPatient.setPatientAddress(user.getAddress());
            }

            patientRepository.save(existingPatient);
            return userRepo.save(existingUser);
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found");
        }
    }


}
