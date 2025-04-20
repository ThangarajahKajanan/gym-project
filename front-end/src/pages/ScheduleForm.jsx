import React, { useState, useEffect } from "react";
import ScheduleDay from "./ScheduleDay";
import Swal from "sweetalert2";
import "../CSS/schedule-form.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ScheduleForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { editData } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [editSchedules, setEditSchedules] = useState({});
  const [membershipNames, setMembershipNames] = useState([]);
  const [trainers, setTrainer] = useState([]);

  const [isUpdated, setIsUpdated] = useState(false);
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    classType: "",
    membershipName: "",
    trainer: "",
    recurrence: "custom",
    schedules: {}
  });

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
      
      // Assuming response.data.data contains the actual names array
      setMembershipNames(response.data.data); 
      
      console.log("The membership names are:", response.data.data);
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
      
      // Extract trainer names from the response data
      const trainerNames = response.data.data.map((trainer) => trainer.trainerName); 
      
      setTrainer(trainerNames); // Set only the names as an array
      
      console.log("The Trainers names are:", trainerNames);
    } catch (error) {
      console.error("Error fetching trainers names:", error);
    }
  };
  


  useEffect(() => {
    if (editData) {
  
      setIsUpdated(true);
      
      // Initialize schedules object with all days
      const initialSchedules = {};
      daysOfWeek.forEach(day => {
        initialSchedules[day.id] = {
          startTime: "",
          endTime: "",
          status: false
        };
      });
  
      // Merge with editData's daySchedules if they exist
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

  const handleScheduleChange = (day, time) => {
    setFormData(prev => ({
      ...prev,
      schedules: {
        ...prev.schedules,
        [day]: time
      }
    }));
  };

  const handleClear = () => {
    setFormData({
      startDate: "",
      endDate: "",
      classType: "",
      membershipName: "",
      trainer: "",
      recurrence: "weekdays",
      schedules: {}
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    const { startDate, endDate, classType, membershipName,trainer, schedules } = formData;

    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!classType) newErrors.classType = "Class type is required"; 
    if (!membershipName) newErrors.membershipName = "Membership Name  is required"; 
    if (!trainer) newErrors.trainer = "Trainer Name  is required"; 

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.dateRange = "End date must be after start date";
    }

    const hasValidSchedule = Object.values(schedules).some(
      s => s.startTime && s.endTime && s.startTime < s.endTime
    );
    
    if (!hasValidSchedule) {
      newErrors.schedules = "At least one valid day schedule is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

/*   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
  
    const { startDate, endDate, classType, recurrence, schedules } = formData;
  
    const submissionData = {
      startDate,
      endDate,
      classType,
      recurrence,
      schedules: schedules,
    };
  
    console.log("Submitting:", submissionData);

    try {
      const response = await axios.post(`http://localhost:5100/api/create`, submissionData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Schedule created successfully!",
        confirmButtonColor: "#3085d6",
      });
      console.log("response", response.data)
      navigate('/manageschedules')
    } catch (error) {
      console.log("Error:", error);
    }

  }; */
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
  
    const { startDate, endDate, classType, membershipName, trainer, recurrence, schedules } = formData;

    console.log("the membershipName ", membershipName)
    console.log("the trainer ", trainer)
  
    // Filter out only active schedules
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
    

    console.log("sending data", submissionData)
  
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
      });
      
      navigate('/manageschedules');
      
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `An error occurred while ${isUpdated ? "updating" : "creating"} schedule`,
        confirmButtonColor: "#3085d6",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="schedule-form-container">
      <div className="container py-3">
        <div className="card shadow-lg">
          <div className="card-header text-white">
            <h4 className="mb-0">{isUpdated ? "Edit Schedule" : "Create New Schedule"}</h4>
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
                    <label htmlFor="endDate" className="form-label">
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

              {/* Class type */}
              <div className="mb-4">
                <h3 className="h5 mb-3">Class Type</h3>
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

              <div className="mb-4">
                <h3 className="h5 mb-3">Select Membership</h3>
                <select
                  id="membershipName"
                  name="membershipName"
                  onChange={handleInputChange}
                  value={formData.membershipName}
                  className="form-select"
                >
                  <option value="">Select Membership</option>
                  {(Array.isArray(membershipNames) ? membershipNames : []).map((name, idx) => (
                    <option key={idx} value={name}>{name}</option>
                  ))}
                </select>
                {errors.membershipName && (
                  <div membershipName="invalid-feedback">{errors.membershipName}</div>
                )}
              </div>



               
            <div className="mb-4">
              <h3 className="h5 mb-3">Trainer</h3>
              <select
                id="trainer"
                name="trainer"
                onChange={handleInputChange}
                value={formData.trainer}
                className="form-select"
              >
                <option value="">Select Trainer</option>
                {trainers?.map((name, idx) => (
                  <option key={idx} value={name}>{name}</option>
                ))}
              </select>
              {errors.trainer && (
                <div trainer="invalid-feedback">{errors.trainer}</div>
              )}
            </div>

 

              

              {/* Recurrence Pattern */}
              <div className="mb-4">
                <h3 className="h5 mb-3">Recurrence Pattern</h3>
                <select
                  id="recurrence"
                  name="recurrence"
                  value={formData.recurrence}
                  onChange={handleInputChange}
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
                  <span className="text-muted small">Select days and set times</span>
                </div>

                {errors.schedules && (
                  <div className="alert alert-danger">{errors.schedules}</div>
                )}

                <div className="schedule-days-container">
                  {daysOfWeek.map(day => (
                    <ScheduleDay
                      key={day.id}
                      day={day}
                      recurrence={formData.recurrence}
                      onScheduleChange={handleScheduleChange}
                      schedule={formData.schedules[day.id] || {}}
                      editSchedules = {editSchedules}
                      isEditMode={isUpdated}
                    />
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="text-center pt-3">
                <button type="submit" className="btn btn-success me-4">
                  {isUpdated ? "Update Schedule" : "Save Schedule"}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="btn btn-secondary me-4"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => { navigate('/manageschedules') }}
                  className="btn btn-danger"
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