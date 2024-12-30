import React, { useState } from "react";
import "./Auth.css";
import welcomeGif from "../../assets/welcome.gif";
import axios from "axios";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "", confirmPassword: "" });
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const endpoint = isLogin ? "/login" : "/register";
    const payload = { username: formData.username, password: formData.password };

    try {
      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, payload);
      setMessage(response.data.message);
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
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          )}
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
          <p>{message}</p>
          <p className="toggle-text">
            {isLogin
              ? "New to the adventure? "
              : "Already have an account? "}
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
