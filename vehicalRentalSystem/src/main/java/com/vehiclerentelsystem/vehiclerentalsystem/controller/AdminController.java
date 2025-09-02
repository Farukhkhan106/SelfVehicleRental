package com.vehiclerentelsystem.vehiclerentalsystem.controller;

import com.vehiclerentelsystem.vehiclerentalsystem.dto.UserDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.dto.VehicleDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.model.Vehicle;
import com.vehiclerentelsystem.vehiclerentalsystem.service.AdminService;
import com.vehiclerentelsystem.vehiclerentalsystem.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    private final VehicleService vehicleService;

    public AdminController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }


    // ✅ Get All Users
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    // ✅ Delete User by ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully!");
    }

    // ✅ Update User Role
    @PutMapping("/users/{id}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        adminService.updateUserRole(id, role);
        return ResponseEntity.ok("User role updated successfully!");
    }



    // ✅ Add Vehicle
    @PostMapping("/vehicles")
    public ResponseEntity<String> addVehicle(
            @RequestParam("vehicle") String vehicleJson,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        try {
            adminService.addVehicle(vehicleJson, files);
            return ResponseEntity.ok("Vehicle added successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ✅ Get All Vehicles
    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    // ✅ Delete Vehicle
    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
        adminService.deleteVehicle(id);
        return ResponseEntity.ok("Vehicle deleted successfully!");
    }

    // ✅ Update Vehicle Status (APPROVED / REJECTED / AVAILABLE / BOOKED)
    @PutMapping("/vehicles/{id}/status")
    public ResponseEntity<String> updateVehicleStatus(@PathVariable Long id, @RequestParam String status) {
        adminService.updateVehicleStatus(id, status);
        return ResponseEntity.ok("Vehicle status updated successfully!");
    }


    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        return ResponseEntity.ok(adminService.getAdminStats());
    }
}
