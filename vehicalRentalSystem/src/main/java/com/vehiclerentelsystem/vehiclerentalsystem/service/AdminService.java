package com.vehiclerentelsystem.vehiclerentalsystem.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vehiclerentelsystem.vehiclerentalsystem.dto.UserDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.dto.VehicleDTO;
import com.vehiclerentelsystem.vehiclerentalsystem.model.Role;
import com.vehiclerentelsystem.vehiclerentalsystem.model.User;
import com.vehiclerentelsystem.vehiclerentalsystem.model.Vehicle;
import com.vehiclerentelsystem.vehiclerentalsystem.model.VehicleStatus;
import com.vehiclerentelsystem.vehiclerentalsystem.repository.BookingRepository;
import com.vehiclerentelsystem.vehiclerentalsystem.repository.UserRepository;
import com.vehiclerentelsystem.vehiclerentalsystem.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookingRepository bookingRepository;

    private final VehicleRepository vehicleRepository;
    private final ObjectMapper objectMapper;

    public AdminService(VehicleRepository vehicleRepository, ObjectMapper objectMapper) {
        this.vehicleRepository = vehicleRepository;
        this.objectMapper = objectMapper;
    }

    // ✅ Get All Users
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getAddress(),
                        user.getCity(),
                        user.getState(),
                        null,  // pincode
                        null,  // about
                        user.getRole().name(),
                        null   // password (hidden for security)
                ))
                .collect(Collectors.toList());
    }

    // ✅ Delete User
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    // ✅ Update User Role
    public void updateUserRole(Long id, String roleName) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        try {
            Role role = Role.valueOf(roleName.toUpperCase());
            user.setRole(role);
            userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role. Allowed roles: USER, ADMIN");
        }
    }

    // ✅ Add Vehicle
    public void addVehicle(String vehicleJson, List<MultipartFile> files) throws Exception {
        // Convert JSON string to DTO
        VehicleDTO vehicleDTO = objectMapper.readValue(vehicleJson, VehicleDTO.class);

        Vehicle vehicle = new Vehicle();
        vehicle.setOwnerId(vehicleDTO.getOwnerId());
        vehicle.setBrand(vehicleDTO.getBrand());
        vehicle.setModel(vehicleDTO.getModel());
        vehicle.setNumberPlate(vehicleDTO.getRegistrationNumber());
        vehicle.setPricePerDay(vehicleDTO.getPricePerDay());
        vehicle.setStatus(VehicleStatus.valueOf(vehicleDTO.getStatus()));

        if (files != null && !files.isEmpty()) {
            List<String> photoUrls = files.stream()
                    .map(file -> "/uploads/" + file.getOriginalFilename())
                    .toList();
            vehicle.setPhotosJson(String.join(",", photoUrls));
        }

        vehicleRepository.save(vehicle);
    }
    // ✅ Delete Vehicle
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with ID: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    // ✅ Update Vehicle Status
    public void updateVehicleStatus(Long id, String status) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + id));

        try {
            vehicle.setStatus(VehicleStatus.valueOf(status.toUpperCase()));
            vehicleRepository.save(vehicle);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status. Allowed: AVAILABLE, BOOKED, APPROVED, REJECTED");
        }
    }

    // ✅ System Stats (Users + Vehicles)
    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalVehicles", vehicleRepository.count());
        stats.put("totalBookings", bookingRepository.count());

        Double totalRevenue = bookingRepository.getTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        return stats;
    }


}
