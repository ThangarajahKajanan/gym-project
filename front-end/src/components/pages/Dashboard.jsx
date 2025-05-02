import React, { useState, useEffect } from "react";
import { Card, Row, Col, Container } from "react-bootstrap";
import {
  FaUsers,
  FaUserTie,
  FaIdCard,
  FaCalendarAlt,
  FaClock,
  FaLightbulb,
  FaCheckCircle,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import gymAdmin from "../../images/gym-profile.jpg";
import "../../CSS/dashboardWelcome.css";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import logo from "../../images/chat1.png";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // Data for pie chart
  const [statusCount, setStatusCount] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [trainerCount, setTrainerCount] = useState(0);
  const [membershipCount, setMembershipCount] = useState(0);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    getUsersCount();
    getTrainerCount();
    getMembershipCount();
    if (userRole === "ADMIN") {
      getStatusCount();
    } else {
      getStatusCountByUser();
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date and time
  const formattedDate = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const getStatusCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5100/api/getStatusCount",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatusCount(response.data.counts);
      console.log("status count", response.data.counts);
    } catch (error) {
      console.error("Failed to fetch status count", error);
    }
  };

  const getStatusCountByUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5100/api/getStatusCountByUser",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStatusCount(response.data.counts);
      console.log("status Count", response.data.counts);
    } catch (error) {
      console.error("Failed to fetch status count", error);
    }
  };

  const getUsersCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5100/api/getUsersCount",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserCount(response.data.userCount);
      console.log("User count", response.data.userCount);
    } catch (error) {
      console.error("Failed to fetch users count", error);
    }
  };

  const getTrainerCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5100/api/getTrainerCount",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTrainerCount(response.data.trainerCount);
      console.log("trainer Count ", response.data.trainerCount);
    } catch (error) {
      console.error("Failed to fetch trainer count", error);
    }
  };

  const getMembershipCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5100/api/getMembershipCount",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMembershipCount(response.data.membershipCount);
      console.log("membership Count  ", response.data.membershipCount);
    } catch (error) {
      console.error("Failed to fetch membership count", error);
    }
  };

  // Prepare pieData safely
  const pieData = statusCount
    ? statusCount.true === 0 && statusCount.false === 0
      ? [{ name: "No Tasks", value: 1 }]
      : [
          { name: "Pending", value: statusCount.false },
          { name: "Completed", value: statusCount.true },
        ]
    : [];

  const COLORS = ["#FF8042", "#00C49F"];

  return (
    <Container fluid className="admin-dashboard">
      <Row className="mb-4">
        <Col>
          <Card className="welcome-card">
            <Card.Body className="d-flex align-items-center justify-content-between">
              {/* Left side: Circle image and button */}

              <div className="ms-0">
                <h2>Welcome Back, {username}</h2>
                <p className="text-muted">
                  {formattedDate} | <FaClock className="me-1" /> {formattedTime}
                </p>
                <p className="mb-0">
                  Here's what's happening with your gym today.
                </p>
              </div>

              {/* Right side: Welcome message */}
              <div className="d-flex align-items-center">
                <div
                  className="rounded-circle overflow-hidden"
                  style={{ width: "80px", height: "80px", borderRadius: "50%" }}
                >
                  <Link to="/gymbot">
                    <img
                      src={logo}
                      alt="Logo"
                      className="img-fluid"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                </div>

                <Link to="/gymbot">
                  <div className="ms-3">
                    <div
                      style={{
                        backgroundColor: "#e0f7fa",
                        padding: "16px 15px",
                        borderRadius: "10px",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        maxWidth: "250px",
                      }}
                    >
                      <h5 style={{ margin: 0 }}>
                        let's plan your diet
                        <span
                          className="ms-1"
                          style={{ fontWeight: "bold", color: "#333" }}
                        >
                          {username}
                        </span>
                      </h5>
                    </div>
                  </div>
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="stat-card users-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Total Users</h6>
                  <h2>{userCount}</h2>
                </div>
                <div className="icon-circle">
                  <FaUsers size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card trainers-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Total Trainers</h6>
                  <h2>{trainerCount}</h2>
                </div>
                <div className="icon-circle">
                  <FaUserTie size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="stat-card memberships-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase">Total Memberships</h6>
                  <h2>{membershipCount}</h2>
                </div>
                <div className="icon-circle">
                  <FaIdCard size={24} />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tasks Pie Chart */}
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <FaCalendarAlt className="me-2" /> Schedule Task Overview
              </Card.Title>
              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow rounded-4 border-0">
            <Card.Body className="text-center d-flex flex-column align-items-center justify-content-center">
              <Card.Title className="mb-3 fs-4 fw-bold text-primary">
                Today's Date
              </Card.Title>
              <div
                className="p-2 rounded-3 bg-light"
                style={{ width: "100%", maxWidth: "350px" }}
              >
                <Calendar value={new Date()} className="border-0" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title className="d-flex align-items-center">
                <FaLightbulb className="me-2 text-warning" /> Tips for a Great
                Day!
              </Card.Title>
              <p className="text-muted">
                Stay consistent, stay strong. Every rep counts toward your goal.
                🔥
              </p>

              <ul className="list-unstyled mt-4">
                <li className="mb-3">
                  <FaCheckCircle className="me-2 text-success" />
                  Warm up before every workout.
                </li>
                <li className="mb-3">
                  <FaCheckCircle className="me-2 text-success" />
                  Hydrate well throughout the day.
                </li>
                <li className="mb-3">
                  <FaCheckCircle className="me-2 text-success" />
                  Focus on proper form over heavy weights.
                </li>
                <li className="mb-3">
                  <FaCheckCircle className="me-2 text-success" />
                  Rest and recover to maximize gains.
                </li>
              </ul>

              <div className="text-end mt-4">
                <button className="text-white btn  btn-blue">
                  Explore More Tips
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
