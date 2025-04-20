const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({

    startDate: {
        type: Date,
        required: true
      },
      
      endDate: {
        type: Date,
        required: true
      },
      
      classType: {
        type: String,
        enum: ['Yoga', 'Strength', 'Training', 'Cardio'],
        required: true
      },

      membershipName: {
        type: String,
        required: true
      },
      trainer: {
        type: String,
        required: true
      },


      recurrence: {
        type: String,
        enum: ['weekdays', 'weekends', 'daily', 'custom'],
        required: true
      },
      currentStatus: {
        type: Boolean,
        default: false
      },
      
    daySchedules: {
        type: Map,
        of: new mongoose.Schema({
        startTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/ // HH:MM format
        },
        endTime: {
            type: String,
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/ // HH:MM format
        },
        isActive: {
            type: Boolean,
            default: false
        }
        }),
        default: () => new Map()
    },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
      }
}, { timestamps: true });

module.exports = mongoose.model("Schedule", ScheduleSchema);
