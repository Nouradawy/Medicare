package com.Medicare.service;

import com.Medicare.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    String DeleteUser(Integer Id);
    User UpdateUserById(User user , Integer Id);
    User GetUserById(Integer Id);
}
