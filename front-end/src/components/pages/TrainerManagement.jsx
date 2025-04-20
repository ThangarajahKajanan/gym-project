import React, { useEffect, useRef, useState } from "react";
import $, { get } from "jquery";
import "datatables.net-dt";
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-buttons/js/buttons.colVis";
import "datatables.net-buttons-dt";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";
import "../../CSS/membership.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const TrainerManagement = () => {
  const tableRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const token = localStorage.getItem('token'); 
  const userRole = localStorage.getItem("userRole");


  const [loading, setLoading] = useState(true);

  useEffect( ()=> {
    getAllTrainerData();
  }, [])

  const getAllTrainerData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5100/api/getAllTrainers', {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching trainers data:", error);
      Swal.fire("Error", "Failed to load trainers data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    window.jQuery = window.$ = $;
    
    const dataTable = $(tableRef.current).DataTable({
      data: data,
      dom: "Bfrtip",
      buttons: [ "pdf", "csv", "excel", "print", "copy", "colvis"],
      columns: [
        { title: "Email", data: "trainerEmail" },
        { title: "Name", data: "trainerName" },
        { title: "Age", data: "trainerAge" },
        { title: "Location", data: "trainerLocation" }, 
        { title: "Experience", data: "trainerExperience" }, 
        {
          title: "Edit",
          data: null,
          defaultContent: "",
          render: (data, type, row) => {
            return `<button class="btn btn-blue btn-sm edit-btn" data-id="${row.id}" data-details='${JSON.stringify(row)}'>Edit</button>`;
          },
        },
        {
          title: "Delete",
          data: null,
          defaultContent: "",
          render: (data, type, row) => {
            return `<button class="btn btn-danger btn-sm delete-btn" data-id="${row._id}">Delete</button>`;
          },
        },
      ],
      responsive: true,
      destroy: true,
    });

    $(tableRef.current).on("click", ".edit-btn", function () {
      const rowData = $(this).data("details");
      setEditData(rowData)
      handleEditMembershipClick(rowData);
    });

    $(tableRef.current).on("click", ".delete-btn", function () {
        const rowId = $(this).data("id");
        const rowElement = $(this).closest("tr"); 
      
        Swal.fire({
          title: "Are you sure?",
          text: "Do you want to delete this record?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, delete!",
        }).then((result) => {
          if (result.isConfirmed) {
            deleteTrainer(rowId, rowElement); 
          }
        });
      });
      

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        dataTable.destroy();
      }
      $(tableRef.current).off("click", ".delete-btn");
    };
  }, [data]);

  const deleteTrainer = async (id, rowElement) => {
    try {
      await axios.delete(`http://localhost:5100/api/deleteTrainer/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`  
        }
      });
      Swal.fire("Deleted!", "The record has been deleted.", "success");
      const table = $(tableRef.current).DataTable();
      table.row(rowElement).remove().draw();
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "Failed to delete record", "error");
    }
  };

  const handleAddMembershipClick = () => {
    navigate("/trainerform")
    setShowForm(!showForm);
  };

  const handleEditMembershipClick = (rowData) => {
    console.log(rowData)
    navigate("/trainerform", {
      state: { editData: rowData },
    });
  };

  return (
    <div className="content" style={{ overflowY: "auto", height: "100vh" }}>
      <div className="container-fluid" style={{ marginTop: "20px" }}>
        <div
          className="card"
          style={{ boxShadow: "rgba(0, 0, 0, 0.75) 0px 0px 4px -1px" }}
        >
          <div className="card-body">
            <h4 className="header-title mb-0">Trainer Managemenrt</h4>
            <div style={{ marginBottom: "20px" }}>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-blue"
                  onClick={handleAddMembershipClick}
                >
                  Add Trainer
                </button>
              </div>
            </div>
            <div style={{ padding: "20px", backgroundColor: "#f0f4f8" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              >
                <div className="table-responsive">
                  <table
                    ref={tableRef}
                    className="display table table-striped table-bordered"
                    style={{ width: "100%" }}
                  ></table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerManagement;
