import React, { useEffect, useState } from "react";
import { api } from "../../axiosConfig";

const AdminOnly = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await api.get("/auth/admin-only");
        setMessage(response.data);
      } catch (error) {
        alert("Access denied: " + (error.response?.data || error.message));
      }
    };
    fetchMessage();
  }, []);

  return <h1>{message}</h1>;
};

export default AdminOnly;
