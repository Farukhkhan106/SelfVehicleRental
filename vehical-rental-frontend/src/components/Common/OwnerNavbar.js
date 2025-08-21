import React from "react";
import { useNavigate } from "react-router-dom";
import "../UserNavbar.css";

const OwnerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="user-navbar">
      <h1 onClick={() => navigate("/owner/dashboard")}>Vehicle Rent Service</h1>
      <div className="nav-links">
        <button onClick={() => navigate("/owner/profile")}>My Profile</button>
        <button onClick={() => navigate("/owner/upload-vehicle")}>
          Upload Vehicle
        </button>
        <button onClick={() => navigate("/owner/booking-management")}>
          Booking Management
        </button>
        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default OwnerNavbar;
