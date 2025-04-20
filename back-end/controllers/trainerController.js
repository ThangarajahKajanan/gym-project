const Trainer = require("../models/Trainer")
const mongoose = require("mongoose");

const createTrainer = async (req, res) => {
    try {
        const { trainerEmail, trainerName, trainerAge, trainerLocation, trainerExperience } = req.body;

        if (!trainerEmail || !trainerName || !trainerAge || !trainerLocation || !trainerExperience) {
            return res.status(400).json({ message: "All fields are required" });
        }

                let existingTrainer = await Trainer.findOne({ trainerEmail });
                let existingTrainerName = await Trainer.findOne({ trainerName });
        
                if (existingTrainer) return res.status(400).json({ message: "Trainer already exists" });
                if (existingTrainerName) return res.status(400).json({ message: "Username already exists" });

        const newTrainer = new Trainer({
            trainerEmail,
            trainerName,
            trainerAge,
            trainerLocation,
            trainerExperience,
        });

        const savedTrainer = await newTrainer.save();
        res.status(201).json(savedTrainer);
    } catch (err) {
        console.error("Error creating trainer:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

const getAllTrainersData = async (req, res) => {
    try {
      const trainers = await Trainer.find(); // This retrieves all trainer documents
      res.status(200).json({
        message: "Retrieved all trainers successfully",
        data: trainers
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve trainers",
        error: error.message
      });
    }
  };

const updateTrainer = async (req, res) => {
    try {
        const { trainerName, trainerAge, trainerLocation, trainerExperience } = req.body;

        const updatedTrainer = await Trainer.findByIdAndUpdate(
            req.params.id,
            {
                trainerName,
                trainerAge,
                trainerLocation,
                trainerExperience,
            },
            { new: true, runValidators: true }
        );

        if (!updatedTrainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        res.json(updatedTrainer);
    } catch (err) {
        console.error("Error updating trainer:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

const dalateTrainer = async (req, res) => {
    try {
        const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);

        if (!deletedTrainer) {
            return res.status(404).json({ message: "Trainer not found" });
        }

        res.json({ message: "Trainer deleted successfully", deletedTrainer });
    } catch (err) {
        console.error("Error deleting trainer:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


const getNames = async (req, res) => {
    try {
        const trainers = await Trainer.find({}, { trainerName: 1, _id: 0 }); 
        res.status(200).json({
            message: "Retrieved all trainers names successfully",
            data: trainers
          });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve trainer names", error });
    }

}

const getTrainerCount = async (req, res) => {
    try {
      const count = await Trainer.countDocuments(); 
      res.status(200).json({ 
        message: "trainer count retrieved successfully", 
        trainerCount: count 
      });
    } catch (error) {
      console.error("Error getting trainer count:", error);
      res.status(500).json({ message: "Server error", error });
    }
  };

module.exports = { createTrainer, updateTrainer , dalateTrainer, getNames, getAllTrainersData, getTrainerCount};
