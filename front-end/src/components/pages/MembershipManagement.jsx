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
import icon_placeholder from "../../images/No_image_available.png";

const MembershipManagement = () => {
  const tableRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const userRole = localStorage.getItem("userRole");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMembershipData();
  }, []);

  const getMembershipData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5100/api/getAllMembership",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching membership data:", error);
      Swal.fire("Error", "Failed to load membership data", "error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    window.jQuery = window.$ = $;

    const columns = [
      {
        title: "Photo",
        data: "membershipPhoto",
        render: (data, type, row) => {
          const imageUrl = data
            ? `http://localhost:5100/${data}`
            : icon_placeholder;
          return `<img src="${imageUrl}" alt="Membership Photo" class="rounded-img" style="width: 50px; height: 50px; object-fit: cover;">`;
        },
      },
      { title: "Name", data: "membershipName" },
      { title: "Type", data: "membershipType" },
      { title: "Period", data: "membershipPeriod" },
      {
        title: "Join Fee",
        data: "isJoinFee",
        render: (data) => {
          const checked = data ? "checked" : "";
          return `
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" ${checked} style="pointer-events: none; background-color: ${
            data ? "#4CAF50" : "#fff"
          }; border-color: ${data ? "#4CAF50" : "#ccc"};">
              </div>
            `;
        },
      },
      { title: "Charge", data: "charge" },
      {
        title: "Purche Date",
        data: "isStartDateOfPurches",
        render: (data) => {
          const checked = data ? "checked" : "";
          return `
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" ${checked} style="pointer-events: none; background-color: ${
            data ? "#4CAF50" : "#fff"
          }; border-color: ${data ? "#4CAF50" : "#ccc"};">
              </div>
            `;
        },
      },
      { title: "Duration", data: "cancellationDuration" },
      {
        title: "Policy",
        data: "cancellationPolicy",
        render: (data) => {
          const content = data
            ? data.replace(/"/g, "&quot;")
            : "No policy available";
          return `
              <button class="btn btn-sm btn-outline-primary view-details-btn" data-bs-toggle="modal" data-bs-target="#policyModal" data-title="Cancellation Policy" data-content="${content}">
                View
              </button>
            `;
        },
      },
      {
        title: "Description",
        data: "membershipDescription",
        render: (data) => {
          const content = data
            ? data.replace(/"/g, "&quot;")
            : "No description available";
          return `
              <button class="btn btn-sm btn-outline-secondary view-details-btn" data-bs-toggle="modal" data-bs-target="#policyModal" data-title="Membership Description" data-content="${content}">
                View
              </button>
            `;
        },
      },
    ];

    if (userRole === "ADMIN") {
      columns.push(
        {
          title: "Edit",
          data: null,
          defaultContent: "",
          render: (data, type, row) => {
            return `<button class="btn btn-blue btn-sm edit-btn" data-id="${
              row.id
            }" data-details='${JSON.stringify(row)}'>Edit</button>`;
          },
        },
        {
          title: "Delete",
          data: null,
          defaultContent: "",
          render: (data, type, row) => {
            return `<button class="btn btn-danger btn-sm delete-btn" data-id="${row._id}">Delete</button>`;
          },
        }
      );
    }

    const dataTable = $(tableRef.current).DataTable({
      data: data,
      dom: "Bfrtip",
      buttons: [
        {
          extend: "pdf",
          exportOptions: {
            columns: [1, 2, 3, 5, 7],
          },
        },
        {
          extend: "csv",
          exportOptions: {
            columns: [1, 2, 3, 5, 7],
          },
        },
        {
          extend: "excel",
          exportOptions: {
            columns: [1, 2, 3, 5, 7],
          },
        },
        "print",
        "copy",
        "colvis",
      ],
      columns: columns,
      responsive: true,
      destroy: true,
    });

    $(tableRef.current).on("click", ".edit-btn", function () {
      const rowData = $(this).data("details");
      setEditData(rowData);
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
          deleteMembership(rowId, rowElement);
        }
      });
    });

    $(tableRef.current).on("click", ".view-details-btn", function () {
      const title = $(this).data("title");
      const content = $(this).data("content");

      $("#policyModalLabel").text(title);
      $("#policyModalBody").html(content);
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        dataTable.destroy();
      }
      $(tableRef.current).off("click", ".delete-btn");
    };
  }, [data, userRole]);

  const deleteMembership = async (id, rowElement) => {
    try {
      await axios.delete(`http://localhost:5100/api/deleteMembership/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    navigate("/membershipForm");
    setShowForm(!showForm);
  };

  const handleEditMembershipClick = (rowData) => {
    console.log(rowData);
    navigate("/membershipForm", {
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
            <h4 className="header-title mb-0">Membership Managemenrt</h4>

            {/* Only for Admin */}
            {userRole === "ADMIN" && (
              <div style={{ marginBottom: "20px" }}>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-blue"
                    onClick={handleAddMembershipClick}
                  >
                    Add Membership
                  </button>
                </div>
              </div>
            )}

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

      <div
        class="modal fade"
        id="policyModal"
        tabIndex="-1"
        aria-labelledby="policyModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="policyModalLabel">
                Title Here
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body" id="policyModalBody">
              Content goes here...
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipManagement;
