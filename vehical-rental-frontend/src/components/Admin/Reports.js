import React, { useEffect, useState } from "react";
import axios from "axios";

const Reports = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // ✅ Fetch All Users
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authorization token is missing!");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message
      );
      setError(error?.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Reports - User Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Reports;
