import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../axiosConfig";
import OwnerNavbar from "../../components/Common/OwnerNavbar";
import OwnerCardView from "../../components/Common/OwnerCardView";
import "../UserDashboard.css";

const OwnerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const response = await api.get("/vehicle/my-vehicles", {
        withCredentials: true,
      });
      setVehicles(response.data);
      setFilteredVehicles(response.data);
    } catch (err) {
      setError("Failed to fetch your vehicles.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          (vehicle.brand &&
            vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (vehicle.model &&
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (priceFilter) {
      filtered = filtered.filter((vehicle) => {
        if (priceFilter === "low") return vehicle.pricePerDay <= 1000;
        if (priceFilter === "medium")
          return vehicle.pricePerDay > 1000 && vehicle.pricePerDay <= 5000;
        if (priceFilter === "high") return vehicle.pricePerDay > 5000;
        return true;
      });
    }

    setFilteredVehicles(filtered);
  }, [searchTerm, priceFilter, vehicles]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await api.delete(`/vehicle/owner/${id}`, { withCredentials: true });
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete vehicle");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <OwnerNavbar />
      <h2 className="dashboard-title">My Uploaded Vehicles</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by brand or model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Filter by Price</option>
          <option value="low">₹0 - ₹1000</option>
          <option value="medium">₹1001 - ₹5000</option>
          <option value="high">₹5001+</option>
        </select>
      </div>

      {loading && <p className="loading-text">Loading vehicles...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && filteredVehicles.length === 0 && (
        <p className="no-vehicles">No vehicles found.</p>
      )}

      <div className="vehicle-grid">
        {filteredVehicles.map((vehicle) => (
          <OwnerCardView
            key={vehicle.id}
            vehicle={vehicle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default OwnerDashboard;
