import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../axiosConfig";
import AdminNavbar from "../../components/Common/AdminNavbar";
import "../AdminNavbar.css";

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await api.get("/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Admin Navbar */}
      <AdminNavbar />

      {/* Admin Dashboard */}
      <h1 className="text-center text-4xl font-bold my-8">Admin Dashboard</h1>
    </div>
  );
};

export default AdminDashboard;
