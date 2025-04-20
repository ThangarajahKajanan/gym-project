const Schedule = require("../models/Schedule")
const mongoose = require("mongoose");

const createSchedule = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { startDate, endDate, classType, membershipName, trainer, recurrence, schedules, currentStatus } = req.body;

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const daySchedules = new Map();
    for (const [day, time] of Object.entries(schedules)) {
      if (time.startTime && time.endTime) {
        if (time.startTime >= time.endTime) {
          return res.status(400).json({ 
            error: `End time must be after start time for ${day}` 
          });
        }
        
        daySchedules.set(day, {
          startTime: time.startTime,
          endTime: time.endTime,
          isActive: true
        });
      }
    }

    // Validate at least one day is selected
    if (daySchedules.size === 0) {
      return res.status(400).json({ error: 'At least one day schedule is required' });
    }

    // Create the new schedule
    const newSchedule = new Schedule({
      startDate,
      endDate,
      classType,
      membershipName,
      trainer,
      recurrence,
      currentStatus,
      daySchedules,
      createdBy: userId  // <-- fixed here
    });

    await newSchedule.save();

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule: {
        ...newSchedule.toObject(),
        daySchedules: Object.fromEntries(newSchedule.daySchedules)
      }
    });
  } catch (error) {
    console.error('Error creating schedule:', error);
    res.status(500).json({ error: 'Server error while creating schedule' });
  }
};

const getAllSchedulesByAdmin = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate({
        path: 'createdBy',
        select: 'name username' 
      })
      .lean();

      const formattedSchedules = schedules.map(schedule => {
      let daySchedules = schedule.daySchedules;

      if (daySchedules instanceof Map || typeof daySchedules?.entries === 'function') {
        daySchedules = Object.fromEntries(daySchedules);
      }

      return {
        _id: schedule._id,
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        classType: schedule.classType,
        membershipName: schedule.membershipName,
        trainer: schedule.trainer,
        recurrence: schedule.recurrence,
        currentStatus: schedule.currentStatus,
        daySchedules: daySchedules,
        createdBy: schedule.createdBy?._id || null,            
        createdByName: schedule.createdBy?.name || null,       
        createdByUsername: schedule.createdBy?.username || null,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      };
    });

    res.status(200).json({
      message: "Schedules fetched successfully",
      data: formattedSchedules
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Server error while fetching schedules" });
  }
};


const getAllSchedules = async (req, res) => {
  const userId = req.user.id; 
  try {
    const schedules = await Schedule.find({ createdBy: userId }).lean();
    
    if (!schedules.length) {
      return res.status(404).json({ message: "No schedules found for this user" });
  }

    const formattedSchedules = schedules.map(schedule => {
      let daySchedules = schedule.daySchedules;
      if (daySchedules instanceof Map || typeof daySchedules?.entries === 'function') {
        daySchedules = Object.fromEntries(daySchedules);
      }

      return {
        ...schedule,
        daySchedules
      };
    });

    res.status(200).json({
      message: "Schedules fetched successfully",
      data: formattedSchedules
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Server error while fetching schedules" });
  }
};

const editSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, classType, membershipName, trainer, recurrence, schedules } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid schedule ID" });
    }

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // Validate dates
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "End date must be after start date" });
    }

    if (!schedules || typeof schedules !== "object") {
      return res.status(400).json({ error: "Invalid or missing schedules" });
    }

    // Construct new daySchedules Map
    const newDaySchedules = new Map();
    for (const [day, time] of Object.entries(schedules)) {
      if (time.startTime && time.endTime) {
        if (time.startTime >= time.endTime) {
          return res.status(400).json({
            error: `End time must be after start time for ${day}`,
          });
        }

        newDaySchedules.set(day, {
          startTime: time.startTime,
          endTime: time.endTime,
          isActive: time.isActive !== undefined ? time.isActive : true,
        });
      }
    }

    if (newDaySchedules.size === 0) {
      return res.status(400).json({ error: "At least one schedule is required" });
    }

    // Update schedule fields
    schedule.startDate = startDate;
    schedule.endDate = endDate;
    schedule.classType = classType;
    schedule.membershipName = membershipName,
    schedule.trainer = trainer,
    schedule.recurrence = recurrence;
    schedule.daySchedules = newDaySchedules;

    await schedule.save();

    res.status(200).json({
      message: "Schedule updated successfully",
      schedule: {
        ...schedule.toObject(),
        daySchedules: Object.fromEntries(schedule.daySchedules),
      },
    });

  } catch (error) {
    console.error("Error updating schedule:", error);
    res.status(500).json({ error: "Server error while updating schedule" });
  }
};

