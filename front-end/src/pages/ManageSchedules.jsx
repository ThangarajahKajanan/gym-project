import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DaySchedulesTable from "./DaySchedulesTable";
import '../CSS/daySchedule.css';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from "jspdf-autotable";

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [filter, setFilter] = useState("all"); // "all", "completed", "not-completed"
  const [editSchedule, setEditSchedule] = useState(null);
  const [updatedSchedule, setUpdatedSchedule] = useState({});
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [daySchedules, setDaySchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem('token'); 
  const userRole = localStorage.getItem("userRole");

  const [searchDate, setSearchDate] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    console.log("Component mounted. Fetching schedules...");

    if(userRole === 'USER'){
      getSchedules();
    }else{
      getAllSchedules();
    }

  }, []);

  // Admin call
  const getAllSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5100/api/getAll', {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });
      setSchedules(response.data.data);
      console.log("The schedules are", response.data.data);
  
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

 // user call
  const getSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5100/api/get', {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });
      setSchedules(response.data.data);
      console.log("The schedules are", response.data.data);
  
    } catch (error) {
      console.error("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };
  



  // Replace the searchByDate function with this client-side version
/*   const searchByDate = () => {
    if (!searchDate) {
      Swal.fire({
        icon: 'warning',
        title: 'No Date Selected',
        text: 'Please select a date to search',
      });
      return;
    }

    const searchDateObj = new Date(searchDate);
    const searchDateString = searchDateObj.toDateString();

    const filtered = schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.startDate).toDateString();
      return scheduleDate === searchDateString;
    });


    setSearchMode(true);
    setSchedules(filtered);

    
    Swal.fire({
      icon: 'success',
      title: 'Search Results',
      text: `Found ${filtered.length} schedules for ${searchDateObj.toLocaleDateString()}`,
    });
  }; */

  const searchByDate = () => {
    if (!searchDate) {
      Swal.fire({
        icon: 'warning',
        title: 'No Date Selected',
        text: 'Please select a date to search',
      });
      return;
    }
  
    const searchDateObj = new Date(searchDate);
    // Reset time to midnight for accurate comparison
    searchDateObj.setHours(0, 0, 0, 0);
  
    const filtered = schedules.filter(schedule => {
      const startDate = new Date(schedule.startDate);
      const endDate = new Date(schedule.endDate);
      
      // Reset times to midnight for range comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
  
      // Check if search date is between start and end dates (inclusive)
      return searchDateObj >= startDate && searchDateObj <= endDate;
    });
  
    setSchedules(filtered);
    setSearchMode(true);
    
    Swal.fire({
      icon: filtered.length ? 'success' : 'info',
      title: 'Search Results',
      text: filtered.length 
        ? `Found ${filtered.length} schedules that include ${searchDateObj.toLocaleDateString()}`
        : `No schedules found for ${searchDateObj.toLocaleDateString()}`,
    });
  };
    // Clear search results
  const clearSearch = () => {
    if(userRole === 'USER'){
      getSchedules();
    }else{
      getAllSchedules();
    }
    setSearchDate("");
    setSearchMode(false);
  };


  // Filter schedules based on currentStatus
  const filteredSchedules = schedules.filter((schedule) => {
    if (filter === "all") return true;
    if (filter === "completed") return schedule.currentStatus === true;
    if (filter === "not-completed") return schedule.currentStatus === false;
    return true;
  });

  const viewDaySchedules = (daySchedules) => {
    setShowModal(true);
    setDaySchedules(daySchedules);
    console.log("the day schedules are ", daySchedules);
  };

  const toggleStatus = async (_id) => {
    try {
      const scheduleToUpdate = schedules.find(schedule => schedule._id === _id);
      if (!scheduleToUpdate) return;
  
      const newStatus = !scheduleToUpdate.currentStatus;
  
      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `You are about to mark this schedule as ${newStatus ? 'Completed' : 'Not Completed'}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
      });
  
      if (!result.isConfirmed) return;
  
      const response = await axios.put(
        `http://localhost:5100/api/updateStatus/${_id}`,
        { currentStatus: newStatus }, {
          headers: {
            'Authorization': `Bearer ${token}`  
          }
        }
      );
  
      setSchedules(schedules.map(schedule =>
        schedule._id === _id
          ? { ...schedule, currentStatus: newStatus }
          : schedule
      ));
  
      Swal.fire(
        'Status Updated!',
        `Schedule is now ${newStatus ? '✅ Completed' : '⏳ Not Completed'}`,
        'success'
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      Swal.fire('Error!', 'Failed to update schedule status.', 'error');
    }
  };

  const handleDelete = async (_id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      });
  
      if (!result.isConfirmed) return;
  
      const response = await axios.delete(`http://localhost:5100/api/deleteSchedule/${_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`  
        }        
      });
      setSchedules(schedules.filter((schedule) => schedule._id !== _id));
  
      Swal.fire("Deleted!", "Your schedule has been deleted.", "success");
    } catch (error) {
      console.error("Error deleting schedule:", error);
      Swal.fire("Error", "Something went wrong while deleting!", "error");
    }
  };


  
  const handleEdit = async (schedule) => {
    setEditSchedule(schedule);
    navigate('/addschedule', {
      state: { editData: schedule },
    })
  };


  const generateReport = () => {
    // Calculate statistics
    const totalSchedules = schedules.length;
    const completed = schedules.filter(s => s.currentStatus === true).length;
    const pending = totalSchedules - completed;
    const completionRate = totalSchedules > 0 ? (completed / totalSchedules * 100).toFixed(2) : 0;
    const pendingRate = totalSchedules > 0 ? (pending / totalSchedules * 100).toFixed(2) : 0;
  
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Schedule Completion Report', 15, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 30);
    
    // Add summary statistics
    doc.setFontSize(14);
    doc.text('Summary Statistics', 15, 45);
    
    const summaryData = [
      ['Total Schedules', totalSchedules],
      ['Completed Schedules', completed],
      ['Pending Schedules', pending],
      ['Completion Rate', `${completionRate}%`],
      ['Pending Rate', `${pendingRate}%`]
    ];
    
    // Use autoTable plugin correctly
    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });
    
    // Add detailed schedule table
    doc.setFontSize(14);
    const finalY = doc.lastAutoTable.finalY || 50;
    doc.text('Schedule Details', 15, finalY + 20);
    
    const scheduleData = schedules.map(schedule => [
      schedule.trainer,
      new Date(schedule.startDate).toLocaleDateString(),
      new Date(schedule.endDate).toLocaleDateString(),
      schedule.classType,
      schedule.recurrence,
      schedule.currentStatus ? 'Completed' : 'Pending'
    ]);
    
    autoTable(doc, {
      startY: finalY + 25,
      head: [
        ['trainer', 'Start Date', 'End Date', 'Class Type', 'Recurrence', 'Status']
      ],
      body: scheduleData,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 }
      }
    });
    
    // Save the PDF
    doc.save('Schedule_Report.pdf');
  };
  
  return (
    <div className="content" style={{ overflowY: "auto", height: "100vh" }}>
      <div className="container-fluid" style={{ marginTop: "20px" }}>
        <div className="card" style={{ boxShadow: "rgba(0, 0, 0, 0.75) 0px 0px 4px -1px" }}>
          <div className="card-body">
            <h4 className="header-title mb-3">Schedule Management</h4>
            <div style={{ marginBottom: "20px" }}>

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
  
                {/* LEFT SIDE: Filter + Report + Create */}
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <select
                    onChange={(e) => setFilter(e.target.value)}
                    className="form-select"
                    style={{ width: "auto" }}
                    value={filter}
                  >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="not-completed">Not Completed</option>
                  </select>

                  <button 
                    onClick={generateReport} 
                    className="btn btn-pink"
                  >
                    PDF Report
                  </button>

                  <button
                    onClick={() => navigate("/addschedule")}
                    className="btn btn-success"
                  >
                    Create Schedule
                  </button>
                </div>

                {/* RIGHT SIDE: Date + Search + Clear */}
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <input
                  type="date"
                  className="form-control"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  style={{ width: "180px" }}
                />
                <button 
                  onClick={searchByDate}
                  className="btn btn-blue"
                >
                  Search Date
                </button>
                {searchMode && (
                  <button 
                    onClick={clearSearch}
                    className="btn btn-secondary"
                  >
                    Clear Search
                  </button>
                )}
              </div>

            </div>

              
            </div>

            {filteredSchedules.length === 0 ? (
              <p className="text-muted mt-3">
                {schedules.length === 0 ? "No schedules available." : "No schedules match the current filter."}
              </p>
            ) : (
              <table className="table table-bordered mt-3">
                <thead>
                  <tr className="table-light">
                    {
                      userRole === 'ADMIN' && (
                        <th>created by</th>
                      )
                    }
                    {
                      userRole === 'ADMIN' && (
                        <th>created at</th>
                      )
                    }
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Type</th>
                    <th>Membership</th>
                    <th>Trainer</th>
                    <th>Recurrence</th>
                    <th>Status</th>
                    <th>Schedules</th>
                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Toggle</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <tr
                      key={schedule._id}
                      style={{
                        cursor: "pointer",
                        backgroundColor: hoveredRow === schedule._id ? "#f1f1f1" : "transparent",
                      }}
                      onMouseEnter={() => setHoveredRow(schedule._id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      {
                        userRole === 'ADMIN' && (
                          <td>{schedule.createdByName}</td>
                        )
                      }
                      {
                        userRole === 'ADMIN' && (
                          <td>{new Date(schedule.createdAt).toLocaleString()}</td>
                        )
                      }
                      <td>{new Date(schedule.startDate).toLocaleDateString()}</td>
                      <td>{new Date(schedule.endDate).toLocaleDateString()}</td>
                      <td>{schedule.classType}</td>
                      <td>{schedule.membershipName}</td>
                      <td>{schedule.trainer}</td>
                      <td>{schedule.recurrence}</td>
                      <td>{schedule.currentStatus ? "✅ Completed" : "⏳ Not Completed"}</td>
                      <td>
                        <button 
                          onClick={() => viewDaySchedules(schedule.daySchedules)}
                          className="btn btn-soft-secondary btn-sm"
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="btn btn-blue btn-sm"
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(schedule._id)}
                          className="btn btn-danger btn-sm"
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleStatus(schedule._id)}
                          className="btn btn-info btn-sm"
                        >
                          Toggle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {showModal && (
            <DaySchedulesTable 
              daySchedules={daySchedules}
              onClose={() => setShowModal(false)}
              getAllSchedules = {getAllSchedules}
            />
          )}
          {showModal && <div className="modal-backdrop fade show"></div>}
        </div>
      </div>
    </div>
  );
};

export default ManageSchedules;