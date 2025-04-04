package com.Medicare.controller;

import com.Medicare.model.User;
import com.Medicare.service.UserService;
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
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }


    @PostMapping("/api/public/user/{Id}")
    public ResponseEntity<String> UpdateUserById(@RequestBody User user, @PathVariable Long Id) {
        try{
            User savedUser = userService.UpdateUserById(user,Id);
            return new ResponseEntity<>("User Updated id: "+Id,HttpStatus.OK);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
