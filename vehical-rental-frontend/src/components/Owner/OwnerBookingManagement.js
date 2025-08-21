import React, { useState, useEffect } from 'react';
import { api } from '../../axiosConfig';
import { jwtDecode } from 'jwt-decode';
import '../OwnerBookingManagement.css';

const OwnerBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('CURRENT');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [ownerInfo, setOwnerInfo] = useState(null);

  const statusTabs = [
    { label: 'Current', value: 'CURRENT' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Past', value: 'PAST' },
    { label: 'Cancelled', value: 'CANCELED' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ Token not found. Please login again.');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const ownerData = {
        ownerId: decoded.userId,
        email: decoded.sub,
        name: decoded.name || 'Owner'
      };
      setOwnerInfo(ownerData);
      fetchBookings(ownerData.ownerId);
    } catch (err) {
      setMessage('❌ Invalid token. Please login again.');
    }
  }, [status]);

  const fetchBookings = async (ownerId) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await api.get(`/booking/owner/${ownerId}?status=${status}`, { withCredentials: true });
      const data = res.data;

      setBookings(data);
      if (data.length === 0) {
        setMessage('ℹ️ No bookings found for this status.');
      }
    } catch (err) {
      setMessage('❌ Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/booking/cancel/${bookingId}`, {}, { withCredentials: true });
      setMessage('✅ Booking cancelled successfully');
      fetchBookings(ownerInfo.ownerId);
    } catch {
      setMessage('❌ Failed to cancel booking.');
    }
  };

  const renderBookingCard = (b) => {
    const vehicle = b.vehicle || {};
    const renter = b.renter || {};
    return (
      <div key={b.bookingId} className="booking-card">
        <h3>
          {vehicle.title || '🚗 [Vehicle info missing]'} 
          ({vehicle.numberPlate || 'N/A'})
        </h3>
        <p>📅 {b.startDate} ➡ {b.endDate}</p>
        <p>
          👤 {renter.name || 'Name N/A'} | 📞 {renter.phone || 'Phone N/A'} | ✉️ {renter.email || 'Email N/A'}
        </p>
        <p>Status: {b.status}</p>
        {(status === 'CURRENT' || status === 'UPCOMING') && (
          <button onClick={() => cancelBooking(b.bookingId)}>Cancel Booking</button>
        )}
      </div>
    );
  };

  return (
    <div className="booking-mgmt-container">
      <h2>Owner Booking Management</h2>
      {ownerInfo && (
        <div className="owner-info">
          <p>👑 {ownerInfo.name} | ✉️ {ownerInfo.email}</p>
        </div>
      )}
      <div className="booking-tabs">
        {statusTabs.map(tab => (
          <button
            key={tab.value}
            className={status === tab.value ? 'active' : ''}
            onClick={() => setStatus(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {message && <p className="status-message">{message}</p>}

      {loading ? (
        <p>⏳ Loading bookings...</p>
      ) : (
        <div className="booking-list">
          {bookings.length > 0 ? bookings.map(renderBookingCard) : !message && <p>ℹ️ No bookings to display.</p>}
        </div>
      )}
    </div>
  );
};

export default OwnerBookingManagement;
