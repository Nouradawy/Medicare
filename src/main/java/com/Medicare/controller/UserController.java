package com.Medicare.controller;

import com.Medicare.model.User;
import com.Medicare.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
public class UserController {
    private UserService userService;

    public UserController(UserService userService){
        this.userService = userService;
    }

    @GetMapping("/api/public/user")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/api/public/user")
    public ResponseEntity<?> CreateUser (@RequestBody User user){
        return ResponseEntity.ok(userService.CreateUser(user));
    }
}
