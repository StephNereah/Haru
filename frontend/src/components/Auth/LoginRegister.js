import React, { useState } from "react";
import "./Auth.css";
import welcomeGif from "../../assets/welcome.gif";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const endpoint = isLogin ? "/login" : "/register";

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : { username: formData.username, email: formData.email, password: formData.password };

      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, payload);
      setMessage(response.data.message);

      if (isLogin && response.status === 200) {
        navigate("/prompt");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "An error occurred.";
      setMessage(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Haru: Music Heals</h1>
        <img src={welcomeGif} alt="Welcome" className="welcome-gif" />
        <h1>Welcome Back!</h1>
        <p>Ready for a healing adventure through music...</p>
      </div>
      <div className="auth-right">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{isLogin ? "Login" : "Register"}</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          )}
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
          <p>{message}</p>
          <p className="toggle-text">
            {isLogin ? "New to the adventure? " : "Already have an account? "}
            <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
              {isLogin ? "Register" : "Login"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
