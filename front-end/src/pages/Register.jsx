import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    axios
      .get("/api/auth/verify-token", { withCredentials: true })
      .catch((err) => console.error("Token verification failed:", err));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setError("Please accept the terms and conditions.");
      return;
    }

    if (password !== cpassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      await axios.post("http://localhost:5100/api/auth/register", {
        username,
        name,
        email,
        password,
      });
      setUsername("");
      setName("");
      setEmail("");
      setPassword("");
      setCpassword("");
      setError("");

      navigate("/login");
    } catch (err) {
      if (err.response?.data?.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Registration failed. Try again.");
      }
    }
  };

  const validatePassword = (password) => {
    if (!/[a-z]/.test(password)) return "Password must have a lowercase letter";
    if (!/[A-Z]/.test(password))
      return "Password must have an uppercase letter";
    if (!/[0-9]/.test(password)) return "Password must have a number";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      return "Password must have a special character";
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    return null;
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-3">Register</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              required
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="termsCheck"
              checked={acceptedTerms}
              onChange={() => setAcceptedTerms(!acceptedTerms)}
            />
            <label className="form-check-label" htmlFor="termsCheck">
              I accept the terms and conditions
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-primary">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
