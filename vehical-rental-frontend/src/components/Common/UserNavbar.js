import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../UserNavbar.css';

const UserNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="user-navbar">
      <h1 onClick={() => navigate('/user/dashboard')}>Vehicle Rent Service</h1>
      <div className="nav-links">
        <button onClick={() => navigate('/user/profile')}>My Profile</button>
        <button onClick={() => navigate('/user/book-vehicle')}>Book Vehicle</button>
        <button onClick={() => navigate('/user/my-bookings')}>My Bookings</button>
        <button onClick={handleLogout} className="logout">Logout</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
