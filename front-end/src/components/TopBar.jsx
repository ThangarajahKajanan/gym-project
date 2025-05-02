import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import placeholder from '../images/register.jpg'



function TopBar() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const profileImage = localStorage.getItem('profileImage'); 

  const imageUrl = profileImage ? `http://localhost:5100/${profileImage}` : 'assets/images/user.png'; 


  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the system.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            "http://localhost:5100/api/auth/logout",
            {},
            { withCredentials: true }
          );
          localStorage.removeItem("userRole");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
                Swal.fire({
                  icon: "success",
                  title: "Logout Successful",
                  text: "You have successfully logged out!",
                  confirmButtonColor: "#3085d6",
                }).then(() => {
                  navigate("/");
                });
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }
    });
  };

  return (
    <div className="navbar-custom" style={{ paddingTop: "10px" }}>
      <div className="topbar">
        <div className="topbar-menu d-flex align-items-center gap-1">
          {/* Brand Logo Light */}
          <div className="logo-box">
            <a
              style={{
                fontSize: "24px",
                textDecoration: "none",
                color: "#fff",
                fontWeight: "600",
              }}
            >
              Power <span style={{ color: "#c11325" }}>Gym</span>
            </a>
          </div>

          {/* Sidebar Menu Toggle Button */}
          <button className="button-toggle-menu">
            <i className="mdi mdi-menu"></i>
          </button>

          {/* Dropdown Menu */}
          <div className="dropdown d-none d-xl-block">
            <a
              className="nav-link dropdown-toggle waves-effect waves-light"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              Section
              <i className="mdi mdi-chevron-down ms-1"></i>
            </a>
            <div className="dropdown-menu">
        
                <Link to="/welcome" className="dropdown-item">
                  <i className="fe-airplay me-1"></i> 
                  <span>Dashboard</span>
                </Link>

            <div className="dropdown-divider"></div>
              <Link to="/" className="dropdown-item">
                <i className="fe-home me-2"></i> 
                <span>Home</span>
              </Link>
            <div className="dropdown-divider"></div>

              {userRole === "ADMIN" && (
                <Link to="/trainerManagement" className="dropdown-item">
                  <i className="fe-user me-1"></i>
                  <span>Trainer</span>
                </Link>
              )}
              {userRole === "ADMIN" && (
                <Link to="/userManagement" className="dropdown-item">
                  <i className="fe-user me-1"></i>
                  <span>User</span>
                </Link>
              )}
              <Link to="/manageschedules" className="dropdown-item">
                <i className="fe-calendar me-1"></i>
                <span>Schedule</span>
              </Link>
              <Link to="/membershipManagement" className="dropdown-item">
                <i className="fe-user me-1"></i>
                <span>Membership</span>
              </Link>
              <Link to="/gymbot" className="dropdown-item">
                <i className="fe-user me-1"></i>
                <span>Gym Bot</span>
              </Link>
            </div>
          </div>
        </div>

        <ul className="topbar-menu d-flex align-items-center">
          <li className="dropdown d-none d-md-inline-block">
            <a
              className="nav-link dropdown-toggle waves-effect waves-light arrow-none"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            ></a>
          </li>

          <li className="dropdown">
            <a
              className="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <img
                src={imageUrl}
                alt="user-image"
                className="rounded-circle overflow-hidden" 
                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
               height="40"
              width="40"
              />
            </a>
            <div className="dropdown-menu dropdown-menu-end profile-dropdown ">
              <div className="dropdown-header noti-title">
                <h6 className="text-overflow m-0">Welcome</h6>
              </div>
              <div className="dropdown-divider"></div>
              <a
                href={void 0}
                onClick={handleLogout}
                className="dropdown-item notify-item"
              >
                <i className="fe-log-out"></i>&nbsp;
                <span>Logout</span>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TopBar;
