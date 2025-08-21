import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../axiosConfig";
import Navbar from "../Common/Navbar";
import "../Register.css";

const stateCityMap = {
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"],
  Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  Punjab: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"],
  Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala"],
  Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  Karnataka: ["Bengaluru", "Mysuru", "Mangalore", "Hubli"],
  Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Andhra Pradesh": ["Vijayawada", "Visakhapatnam", "Guntur", "Nellore"],
  Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri"],
  Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  Chhattisgarh: ["Raipur", "Bilaspur", "Durg", "Korba"],
  Delhi: ["New Delhi"],
  Goa: ["Panaji", "Margao"],
  Assam: ["Guwahati", "Dibrugarh", "Silchar"],
  Uttarakhand: ["Dehradun", "Haridwar"],
  "Himachal Pradesh": ["Shimla", "Manali"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  Tripura: ["Agartala"],
  Meghalaya: ["Shillong"],
  Manipur: ["Imphal"],
  Nagaland: ["Kohima"],
  Mizoram: ["Aizawl"],
  Sikkim: ["Gangtok"],
  "Arunachal Pradesh": ["Itanagar"],
  Puducherry: ["Puducherry"],
  Chandigarh: ["Chandigarh"],
  Ladakh: ["Leh"],
};

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/register`, {
        name,
        email,
        password,
        role,
        phone,
        address,
        city,
        state: stateName,
      });
      alert(`Registration successful as ${role}! Please login.`);
      navigate("/login");
    } catch (error) {
      alert("Registration failed: " + (error.response?.data || error.message));
    }
  };

  const cityOptions = stateName ? stateCityMap[stateName] || [] : [];

  return (
    <div className="register-container">
      <Navbar />
      <form onSubmit={handleRegister} className="register-form">
        <h1>Register</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label>State:</label>
        <select
          value={stateName}
          onChange={(e) => {
            setStateName(e.target.value);
            setCity("");
          }}
          required
        >
          <option value="">Select State</option>
          {Object.keys(stateCityMap).map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <label>City / Village:</label>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          disabled={!stateName}
        >
          <option value="">Select City / Village</option>
          {cityOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">User </option>
          <option value="OWNER">Owner</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
