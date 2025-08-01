import React, { useState } from 'react';
import axios from 'axios';

// API Configuration
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

const ManageVehicles = () => {
  const [formData, setFormData] = useState({
    ownerId: '',
    brand: '',
    model: '',
    registrationNumber: '',
    pricePerDay: '',
    status: 'AVAILABLE',
    files: [],
  });

  const token = localStorage.getItem('token');

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, files }));
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      console.error('Token not found!');
      return;
    }

    const requestData = new FormData();

    // Append Vehicle Data as JSON
    const vehicleData = JSON.stringify({
      ownerId: formData.ownerId,
      brand: formData.brand,
      model: formData.model,
      registrationNumber: formData.registrationNumber,
      pricePerDay: formData.pricePerDay,
      status: formData.status,
    });
    requestData.append('vehicle', vehicleData);

    // Append Files
    if (formData.files.length > 0) {
      formData.files.forEach((file) => {
        requestData.append('files', file);
      });
    }

    try {
      const response = await api.post('/admin/add', requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Vehicle added successfully:', response.data);
    } catch (error) {
      console.error('Error adding vehicle:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Add New Vehicle</h1>
      <form onSubmit={handleSubmit}>
        <input name="ownerId" placeholder="Owner ID" onChange={handleChange} required />
        <input name="brand" placeholder="Brand" onChange={handleChange} required />
        <input name="model" placeholder="Model" onChange={handleChange} required />
        <input name="registrationNumber" placeholder="Registration Number" onChange={handleChange} required />
        <input name="pricePerDay" placeholder="Price Per Day" type="number" onChange={handleChange} required />
        <input type="file" multiple onChange={handleFileChange} accept="image/*" />
        <button type="submit">Add Vehicle</button>
      </form>
    </div>
  );
};

export default ManageVehicles;
