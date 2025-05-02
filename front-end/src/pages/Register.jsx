import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import userLogo from '../../public/assets/images/user.png';
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import "../CSS/register.css";
import img from '../images/bg1.jpg'

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    axios
      .get("/api/auth/verify-token", { withCredentials: true })
      .catch((err) => console.error("Token verification failed:", err));
  }, [navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!profileImage) {
      Swal.fire({
        icon: "warning",
        title: "Profile pic required",
        text: "Please upload your profile pic.",
        confirmButtonColor: "#6c63ff",
      });
      return;
    }

    if (!acceptedTerms) {
      Swal.fire({
        icon: "warning",
        title: "Terms not accepted",
        text: "Please accept the terms and conditions.",
        confirmButtonColor: "#6c63ff",
      });
      return;
    }
  
    if (password !== cpassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match.",
        confirmButtonColor: "#6c63ff",
      });
      return;
    }
  
    const passwordError = validatePassword(password);
    if (passwordError) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: passwordError,
        confirmButtonColor: "#6c63ff",
      });
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      if (profileImage?.file) {
        formData.append("profileImage", profileImage.file);
      }

      await axios.post("http://localhost:5100/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUsername("");
      setName("");
      setEmail("");
      setPassword("");
      setCpassword("");
      setProfileImage(null);
      setError("");
  
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You can now log in.",
        confirmButtonColor: "#6c63ff",
      }).then(() => {
        navigate("/login");
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";

      if (errorMessage === "User already exists") {
        Swal.fire({
          icon: "error",
          title: "Email Already Registered",
          text: "Please use a different email address.",
          confirmButtonColor: "#6c63ff",
        });
      } else if (errorMessage === "Username already exists") {
        Swal.fire({
          icon: "error",
          title: "Username Taken",
          text: "Please choose another username.",
          confirmButtonColor: "#6c63ff",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
          confirmButtonColor: "#6c63ff",
        });
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
    <div className="container-fluid register-container">
      <div className="row min-vh-100">
        {/* Image Section */}
        <div className="col-md-6 d-none d-md-flex p-0">
          <div className="register-image-container">
            <div className="register-image-overlay">
              <div className="register-image-content">
                <h1>Join Our Fitness Community</h1>
                <p>Start your fitness journey with us today and achieve your health goals!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div className="register-form-container">
            <h2 className="text-center mb-3">Create Account</h2>
            {error && <div className="alert alert-danger text-center">{error}</div>}
            
            <form onSubmit={handleSubmit}>
              {/* Profile Image */}
              <div className="d-flex justify-content-center mb-3">
                <div className="profile-image-container">
                  <img
                    src={profileImage ? profileImage.preview : userLogo}
                    alt="Profile"
                    className="profile-image"
                  />
                </div>
              </div>

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

              <div className="mb-3 position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="password-eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>

              <div className="mb-3 position-relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm Password"
                  value={cpassword}
                  onChange={(e) => setCpassword(e.target.value)}
                  required
                />
                <span
                  className="password-eye-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>            
              </div>

              <div className="mb-3">
                <label htmlFor="profileImage" className="form-label">Profile Picture</label>
                <input
                  type="file"
                  className="form-control"
                  id="profileImage"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
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
                  I accept the <a href="/terms" target="_blank">terms and conditions</a>
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-100 register-submit-btn">
                Sign Up
              </button>
            </form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <a href="/login" className="register-login-link">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;