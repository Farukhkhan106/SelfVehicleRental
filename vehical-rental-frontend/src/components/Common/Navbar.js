import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Vehicle Rent Service</h1>
      <div>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;