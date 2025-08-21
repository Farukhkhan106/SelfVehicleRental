package com.vehiclerentelsystem.vehiclerentalsystem.service;

import com.vehiclerentelsystem.vehiclerentalsystem.model.User;
import com.vehiclerentelsystem.vehiclerentalsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Find user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    // Save user without touching password
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Save user with password update
    public User saveUserWithPassword(User user, String rawPassword, BCryptPasswordEncoder encoder) {
        user.setPassword(encoder.encode(rawPassword));
        return userRepository.save(user);
    }
}
