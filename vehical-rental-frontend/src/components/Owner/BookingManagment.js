import React, { useState, useEffect } from 'react';
import { api } from '../../axiosConfig';
import '../BookingManagement.css';
import OwnerNavbar from '../Common/OwnerNavbar';

const BookingManagement = ({ ownerId }) => {
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('CONFIRMED');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validStatuses = ['CONFIRMED', 'BOOKED', 'PENDING', 'CANCELED', 'AVAILABLE'];

  useEffect(() => {
    if (ownerId) fetchFullBookingDetails();
  }, [ownerId, status]);

  const fetchFullBookingDetails = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await api.get(`/booking/owner/${ownerId}?status=${status}`, {
        withCredentials: true,
      });

      const bookingsData = res.data || [];

      const enrichedBookings = await Promise.all(
        bookingsData.map(async (b) => {
          let vehicle = null;
          let renter = null;

          try {
            const [vRes, rRes] = await Promise.all([
              api.get(`/vehicle/${b.vehicleId}`, { withCredentials: true }),
              api.get(`/user/${b.userId}`, { withCredentials: true }), // ✅ Corrected here
            ]);

            vehicle = vRes.data;
            renter = rRes.data;
          } catch (error) {
            console.warn('Failed to fetch extra data for booking:', b.bookingId || b.id);
          }

          return {
            ...b,
            vehicle,
            renter,
          };
        })
      );

      setBookings(enrichedBookings);
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/booking/cancel/${bookingId}`, {}, { withCredentials: true });
      setMessage('✅ Booking cancelled successfully');
      fetchFullBookingDetails();
    } catch {
      setMessage('❌ Failed to cancel booking');
    }
  };

  return (
    <>
      <OwnerNavbar />
      <div className="booking-mgmt-wrapper">
        <div className="booking-mgmt-container">
          <h1 className="page-title">📘 Booking Management</h1>

          <div className="booking-tabs">
            {validStatuses.map((s) => (
              <button
                key={s}
                className={status === s ? 'active' : ''}
                onClick={() => setStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {message && <div className="status-message">{message}</div>}

          {loading ? (
            <p className="loading-text">⏳ Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="no-data">📭 No bookings found for "{status}"</p>
          ) : (
            <div className="booking-list">
              {bookings.map((b) => (
                <div key={b.bookingId || b.id} className="booking-card">
                  <div className="booking-card-header">
                    <h3>{b.vehicle?.brand} {b.vehicle?.model}</h3>
                    <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                  </div>

                  <img
                    src={b.vehicle?.image ? `/uploads/${b.vehicle.image}` : '/no-image.jpg'}
                    alt="vehicle"
                    className="vehicle-thumbnail"
                  />

                  <p><strong>Number Plate:</strong> {b.vehicle?.number}</p>
                  <p><strong>Booking Date:</strong> {b.startDate} ➡ {b.endDate}</p>
                  <p><strong>Price/Day:</strong> ₹{b.vehicle?.pricePerDay}</p>
                  <p><strong>Total:</strong> ₹{b.totalAmount}</p>
                  <p><strong>Renter Info:</strong> 📞 {b.renter?.phone} | 👤 {b.renter?.name}</p>

                  {(b.status === 'BOOKED' || b.status === 'PENDING') && (
                    <button className="cancel-btn" onClick={() => cancelBooking(b.bookingId || b.id)}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingManagement;
