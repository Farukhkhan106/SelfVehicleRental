package com.vehiclerentelsystem.vehiclerentalsystem.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vehiclerentelsystem.vehiclerentalsystem.dto.VehicleDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.model.Vehicle;
import com.vehiclerentelsystem.vehiclerentalsystem.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
//@CrossOrigin(origins = "http://localhost:4173", allowCredentials = "true")
@RequestMapping("/vehicle")
public class VehicleController {

    private final VehicleService vehicleService;
    private final ObjectMapper objectMapper;

    @Autowired
    public VehicleController(VehicleService vehicleService, ObjectMapper objectMapper) {
        this.vehicleService = vehicleService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addVehicle(@RequestParam("vehicle") String vehicleDTOStr,
                                        @RequestParam("files") List<MultipartFile> files,
                                        Authentication authentication) {
        try {
            VehicleDTO vehicleDTO = objectMapper.readValue(vehicleDTOStr, VehicleDTO.class);
            String userEmail = authentication.getName();
            VehicleDTO addedVehicle = vehicleService.addVehicle(vehicleDTO, files, userEmail);
            return ResponseEntity.ok(addedVehicle);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding vehicle: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllVehicles() {
        try {
            List<VehicleDTO> vehicles = vehicleService.getAllVehicles();
            return vehicles.isEmpty() ?
                    ResponseEntity.status(404).body("No vehicles found.") :
                    ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching vehicles: " + e.getMessage());
        }
    }

    @GetMapping("/my-vehicles")
    public ResponseEntity<?> getMyVehicles(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<VehicleDTO> vehicles = vehicleService.getVehiclesByOwnerEmail(userEmail);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching your vehicles: " + e.getMessage());
        }
    }

    @PutMapping("/owner/{vehicleId}")
    public ResponseEntity<String> updateVehicle(@PathVariable Long vehicleId,
                                                @RequestBody VehicleDTO vehicleDTO) {
        try {
            vehicleService.updateVehicle(vehicleId, vehicleDTO);
            return ResponseEntity.ok("Vehicle updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating vehicle: " + e.getMessage());
        }
    }

    @DeleteMapping("/owner/{vehicleId}")
    public ResponseEntity<String> deleteVehicle(@PathVariable Long vehicleId,
                                                Authentication authentication) {
        try {
            String username = authentication.getName();
            vehicleService.deleteVehicle(vehicleId, username);
            return ResponseEntity.ok("Vehicle deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting vehicle: " + e.getMessage());
        }
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> getVehicleDetails(@PathVariable Long id) {
        try {
            Vehicle vehicle = vehicleService.getVehicleById(id);
            return ResponseEntity.ok(vehicle);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Vehicle not found: " + e.getMessage());
        }
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<?> getVehiclesByOwnerId(@PathVariable Long ownerId) {
        try {
            List<VehicleDTO> vehicles = vehicleService.getVehiclesByOwnerId(ownerId);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching vehicles: " + e.getMessage());
        }
    }

    @PutMapping("/update-status/{vehicleId}")
    public ResponseEntity<?> updateStatus(@PathVariable Long vehicleId,
                                          @RequestParam("status") String status,
                                          Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            vehicleService.updateVehicleStatus(vehicleId, status, userEmail);
            return ResponseEntity.ok("Vehicle status updated to " + status);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
}
