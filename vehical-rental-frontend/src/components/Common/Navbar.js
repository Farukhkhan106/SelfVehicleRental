import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h1 onClick={() => navigate("/")}>Vehicle Rent Service</h1>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/login" className="nav-link">
            Login
          </Link>
          <Link to="/register" className="nav-link">
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
