import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PrivateRoute from "./components/Common/ProtectedRoute";
import Home from "./components/Home";
import "./App.css";

// Admin Components
import AdminDashboard from "./components/Admin/AdminDashboard";
import ManageVehicles from "./components/Admin/ManageVehicles";
import ManageUsers from "./components/Admin/ManageUsers";
import Reports from "./components/Admin/Reports";
import Support from "./components/Admin/Support";

// User Components
import UserDashboard from "./components/User/UserDashboard";
import Profile from "./components/User/Profile";
import VehicleDetail from "./components/User/VehicleDetail";
import MyBookings from "./components/User/MyBookings";

// Owner Components
import OwnerDashboard from "./components/Owner/OwnerDashboard";
import UploadVehicle from "./components/Owner/UploadVehicle";
import MyVehicles from "./components/Owner/MyVehicles";
import OwnerProfile from "./components/Owner/OwnerProfile";
import EditVehicle from "./components/Owner/EditVehicle";
import BookingManagement from "./components/Owner/OwnerBookingManagement"; // ✅ Correct single import

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Admin Routes (Protected) */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-vehicles"
          element={
            <PrivateRoute role="ADMIN">
              <ManageVehicles />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <PrivateRoute role="ADMIN">
              <ManageUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <PrivateRoute role="ADMIN">
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <PrivateRoute role="ADMIN">
              <Support />
            </PrivateRoute>
          }
        />
        {/* User Routes (Protected) */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute role="USER">
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <PrivateRoute role="USER">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/vehicle/:id"
          element={
            <PrivateRoute role="USER">
              <VehicleDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/my-bookings"
          element={
            <PrivateRoute role="USER">
              <MyBookings />
            </PrivateRoute>
          }
        />
        {/* Owner Routes (Protected) */}
        <Route
          path="/owner/dashboard"
          element={
            <PrivateRoute role="OWNER">
              <OwnerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/upload-vehicle"
          element={
            <PrivateRoute role="OWNER">
              <UploadVehicle />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/my-vehicles"
          element={
            <PrivateRoute role="OWNER">
              <MyVehicles />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <PrivateRoute role="OWNER">
              <OwnerProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/vehicle/edit/:id"
          element={
            <PrivateRoute role="OWNER">
              <EditVehicle />
            </PrivateRoute>
          }
        />
        <Route
          path="/owner/booking-management"
          element={
            <PrivateRoute role="OWNER">
              <BookingManagement />
            </PrivateRoute>
          }
        />{" "}
        {/* ✅ Correct path */}
        {/* Fallback 404 */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
