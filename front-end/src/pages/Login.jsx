import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import login from "../images/login.jpg";
import "../CSS/login.css";
import Swal from "sweetalert2";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  // Verify token on mount
  useEffect(() => {
    axios
      .get("http://localhost:5100/api/auth/verify-token", {
        withCredentials: true,
      })
      .then(() => navigate("/"))
      .catch((error) => console.error("Error verifying token:", error));
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Reset validation errors
    setValidEmail(false);
    setValidPassword(false);
  
    // Basic validation
    if (!email.trim()) {
      setValidEmail(true);
      Swal.fire({
        icon: "warning",
        title: "Missing Email",
        text: "Please enter your email address.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
  
    if (!password.trim()) {
      setValidPassword(true);
      Swal.fire({
        icon: "warning",
        title: "Missing Password",
        text: "Please enter your password.",
        confirmButtonColor: "#3085d6",
      });
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:5100/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);

      console.log("teh token is",  response.data.token)
  
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have successfully logged in!",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/welcome");
      });
  
    } catch (error) {
      let message = "Something went wrong. Please try again.";
  
      if (error.response && error.response.data) {
        message = error.response.data.message || message;
      }
  
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
        confirmButtonColor: "#3085d6",
      });
  
      console.error("Error logging in:", error);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-image">
        <img src={login} alt="Login Cover" loading="lazy" />
      </div>

      <div className="login-form">
        <div className="form-card">
          <h2 className="text-center mb-4">
            <a
              style={{
                fontSize: "28px",
                textDecoration: "none",
                color: "#000",
                fontWeight: "600",
              }}
            >
              Power <span style={{ color: "#c11325" }}>Gym</span>
            </a>
          </h2>
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="form-group">
              <label className="">Email Address</label>
              <div className="input-container">
                {/*    <FaUser className="input-icon" /> */}
                <input
                  type="email"
                  className={`form-control ${validEmail ? "is-invalid" : ""}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {validEmail && (
                <div className="invalid-feedback">Enter a valid email!</div>
              )}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label>Password</label>
              <div className="input-container">
                {/*    <FaLock className="input-icon" /> */}
                <input
                  type="password"
                  className={`form-control ${
                    validPassword ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {validPassword && (
                <div className="invalid-feedback">Enter the password!</div>
              )}
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-primary btn-lg w-100 mt-3">
              Login Now
            </button>

            {/* Forgot Password */}
            <div className="text-center mt-3">
              <a href="#!" className="text-muted">
                Forgot password?
              </a>
            </div>

            {/* Register Link */}
            <div className="text-center mt-4">
              <p>
                Don't have an account?{" "}
                <a href="/register" className="text-primary">
                  Sign up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
