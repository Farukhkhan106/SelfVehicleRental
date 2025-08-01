import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../axiosConfig'; // Ensure axios is configured
import OwnerNavbar from '../../components/Common/OwnerNavbar'; // ✅ Correct Navbar
import '../UploadVehicle.css'; // Import styling

const UploadVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    brand: '',
    model: '',
    registrationNumber: '',
    pricePerDay: '',
    status: 'AVAILABLE',
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();

      // Add vehicle data
      formData.append('vehicle', JSON.stringify(vehicleData));

      // Add ownerId if needed by backend
      const ownerId = localStorage.getItem('userId');
      if (ownerId) {
        formData.append('ownerId', ownerId);
      }

      // Append images
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      await api.post('/vehicle/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('✅ Vehicle uploaded successfully!');
      setTimeout(() => navigate('/owner/dashboard'), 2000);
    } catch (error) {
      console.error(error);
      setMessage('❌ Failed to upload vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-vehicle-container">
      {/* ✅ Owner Navbar added here */}
      <h2>Upload Your Vehicle</h2>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="brand"
          placeholder="Brand"
          value={vehicleData.brand}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="model"
          placeholder="Model"
          value={vehicleData.model}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="registrationNumber"
          placeholder="Registration Number"
          value={vehicleData.registrationNumber}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="pricePerDay"
          placeholder="Price Per Day (₹)"
          value={vehicleData.pricePerDay}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Vehicle'}
        </button>
      </form>
    </div>
  );
};

export default UploadVehicle;
