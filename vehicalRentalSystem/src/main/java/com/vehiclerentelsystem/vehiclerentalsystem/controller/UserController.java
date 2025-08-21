package com.vehiclerentelsystem.vehiclerentalsystem.controller;

import com.vehiclerentelsystem.vehiclerentalsystem.dto.UserDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.model.User;
import com.vehiclerentelsystem.vehiclerentalsystem.security.JwtUtil;
import com.vehiclerentelsystem.vehiclerentalsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String token) {
        try {
            String email = extractEmailFromToken(token);
            User user = userService.getUserByEmail(email);
            if (user == null) return ResponseEntity.status(404).body("User not found");
            return ResponseEntity.ok(convertToDTO(user));
        } catch (Exception e) {
            return ResponseEntity.status(403).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/update-profile")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token, @RequestBody UserDTO dto) {
        try {
            String email = extractEmailFromToken(token);
            User user = userService.getUserByEmail(email);
            if (user == null) return ResponseEntity.status(404).body("User not found");

            user.setName(dto.getName());
            user.setPhone(dto.getPhone());
            user.setAddress(dto.getAddress());
            user.setCity(dto.getCity());
            user.setState(dto.getState());
            user.setPincode(dto.getPincode());
            user.setAbout(dto.getAbout());

            userService.saveUser(user);

            return ResponseEntity.ok("✅ Profile updated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> req) {
        try {
            String oldPassword = req.get("oldPassword");
            String newPassword = req.get("newPassword");

            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("Old and new passwords are required");
            }

            String email = extractEmailFromToken(token);
            User user = userService.getUserByEmail(email);
            if (user == null) return ResponseEntity.status(404).body("User not found");

            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("❌ Old password is incorrect");
            }

            userService.saveUserWithPassword(user, newPassword, (BCryptPasswordEncoder) passwordEncoder);

            return ResponseEntity.ok("✅ Password changed");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    private String extractEmailFromToken(String token) {
        return jwtUtil.extractUsername(token.replace("Bearer ", ""));
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setState(user.getState());
        dto.setPincode(user.getPincode());
        dto.setAbout(user.getAbout());
        dto.setRole(user.getRole().name());
        return dto;
    }
}
