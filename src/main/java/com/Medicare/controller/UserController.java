package com.Medicare.controller;

import com.Medicare.model.User;
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
    private ReservationController reservationController;

    public UserController(UserService userService) {
        this.userService = userService;
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
}
