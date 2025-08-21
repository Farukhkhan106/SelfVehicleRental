package com.vehiclerentelsystem.vehiclerentalsystem.controller;
import com.vehiclerentelsystem.vehiclerentalsystem.dto.UserDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.security.JwtUtil;
import com.vehiclerentelsystem.vehiclerentalsystem.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
