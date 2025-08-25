import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../axiosConfig';
import UserNavbar from '../../components/Common/UserNavbar';
import '../VehicleDetail.css';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  Phone,
  MapPin,
  IndianRupee,
  User2,
  Car,
  CalendarClock,
  Clock4,
  ShieldCheck,
  AlertTriangle,
  Map,
} from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const VehicleDetail = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [location, setLocation] = useState({ lat: 22.7196, lng: 75.8577 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [rentalAmount, setRentalAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [warning, setWarning] = useState('');
  const [availabilityWarning, setAvailabilityWarning] = useState('');

  const securityDeposit = 1000;

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await api.get(`/vehicle/details/${id}`);
        const data = {
          ...response.data,
          photoUrls: JSON.parse(response.data.photosJson || '[]')
        };
        setVehicle(data);

        const address = `${data.ownerAddress}, ${data.ownerCity}`;
        const geo = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=YOUR_OPENCAGE_API_KEY`);
        const geoData = await geo.json();

        if (geoData?.results?.[0]?.geometry) {
          setLocation({
            lat: geoData.results[0].geometry.lat,
            lng: geoData.results[0].geometry.lng
          });
        }

      } catch (err) {
        console.error(err);
        setError("Failed to fetch vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  useEffect(() => {
    const now = new Date();
    const later = new Date(now.getTime() + 60 * 60 * 1000);

    const format = (n) => (n < 10 ? `0${n}` : n);

    setStartDate(now.toISOString().split('T')[0]);
    setEndDate(later.toISOString().split('T')[0]);
    setStartTime(`${format(now.getHours())}:${format(now.getMinutes())}`);
    setEndTime(`${format(later.getHours())}:${format(later.getMinutes())}`);
  }, []);

  useEffect(() => {
    if (startDate && endDate && startTime && endTime && vehicle) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);

      if (end <= start) {
        setWarning("End time must be after start time.");
        setRentalAmount(0);
        setTotalPrice(0);
        return;
      }

      const hours = Math.ceil((end - start) / (1000 * 60 * 60));
      if (hours < 5) {
        setWarning("Minimum booking is 5 hours.");
        setRentalAmount(0);
        setTotalPrice(0);
      } else {
        setWarning('');
        let rental = hours * (vehicle.pricePerDay / 24);
        if (hours === 5) rental += 50;
        rental = Math.ceil(rental);
        setRentalAmount(rental);
        setTotalPrice(rental + securityDeposit);
      }
    }
  }, [startDate, endDate, startTime, endTime, vehicle]);

 useEffect(() => {
  const checkAvailability = async () => {
    if (!vehicle || !startDate || !endDate || !startTime || !endTime) return;

    const startDateTime = `${startDate}T${startTime}`;
    const endDateTime = `${endDate}T${endTime}`;
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    // Skip availability check if booking period is invalid or price is 0
    if (end <= start || rentalAmount === 0) {
      setAvailabilityWarning('');
      return;
    }

try {
  const token = localStorage.getItem('token');

  const res = await api.get('/booking/check-availability', {
    params: {
      vehicleId: vehicle.id,
      startDate: startDateTime.split('T')[0],
      endDate: endDateTime.split('T')[0]
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.data && res.data.available) {
    setAvailabilityWarning('');
  } else {
    setAvailabilityWarning("❌ Vehicle is already booked for the selected period.");
  }
} catch (err) {
  console.error("Availability check failed", err);
  setAvailabilityWarning("❌ Could not check availability. Try again.");
}


  };

  checkAvailability();
}, [startDate, endDate, startTime, endTime, vehicle, rentalAmount]);


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("✅ Razorpay script loaded successfully.");
        resolve(true);
      };
      script.onerror = () => {
        console.error("❌ Failed to load Razorpay script.");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

 const handlePayment = async () => {
  console.log("🟡 Starting payment process...");

  if (!startDate || !endDate || !startTime || !endTime) {
    alert("⚠️ Please fill in all booking details.");
    return;
  }

  if (totalPrice === 0 || availabilityWarning) {
    alert("❌ Booking is not valid.");
    return;
  }

  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("⚠️ Please log in.");
    return;
  }

  const confirmBooking = window.confirm(`Are you sure you want to pay ₹${totalPrice}?`);
  if (!confirmBooking) return;

  const isScriptLoaded = await loadRazorpayScript();
  if (!isScriptLoaded) {
    alert("❌ Razorpay SDK failed to load.");
    return;
  }

  const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
  const formattedEndDate = new Date(endDate).toISOString().split("T")[0];

  try {
    // STEP 1: Create Razorpay order (and store PENDING payment)
    const paymentInit = {
      bookingId: 0, // no booking yet
      amount: totalPrice,
      vehicleId: vehicle.id,
      ownerId: vehicle.ownerId,
    };

    const paymentResponse = await api.post("/payment/create-order", paymentInit);
    const payment = paymentResponse.data;

    if (!payment?.orderId || !payment?.amount) {
      alert("❌ Payment order creation failed.");
      return;
    }

    // STEP 2: Launch Razorpay Checkout
    const options = {
      key: "rzp_test_ZA0Jp4gS6ym8c4",
      amount: payment.amount * 100,
      currency: "INR",
      name: "Vehicle Rental",
      description: "Booking Payment",
      image: "/logo.png",
      order_id: payment.orderId,

      handler: async (response) => {
        console.log("💰 Razorpay payment response:", response);

        // STEP 3: Create booking only after payment success
        const bookingAfterPayment = {
          paymentIdInDb: payment.id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          orderId: payment.orderId,

          userId: parseInt(userId),
          vehicleId: vehicle.id,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          amount: totalPrice,
        };

        try {
          const result = await api.post("/booking/create-after-payment", bookingAfterPayment);
          alert("✅ Payment Successful! Booking Confirmed.");
          console.log("🎉 Booking created:", result.data);
        } catch (error) {
          console.error("❌ Booking creation after payment failed:", error);
          alert("❌ Something went wrong after payment. Contact support.");
        }
      },

      prefill: {
        name: localStorage.getItem("userName") || "Guest",
        email: localStorage.getItem("userEmail") || "",
        contact: "",
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: function () {
          alert("⚠️ Payment cancelled.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      alert("❌ Payment failed. Please try again.");
      console.error("❌ Razorpay failure:", response);
    });
  } catch (error) {
    const msg = error?.response?.data?.message || error.message || "Something went wrong.";
    alert("❌ " + msg);
    console.error("🔴 Error during payment:", msg);
  }
};


  if (loading) return <p>Loading vehicle details...</p>;
  if (error) return <p>{error}</p>;
  if (!vehicle) return <p>No vehicle details available.</p>;

  const durationHours = Math.ceil((new Date(`${endDate}T${endTime}`) - new Date(`${startDate}T${startTime}`)) / (1000 * 60 * 60));

  return (
    <div>
      <UserNavbar />
      <div className="vehicle-detail-container">
        <div className="two-column-layout">
          <div className="left-column">
            <div className="booking-section">
              <h2><CalendarClock size={20} /> Book This Vehicle</h2>
              <div className="booking-inputs">
                <label>Start Date:<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></label>
                <label>Start Time:<input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></label>
                <label>End Date:<input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></label>
                <label>End Time:<input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></label>
              </div>

              {warning && <p className="warning-text"><AlertTriangle size={16} /> {warning}</p>}
              {availabilityWarning && <p className="warning-text"><AlertTriangle size={16} /> {availabilityWarning}</p>}

              {totalPrice > 0 && !availabilityWarning && (
                <div className="total-price">
                  <p><IndianRupee size={16} /> Rental Price: ₹{rentalAmount}</p>
                  <p><Clock4 size={16} /> Duration: <strong>{durationHours} hours</strong></p>
                  <p><ShieldCheck size={16} /> Security Deposit: ₹{securityDeposit} <span style={{ fontSize: '12px', color: '#888' }}>(Refundable)</span></p>
                  <hr style={{ margin: '10px 0' }} />
                  <p><strong>Total Payable Now: ₹{totalPrice}</strong></p>
                  <p style={{ fontSize: '13px', color: '#777' }}>
                    Security deposit will be refunded after vehicle inspection.<br />
                    Deductions may apply for late return, fuel shortage, or any damage.
                  </p>
                </div>
              )}

              <button className="payment-button" onClick={handlePayment}>Proceed to Payment</button>
            </div>

            <div className="map-wrapper">
              <h2><Map size={20} /> Vehicle Location</h2>
              <MapContainer center={[location.lat, location.lng]} zoom={13} scrollWheelZoom={false} style={{ height: '300px', width: '100%', borderRadius: '12px' }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>
                    {vehicle.brand} {vehicle.model} Location
                  </Popup>
                </Marker>
              </MapContainer>
              <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '14px', color: '#1a73e8', display: 'block', marginTop: '8px' }}>
                Open in Google Maps →
              </a>
            </div>
          </div>

          <div className="right-column">
            <div className="vehicle-detail-card">
              <h2><Car size={20} /> Vehicle Details</h2>
              <p><strong>Title:</strong> {vehicle.title}</p>
              <p><strong>Description:</strong> {vehicle.description}</p>
              <p><strong>Brand:</strong> {vehicle.brand}</p>
              <p><strong>Model:</strong> {vehicle.model}</p>
              <p><IndianRupee size={16} /> <strong>Price Per Day:</strong> ₹{vehicle.pricePerDay}</p>
              <p><strong>Status:</strong> {vehicle.status}</p>
              <p><strong>Fuel Type:</strong> {vehicle.fuelType}</p>
              <p><strong>Transmission:</strong> {vehicle.transmission}</p>
              <p><strong>Seats:</strong> {vehicle.seats}</p>
              {vehicle.photoUrls?.length > 0 && (
                <div className="vehicle-images-gallery">
                  {vehicle.photoUrls.map((url, index) => (
                    <img
                      key={index}
                      src={`http://localhost:8081${url}`}
                      alt={`Vehicle ${index + 1}`}
                      className="vehicle-detail-image"
                      onError={(e) => { e.target.src = '/placeholder.jpg' }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="owner-detail-card">
              <h2><User2 size={20} /> Owner Details</h2>
              <p><Phone size={16} /> <strong>Phone:</strong> {vehicle.ownerPhone}</p>
              <p><MapPin size={16} /> <strong>City:</strong> {vehicle.ownerCity}</p>
              <p><MapPin size={16} /> <strong>Address:</strong> {vehicle.ownerAddress}</p>
            </div>

            <div className="rental-instructions">
              <h3><ShieldCheck size={18} /> Rental Instructions:</h3>
              <ul>
                <li>Minimum booking: 5 hours</li>
                <li>5-hour bookings have ₹50 short duration charge</li>
                <li>Pricing is hourly (based on daily rate)</li>
                <li>15-minute grace period for returns</li>
                <li>₹100/hour late return charge</li>
                <li>No refund for early return</li>
                <li>Security deposit ₹1000 taken at booking</li>
                <li>Deposit refundable after damage/fuel check</li>
                <li>Photos or proof shared for any deduction</li>
                <li>Refund processed within 3-5 working days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
