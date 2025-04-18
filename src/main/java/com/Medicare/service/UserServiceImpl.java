package com.Medicare.service;
import com.Medicare.model.Patient;
import com.Medicare.model.User;
import com.Medicare.repository.PatientRepository;
import com.Medicare.repository.RoleRepository;
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

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User GetUserById(Long Id) {
        return userRepo.findById(Id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }


    @Override
    public String DeleteUser(Long Id) {
        List<User> users = userRepo.findAll();
        User user = users.stream()
                .filter(u ->u.getId().equals(Id))
                .findFirst()
                .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        users.remove(user);
        return "user with Id: "+Id+" deleted successfully";
    }

    @Override
    public User UpdateUserById(User user, Long Id) {
        Optional<User> optionalUser = userRepo.findById(Id);
        Optional<Patient> optionalPatient = patientRepository.findById(Id);

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
            if(user.getCityId() != null && !Objects.equals(existingUser.getCityId(), user.getCityId())) {
                existingUser.setCityId(user.getCityId());
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
            return userRepo.save(existingUser);
        }
        else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found");
        }
    }


}
