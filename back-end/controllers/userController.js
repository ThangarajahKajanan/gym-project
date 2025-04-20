
const User = require("../models/User");
const mongoose = require("mongoose");

const getAllUsers = async (req, res) => {
    try {
      const response = await User.find({ role: "USER" });
        res.status(201).json({ message: "Retrieved all users successfully", data: response});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

const getUserCount = async (req, res) => {
    try {
      const count = await User.countDocuments({ role: "USER" });
      res.status(200).json({ 
        message: "User count retrieved successfully", 
        userCount: count 
      });
    } catch (error) {
      console.error("Error getting user count:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

  const dalateUser = async (req, res) => {
      try {
          const deletedUser = await User.findByIdAndDelete(req.params.id);
  
          if (!deletedUser) {
              return res.status(404).json({ message: "User not found" });
          }
  
          res.json({ message: "User deleted successfully", deletedUser });
      } catch (err) {
          console.error("Error deleting user:", err);
          res.status(500).json({ message: "Server Error" });
      }
  };
  
  module.exports = { 
    getAllUsers, 
    getUserCount,
    dalateUser
  };