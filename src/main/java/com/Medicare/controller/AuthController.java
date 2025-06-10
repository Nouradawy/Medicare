package com.Medicare.controller;
import com.Medicare.Enums.ERole;
import com.Medicare.dto.DoctorDTO;
import com.Medicare.model.City;
import com.Medicare.model.Role;
import com.Medicare.model.User;
import com.Medicare.payload.request.LoginRequest;
import com.Medicare.payload.request.SignupRequest;
import com.Medicare.payload.response.JwtResponse;
import com.Medicare.payload.response.MessageResponse;
import com.Medicare.repository.CityRepository;
import com.Medicare.repository.RoleRepository;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import com.Medicare.security.jwt.UserDetailsImpl;
import com.Medicare.service.DoctorService;
import com.Medicare.service.DoctorServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static java.sql.DriverManager.println;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    DoctorService doctorService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    CityRepository cityRepository;


    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;


    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                                                 userDetails.getId(),
                                                 userDetails.getUsername(),
                                                 userDetails.getEmail(),
                                                 userDetails.getFullName(),
                                                 roles));
    }

    @Tag(name= "auth-controller", description = "POST method for user signup roles admin, doctor, patient")

    @PostMapping("/signup")
    @Operation(
            summary = "Create a new user",
            description = "Create a new user.",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User object to be created",

                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = "application/json",
                            examples = @io.swagger.v3.oas.annotations.media.ExampleObject(
                                    name = "Register User Example",
                                    value = "{\n" +
                                            "  \"userName\": \"john_doe\",\n" +
                                            "  \"email\": \"john.doe@example.com\",\n" +
                                            "  \"fullName\": \"John Doe\",\n" +
                                            "  \"role\": [\"patient\"],\n" +
                                            "  \"password\": \"securePassword123\",\n" +
                                            "  \"gender\": \"MALE\",\n" +
                                            "  \"Address\": \"123 Main Street\",\n" +
                                            "  \"dateOfBirth\": \"1990-01-01\",\n" +
                                            "  \"Age\": 33,\n" +
                                            "  \"cityId\": 3\n" +
                                            "}"
                            )
                    )
            )
    )
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUserName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Fetch the City entity using cityId
        City city = cityRepository.findById(signUpRequest.getCityId())
                .orElseThrow(() -> new RuntimeException("Error: City not found."));

        // Create new user's account
        User user = new User(signUpRequest.getUserName(),
                            encoder.encode(signUpRequest.getPassword()),
                            signUpRequest.getFullName(),
                            signUpRequest.getEmail(),
                            signUpRequest.getGender(),
                            signUpRequest.getAddress(),
                            signUpRequest.getDateOfBirth(),
                            signUpRequest.getAge() ,
                city , null,null,signUpRequest.getPhoneNumber(),signUpRequest.getNationalId());

                Set<String> strRoles = signUpRequest.getRole();
                Set<Role> roles = new HashSet<>();
                
                if (strRoles == null || strRoles.isEmpty()) {
                    // Default role is patient if no roles are specified
                    Role patientRole = roleRepository.findByName(ERole.ROLE_PATIENT)
                            .orElseThrow(() -> new RuntimeException("Error: Patient role is not found."));
                    roles.add(patientRole);
                } else {
                    // Process each role string
                    for (String role : strRoles) {
                        try {
                            switch (role.toLowerCase().trim()) {
                                case "admin":
                                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                            .orElseThrow(() -> new RuntimeException("Error: Admin role is not found."));
                                    roles.add(adminRole);
                                    break;
                                case "doctor":
                                    Role doctorRole = roleRepository.findByName(ERole.ROLE_DOCTOR)
                                            .orElseThrow(() -> new RuntimeException("Error: Doctor role is not found."));
                                    roles.add(doctorRole);

                                    break;
                                default:
                                    Role patientRole = roleRepository.findByName(ERole.ROLE_PATIENT)
                                            .orElseThrow(() -> new RuntimeException("Error: Patient role is not found."));
                                    roles.add(patientRole);
                                    break;
                            }
                        } catch (Exception e) {
                            // Log the error and continue with next role
                            System.err.println("Error processing role '" + role + "': " + e.getMessage());
                            // Optionally add a default role if there's an error
                            try {
                                Role patientRole = roleRepository.findByName(ERole.ROLE_PATIENT)
                                        .orElseThrow(() -> new RuntimeException("Error: Patient role is not found."));
                                roles.add(patientRole);
                            } catch (Exception ex) {
                                System.err.println("Failed to add default patient role: " + ex.getMessage());
                            }
                        }
                    }
                }
                
                // If no valid roles were added, add the default patient role
                if (roles.isEmpty()) {
                    Role patientRole = roleRepository.findByName(ERole.ROLE_PATIENT)
                            .orElseThrow(() -> new RuntimeException("Error: Patient role is not found."));
                    roles.add(patientRole);
                }

        user.setRoles(roles);
        userRepository.save(user);
        for (String role : strRoles) {
            try {
                switch (role.toLowerCase().trim()) {
                    case "doctor" :
                        User existing = userRepository.findByUsername(signUpRequest.getUserName()).orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + signUpRequest.getUserName()));
                        DoctorDTO doctorDTO = new DoctorDTO();
                        doctorDTO.setUserId(existing.getUserId());
                        doctorService.CreateDoctor(doctorDTO);
                        break;

                }} catch (Exception e){
                    // Log the error and continue with next role
                    System.err.println("Error processing role '" + role + "': " + e.getMessage());
                }}

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
