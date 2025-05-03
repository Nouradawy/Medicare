package com.Medicare.service;
import com.Medicare.dto.UserRequestDTO;
import com.Medicare.model.User;
import java.util.List;
import java.util.Optional;


public interface UserService {
    List<User> getAllUsers();
    String DeleteUser(Integer Id);
    User UpdateUserById(User user , Integer Id);
    User GetUserById(Integer Id);
   Optional<User> GetCurrentUser();
    User AddPatientInfo(UserRequestDTO userRequestDTO);
}
