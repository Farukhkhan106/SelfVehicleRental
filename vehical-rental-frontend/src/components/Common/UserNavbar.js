import React from "react";
import { useNavigate } from "react-router-dom";
import "../UserNavbar.css";

const UserNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1); // Go back
  };

  return (
    <nav className="user-navbar">
      <div className="nav-left">
        <button onClick={handleBack} className="back-button">
          ⬅
        </button>
        <h1 onClick={() => navigate("/user/dashboard")}>
          Vehicle Rent Service
        </h1>
      </div>

      <div className="nav-links">
        <button onClick={() => navigate("/user/profile")}>My Profile</button>
        <button onClick={() => navigate("/user/my-bookings")}>
          My Bookings
        </button>
        <button onClick={handleLogout} className="logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default UserNavbar;
