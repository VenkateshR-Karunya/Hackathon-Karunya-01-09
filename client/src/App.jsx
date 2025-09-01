// src/App.jsx
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email"); // 'email' or 'otp'
  const [message, setMessage] = useState("");

  // Request OTP
  const handleRequestOtp = async () => {
    try {
      await axios.post("http://localhost:5000/otp/request", { email });
      setMessage("OTP sent! Check your email.");
      setStep("otp");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/otp/verify", { email, otp });
      setMessage(res.data.message || "OTP verified successfully!");
      setStep("success");}}}
export default App;
