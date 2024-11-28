import React, { useEffect, useState } from "react";
import "./styles.css";
import { BASE_URL } from "../clientServer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      setSuccessMessage("Login successful!");

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="container">
      <div>
        <h2>Welcome to To-do-app</h2>
      </div>

      <div className="inputBoxes">
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}

        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <button onClick={handleLogin}>Sign in to continue</button>
      </div>
    </div>
  );
};

export default LoginPage;