const deleteSchedule = async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid schedule ID" });
      }
  
      const deletedSchedule = await Schedule.findByIdAndDelete(id);
  
      if (!deletedSchedule) {
        return res.status(404).json({ error: "Schedule not found" });
      }
  
      res.status(200).json({
        message: "Schedule deleted successfully",
        schedule: {
          ...deletedSchedule.toObject(),
          daySchedules: Object.fromEntries(deletedSchedule.daySchedules)
        }
      });
    } catch (error) {
      console.error("Error deleting schedule:", error);
      res.status(500).json({ error: "Server error while deleting schedule" });
    }
}

const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentStatus } = req.body;

    if (typeof currentStatus !== 'boolean') {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find and update the schedule
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      { currentStatus },
      { new: true } 
    );

    if (!updatedSchedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json({
      message: 'Schedule status updated successfully',
      data: updatedSchedule
    });
  } catch (error) {
    console.error('Error updating schedule status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const changeDayScheduleStatus = async (req, res) => {
  try {
    const { dayId } = req.params; 
    const { isActive } = req.body;

    
    const schedules = await Schedule.find(); 

    let targetSchedule = null;
    let targetKey = null;

    for (const schedule of schedules) {
      for (const [key, value] of schedule.daySchedules.entries()) {
        if (value._id?.toString() === dayId) {
          targetSchedule = schedule;
          targetKey = key;
          break;
        }
      }
      if (targetSchedule) break;
    }

    if (!targetSchedule || !targetKey) {
      return res.status(404).json({ message: "Schedule or day not found" });
    }

    // Update the isActive value
    targetSchedule.daySchedules.get(targetKey).isActive = isActive;
    await targetSchedule.save();

    res.status(200).json({
      message: `Day schedule (${targetKey}) updated successfully`,
      schedule: targetSchedule,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getScheduleStatusCounts = async (req, res) => {
  try {
    const statusCounts = await Schedule.aggregate([
      {
        $group: {
          _id: "$currentStatus", 
          count: { $sum: 1 }    
        }
      }
    ]);

    const result = {
      true: 0,
      false: 0
    };
    statusCounts.forEach(item => {
      result[item._id] = item.count;
    });

    res.status(200).json({
      message: "Schedule status counts retrieved successfully",
      counts: result
    });

  } catch (error) {
    console.error('Error fetching schedule status counts:', error);
    res.status(500).json({ error: 'Server error while fetching schedule status counts' });
  }
};

const getScheduleStatusCountByUser = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.id); 

  try {
    const statusCounts = await Schedule.aggregate([
      {
        $match: { createdBy: userId } 
      },
      {
        $group: {
          _id: "$currentStatus", 
          count: { $sum: 1 }    
        }
      }
    ]);

    const result = {
      true: 0,
      false: 0
    };
    
    statusCounts.forEach(item => {
      if (item._id === true || item._id === false) {
        result[item._id] = item.count;
      }
    });

    res.status(200).json({
      message: "Schedule status counts retrieved successfully",
      counts: result
    });

  } catch (error) {
    console.error('Error fetching schedule status counts:', error);
    res.status(500).json({ error: 'Server error while fetching schedule status counts' });
  }
};

module.exports = { createSchedule, getAllSchedules, editSchedule,
   deleteSchedule, changeStatus, changeDayScheduleStatus, getScheduleStatusCounts, 
   getAllSchedulesByAdmin, getScheduleStatusCountByUser };
