const mongoose = require("mongoose");

const TrainerSchema = new mongoose.Schema({
    trainerEmail: {
        type: String,
        required: true,
    },
    trainerName: {
        type: String,
        required: true,
    },
    trainerAge: {
        type: Number,
        required: true,
    },
    trainerLocation: {
        type: String,
        required: true,
    },
    trainerExperience: {
        type: Number,
        required: true,
        min: 0,
        max: 80,
    },
});

module.exports = mongoose.model("Trainer", TrainerSchema);
