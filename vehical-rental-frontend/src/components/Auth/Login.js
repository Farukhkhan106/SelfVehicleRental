import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../axiosConfig";
import { jwtDecode } from "jwt-decode";
import Navbar from "../Common/Navbar";
import "../Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data;

      const decodedToken = jwtDecode(token);
      let role = decodedToken.role;
      const userEmail = decodedToken.sub;
      const userId = decodedToken.userId;

      console.log("Decoded Role:", role);
      console.log("User Email:", userEmail);
      console.log("User ID:", userId);

      if (role === "ROLE_USER") {
        role = "USER";
      } else if (role === "ROLE_OWNER") {
        role = "OWNER";
      } else if (role === "ROLE_ADMIN") {
        role = "ADMIN";
      } else {
        alert("Invalid role!");
        return;
      }

      // Save common data
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      // Save ownerId if owner
      if (role === "OWNER") {
        localStorage.setItem("ownerId", userId); // ✅ Save as ownerId for OwnerBookingManagement
      }

      // Navigate based on role
      if (role === "OWNER") {
        navigate("/owner/dashboard");
      } else if (role === "USER") {
        navigate("/user/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed!");
    }
  };

  return (
    <div className="login-container">
      <Navbar />
      <form className="login-form" onSubmit={handleLogin}>
        <h1 className="login-title">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
