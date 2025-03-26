package com.Medicare.service;

import com.Medicare.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    String DeleteUser(Long Id);
    User UpdateUserById(User user , Long Id);
    User GetUserById(Long Id);
}
