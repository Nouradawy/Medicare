package com.Medicare.service;

import com.Medicare.model.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();

    User CreateUser(User user );
    String DeleteUser(Integer Id);
    User UpdateUser(User user , Integer Id);
}
