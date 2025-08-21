// Payment.js
import React, { useState } from "react";
import { api } from "../../axiosConfig";

const Payment = ({ bookingId }) => {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    try {
      await api.post("/payments", { bookingId, amount });
      alert("Payment successful!");
    } catch (error) {
      alert("Payment failed: " + (error.response?.data || error.message));
    }
  };

  return (
    <div>
      <h1>Payment</h1>
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default Payment;
