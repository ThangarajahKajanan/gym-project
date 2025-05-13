/* import React, { useState, useEffect } from "react";

const ScheduleDay = ({ day, recurrence, onScheduleChange, schedule, isEditMode }) => {
  const [isActive, setIsActive] = useState(schedule.status || false);
  const [times, setTimes] = useState({
    startTime: schedule.startTime || "",
    endTime: schedule.endTime || ""
  });
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      setIsActive(schedule.status || false);
      setTimes({
        startTime: schedule.startTime || "",
        endTime: schedule.endTime || ""
      });
    }
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) {
      let active = false;
      switch (recurrence) {
        case "weekdays":
          active = ["mon", "tue", "wed", "thu", "fri"].includes(day.id);
          break;
        case "weekends":
          active = ["sat", "sun"].includes(day.id);
          break;
        case "daily":
          active = true;
          break;
        case "custom":
        default:
      }
      if (active !== isActive) {
        setIsActive(active);
      }
    }
  }, [recurrence, day.id, isEditMode]);

  useEffect(() => {
    if (isActive && times.startTime && times.endTime) {
      if (times.startTime >= times.endTime) {
        setTimeError("End time must be after start time");
      } else {
        setTimeError("");
      }
    }
  }, [times, isActive]);

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const newTimes = {
      ...times,
      [name]: value
    };
    setTimes(newTimes);
    
    if (isActive && newTimes.startTime && newTimes.endTime && newTimes.startTime < newTimes.endTime) {
      onScheduleChange(day.id, {
        ...newTimes,
        status: true
      });
    }
  };

  const handleToggle = () => {
    const newActive = !isActive;
    setIsActive(newActive);
    
    if (!newActive) {
      const resetTimes = { startTime: "", endTime: "" };
      setTimes(resetTimes);
      onScheduleChange(day.id, {
        ...resetTimes,
        status: false
      });
    } else {
      const newTimes = {
        startTime: times.startTime || "08:00",
        endTime: times.endTime || "09:00"
      };
      setTimes(newTimes);
      onScheduleChange(day.id, {
        ...newTimes,
        status: true
      });
    }
  };

  return (
    <div className={`schedule-day-card mb-3 p-3 rounded ${isActive ? "active" : ""}`}>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={isActive}
              onChange={handleToggle}
              id={`switch-${day.id}`}
            />
          </div>
          <label
            htmlFor={`switch-${day.id}`}
            className={`form-check-label mb-0 ${isActive ? "fw-bold text-primary" : "text-muted"}`}
          >
            {day.label}
          </label>
        </div>

        {isActive && (
          <div className="d-flex flex-column flex-md-row gap-3">
            <div className="d-flex align-items-center gap-2">
              <label className="small ">From</label>
              <input
                type="time"
                name="startTime"
                value={times.startTime}
                onChange={handleTimeChange}
                className="form-control form-control-sm"
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="small text-muted">To</label>
              <input
                type="time"
                name="endTime"
                value={times.endTime}
                onChange={handleTimeChange}
                min={times.startTime}
                className="form-control form-control-sm"
              />
            </div>
          </div>
        )}
      </div>

      {isActive && timeError && (
        <div className="text-danger small mt-2">{timeError}</div>
      )}
    </div>
  );
};

export default ScheduleDay; */