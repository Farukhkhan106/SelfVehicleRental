import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../axiosConfig';
import Navbar from '../Common/Navbar';
import '../Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/register`, { name, email, password, role, phone, address, city, state });
      alert(`Registration successful as ${role}! Please login.`);
      navigate('/login');
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Registration Form */}
      <form onSubmit={handleRegister} className="register-form mx-auto my-10 p-6 bg-white shadow-lg rounded-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>
        
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        
        <div className="mb-4">
          <label className="block mb-2">Role:</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>
        
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition">Register</button>
      </form>
    </div>
  );
};

export default Register;
