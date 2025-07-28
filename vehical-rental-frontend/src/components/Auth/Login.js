import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../axiosConfig';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../Common/Navbar';
import '../Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const token = response.data;

      const decodedToken = jwtDecode(token);
      let role = decodedToken.role;
      const userEmail = decodedToken.sub;
      const userId = decodedToken.userId; // ✅ Extract userId

      console.log('Decoded Role:', role);
      console.log('User Email:', userEmail);
      console.log('User ID:', userId);

      // Normalize roles
      if (role === 'ROLE_USER') {
        role = 'USER';
      } else if (role === 'ROLE_OWNER') {
        role = 'OWNER';
      } else if (role === 'ROLE_ADMIN') {
        role = 'ADMIN';
      } else {
        alert('Invalid role!');
        return;
      }

      // Save data in localStorage
      localStorage.setItem('userEmail', userEmail);
      localStorage.setItem('userId', userId); // ✅ Save userId here
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Navigate based on role
      if (role === 'OWNER') {
        navigate('/owner/dashboard');
      } else if (role === 'USER') {
        navigate('/user/dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Navbar />
      <form
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-xs border border-gray-200 text-center"
        onSubmit={handleLogin}
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Login</h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 text-sm rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};



export default Login;
