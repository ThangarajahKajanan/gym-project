import React, { useState } from "react";
import ScheduleDay from "./ScheduleDay";
import "../CSS/schedule-form.css";
import Swal from "sweetalert2";

const ScheduleForm = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [recurrence, setRecurrence] = useState("weekdays");
  const [schedules, setSchedules] = useState({});
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    { id: "sun", label: "Sunday" },
    { id: "mon", label: "Monday" },
    { id: "tue", label: "Tuesday" },
    { id: "wed", label: "Wednesday" },
    { id: "thu", label: "Thursday" },
    { id: "fri", label: "Friday" },
    { id: "sat", label: "Saturday" },
  ];

  const handleScheduleChange = (day, time) => {
    setSchedules((prev) => ({
      ...prev,
      [day]: time,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.dateRange = "End date must be after start date";
    }

    const hasValidSchedule = Object.values(schedules).some(
      (s) => s.startTime && s.endTime
    );
    if (!hasValidSchedule)
      newErrors.schedules = "At least one day schedule is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitted Schedule:", {
        startDate,
        endDate,
        recurrence,
        schedules,
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Schedule created successfully!",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  return (
    <div className="schedule-form-container">
      <div className="container py-3">
        <div className="card shadow-lg">
          <div className="card-header text-white">
            <h4 className="mb-0">Create Your Schedule</h4>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* Date Range Section */}
              <div className="mb-4">
                <h3 className="h5 mb-3">Date Range</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={`form-control ${
                        errors.startDate ? "is-invalid" : ""
                      }`}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.startDate && (
                      <div className="invalid-feedback">{errors.startDate}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="endDate" className="form-label">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className={`form-control ${
                        errors.endDate ? "is-invalid" : ""
                      }`}
                      min={startDate || new Date().toISOString().split("T")[0]}
                    />
                    {errors.endDate && (
                      <div className="invalid-feedback">{errors.endDate}</div>
                    )}
                  </div>
                </div>
                {errors.dateRange && (
                  <div className="text-danger small mt-2">
                    {errors.dateRange}
                  </div>
                )}
              </div>

              {/* Recurrence Pattern */}
              <div className="mb-4">
                <h3 className="h5 mb-3">Recurrence Pattern</h3>
                <select
                  id="recurrence"
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value)}
                  className="form-select"
                >
                  <option value="weekdays">Weekdays (Monday-Friday)</option>
                  <option value="weekends">Weekends (Saturday-Sunday)</option>
                  <option value="daily">Daily</option>
                  <option value="custom">Custom Days</option>
                </select>
              </div>

              {/* Daily Schedules */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 mb-0">Daily Schedules</h3>
                  <span className="text-muted small">
                    Select days and set times
                  </span>
                </div>

                {errors.schedules && (
                  <div className="alert alert-danger">{errors.schedules}</div>
                )}

                <div className="schedule-days-container">
                  {daysOfWeek.map((day) => (
                    <ScheduleDay
                      key={day.id}
                      day={day}
                      recurrence={recurrence}
                      onScheduleChange={handleScheduleChange}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-3">
                <button
                  type="submit"
                  className="btn  btn-success btn-sm py-2 me-4"
                >
                  Save Schedule
                </button>
                <button type="submit" className="btn  btn-blue btn-sm py-2">
                  Clear Fields
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
