const express = require("express");
const { createSchedule, getAllSchedules, editSchedule, deleteSchedule, 
    changeStatus, changeDayScheduleStatus, getScheduleStatusCounts, getAllSchedulesByAdmin, getScheduleStatusCountByUser } = require("../controllers/scheduleController");
const { protect } = require("../middleware/authMiddleware"); 
const router = express.Router();



router.post("/create", protect, createSchedule);
router.get("/get", protect,  getAllSchedules);
router.get("/getAll", protect,  getAllSchedulesByAdmin);
router.put("/updateSchedule/:id", protect, editSchedule);
router.delete("/deleteSchedule/:id", protect, deleteSchedule);
router.put("/updateStatus/:id", protect, changeStatus);
router.put("/updateDayStatus/:dayId", protect, changeDayScheduleStatus);
router.get("/getStatusCount", protect, getScheduleStatusCounts);
router.get("/getStatusCountByUser", protect, getScheduleStatusCountByUser);


module.exports = router;
