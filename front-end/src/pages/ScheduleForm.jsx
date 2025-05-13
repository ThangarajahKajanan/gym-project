import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../CSS/schedule-form.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ScheduleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { editData } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [membershipNames, setMembershipNames] = useState([]);
  const [trainers, setTrainer] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const token = localStorage.getItem('token');

  const daysOfWeek = [
    { id: "sun", label: "Sunday" },
    { id: "mon", label: "Monday" },
    { id: "tue", label: "Tuesday" },
    { id: "wed", label: "Wednesday" },
    { id: "thu", label: "Thursday" },
    { id: "fri", label: "Friday" },
    { id: "sat", label: "Saturday" },
  ];

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    classType: "",
    membershipName: "",
    trainer: "",
    recurrence: "",
    schedules: {}
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    getAllMembershipNames();
    getAllTrainers();
  }, []);
  
  const getAllMembershipNames = async () => {
    try {
      const response = await axios.get('http://localhost:5100/api/getAllMembershipNames', {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });
      setMembershipNames(response.data.data); 
    } catch (error) {
      console.error("Error fetching membership names:", error);
    }
  };
  
  const getAllTrainers = async () => {
    try {
      const response = await axios.get('http://localhost:5100/api/getTrainerNames', {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });
      const trainerNames = response.data.data.map((trainer) => trainer.trainerName); 
      setTrainer(trainerNames);
    } catch (error) {
      console.error("Error fetching trainers names:", error);
    }
  };

  useEffect(() => {
    if (editData) {
      setIsUpdated(true);
      
      const initialSchedules = {};
      daysOfWeek.forEach(day => {
        initialSchedules[day.id] = {
          startTime: "",
          endTime: "",
          status: false
        };
      });
  
      if (editData.daySchedules) {
        Object.keys(editData.daySchedules).forEach(day => {
          if (editData.daySchedules[day]) {
            initialSchedules[day] = {
              startTime: editData.daySchedules[day].startTime || "",
              endTime: editData.daySchedules[day].endTime || "",
              status: editData.daySchedules[day].isActive || false
            };
          }
        });
      }
  
      setFormData({
        startDate: editData.startDate.split('T')[0],
        endDate: editData.endDate.split('T')[0],
        classType: editData.classType,
        membershipName: editData.membershipName,
        trainer: editData.trainer,
        recurrence: editData.recurrence,
        schedules: initialSchedules
      });
    }
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecurrenceChange = (e) => {
    const value = e.target.value;
    const newSchedules = {...formData.schedules};
    
    daysOfWeek.forEach(day => {
      let shouldBeActive = false;
      
      switch(value) {
        case "weekdays":
          shouldBeActive = ["mon", "tue", "wed", "thu", "fri"].includes(day.id);
          break;
        case "weekends":
          shouldBeActive = ["sat", "sun"].includes(day.id);
          break;
        case "daily":
          shouldBeActive = true;
          break;
        case "custom":
          shouldBeActive = newSchedules[day.id]?.status || false;
          break;
        default:
          shouldBeActive = false;
      }
      
      newSchedules[day.id] = {
        ...(newSchedules[day.id] || {}),
        status: shouldBeActive,
        startTime: newSchedules[day.id]?.startTime || "08:00",
        endTime: newSchedules[day.id]?.endTime || "09:00"
      };
    });
    
    setFormData(prev => ({
      ...prev,
      recurrence: value,
      schedules: newSchedules
    }));
  };

  const handleScheduleToggle = (dayId) => {
    const newSchedules = {...formData.schedules};
    const newStatus = !newSchedules[dayId]?.status;
    
    newSchedules[dayId] = {
      ...(newSchedules[dayId] || {}),
      status: newStatus,
      startTime: newSchedules[dayId]?.startTime || "08:00",
      endTime: newSchedules[dayId]?.endTime || "09:00"
    };
    
    setFormData(prev => ({
      ...prev,
      schedules: newSchedules
    }));
  };

  const handleTimeChange = (dayId, field, value) => {
    const newSchedules = {...formData.schedules};
    
    newSchedules[dayId] = {
      ...(newSchedules[dayId] || {}),
      [field]: value,
      status: true
    };
    
    setFormData(prev => ({
      ...prev,
      schedules: newSchedules
    }));
  };

  const handleClear = () => {
    setFormData({
      startDate: "",
      endDate: "",
      classType: "",
      membershipName: "",
      trainer: "",
      recurrence: "",
      schedules: {}
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const { startDate, endDate, classType, membershipName, trainer, schedules } = formData;

    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!classType) newErrors.classType = "Class type is required"; 
    if (!membershipName) newErrors.membershipName = "Membership Name is required"; 
    if (!trainer) newErrors.trainer = "Trainer Name is required"; 

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.dateRange = "End date must be after start date";
    }

    const hasValidSchedule = Object.values(schedules).some(
      s => s.status && s.startTime && s.endTime && s.startTime < s.endTime
    );
    
    if (!hasValidSchedule) {
      newErrors.schedules = "At least one valid day schedule is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.recurrence) {
      Swal.fire({
        icon: "error",
        title: "Required!",
        text: "Please select the Recurrence Pattern",
        confirmButtonColor: "#3085d6",
        background: 'rgba(255, 255, 255, 0.9)',
      });
      setIsLoading(false);
      return;
    }

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
  
    const { startDate, endDate, classType, membershipName, trainer, recurrence, schedules } = formData;
  
    const activeSchedules = Object.keys(schedules).reduce((acc, day) => {
      if (schedules[day].status) {
        acc[day] = {
          startTime: schedules[day].startTime,
          endTime: schedules[day].endTime,
        };
      }
      return acc;
    }, {});


  
    const submissionData = {
      startDate,
      endDate,
      classType,
      membershipName,
      trainer,
      recurrence,
      schedules: activeSchedules
    };
    
    try {
      const endpoint = isUpdated 
        ? `http://localhost:5100/api/updateSchedule/${editData._id}`
        : "http://localhost:5100/api/create";
      
      const method = isUpdated ? "put" : "post";
  
      const response = await axios[method](endpoint, submissionData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: isUpdated ? "Schedule updated successfully!" : "Schedule created successfully!",
        confirmButtonColor: "#3085d6",
        background: 'rgba(255, 255, 255, 0.9)',
      });
      
      navigate('/manageschedules');
      
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `An error occurred while ${isUpdated ? "updating" : "creating"} schedule`,
        confirmButtonColor: "#3085d6",
        background: 'rgba(255, 255, 255, 0.9)'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredDays = () => {
    switch(formData.recurrence) {
      case "weekdays":
        return daysOfWeek.filter(day => ["mon", "tue", "wed", "thu", "fri"].includes(day.id));
      case "weekends":
        return daysOfWeek.filter(day => ["sat", "sun"].includes(day.id));
      case "daily":
        return daysOfWeek;
      case "custom":
        return daysOfWeek;
      default:
        return [];
    }
  };

  return (
    <div className="schedule-form-container">
      <div className="container py-3">
        <div className="card shadow-lg">
          <div className="card-header">
            <h4 className="mb-0">{isUpdated ? "Edit Schedule" : "Create New Schedule"}</h4>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* Date Range Section */}
              <div className="mb-4">
                <h3 className="h5 mb-3 text-white">Date Range</h3>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label text-white">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.startDate && (
                      <div className="invalid-feedback">{errors.startDate}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="endDate" className="form-label text-white">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                      min={formData.startDate || new Date().toISOString().split("T")[0]}
                    />
                    {errors.endDate && (
                      <div className="invalid-feedback">{errors.endDate}</div>
                    )}
                  </div>
                </div>
                {errors.dateRange && (
                  <div className="text-danger small mt-2">{errors.dateRange}</div>
                )}
              </div>

              {/* Grouped Dropdowns */}
              <div className="dropdown-group">
                <div className="form-group">
                  <label htmlFor="classType" className="form-label text-white">
                    Class Type <span className="text-danger">*</span>
                  </label>
                  <select
                    id="classType"
                    name="classType"
                    value={formData.classType}
                    onChange={handleInputChange}
                    className={`form-select ${errors.classType ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Class Type</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Strength">Strength</option>
                    <option value="Training">Training</option>
                    <option value="Cardio">Cardio</option>
                  </select>
                  {errors.classType && (
                    <div className="invalid-feedback">{errors.classType}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="membershipName" className="form-label text-white">
                    Membership <span className="text-danger">*</span>
                  </label>
                  <select
                    id="membershipName"
                    name="membershipName"
                    onChange={handleInputChange}
                    value={formData.membershipName}
                    className={`form-select ${errors.membershipName ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Membership</option>
                    {(Array.isArray(membershipNames) ? membershipNames : []).map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    ))}
                  </select>
                  {errors.membershipName && (
                    <div className="invalid-feedback">{errors.membershipName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="trainer" className="form-label text-white">
                    Trainer <span className="text-danger">*</span>
                  </label>
                  <select
                    id="trainer"
                    name="trainer"
                    onChange={handleInputChange}
                    value={formData.trainer}
                    className={`form-select ${errors.trainer ? "is-invalid" : ""}`}
                  >
                    <option value="">Select Trainer</option>
                    {trainers?.map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    ))}
                  </select>
                  {errors.trainer && (
                    <div className="invalid-feedback">{errors.trainer}</div>
                  )}
                </div>
              </div>

              {/* Recurrence Pattern */}
              <div className="mb-4">
                <h3 className="h5 mb-3 text-white">Recurrence Pattern</h3>
                <select
                  id="recurrence"
                  name="recurrence"
                  value={formData.recurrence}
                  onChange={handleRecurrenceChange}
                  className="form-select"
                >
                  <option value="">Select One</option>
                  <option value="weekdays">Weekdays (Monday-Friday)</option>
                  <option value="weekends">Weekends (Saturday-Sunday)</option>
                  <option value="daily">Daily</option>
                  <option value="custom">Custom Days</option>
                </select>

                {
                  formData.recurrence && 
                  <div className="recurrence-display mt-3">
                  <h5>Selected Days:</h5>
                  <div className="day-selection">
                    {getFilteredDays().map(day => (
                      <span 
                        key={day.id} 
                        className={`day-pill ${
                          formData.schedules[day.id]?.status ? "active" : ""
                        }`}
                      >
                        {day.label}
                      </span>
                    ))}
                  </div>
                </div>
                }


              </div>

              {/* Daily Schedules */}
              {
                formData.recurrence && 
                <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="h5 mb-0 text-white">Daily Schedules</h3>
                  {formData.recurrence === "custom" && (
                    <span className="text-white small">Toggle days and set times</span>
                  )}
                </div>

                {errors.schedules && (
                  <div className="alert alert-danger"  style={{
                    backgroundColor: 'white',
                    color: '#721c24',
                    borderColor: '#f5c6cb'
                  }}>{errors.schedules}</div>
                )}

                <div className="schedule-days-container">
                  {getFilteredDays().map(day => (
                    <div 
                      key={day.id} 
                      className={`schedule-day-card mb-3 p-3 rounded ${
                        formData.schedules[day.id]?.status ? "active" : ""
                      }`}
                    >
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              checked={formData.schedules[day.id]?.status || false}
                              onChange={() => handleScheduleToggle(day.id)}
                              id={`switch-${day.id}`}
                              disabled={formData.recurrence !== "custom"}
                            />
                          </div>
                          <label
                            htmlFor={`switch-${day.id}`}
                            className={`form-check-label mb-0 ${
                              formData.schedules[day.id]?.status ? "fw-bold text-primary" : "text-muted"
                            }`}
                          >
                            {day.label}
                          </label>
                        </div>

                        {formData.schedules[day.id]?.status && (
                          <div className="d-flex flex-column flex-md-row gap-3">
                            <div className="d-flex align-items-center gap-2">
                              <label className="small " style={{ color: '#ffffff' }}>From</label>
                              <input
                                type="time"
                                value={formData.schedules[day.id]?.startTime || "08:00"}
                                onChange={(e) => handleTimeChange(day.id, "startTime", e.target.value)}
                                className="form-control form-control-sm"
                              />
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <label className="small " style={{ color: '#ffffff' }}>To</label>
                              <input
                                type="time"
                                value={formData.schedules[day.id]?.endTime || "09:00"}
                                onChange={(e) => handleTimeChange(day.id, "endTime", e.target.value)}
                                min={formData.schedules[day.id]?.startTime || "08:00"}
                                className="form-control form-control-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                </div>

              }

              {/* Form Actions */}
              <div className="text-center pt-3">
                <button 
                  type="submit" 
                  className="btn btn-success me-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : isUpdated ? (
                    "Update Schedule"
                  ) : (
                    "Save Schedule"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn btn-secondary me-4"
                  disabled={isLoading}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => { navigate('/manageschedules') }}
                  className="btn btn-danger"
                  disabled={isLoading}
                >
                  Close
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