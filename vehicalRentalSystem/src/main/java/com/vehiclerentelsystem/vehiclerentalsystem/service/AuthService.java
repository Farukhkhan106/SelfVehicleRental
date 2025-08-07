package com.vehicalrentelsystem.vehicalrentalsystem.service;

import com.vehicalrentelsystem.vehicalrentalsystem.dto.UserDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.model.Role;
import com.vehicalrentelsystem.vehicalrentalsystem.model.User;
import com.vehicalrentelsystem.vehicalrentalsystem.repository.UserRepository;
import com.vehicalrentelsystem.vehicalrentalsystem.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService implements CustomUserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // Register a new user with email validation and role assignment
    public String register(UserDTO userDTO) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            logger.error("Registration failed: Email is already taken - {}", userDTO.getEmail());
            throw new IllegalArgumentException("Email is already taken!");
        }

        // Assign default role if not provided
        String roleName = (userDTO.getRole() == null) ? Role.USER.name() : userDTO.getRole().toUpperCase();

        Role role;
        try {
            role = Role.valueOf(roleName);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid role provided: {}", userDTO.getRole());
            throw new IllegalArgumentException("Invalid role! Please provide either USER or ADMIN.");
        }

        // 👇 All fields mapped from DTO
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // BCrypt encoding
        user.setRole(role);
        user.setPhone(userDTO.getPhone());
        user.setAddress(userDTO.getAddress());
        user.setCity(userDTO.getCity());
        user.setState(userDTO.getState());

        userRepository.save(user);

        logger.info("User registered successfully: {}", userDTO.getEmail());
        return "User registered successfully!";
    }


    // Login and generate JWT if credentials are valid
    public String login(String email, String password) {
        logger.info("Login attempt for email: {}", email);
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty() || !passwordEncoder.matches(password, user.get().getPassword())) {
            logger.warn("Login failed for email: {}", email);
            throw new BadCredentialsException("Invalid credentials!");
        }

        logger.info("Login successful, generating token for email: {}", email);
        return jwtUtil.generateToken(user.get());
    }

    // Load user by email for authentication
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        logger.info("User details loaded successfully for email: {}", username);
        return org.springframework.security.core.userdetails.User
                .builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_" + user.getRole().name())
                .build();
    }
}
