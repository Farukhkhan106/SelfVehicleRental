// src/components/Common/CardView.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../CardView.css'; // (optional: create if you want specific styles)

const CardView = ({ vehicle }) => {
  const navigate = useNavigate();

  return (
    <div
      className="vehicle-card"
      onClick={() => navigate(`/user/vehicle/${vehicle.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={
          vehicle.photoUrls && vehicle.photoUrls.length > 0
            ? `http://localhost:8081${vehicle.photoUrls[0]}`
            : '/placeholder.jpg'
        }
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="vehicle-image"
        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
      />
      <div className="vehicle-info">
        <h3 className="vehicle-name">{vehicle.brand} {vehicle.model}</h3>
        <p className="vehicle-price">💰 ₹{vehicle.pricePerDay}/day</p>
        <p className="vehicle-location">📍 {vehicle.ownerCity}</p>
        <p className="vehicle-status">
          🚦 Status: <span className={vehicle.status === 'AVAILABLE' ? 'available' : 'unavailable'}>
            {vehicle.status}
          </span>
        </p>
        <p className="vehicle-fuel-type">⛽ Fuel Type: {vehicle.fuelType}</p>
        <p className="vehicle-transmission">🔧 Transmission: {vehicle.transmission}</p>
        <p className="vehicle-seats">👥 Seats: {vehicle.seats}</p>
        <p className="click-msg">Click for more info</p>
      </div>
    </div>
  );
};

export default CardView;
