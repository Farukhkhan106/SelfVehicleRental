import React, { useEffect, useState } from "react";
import { api } from "../../axiosConfig"; // ✅ Configured Axios instance
import '../MyVehicles.css'; // ✅ Correct path to CSS

const statusOptions = ["AVAILABLE", "BOOKED", "MAINTENANCE", "UNAVAILABLE"];

function MyVehicles() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchMyVehicles();
  }, []);

  const fetchMyVehicles = async () => {
    try {
      const res = await api.get("/vehicle/my-vehicles");
      setVehicles(res.data);
    } catch (err) {
      alert("❌ Error fetching vehicles.");
      console.error(err);
    }
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await api.delete(`/vehicle/delete/${id}`);
      fetchMyVehicles(); // Refresh list
    } catch (err) {
      alert("❌ Error deleting vehicle.");
      console.error(err);
    }
  };

  const changeStatus = async (id, status) => {
    try {
      await api.put(`/vehicle/update-status/${id}?status=${status}`);
      fetchMyVehicles();
    } catch (err) {
      alert("❌ Error updating status.");
      console.error(err);
    }
  };

  const updateVehicle = async (id) => {
    alert("You can create a modal or separate form for editing.");
  };

  return (
    <div className="vehicle-container">
      <h2 className="vehicle-heading">My Vehicles</h2>
      {vehicles.map((v) => (
        <div className="vehicle-card" key={v.id}>
          <h3>{v.brand} - {v.model}</h3>
          <p><strong>Plate:</strong> {v.numberPlate}</p>
          <p><strong>Price Per Day:</strong> ₹{v.pricePerDay}</p>
          <p><strong>Status:</strong>
            <select value={v.status} onChange={(e) => changeStatus(v.id, e.target.value)}>
              {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </p>
          <div className="vehicle-images">
            {v.photoUrls?.map((url, index) => (
              <img
                key={index}
                src={`http://localhost:8080${url}`}
                alt="Vehicle"
                onError={(e) => e.target.src = "/placeholder.jpg"}
              />
            ))}
          </div>
          <br />
          <button className="edit-btn" onClick={() => updateVehicle(v.id)}>✏️ Edit</button>
          <button className="delete-btn" onClick={() => deleteVehicle(v.id)}>🗑️ Delete</button>
        </div>
      ))}
    </div>
  );
}

export default MyVehicles;
