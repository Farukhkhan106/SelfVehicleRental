import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../OwnerCardView.css';

const OwnerCardView = ({ vehicle, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="owner-card">
      <img
        src={vehicle.photoUrls?.length > 0 ? `http://localhost:8081${vehicle.photoUrls[0]}` : '/placeholder.jpg'}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="owner-card-image"
        onError={(e) => (e.target.src = '/placeholder.jpg')}
      />
      <div className="owner-card-info">
        <h3 className="owner-card-name">{vehicle.brand} {vehicle.model}</h3>
        <p className="owner-card-price">💰 ₹{vehicle.pricePerDay}/day</p>
        <p className="owner-card-location">📍 {vehicle.ownerCity}</p>
        <div className="owner-card-actions">
          <button 
            className="edit-btn" 
            onClick={() => navigate(`/owner/vehicle/edit/${vehicle.id}`)}
          >
            ✏️ Edit
          </button>
          <button 
            className="delete-btn" 
            onClick={() => onDelete(vehicle.id)}
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OwnerCardView;
