const express = require("express");
const { createTrainer, updateTrainer, dalateTrainer, getNames , getAllTrainersData, getTrainerCount} = require("../controllers/trainerController");
const { protect } = require("../middleware/authMiddleware"); 
const router = express.Router();

router.post("/createTrainer", protect, createTrainer);  
router.put("/updateTrainer/:id", protect, updateTrainer); 
router.delete("/deleteTrainer/:id",protect, dalateTrainer); 
router.get("/getTrainerNames",protect, getNames); 
router.get("/getAllTrainers",protect, getAllTrainersData); 
router.get("/getTrainerCount",protect, getTrainerCount); 



module.exports = router;
