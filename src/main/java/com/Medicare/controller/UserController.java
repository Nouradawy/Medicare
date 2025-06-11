package com.Medicare.controller;

import com.Medicare.dto.UserRequestDTO;
import com.Medicare.dto.UserUpdateDTO;
import com.Medicare.model.User;
import com.Medicare.repository.UserRepository;
import com.Medicare.security.jwt.JwtUtils;
import com.Medicare.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private ReservationController reservationController;

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

    @PostMapping("/api/public/Update-user")
    @Tag(name = "User")
    @Operation(summary = "Update User information", description = "Update user information with the given user_id .")
    public ResponseEntity<?> UpdateUser(@RequestBody UserUpdateDTO requestDTO) {
        messagingTemplate.convertAndSend("/topic/updates", "Live Update: ");
        return userService.UpdateUser(requestDTO);

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


    @PostMapping("/api/public/uploadProfilePicture")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String uploadDir = "C:\\Users\\Nouradawy\\Desktop\\Java_app\\vite-medicare\\src\\assets\\userProfilePictures";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        Integer userID = JwtUtils.getLoggedInUserId();

        User user = userRepository.findById(userID).orElse(null);
        // Save file path to database (example)
        String dbPath = "src/assets/userProfilePictures/" + fileName;
        user.setImageUrl(dbPath);
        userRepository.save(user);
        // imageRepository.save(new ImageEntity(dbPath));

        return ResponseEntity.ok("File uploaded and path saved: " + dbPath);
    }

    @GetMapping("/findpatient/{id}")
    public User findPatientByPhoneOrSSN(@PathVariable String id) {
        return userService.findPatientByPhoneOrSSN(id);
    }




}
