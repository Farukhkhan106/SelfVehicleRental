package com.vehicalrentelsystem.vehicalrentalsystem.controller;
import com.vehicalrentelsystem.vehicalrentalsystem.dto.UserDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.model.User;
import com.vehicalrentelsystem.vehicalrentalsystem.security.JwtUtil;
import com.vehicalrentelsystem.vehicalrentalsystem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDTO userDTO) {
        authService.register(userDTO);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDTO userDTO) {
        String token = authService.login(userDTO.getEmail(), userDTO.getPassword());
        return ResponseEntity.ok(token);
    }


}
