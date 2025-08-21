import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../axiosConfig";
import "../UploadVehicle.css";
import OwnerNavbar from "../Common/OwnerNavbar";

const UploadVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    brand: "",
    model: "",
    registrationNumber: "",
    pricePerDay: "",
    title: "",
    description: "",
    location: "",
    year: "",
    type: "",
    seats: "",
    transmission: "",
    fuelType: "",
    features: [],
    numberPlate: "",
    status: "AVAILABLE",
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const featureOptions = [
    "Air Conditioning",
    "Bluetooth",
    "GPS",
    "USB Charger",
    "Parking Sensors",
  ];
  const vehicleTypes = [
    "Hatchback",
    "Sedan",
    "SUV",
    "Truck",
    "Van",
    "Motorbike",
    "Electric",
    "Convertible",
  ];
  const seatOptions = [2, 4, 5, 6, 7, 8];
  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"];
  const transmissions = ["Manual", "Automatic"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (e) => {
    const { value, checked } = e.target;
    setVehicleData((prev) => {
      if (checked) {
        return { ...prev, features: [...prev.features, value] };
      } else {
        return { ...prev, features: prev.features.filter((f) => f !== value) };
      }
    });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const processedVehicleData = {
        ...vehicleData,
        pricePerDay: Number(vehicleData.pricePerDay),
        year: Number(vehicleData.year),
        seats: Number(vehicleData.seats),
      };

      const formData = new FormData();
      formData.append("vehicle", JSON.stringify(processedVehicleData));

      const ownerId = localStorage.getItem("userId");
      if (ownerId) {
        formData.append("ownerId", ownerId);
      }

      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const response = await api.post("/vehicle/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Vehicle uploaded successfully!");
      setTimeout(() => navigate("/owner/dashboard"), 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Failed to upload vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OwnerNavbar />

      <div className="upload-vehicle-wrapper">
        <div className="upload-vehicle-container">
          <h2>Upload Your Vehicle</h2>
          {message && <p className="message">{message}</p>}

          <form onSubmit={handleSubmit}>
            {/* Block 1: Basic Info */}
            <div className="form-block">
              <h3>Basic Info</h3>
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
                type="number"
                name="year"
                placeholder="Year"
                value={vehicleData.year}
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
                type="text"
                name="numberPlate"
                placeholder="Number Plate"
                value={vehicleData.numberPlate}
                onChange={handleChange}
                required
              />
            </div>

            {/* Block 2: Vehicle Specs */}
            <div className="form-block">
              <h3>Specifications</h3>
              <select
                name="type"
                value={vehicleData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                name="seats"
                value={vehicleData.seats}
                onChange={handleChange}
                required
              >
                <option value="">Select Seats</option>
                {seatOptions.map((seat) => (
                  <option key={seat} value={seat}>
                    {seat}
                  </option>
                ))}
              </select>
              <select
                name="transmission"
                value={vehicleData.transmission}
                onChange={handleChange}
                required
              >
                <option value="">Select Transmission</option>
                {transmissions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                name="fuelType"
                value={vehicleData.fuelType}
                onChange={handleChange}
                required
              >
                <option value="">Select Fuel Type</option>
                {fuelTypes.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            {/* Block 3: Rental & Description */}
            <div className="form-block">
              <h3>Rental & Description</h3>
              <input
                type="number"
                name="pricePerDay"
                placeholder="Price Per Day (₹)"
                value={vehicleData.pricePerDay}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={vehicleData.title}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="description"
                placeholder="Description"
                value={vehicleData.description}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={vehicleData.location}
                onChange={handleChange}
                required
              />
            </div>

            {/* Block 4: Features */}
            <div className="form-block">
              <h3>Features</h3>
              <div className="feature-group">
                {featureOptions.map((feature) => (
                  <label key={feature}>
                    <input
                      type="checkbox"
                      value={feature}
                      checked={vehicleData.features.includes(feature)}
                      onChange={handleFeatureChange}
                    />{" "}
                    {feature}
                  </label>
                ))}
              </div>
            </div>

            {/* Block 5: Images */}
            <div className="form-block">
              <h3>Upload Images</h3>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                required
              />
            </div>

            {/* Block 6: Submit */}
            <div className="form-block">
              <button type="submit" disabled={loading}>
                {loading ? "Uploading..." : "Upload Vehicle"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadVehicle;
