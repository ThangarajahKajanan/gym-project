import { useState } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function ChatBot() {
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Check if any fields are missing
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
    // Validation for Age, Weight, and Height
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
      // Assuming height range from 0.5m to 2.5m
      Swal.fire(
        "Invalid Height",
        "Please enter a height between 0.5m and 2.5m.",
        "error"
      );
      return;
    }

    // Clear previous results when submitting again
    setMessages([
      { text: "Finding the best fitness type for you...", sender: "bot" },
    ]);

    // Convert to proper JSON structure
    const requestData = {
      ...formData,
      Age: Number(formData.Age),
      Height: Number(formData.Height),
      Weight: Number(formData.Weight),
      BMI: parseFloat((formData.Weight / formData.Height ** 2).toFixed(2)), // BMI Calculation
      Hypertension: formData.Hypertension || "No",
      Diabetes: formData.Diabetes || "No",
    };

    try {
      console.log(requestData);
      const response = await axios.post(
        "http://127.0.0.1:5001/predict",
        requestData
      );
      console.log("Response:", response.data); // Debugging

      // Get the response data (fitness type, exercises, and diet)
      const { fitness_type, exercises, diet } = response.data;

      setMessages((prev) => [
        ...prev,
        { text: `Based on your data, I recommend:`, sender: "bot" },
        { text: `Fitness Type: ${fitness_type}`, sender: "bot" },
        { text: `Exercises: ${exercises}`, sender: "bot" },
        { text: `Diet: ${diet}`, sender: "bot" },
      ]);

      // Clear form data after submission
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
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...messages,
        { text: "Something went wrong! Try again.", sender: "bot" },
      ]);
    }
  };

  const handleClear = () => {
    // Clear all form fields and messages
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
  };

  return (
    <div
      className="container bg-dark text-white p-4 rounded shadow   "
      style={{ maxWidth: "600px" }}
    >
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded ${
              msg.sender === "bot" ? "bg-primary" : "bg-secondary"
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
          className="form-select bg-dark text-white mb-2"
          value={formData.Sex}
        >
          <option value="" disabled>
            Select Gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          type="number"
          name="Age"
          placeholder="Age"
          onChange={handleChange}
          className="form-control bg-dark text-white mb-2"
          value={formData.Age}
        />
        <input
          type="number"
          name="Height"
          placeholder="Height (meters)"
          onChange={handleChange}
          className="form-control bg-dark text-white mb-2"
          value={formData.Height}
        />
        <input
          type="number"
          name="Weight"
          placeholder="Weight (kg)"
          onChange={handleChange}
          className="form-control bg-dark text-white mb-2"
          value={formData.Weight}
        />

        <select
          name="Level"
          onChange={handleChange}
          className="form-select bg-dark text-white mb-2"
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
          className="form-select bg-dark text-white mb-2"
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
        >
          Get Recommendation <FaPaperPlane className="ms-2" />
        </button>

        {/* Clear Button */}
        <button onClick={handleClear} className="btn btn-secondary w-100 mt-2">
          Clear All
        </button>
      </div>
    </div>
  );
}
