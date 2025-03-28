import React, { useState, useEffect } from "react";

const ScheduleDay = ({ day, recurrence, onScheduleChange }) => {
  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    if (
      recurrence === "weekdays" &&
      ["mon", "tue", "wed", "thu", "fri"].includes(day.id)
    ) {
      setIsActive(true);
    } else if (recurrence === "weekends" && ["sat", "sun"].includes(day.id)) {
      setIsActive(true);
    } else if (recurrence === "daily") {
      setIsActive(true);
    }
  }, [recurrence, day.id]);

  useEffect(() => {
    if (startTime && endTime) {
      if (startTime >= endTime) {
        setTimeError("End time must be after start time");
      } else {
        setTimeError("");
        onScheduleChange(day.id, { startTime, endTime });
      }
    } else {
      setTimeError("");
    }
  }, [startTime, endTime, day.id, onScheduleChange]);

  const handleToggle = () => {
    const newActiveState = !isActive;
    setIsActive(newActiveState);

    if (!newActiveState) {
      setStartTime("");
      setEndTime("");
      onScheduleChange(day.id, { startTime: "", endTime: "" });
    }
  };

  return (
    <div
      className={`schedule-day-card mb-3 p-3 rounded ${
        isActive ? "active" : ""
      }`}
    >
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
            className={`form-check-label mb-0 ${
              isActive ? "fw-bold" : "text-muted"
            }`}
          >
            {day.label}
          </label>
        </div>

        {isActive && (
          <div className="d-flex flex-column flex-md-row gap-3">
            <div className="d-flex align-items-center gap-2">
              <label className="small">From</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="form-control form-control-sm"
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <label className="small">To</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                min={startTime}
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

export default ScheduleDay;
