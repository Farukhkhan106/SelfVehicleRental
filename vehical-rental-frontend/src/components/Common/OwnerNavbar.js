import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../UserNavbar.css'; // ✅ Reuse user navbar styles

const OwnerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="user-navbar">
      <h1 onClick={() => navigate('/owner/dashboard')}>Vehicle Rent Service</h1>
      <div className="nav-links">
        <button onClick={() => navigate('/owner/profile')}>My Profile</button>
        <button onClick={() => navigate('/owner/my-vehicles')}>My Vehicles</button>
        <button onClick={() => navigate('/owner/upload-vehicle')}>Upload Vehicle</button>
        <button onClick={handleLogout} className="logout">Logout</button>
      </div>
    </nav>
  );
};

export default OwnerNavbar;
