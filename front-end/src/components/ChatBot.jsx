import { useState, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import "../CSS/gymBot.css";
import img1 from "../images/gym-profile.jpg";
import img2 from "../images/bg2.jpg";
import img3 from "../images/bg3.jpg";
import { ClipLoader } from "react-spinners";

const backgrounds = [img3, img2, img1];

export default function ChatBot() {
  const [isLoading, setIsLoading] = useState(true); // Add this
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [messages, setMessages] = useState([
    {
      text: "Hi! Tell me about yourself, and I'll recommend a fitness type.",
      sender: "bot",
    },
  ]);
  const [formData, setFormData] = useState({
    Sex: "",
    Age: "",
    Height: "",
    Weight: "",
    Hypertension: "",
    Diabetes: "",
    BMI: "",
    Level: "",
    FitnessGoal: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          color: "white",
        }}
      >
        <ClipLoader color="#36d7b7" size={50} />
        <h3 style={{ marginLeft: "10px" }}>Loading GymBot...</h3>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (
      !formData.Sex ||
      !formData.Age ||
      !formData.Height ||
      !formData.Weight ||
      !formData.Level ||
      !formData.FitnessGoal
    ) {
      Swal.fire("Missing Information", "Please fill in all fields.", "warning");
      return;
    }

    if (formData.Age < 18 || formData.Age > 100) {
      Swal.fire(
        "Invalid Age",
        "Please enter an age between 18 and 100.",
        "error"
      );
      return;
    }

    if (formData.Weight < 30 || formData.Weight > 250) {
      Swal.fire(
        "Invalid Weight",
        "Please enter a weight between 30kg and 250kg.",
        "error"
      );
      return;
    }

    if (formData.Height < 0.5 || formData.Height > 2.5) {
      Swal.fire(
        "Invalid Height",
        "Please enter a height between 0.5m and 2.5m.",
        "error"
      );
      return;
    }

    // First filter out any previous "Finding..." or recommendation messages
    setMessages((prev) => [
      ...prev.filter(
        (msg) =>
          msg.text !== "Finding the best fitness type for you..." &&
          !msg.text.includes("Your fitness recommendation is ready!")
      ),
      { text: "Finding the best fitness type for you...", sender: "bot" },
    ]);

    setMessages([
      ...messages,
      { text: "Finding the best fitness type for you...", sender: "bot" },
    ]);
    setLoading(true);

    setTimeout(async () => {
      const requestData = {
        ...formData,
        Age: Number(formData.Age),
        Height: Number(formData.Height),
        Weight: Number(formData.Weight),
        BMI: parseFloat((formData.Weight / formData.Height ** 2).toFixed(2)),
        Hypertension: formData.Hypertension || "No",
        Diabetes: formData.Diabetes || "No",
      };

      try {
        const response = await axios.post(
          "http://127.0.0.1:5001/predict",
          requestData
        );
        const { fitness_type, exercises, diet } = response.data;

        // Set the recommendation data for the modal
        setRecommendation({
          fitnessType: fitness_type,
          exercises: exercises.split(","),
          diet: diet.split(";"),
        });

        // Open the modal
        setModalOpen(true);

        // Clear form data
        setFormData({
          Sex: "",
          Age: "",
          Height: "",
          Weight: "",
          Hypertension: "",
          Diabetes: "",
          BMI: "",
          Level: "",
          FitnessGoal: "",
        });

        // Add a message that recommendation is ready
        /*         setMessages(prev => [
          ...prev.filter(msg => msg.text !== "Finding the best fitness type for you..."),
          { text: "Your fitness recommendation is ready! Click 'Show Recommendation' to view it.", sender: "bot" }
        ]);
 */
        // Filter out any previous messages and add the new one
        setMessages((prev) => [
          ...prev.filter(
            (msg) =>
              msg.text !== "Finding the best fitness type for you..." &&
              !msg.text.includes("Your fitness recommendation is ready!")
          ),
          {
            text: "Your fitness recommendation is ready! Click 'Show Recommendation' to view it.",
            sender: "bot",
          },
        ]);
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev.filter(
            (msg) => msg.text !== "Finding the best fitness type for you..."
          ),
          { text: "Something went wrong! Try again.", sender: "bot" },
        ]);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleClear = () => {
    setFormData({
      Sex: "",
      Age: "",
      Height: "",
      Weight: "",
      Hypertension: "",
      Diabetes: "",
      BMI: "",
      Level: "",
      FitnessGoal: "",
    });
    setMessages([
      {
        text: "Hi! Tell me about yourself, and I'll recommend a fitness type.",
        sender: "bot",
      },
    ]);
    setRecommendation(null);
  };

  return (
    <div
      className="chatbot-bg"
      style={{
        backgroundImage: `url(${backgrounds[bgIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <div className="glass-card">
        <div className="mb-4 chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.sender === "bot" ? "bot-message" : "user-message"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="form-group">
          <select
            name="Sex"
            onChange={handleChange}
            className="form-control mb-3"
            value={formData.Sex}
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input
            type="text"
            name="Age"
            placeholder="Age"
            className="form-control mb-3"
            value={formData.Age}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleChange(e);
              }
            }}
          />

          <input
            type="text"
            name="Height"
            placeholder="Height (meters)"
            className="form-control mb-3"
            value={formData.Height}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                handleChange(e);
              }
            }}
          />

          <input
            type="text"
            name="Weight"
            placeholder="Weight (kg)"
            className="form-control mb-3"
            value={formData.Weight}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*\.?\d*$/.test(value)) {
                handleChange(e);
              }
            }}
          />

          <select
            name="Level"
            onChange={handleChange}
            className="form-control mb-3"
            value={formData.Level}
          >
            <option value="" disabled>
              Select Level
            </option>
            <option value="Underweight">Underweight</option>
            <option value="Normal">Normal</option>
            <option value="Overweight">Overweight</option>
            <option value="Obese">Obese</option>
          </select>

          <select
            name="FitnessGoal"
            onChange={handleChange}
            className="form-control mb-3"
            value={formData.FitnessGoal}
          >
            <option value="" disabled>
              Select Goal
            </option>
            <option value="Weight Gain">Weight Gain</option>
            <option value="Weight Loss">Weight Loss</option>
          </select>

          <button
            onClick={handleSubmit}
            className="btn btn-primary w-100 mt-2 d-flex justify-content-center align-items-center"
            disabled={loading}
          >
            {loading ? (
              <span className="d-flex align-items-center">
                <ClipLoader color="#fff" size={20} className="me-2" />
                Preparing result...
              </span>
            ) : (
              <span>
                Get Recommendation
                <FaPaperPlane className="ms-2" />
              </span>
            )}
          </button>

          <button
            onClick={handleClear}
            className="btn btn-secondary w-100 mt-2"
          >
            Clear All
          </button>

          {recommendation && (
            <button
              onClick={() => setModalOpen(true)}
              className="btn btn-success w-100 mt-2"
            >
              Show Recommendation
            </button>
          )}
        </div>
      </div>

      {/* Recommendation Modal */}
      {isModalOpen && recommendation && (
        <div className="modal-overlay">
          <div className="gym-modal-content">
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              &times;
            </button>

            <h3 className="modal-title">🏋️ Your Fitness Recommendation</h3>

            <div className="modal-section">
              <h4>Fitness Type:</h4>
              <p className="fitness-type">{recommendation.fitnessType}</p>
            </div>

            <div className="modal-section">
              <h4>💪 Recommended Exercises:</h4>
              <ul className="exercise-list">
                {recommendation.exercises.map((exercise, idx) => (
                  <li key={idx}>{exercise.trim()}</li>
                ))}
              </ul>
            </div>

            <div className="modal-section">
              <h4>🍎 Dietary Suggestions:</h4>
              <ul className="diet-list">
                {recommendation.diet.map((item, idx) => (
                  <li key={idx}>{item.trim()}</li>
                ))}
              </ul>
            </div>

            <button
              className="modal-button"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
