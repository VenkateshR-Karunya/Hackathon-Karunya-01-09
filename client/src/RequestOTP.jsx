// src/RequestOtp.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RequestOtp() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequest = async () => {
    try {
      await axios.post("http://localhost:5000/otp/request", { email });
      setMessage("OTP sent! Check your email.");
      navigate("/verify", { state: { email } });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <div>
      <h2>Request OTP</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleRequest}>Send OTP</button>
      <p>{message}</p>
    </div>
  );
}
