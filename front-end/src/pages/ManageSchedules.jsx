import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      day: "Monday",
      startTime: "09:00 AM",
      endTime: "11:00 AM",
      status: "Not Completed",
    },
    {
      id: 2,
      day: "Wednesday",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      status: "Completed",
    },
    {
      id: 3,
      day: "Friday",
      startTime: "10:00 AM",
      endTime: "12:00 PM",
      status: "Not Completed",
    },
    {
      id: 4,
      day: "Tuesday",
      startTime: "01:00 PM",
      endTime: "03:00 PM",
      status: "Completed",
    },
    {
      id: 5,
      day: "Thursday",
      startTime: "11:00 AM",
      endTime: "01:00 PM",
      status: "Not Completed",
    },
    {
      id: 6,
      day: "Saturday",
      startTime: "03:00 PM",
      endTime: "05:00 PM",
      status: "Completed",
    },
  ]);

  const [filter, setFilter] = useState("All");
  const [editSchedule, setEditSchedule] = useState(null);
  const [updatedSchedule, setUpdatedSchedule] = useState({});
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);

  const toggleStatus = (id) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id
          ? {
              ...schedule,
              status:
                schedule.status === "Completed" ? "Not Completed" : "Completed",
            }
          : schedule
      )
    );
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setSchedules(schedules.filter((schedule) => schedule.id !== id));
        Swal.fire("Deleted!", "Your schedule has been deleted.", "success");
      }
    });
  };

  const handleEdit = (schedule) => {
    setEditSchedule(schedule.id);
    setUpdatedSchedule(schedule);
  };

  const handleUpdate = () => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === editSchedule ? updatedSchedule : schedule
      )
    );
    setEditSchedule(null);
  };

  const filteredSchedules = schedules.filter(
    (schedule) => filter === "All" || schedule.status === filter
  );

  const generateReport = () => {
    const completed = schedules.filter((s) => s.status === "Completed").length;
    const pending = schedules.filter(
      (s) => s.status === "Not Completed"
    ).length;
    const total = schedules.length;

    alert(
      `Report:\nTotal: ${total}\nCompleted: ${completed} (${(
        (completed / total) *
        100
      ).toFixed(2)}%)\nPending: ${pending} (${((pending / total) * 100).toFixed(
        2
      )}%)`
    );
  };

  return (
    <div className="content" style={{ overflowY: "auto", height: "100vh" }}>
      <div className="container-fluid" style={{ marginTop: "20px" }}>
        <div
          className="card"
          style={{ boxShadow: "rgba(0, 0, 0, 0.75) 0px 0px 4px -1px" }}
        >
          <div className="card-body">
            <h4 className="header-title mb-3">Membership Management</h4>
            <div style={{ marginBottom: "20px" }}>
              <div className="d-flex align-items-center mb-4">
                <select
                  onChange={(e) => setFilter(e.target.value)}
                  className="form-select"
                  style={{ width: "auto" }}
                >
                  <option value="All">All</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Completed">Not Completed</option>
                </select>

                <button onClick={generateReport} className="btn  btn-blue ms-3">
                  Generate Report
                </button>

                <button
                  onClick={() => navigate("/addschedule")}
                  className="btn btn-success ms-3"
                >
                  Create Schedule
                </button>
              </div>
            </div>

            {filteredSchedules.length === 0 ? (
              <p className="text-muted mt-3">No schedules available.</p>
            ) : (
              <table className="table table-bordered mt-3">
                <thead>
                  <tr className="table-light">
                    <th style={{ width: "20%" }}>Day</th>
                    <th style={{ width: "20%" }}>Start Time</th>
                    <th style={{ width: "20%" }}>End Time</th>
                    <th style={{ width: "20%" }}>Status</th>
                    <th style={{ width: "20%" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <tr
                      key={schedule.id}
                      style={{
                        cursor: "pointer",
                        backgroundColor:
                          hoveredRow === schedule.id
                            ? "#f1f1f1"
                            : "transparent",
                      }}
                      onMouseEnter={() => setHoveredRow(schedule.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td>{schedule.day}</td>
                      <td>
                        {editSchedule === schedule.id ? (
                          <input
                            type="time"
                            value={updatedSchedule.startTime}
                            onChange={(e) =>
                              setUpdatedSchedule({
                                ...updatedSchedule,
                                startTime: e.target.value,
                              })
                            }
                            className="form-control form-control-sm"
                          />
                        ) : (
                          schedule.startTime
                        )}
                      </td>
                      <td>
                        {editSchedule === schedule.id ? (
                          <input
                            type="time"
                            value={updatedSchedule.endTime}
                            onChange={(e) =>
                              setUpdatedSchedule({
                                ...updatedSchedule,
                                endTime: e.target.value,
                              })
                            }
                            className="form-control form-control-sm"
                          />
                        ) : (
                          schedule.endTime
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            schedule.status === "Completed"
                              ? "bg-success"
                              : "bg-warning text-dark"
                          } px-2 py-2`}
                        >
                          {schedule.status}
                        </span>
                      </td>
                      <td>
                        {editSchedule === schedule.id ? (
                          <button
                            onClick={handleUpdate}
                            className="btn btn-success btn-sm"
                          >
                            Save
                          </button>
                        ) : (
                          <div className="btn-group">
                            <button
                              onClick={() => handleEdit(schedule)}
                              className="btn btn-info btn-sm me-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="btn btn-danger btn-sm me-3"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => toggleStatus(schedule.id)}
                              className="btn btn-secondary btn-sm"
                            >
                              Toggle
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedules;
