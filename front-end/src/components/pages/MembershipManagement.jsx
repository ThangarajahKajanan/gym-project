import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt";
import "datatables.net-buttons/js/dataTables.buttons";
import "datatables.net-buttons/js/buttons.html5";
import "datatables.net-buttons/js/buttons.print";
import "datatables.net-buttons/js/buttons.colVis";
import "datatables.net-buttons-dt";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";
import "../../CSS/membership.css";
import Swal from "sweetalert2";
import MemberShipForm from "../MembershipForm";
import { useNavigate } from "react-router-dom";
import dia from "../../images/dia.png";
import plati from "../../images/plati.jpg";
import sil from "../../images/sil.jpeg";

const DataTableComponent = () => {
  const tableRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    window.jQuery = window.$ = $;

    const data = [
      {
        membershipPhoto: dia,
        membershipName: "Gold Membership",
        membershipType: "type 1",
        office: "New York",
        membershipPeriod: "30",
        joinFee: "$100",
        charge: "$20/month",
      },
      {
        membershipPhoto: plati,
        membershipName: "Silver Membership",
        membershipType: "type 2",
        office: "London",
        membershipPeriod: "60",
        joinFee: "$50",
        charge: "$10/month",
      },
      {
        membershipPhoto: sil,
        membershipName: "Platinum Membership",
        membershipType: "type 3",
        office: "Paris",
        membershipPeriod: "90",
        joinFee: "$200",
        charge: "$30/month",
      },
      {
        membershipPhoto: dia,
        membershipName: "Diamond Membership",
        membershipType: "type 4",
        office: "Berlin",
        membershipPeriod: "120",
        joinFee: "$500",
        charge: "$50/month",
      },
      {
        membershipPhoto: plati,
        membershipName: "Bronze Membership",
        membershipType: "type 5",
        office: "Sydney",
        membershipPeriod: "180",
        joinFee: "$150",
        charge: "$15/month",
      },
      {
        membershipPhoto: sil,
        membershipName: "Emerald Membership",
        membershipType: "type 6",
        office: "Tokyo",
        membershipPeriod: "60",
        joinFee: "$120",
        charge: "$25/month",
      },
      {
        membershipPhoto: dia,
        membershipName: "Ruby Membership",
        membershipType: "type 7",
        office: "Dubai",
        membershipPeriod: "45",
        joinFee: "$200",
        charge: "$35/month",
      },
      {
        membershipPhoto: plati,
        membershipName: "Sapphire Membership",
        membershipType: "type 8",
        office: "Mumbai",
        membershipPeriod: "120",
        joinFee: "$350",
        charge: "$40/month",
      },
      {
        membershipPhoto: sil,
        membershipName: "Titanium Membership",
        membershipType: "type 9",
        office: "Shanghai",
        membershipPeriod: "24",
        joinFee: "$600",
        charge: "$60/month",
      },
      {
        membershipPhoto: dia,
        membershipName: "Pearl Membership",
        membershipType: "type 10",
        office: "Los Angeles",
        membershipPeriod: "60",
        joinFee: "$400",
        charge: "$45/month",
      },
    ];

    const dataTable = $(tableRef.current).DataTable({
      data: data,
      dom: "Bfrtip",
      buttons: ["copy", "csv", "excel", "pdf", "print", "colvis"],
      columns: [
        {
          title: "Photo",
          data: "membershipPhoto",
          render: (data, type, row) => {
            return `<img src="${data}" alt="Photo" class="rounded-img" style="width: 50px; height: 50px; object-fit: cover;">`;
          },
        },
        { title: "Membership Name", data: "membershipName" },
        { title: "Membership Type", data: "membershipType" },
        { title: "Membership Period", data: "membershipPeriod" },
        { title: "Join Fee", data: "joinFee" },
        { title: "Charge", data: "charge" },
        {
          title: "Edit",
          data: null,
          defaultContent: "",
          render: (data, type, row) => {
            return `<button class="btn btn-blue btn-sm edit-btn" data-id="${
              row.membershipName
            }" data-details='${JSON.stringify(row)}'>Edit</button>`;
          },
        },
        {
          title: "Delete",
          data: null,
          defaultContent: "",
          render: (data, type, row) => {
            return `<button class="btn btn-danger btn-sm delete-btn" data-id="${row.id}">Delete</button>`;
          },
        },
        {
          title: "Activities",
          data: null,
          defaultContent: "",
          render: (data, type, row) => {
            return `<button class="btn btn-info btn-sm activities-btn" data-id="${row.id}">Activities</button>`;
          },
        },
      ],
      responsive: true,
      destroy: true,
    });

    $(tableRef.current).on("click", ".edit-btn", function () {
      const membershipData = $(this).data("details");
      handleEditMembershipClick(membershipData);
    });

    $(tableRef.current).on("click", ".delete-btn", function () {
      const rowId = $(this).data("id");
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
          Swal.fire("Deleted!", "The record has been deleted.", "success");
          dataTable.row($(this).closest("tr")).remove().draw();
        }
      });
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        dataTable.destroy();
      }
      $(tableRef.current).off("click", ".delete-btn");
    };
  }, []);

  const handleAddMembershipClick = () => {
    setShowForm(!showForm);
  };

  const handleEditMembershipClick = (membershipData) => {
    navigate("/membershipForm", {
      state: { membershipData },
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

      {showForm && (
        <div className="form-overlay">
          <div style={{ width: "100%" }}>
            <MemberShipForm
              handleAddMembershipClick={handleAddMembershipClick}
              closeModal={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTableComponent;
