package com.vehicalrentelsystem.vehicalrentalsystem.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vehicalrentelsystem.vehicalrentalsystem.dto.VehicleDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.model.*;
import com.vehicalrentelsystem.vehicalrentalsystem.repository.BookingRepository;
import com.vehicalrentelsystem.vehicalrentalsystem.repository.ReviewRepository;
import com.vehicalrentelsystem.vehicalrentalsystem.repository.UserRepository;
import com.vehicalrentelsystem.vehicalrentalsystem.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private  final ReviewRepository reviewRepository;
    private  final BookingRepository bookingRepository;
    @Autowired
    public VehicleService(VehicleRepository vehicleRepository,
                          ObjectMapper objectMapper,
                          UserRepository userRepository, ReviewRepository reviewRepository, BookingRepository bookingRepository) {
        this.vehicleRepository = vehicleRepository;
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
    }

    public VehicleDTO addVehicle(VehicleDTO vehicleDTO, List<MultipartFile> files, String userEmail) throws IOException {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User  not found with email: " + userEmail));

        Vehicle vehicle = new Vehicle();
        vehicle.setOwnerId(user.getId());
        vehicle.setBrand(vehicleDTO.getBrand());
        vehicle.setModel(vehicleDTO.getModel());
        vehicle.setNumberPlate(vehicleDTO.getRegistrationNumber()); // Use registrationNumber from DTO
        vehicle.setPricePerDay(vehicleDTO.getPricePerDay());
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setOwnerPhone(user.getPhone());
        vehicle.setOwnerCity(user.getCity());
        vehicle.setOwnerAddress(user.getAddress());
        vehicle.setType(vehicleDTO.getType()); // Set vehicle type
        vehicle.setSeats(vehicleDTO.getSeats()); // Set number of seats
        vehicle.setTransmission(vehicleDTO.getTransmission()); // Set transmission type
        vehicle.setFuelType(vehicleDTO.getFuelType()); // Set fuel type
        vehicle.setYear(vehicleDTO.getYear()); // Set year
        vehicle.setTitle(vehicleDTO.getTitle()); // Set title
        vehicle.setDescription(vehicleDTO.getDescription()); // Set description

        List<String> photoUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            photoUrls.add(savePhoto(file));
        }

        vehicle.setPhotosJson(objectMapper.writeValueAsString(photoUrls));
        vehicleRepository.save(vehicle);

        return mapToDTO(vehicle);
    }

    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public List<VehicleDTO> getVehiclesByOwnerEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User  not found with email: " + email));
        return vehicleRepository.findByOwnerId(user.getId()).stream().map(this::mapToDTO).toList();
    }

    public List<VehicleDTO> getVehiclesByOwnerId(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId).stream().map(this::mapToDTO).toList();
    }

    public void updateVehicle(Long vehicleId, VehicleDTO vehicleDTO) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + vehicleId));
        vehicle.setBrand(vehicleDTO.getBrand());
        vehicle.setModel(vehicleDTO.getModel());
        vehicle.setNumberPlate(vehicleDTO.getRegistrationNumber()); // Use registrationNumber from DTO
        vehicle.setPricePerDay(vehicleDTO.getPricePerDay());
        vehicle.setType(vehicleDTO.getType()); // Update vehicle type
        vehicle.setSeats(vehicleDTO.getSeats()); // Update number of seats
        vehicle.setTransmission(vehicleDTO.getTransmission()); // Update transmission type
        vehicle.setFuelType(vehicleDTO.getFuelType()); // Update fuel type
        vehicle.setYear(vehicleDTO.getYear()); // Update year
        vehicle.setTitle(vehicleDTO.getTitle()); // Update title
        vehicle.setDescription(vehicleDTO.getDescription()); // Update description
        vehicleRepository.save(vehicle);
    }


    @Transactional
    public void deleteVehicle(Long vehicleId, String username) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + vehicleId));

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (user.getRole() == Role.ADMIN || Objects.equals(vehicle.getOwnerId(), user.getId())) {
            vehicleRepository.delete(vehicle);  // Cascade handles dependent deletes
        } else {
            throw new RuntimeException("Access denied! You are not authorized to delete this vehicle.");
        }
    }



    public void updateVehicleStatus(Long vehicleId, String status, String userEmail) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User  not found"));

        if (!Objects.equals(vehicle.getOwnerId(), user.getId())) {
            throw new RuntimeException("Access denied!");
        }

        vehicle.setStatus(VehicleStatus.valueOf(status.toUpperCase()));
        vehicleRepository.save(vehicle);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with ID: " + id));
    }

    private String savePhoto(MultipartFile file) throws IOException {
        String uploadDir = "F:/springBoot/uploads/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(dir, fileName);
        file.transferTo(dest);
        return "/uploads/" + fileName;
    }

    public VehicleDTO mapToDTO(Vehicle vehicle) {
        List<String> photoUrls = new ArrayList<>();
        try {
            if (vehicle.getPhotosJson() != null) {
                photoUrls = objectMapper.readValue(vehicle.getPhotosJson(), List.class);
            }
        } catch (JsonProcessingException ignored) {}

        return VehicleDTO.builder()
                .id(vehicle.getId())
                .ownerId(vehicle.getOwnerId())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .registrationNumber(vehicle.getNumberPlate()) // Use registrationNumber for DTO
                .pricePerDay(vehicle.getPricePerDay())
                .status(vehicle.getStatus().name())
                .photoUrls(photoUrls)
                .ownerPhone(vehicle.getOwnerPhone())
                .ownerCity(vehicle.getOwnerCity())
                .ownerAddress(vehicle.getOwnerAddress())
                .type(vehicle.getType()) // Include type
                .seats(vehicle.getSeats()) // Include seats
                .transmission(vehicle.getTransmission()) // Include transmission
                .fuelType(vehicle.getFuelType()) // Include fuel type
                .year(vehicle.getYear()) // Include year
                .title(vehicle.getTitle()) // Include title
                .description(vehicle.getDescription()) // Include description
                .build();
    }
}
