import axios from "axios";
import React from "react";
import Swal from "sweetalert2";

const DaySchedulesTable = ({ daySchedules, onClose, getSchedules }) => {
  // Convert the daySchedules object to an array of entries
  const scheduleEntries = Object.entries(daySchedules || {});
  const token = localStorage.getItem('token');

  const toggleStatus = async (_id) => {
    try {
      // Find the day and schedule with the matching _id
      console.log("the id is", _id)
      const [dayKey, scheduleToUpdate] = Object.entries(daySchedules).find(
        ([, schedule]) => schedule._id === _id
      );
  
      if (!scheduleToUpdate) return;
  
      const newStatus = !scheduleToUpdate.isActive;

      const result = await Swal.fire({
        title: `Are you sure?`,
        text: `Do you want to change the status of this daily schedule?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change it!'
      });
        
      if (!result.isConfirmed) return;
        
  
      const response = await axios.put(
        `http://localhost:5100/api/updateDayStatus/${_id}`,
        { isActive: newStatus }, {
          headers: {
            'Authorization': `Bearer ${token}`  
          }
        }
      );

      // Optional: Update UI or notify success
    //  updateLocalSchedules(dayKey, newStatus);
  
      Swal.fire(
        'Status Updated!',
        `Schedule is now ${newStatus ? '✅ Completed' : '⏳ Not Completed'}`,
        'success'
      );
      getSchedules();
      onClose();
  
    } catch (error) {
      console.error("Error toggling status:", error);
      Swal.fire('Error!', 'Failed to update schedule status.', 'error');
    }
  };
  

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Day Schedules</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <table className="table table-bordered">
              <thead>
                <tr className="table-light">
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {scheduleEntries.map(([day, schedule]) => (
                  <tr key={schedule._id}>
                    <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                    <td>{schedule.startTime}</td>
                    <td>{schedule.endTime}</td>
                    <td>
                      <span className={`badge ${schedule.isActive ? 'bg-secondary' : 'bg-success'} py-1 px-1`}>
                        {schedule.isActive ? "Not Completed" : "Completed"}
                      </span>
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
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaySchedulesTable;