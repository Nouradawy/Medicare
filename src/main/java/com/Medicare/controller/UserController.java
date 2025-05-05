package com.Medicare.controller;

import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.User;
import com.Medicare.repository.UserRepository;
import com.Medicare.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    private UserService userService;
    private UserRepository userRepository;
    private ReservationController reservationController;
    private CloudinaryService cloudinaryService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/public/currentUser")
    @Tag(name = "User")
    @Operation( summary = "Retrieve all currentUser", description = "Retrieve currentUser .")
    public ResponseEntity<?> GetCurrentUser() {
        return ResponseEntity.ok(userService.GetCurrentUser());
    }

    @GetMapping("/api/public/user")
    @Tag(name = "User")
    @Operation( summary = "Retrieve all registered Users", description = "Retrieve all registered Users .")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }


    @PostMapping("/api/public/user/{Id}")
    @Tag(name = "Admin-User")
    @Operation(summary = "Update User information with the given ID", description = "Update user information with a given user_id .")
    public ResponseEntity<String> UpdateUserById(@RequestBody User user, @PathVariable Integer Id) {
        try{
            User savedUser = userService.UpdateUserById(user,Id);
            return new ResponseEntity<>("User Updated id: "+Id,HttpStatus.OK);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Tag(name = "patient")
    @Operation(summary = "add or edit patient info ex: allergies, drug histories",
            description = "POST method For Adding Patient additional information based on logged in User ex: allergies, chronic diseases, drug histories, medical histories")
    @PostMapping("/api/public/patient/Info")
    public ResponseEntity<?> AddPatientInfo(@RequestBody UserRequestDTO userRequestDTO ) {
        User savedPatient = userService.AddPatientInfo(userRequestDTO );
        return ResponseEntity.ok(savedPatient);
    }
}
