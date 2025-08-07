package com.vehiclerentelsystem.vehiclerentalsystem.controller;

import com.vehiclerentelsystem.vehiclerentalsystem.dto.OwnerDetailsDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.model.OwnerDetails;
import com.vehiclerentelsystem.vehiclerentalsystem.model.User;
import com.vehiclerentelsystem.vehiclerentalsystem.security.JwtUtil;
import com.vehiclerentelsystem.vehiclerentalsystem.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/owner")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<?> getOwnerProfile(@RequestHeader("Authorization") String token) {
        try {
            String email = extractEmailFromToken(token);
            User user = ownerService.getOwnerByEmail(email);
            if (user == null) return ResponseEntity.status(404).body("❌ Owner not found");

            Map<String, Object> profile = ownerService.getOwnerProfile(user.getId());
            return ResponseEntity.ok(profile);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }

    @PutMapping("/update-profile")
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String token, @RequestBody OwnerDetailsDTO dto) {
        try {
            String email = extractEmailFromToken(token);
            User user = ownerService.getOwnerByEmail(email);
            if (user == null) return ResponseEntity.status(404).body("❌ Owner not found");

            // Update user info
            user.setName(dto.getName());
            user.setPhone(dto.getPhone());
            user.setAddress(dto.getAddress());
            user.setCity(dto.getCity());
            user.setState(dto.getState());
            user.setPincode(dto.getPincode());
            user.setAbout(dto.getAbout());
            ownerService.saveOwner(user);

            // Update or create OwnerDetails
            OwnerDetails details = ownerService.getOwnerDetailsByUser(user);
            if (details == null) {
                details = new OwnerDetails();
                details.setUser(user);
            }
            details.setBankName(dto.getBankName());
            details.setAccountNumber(dto.getAccountNumber());
            details.setIfscCode(dto.getIfscCode());
            details.setAadhaarNumber(dto.getAadhaarNumber());
            details.setPanNumber(dto.getPanNumber());
            ownerService.saveOwnerDetails(details);

            return ResponseEntity.ok("✅ Profile updated");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }

    @PutMapping("/change-password")
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> req) {
        try {
            String oldPassword = req.get("oldPassword");
            String newPassword = req.get("newPassword");

            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body("❌ Old and new passwords are required");
            }

            String email = extractEmailFromToken(token);
            User user = ownerService.getOwnerByEmail(email);
            if (user == null) return ResponseEntity.status(404).body("❌ Owner not found");

            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body("❌ Old password is incorrect");
            }

            ownerService.saveOwnerWithPassword(user, newPassword, (BCryptPasswordEncoder) passwordEncoder);
            return ResponseEntity.ok("✅ Password changed");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }

    private String extractEmailFromToken(String token) {
        return jwtUtil.extractUsername(token.replace("Bearer ", ""));
    }

    @PostMapping("/upload-docs")
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<?> uploadDocs(@RequestHeader("Authorization") String token,
                                        @RequestParam(required = false) MultipartFile rc,
                                        @RequestParam(required = false) MultipartFile insurance,
                                        @RequestParam(required = false) MultipartFile permit) {
        try {
            String email = jwtUtil.extractUsername(token.replace("Bearer ", ""));
            User user = ownerService.getOwnerByEmail(email);
            OwnerDetails details = ownerService.getOwnerDetailsByUser(user);

            if (rc != null) details.setRcDoc(rc.getBytes());
            if (insurance != null) details.setInsuranceDoc(insurance.getBytes());
            if (permit != null) details.setPermitDoc(permit.getBytes());

            ownerService.saveOwnerDetails(details);

            return ResponseEntity.ok("✅ Documents uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error uploading documents: " + e.getMessage());
        }
    }



}
