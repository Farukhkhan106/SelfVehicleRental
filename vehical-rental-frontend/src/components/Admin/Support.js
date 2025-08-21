import React, { useEffect, useState } from "react";
import axios from "axios";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  // ✅ Fetch Support Tickets
  const fetchTickets = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:8080/admin/support-tickets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTickets(response.data);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch tickets");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <h1>Admin Support - Manage Support Tickets</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.userName}</td>
              <td>{ticket.subject}</td>
              <td>{ticket.status}</td>
              <td>{new Date(ticket.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => alert(`View Ticket ${ticket.id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Support;
