import React, { useEffect, useState } from "react";
import axios from "axios";
import BookingCard from "../Common/BookingCard";
import UserNavbar from "../Common/UserNavbar"; // ✅ Navbar Import
import "../MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState("ALL");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId || !token) return;
      try {
        const res = await axios.get(
          `http://localhost:8081/booking/my-detailed-bookings-by-user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("✅ All bookings fetched", res.data);
        setBookings(res.data);
      } catch (err) {
        console.error("❌ Error fetching bookings", err);
      }
    };

    fetchBookings();
  }, [userId, token]);

  const updateBookingStatus = (id, status) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === id ? { ...b, status } : b))
    );
  };

  const removeBookingFromState = (id) => {
    setBookings((prev) => prev.filter((b) => b.bookingId !== id));
  };

  const filteredBookings = bookings.filter((booking) => {
    if (tab === "ALL") return true;
    return booking.status?.toUpperCase() === tab;
  });

  return (
    <>
      <UserNavbar /> {/* ✅ Navbar rendered here */}
      <div className="my-bookings-container">
        <h2 className="heading">My Bookings</h2>

        {/* Tabs */}
        <div className="booking-tabs">
          {["ALL", "CONFIRMED", "CANCELED", "COMPLETED"].map((status) => (
            <button
              key={status}
              onClick={() => setTab(status)}
              className={tab === status ? "active" : ""}
            >
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {filteredBookings.length === 0 ? (
          <p className="no-bookings">No {tab.toLowerCase()} bookings found.</p>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.bookingId}
                booking={booking}
                onCancel={updateBookingStatus}
                onDelete={removeBookingFromState}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyBookings;
