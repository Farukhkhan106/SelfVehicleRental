import React from "react";
import "../BookingCard.css";
import moment from "moment";

const BookingCard = ({ booking, onCancel, onDelete }) => {
  if (!booking) return null;

  const {
    bookingId,
    status,
    totalAmount,
    startDate,
    endDate,
    brand,
    model,
    image,
  } = booking;

  const formattedPickupDate = moment(startDate).format("DD-MM-YYYY");
  const formattedDropDate = moment(endDate).format("DD-MM-YYYY");

  const handleCancel = () => {
    onCancel(bookingId, "CANCELED");
  };

  const handleDelete = () => {
    onDelete(bookingId);
  };

  const imageUrl = image
    ? `http://localhost:8081${image}`
    : "/placeholder.jpg";

  return (
    <div className="bc-card">
      <div className="bc-image-section">
        <img
          src={imageUrl}
          alt={`${brand} ${model}`}
          className="bc-vehicle-image"
          onError={(e) => {
            e.target.src = "/placeholder.jpg";
          }}
        />
      </div>

      <div className="bc-details-section">
        <h3 className="bc-vehicle-name">{brand} {model}</h3>
        <p><strong>Status:</strong> <span className={`bc-status ${status.toLowerCase()}`}>{status}</span></p>
        <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
        <p><strong>Pickup Date:</strong> {formattedPickupDate}</p>
        <p><strong>Drop Date:</strong> {formattedDropDate}</p>
      </div>

      <div className="bc-actions-section">
        {status === "CONFIRMED" && (
          <button className="bc-cancel-btn" onClick={handleCancel}>Cancel</button>
        )}
        <button className="bc-delete-btn" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default BookingCard;
