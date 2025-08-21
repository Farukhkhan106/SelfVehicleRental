import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../axiosConfig';
import '../EditVehicle.css';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    title: '',
    description: '',
    location: '',
    year: '',
    type: '',
    seats: '',
    transmission: '',
    fuelType: '',
    features: [],
    numberPlate: '',
    pricePerDay: '',
    ownerPhone: '',
    ownerCity: '',
    ownerAddress: '',
    status: 'AVAILABLE',
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const featureOptions = ['Air Conditioning', 'Bluetooth', 'GPS', 'USB Charger', 'Parking Sensors'];
  const vehicleTypes = ['Hatchback', 'Sedan', 'SUV', 'Truck', 'Van', 'Motorbike', 'Electric', 'Convertible'];
  const seatOptions = [2, 4, 5, 6, 7, 8];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  const transmissions = ['Manual', 'Automatic'];

  useEffect(() => {
    fetchVehicleDetails();
  }, []);

  const fetchVehicleDetails = async () => {
    try {
      const response = await api.get(`/vehicle/details/${id}`, { withCredentials: true });
      setVehicleData({
        ...response.data,
        features: response.data.features || [],
        year: String(response.data.year),
        seats: String(response.data.seats),
        pricePerDay: String(response.data.pricePerDay)
      });
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to fetch vehicle details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    setVehicleData(prev => {
      const updatedFeatures = checked
        ? [...prev.features, value]
        : prev.features.filter(f => f !== value);
      return { ...prev, features: updatedFeatures };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const processedData = {
        ...vehicleData,
        pricePerDay: Number(vehicleData.pricePerDay),
        year: Number(vehicleData.year),
        seats: Number(vehicleData.seats),
      };

      await api.put(`/vehicle/owner/${id}`, processedData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      setMessage('✅ Vehicle updated successfully!');
      setTimeout(() => navigate('/owner/my-vehicles'), 2000);

    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update vehicle.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading vehicle details...</p>;

  return (
    <div className="edit-vehicle-container">
      <h2>Edit Your Vehicle</h2>

      {message && <p className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</p>}

      <form className="edit-vehicle-form" onSubmit={handleSave}>
        <input type="text" name="brand" value={vehicleData.brand} onChange={handleChange} placeholder="Brand" required />
        <input type="text" name="model" value={vehicleData.model} onChange={handleChange} placeholder="Model" required />
        <input type="text" name="title" value={vehicleData.title} onChange={handleChange} placeholder="Title" required />
        <textarea name="description" value={vehicleData.description} onChange={handleChange} placeholder="Description" required />
        <input type="text" name="location" value={vehicleData.location} onChange={handleChange} placeholder="Location" required />
        <input type="number" name="year" value={vehicleData.year} onChange={handleChange} placeholder="Year" required />
        <input type="text" name="numberPlate" value={vehicleData.numberPlate} onChange={handleChange} placeholder="Number Plate" required />
        <input type="number" name="pricePerDay" value={vehicleData.pricePerDay} onChange={handleChange} placeholder="Price Per Day (₹)" required />
        <input type="text" name="ownerPhone" value={vehicleData.ownerPhone} onChange={handleChange} placeholder="Owner Phone" required />
        <input type="text" name="ownerCity" value={vehicleData.ownerCity} onChange={handleChange} placeholder="Owner City" required />
        <input type="text" name="ownerAddress" value={vehicleData.ownerAddress} onChange={handleChange} placeholder="Owner Address" required />

        <select name="type" value={vehicleData.type} onChange={handleChange} required>
          <option value="">Select Type</option>
          {vehicleTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select name="seats" value={vehicleData.seats} onChange={handleChange} required>
          <option value="">Select Seats</option>
          {seatOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select name="transmission" value={vehicleData.transmission} onChange={handleChange} required>
          <option value="">Select Transmission</option>
          {transmissions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select name="fuelType" value={vehicleData.fuelType} onChange={handleChange} required>
          <option value="">Select Fuel Type</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        <div className="features-container">
          <label>Features:</label>
          {featureOptions.map((feature) => (
            <div key={feature}>
              <input
                type="checkbox"
                value={feature}
                checked={vehicleData.features.includes(feature)}
                onChange={handleFeatureChange}
              /> {feature}
            </div>
          ))}
        </div>

        <small>To change images, please go to the "Manage Photos" section.</small>

        <button type="submit" className="save-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditVehicle;
