import React from "react";
import { useNavigate } from "react-router-dom";
import "../AdminNavbar.css";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="admin-navbar">
      <h1 className="admin-title" onClick={() => navigate("/admin/dashboard")}>
        Vehicle Rent Service
      </h1>
      <div className="admin-nav-links">
        <button onClick={() => navigate("/admin/manage-vehicles")}>
          Manage Vehicles
        </button>
        <button onClick={() => navigate("/admin/manage-users")}>
          Manage Users
        </button>
        <button onClick={() => navigate("/admin/reports")}>Reports</button>
        <button onClick={() => navigate("/admin/support")}>Support</button>
        <button onClick={handleLogout} className="admin-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
