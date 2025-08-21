import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole || userRole !== role) {
    alert("Invalid role!");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
