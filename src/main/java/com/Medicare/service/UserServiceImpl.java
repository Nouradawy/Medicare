package com.Medicare.service;

import com.Medicare.model.User;
import com.Medicare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepo;


    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public User CreateUser(User user) {
        return userRepo.save(user);
    }
}
