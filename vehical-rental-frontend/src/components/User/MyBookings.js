import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!userId || !token) {
          console.warn("Missing user ID or token");
          return;
        }

        const res = await axios.get(
          `http://localhost:8080/booking/my-detailed-bookings-by-user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };

    fetchBookings();
  }, [userId, token]);

  const removeBookingFromState = (id) => {
    setBookings(prev => prev.filter(b => b.bookingId !== id));
  };

  return (
    <div className="my-bookings-container">
      <h2 className="my-bookings-heading">My Bookings</h2>
      <div className="booking-list">
        {bookings.length === 0 ? (
          <p className="text-center">No bookings found.</p>
        ) : (
          bookings.map((booking, index) => (
            <BookingCard key={index} booking={booking} onDelete={removeBookingFromState} />
          ))
        )}
      </div>
    </div>
  );
};

const BookingCard = ({ booking, onDelete }) => {
  const {
    bookingId,
    brand,
    model,
    number,
    image,
    pricePerDay,
    totalAmount,
    ownerCity,
    ownerName,
    ownerPhone,
    startDate,
    endDate,
    status,
  } = booking;

  const token = localStorage.getItem("token");

  const handleCancel = async () => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    try {
      await axios.put(`http://localhost:8080/booking/cancel/${bookingId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Booking canceled successfully");
      window.location.reload();
    } catch (err) {
      alert("Failed to cancel booking");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this canceled booking?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/booking/delete/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Booking deleted successfully");
      onDelete(bookingId);
    } catch (err) {
      alert("Failed to delete booking");
    }
  };

  return (
    <div className="booking-card-horizontal">
      <div className="booking-image-horizontal">
        <img src={`http://localhost:8080${image}`} alt="Vehicle" />
      </div>
      <div className="booking-content">
        <div>
          <h5>{brand} {model}</h5>
          <p>
            <strong>Number:</strong> {number}<br />
            <strong>Price/Day:</strong> ₹{pricePerDay}<br />
            <strong>Total:</strong> ₹{totalAmount}<br />
            <strong>Location:</strong> {ownerCity}<br />
            <strong>Owner:</strong> {ownerName}<br />
            <strong>Phone:</strong> {ownerPhone}<br />
            <strong>Start:</strong> {startDate}<br />
            <strong>End:</strong> {endDate}<br />
            <strong>Status:</strong>{" "}
            <span className={`badge booking-status ${
              status === "CONFIRMED" ? "bg-success" :
              status === "CANCELED" ? "bg-danger" : "bg-secondary"
            }`}>
              {status}
            </span>
          </p>
        </div>
        <div className="btn-container">
          {status === "CONFIRMED" && (
            <button className="btn btn-warning btn-sm" onClick={handleCancel}>Cancel</button>
          )}
          {status === "CANCELED" && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
