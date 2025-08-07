package com.vehicalrentelsystem.vehicalrentalsystem.service;

import com.google.gson.Gson;
import com.vehicalrentelsystem.vehicalrentalsystem.dto.BookingAfterPaymentDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.dto.BookingDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.dto.MyBookingDetailDTO;
import com.vehicalrentelsystem.vehicalrentalsystem.model.Booking;
import com.vehicalrentelsystem.vehicalrentalsystem.model.BookingStatus;
import com.vehicalrentelsystem.vehicalrentalsystem.model.User;
import com.vehicalrentelsystem.vehicalrentalsystem.model.Vehicle;
import com.vehicalrentelsystem.vehicalrentalsystem.repository.BookingRepository;
import com.vehicalrentelsystem.vehicalrentalsystem.repository.UserRepository;
import com.vehicalrentelsystem.vehicalrentalsystem.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final PaymentService paymentService;
    public Booking createBooking(BookingDTO bookingDTO, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vehicle vehicle = vehicleRepository.findById(bookingDTO.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (vehicle.getOwnerId().equals(user.getId())) {
            throw new RuntimeException("You cannot book your own vehicle.");
        }

        if (!isVehicleAvailable(bookingDTO.getVehicleId(), bookingDTO.getStartDate(), bookingDTO.getEndDate())) {
            throw new RuntimeException("Vehicle is already booked during the selected time.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setStartDate(bookingDTO.getStartDate());
        booking.setEndDate(bookingDTO.getEndDate());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setOwnerId(vehicle.getOwnerId());

        long days = ChronoUnit.DAYS.between(bookingDTO.getStartDate(), bookingDTO.getEndDate()) + 1;
        booking.setTotalAmount(vehicle.getPricePerDay().doubleValue() * days);

        return bookingRepository.save(booking);
    }

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELED);
        bookingRepository.save(booking);
    }

    public void deleteBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + bookingId));
        bookingRepository.delete(booking);
    }

    public boolean isVehicleAvailable(Long vehicleId, LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findOverlappingBookings(vehicleId, startDate, endDate, BookingStatus.CONFIRMED).isEmpty();
    }

    public Optional<Booking> findOverlappingBooking(Long vehicleId, LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findFirstByVehicleIdAndDateRangeOverlap(vehicleId, startDate, endDate);
    }

    public List<MyBookingDetailDTO> getMyDetailedBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::convertToMyBookingDetailDTO)
                .collect(Collectors.toList());
    }

    public List<MyBookingDetailDTO> getBookingsByOwnerAndStatus(Long ownerId, String status) {
        BookingStatus bookingStatus;
        try {
            bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid booking status: " + status);
        }

        return bookingRepository.findByOwnerAndStatus(ownerId, bookingStatus).stream()
                .map(this::convertToMyBookingDetailDTO)
                .collect(Collectors.toList());
    }


    private BookingDTO mapToDTO(Booking booking) {
        return new BookingDTO(
                booking.getId(),
                booking.getUser().getId(),
                booking.getVehicle().getId(),
                booking.getStartDate(),
                booking.getEndDate(),
                booking.getStatus().name(),
                booking.getTotalAmount()
        );
    }

    private MyBookingDetailDTO convertToMyBookingDetailDTO(Booking booking) {
        MyBookingDetailDTO dto = new MyBookingDetailDTO();
        dto.setBookingId(booking.getId());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setStatus(booking.getStatus().name());
        dto.setTotalAmount(booking.getTotalAmount());

        Vehicle v = booking.getVehicle();
        if (v != null) {
            dto.setVehicleId(v.getId());
            dto.setBrand(v.getBrand());
            dto.setModel(v.getModel());
            dto.setNumber(v.getNumberPlate());
            dto.setPricePerDay(v.getPricePerDay().doubleValue());

            if (v.getPhotosJson() != null) {
                String[] images = new Gson().fromJson(v.getPhotosJson(), String[].class);
                if (images != null && images.length > 0) {
                    dto.setImage(images[0]);
                }
            }

            userRepository.findById(v.getOwnerId()).ifPresent(owner -> {
                dto.setOwnerName(owner.getName());
                dto.setOwnerCity(owner.getCity());
                dto.setOwnerPhone(owner.getPhone());
            });
        }

        return dto;
    }
    public BookingDTO createBookingAfterPayment(BookingAfterPaymentDTO dto) {
        boolean isValid = paymentService.verifySignature(dto.getOrderId(), dto.getPaymentId(), dto.getSignature());
        if (!isValid) {
            throw new RuntimeException("Invalid Razorpay signature");
        }

        User user = userRepository.findById(dto.getUserId()).orElseThrow();
        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId()).orElseThrow();

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setStartDate(dto.getStartDate());
        booking.setEndDate(dto.getEndDate());
        booking.setTotalAmount(dto.getAmount());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setOwnerId(vehicle.getOwnerId()
        );

        bookingRepository.save(booking);

        paymentService.updatePaymentStatus(dto.getPaymentIdInDb(), dto.getPaymentId(), dto.getSignature());

        return mapToDTO(booking);
    }

}
