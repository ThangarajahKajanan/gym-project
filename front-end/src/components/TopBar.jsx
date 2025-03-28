import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function TopBar() {
  const navigate = useNavigate();

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

          navigate("/login"); // Redirect to login page
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }
    });
  };

  return (
    <div className="navbar-custom" style={{ paddingTop: "10px" }}>
      {/*  */}

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
              <a href={void 0} className="dropdown-item">
                <i className="fe-settings me-1"></i>
                <span>Settings</span>
              </a>
              <div className="dropdown-divider"></div>
              {/*              <a href={void 0} className="dropdown-item">
                <i className="fe-calendar me-1"></i>
                <span>Schedule Management</span>
              </a> */}
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

          <li className="dropdown notification-list">
            <a
              className="nav-link dropdown-toggle waves-effect waves-light arrow-none"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-haspopup="false"
              aria-expanded="false"
            >
              <i className="fe-bell font-22"></i>
              <span className="badge bg-danger rounded-circle noti-icon-badge">
                9
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated dropdown-lg py-0">
              <div className="p-2 border-top-0 border-start-0 border-end-0 border-dashed border">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="m-0 font-16 fw-semibold"> Notification</h6>
                  </div>
                  <div className="col-auto">
                    <a
                      href={void 0}
                      className="text-dark text-decoration-underline"
                    >
                      <small>Clear All</small>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </li>

          {/*           <li className="d-none d-sm-inline-block">
            <div
              className="nav-link waves-effect waves-light"
              id="light-dark-mode"
            >
              <i className="ri-moon-line font-22"></i>
            </div>
          </li> */}

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
                src="assets/images/user.png"
                alt="user-image"
                className="rounded-circle"
              />
            </a>
            <div className="dropdown-menu dropdown-menu-end profile-dropdown ">
              <div className="dropdown-header noti-title">
                <h6 className="text-overflow m-0">Welcome</h6>
              </div>
              <a href="changepassword" className="dropdown-item notify-item">
                <i className="fe-settings"></i>&nbsp;
                <span>Change Password</span>
              </a>

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

          <li>
            <a
              className="nav-link waves-effect waves-light"
              data-bs-toggle="offcanvas"
              href="#theme-settings-offcanvas"
            >
              <i className="fe-settings font-22"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default TopBar;
