import React, { useState } from "react";
import Swal from "sweetalert2";

const MembershipForm = ({ handleAddMembershipClick, closeModal }) => {
  const handleMembershipManagementClick = () => {
    closeModal();
  };

  const [formData, setFormData] = useState({
    membershipName: "",
    membershipDescription: "",
    membershipType: "",
    membershipPhoto: "",
    membershipPeriod: "",
    joinFee: false,
    charge: "",
    startDateOfPurches: false,
    cancellationPolicy: "",
    membershipDuration: "",
  });

  const [errors, setErrors] = useState({
    membershipName: false,
    membershipDescription: false,
    membershipType: false,
    membershipPeriod: false,
    charge: false,
    cancellationPolicy: false,
    membershipDuration: false,
    chargeRange: false,
    periodRange: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user types
    if (value.trim() !== "" && errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }

    // Clear range errors when user adjusts values
    if (name === "charge" && errors.chargeRange) {
      setErrors((prev) => ({
        ...prev,
        chargeRange: false,
      }));
    }

    if (name === "membershipPeriod" && errors.periodRange) {
      setErrors((prev) => ({
        ...prev,
        periodRange: false,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      membershipName: formData.membershipName.trim() === "",
      membershipDescription: formData.membershipDescription.trim() === "",
      membershipType: formData.membershipType.trim() === "",
      membershipPeriod: formData.membershipPeriod.trim() === "",
      charge: formData.charge.trim() === "",
      cancellationPolicy: formData.cancellationPolicy.trim() === "",
      chargeRange: false,
      periodRange: false,
    };    

    // Validate charge range (500 to 25000)
    if (formData.charge && (parseInt(formData.charge) < 500 || parseInt(formData.charge) > 25000)) {
      newErrors.chargeRange = true;
    }

    // Validate membership period (30 to 3600 days)
    if (formData.membershipPeriod && (parseInt(formData.membershipPeriod) < 30 || parseInt(formData.membershipPeriod) > 3600)) {
      newErrors.periodRange = true;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      let errorMessage = "Please fill all required fields!";
      
      if (errors.chargeRange) {
        errorMessage = "Charge must be between ₹500 and ₹25,000";
      } else if (errors.periodRange) {
        errorMessage = "Membership period must be between 30 and 3600 days";
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    try {
      console.log("Form submitted:", formData);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Membership created successfully!",
        confirmButtonColor: "#3085d6",
      });
      handleClear();
    } catch (error) {
      console.log("the error in " + error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while creating membership",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const handleClear = () => {
    setFormData({
      membershipName: "",
      membershipDescription: "",
      membershipType: "",
      membershipPhoto: "",
      membershipPeriod: "",
      joinFee: false,
      charge: "",
      startDateOfPurches: false,
      cancellationPolicy: "",
    });

    setErrors({
      membershipName: false,
      membershipDescription: false,
      membershipType: false,
      membershipPeriod: false,
      charge: false,
      cancellationPolicy: false,
      chargeRange: false,
      periodRange: false,
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
            <h4 className="header-title mb-0"> </h4>
            <div style={{ marginBottom: "20px" }}>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-blue"
                  onClick={handleMembershipManagementClick}
                >
                  Membership Management
                </button>
              </div>
            </div>
            <div
              style={{
                padding: "20px",
                backgroundColor: "#f0f4f8",
              }}
            >
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  marginBottom: "20px",
                }}
              >
                <form onSubmit={handleSubmit}>
                  {/* Membership Name */}
                  <div className="mb-3">
                    <label htmlFor="membershipName" className="form-label">
                      Membership Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="membershipName"
                      name="membershipName"
                      placeholder="Silver Membership (Monthly)"
                      value={formData.membershipName}
                      onChange={handleChange}
                    />
                    {errors.membershipName && (
                      <div className="text-danger small mt-1">
                        Please enter membership name
                      </div>
                    )}
                  </div>

                  {/* Membership Description */}
                  <div className="mb-3">
                    <label
                      htmlFor="membershipDescription"
                      className="form-label"
                    >
                      Membership Description *
                    </label>
                    <textarea
                      className="form-control"
                      id="membershipDescription"
                      name="membershipDescription"
                      rows="3"
                      placeholder="Enter membership details..."
                      value={formData.membershipDescription}
                      onChange={handleChange}
                    ></textarea>
                    {errors.membershipDescription && (
                      <div className="text-danger small mt-1">
                        Please enter description
                      </div>
                    )}
                  </div>

                  {/* Membership Type Dropdown */}
                  <div className="mb-3">
                    <label htmlFor="membershipType" className="form-label">
                      Membership Type *
                    </label>
                    <select
                      className="form-control"
                      id="membershipType"
                      name="membershipType"
                      value={formData.membershipType}
                      onChange={handleChange}
                    >
                      <option value="">Select Membership Type</option>
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="platinum">Platinum</option>
                    </select>
                    {errors.membershipType && (
                      <div className="text-danger small mt-1">
                        Please select membership type
                      </div>
                    )}
                  </div>

                  {/* Membership Photo */}
                  <div className="mb-3">
                    <label htmlFor="membershipPhoto" className="form-label">
                      Upload Membership Photo
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="membershipPhoto"
                      name="membershipPhoto"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Membership Period */}
                  <div className="mb-3">
                    <label htmlFor="membershipPeriod" className="form-label">
                      Membership Period (days) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="membershipPeriod"
                      name="membershipPeriod"
                      placeholder="Duration in days (30-3600)"
                      min="1"
                      value={formData.membershipPeriod}
                      onChange={handleChange}
                    />
                    {errors.membershipPeriod && (
                      <div className="text-danger small mt-1">
                        Please enter membership period
                      </div>
                    )}
                    {errors.periodRange && (
                      <div className="text-danger small mt-1">
                        Membership period must be between 30 and 3600 days
                      </div>
                    )}
                  </div>

                  {/* Join Fee Toggle */}
                  <div className="mb-3">
                    <label className="form-label">
                      Charge Joining Fee * A one-time fee applicable for new
                      customers
                    </label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="joinFee"
                        name="joinFee"
                        checked={formData.joinFee}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="joinFee">
                        {formData.joinFee ? "Yes" : "No"}
                      </label>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <label htmlFor="charge" className="form-label">
                      Charge (₹) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="charge"
                      name="charge"
                      placeholder="Enter price (500-25000)"
                      min="0"
                      value={formData.charge}
                      onChange={handleChange}
                    />
                    {errors.charge && (
                      <div className="text-danger small mt-1">
                        Please enter charge amount
                      </div>
                    )}
                    {errors.chargeRange && (
                      <div className="text-danger small mt-1">
                        Charge must be between ₹500 and ₹25,000
                      </div>
                    )}
                  </div>

                  {/* Membership Start Date Toggle */}
                  <div className="mb-3">
                    <label className="form-label">
                      Membership starts on the date of purchase
                    </label>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="startDateOfPurches"
                        name="startDateOfPurches"
                        checked={formData.startDateOfPurches}
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="startDateOfPurches"
                      >
                        {formData.startDateOfPurches ? "Yes" : "No"}
                      </label>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="mb-3">
                    <label htmlFor="cancellationPolicy" className="form-label">
                      Add a cancel policy
                    </label>

                    <div className="d-flex align-items-center mb-3">
                      <label
                        htmlFor="membershipDuration"
                        className="form-label mb-0 me-2"
                      >
                        This membership can be cancelled
                      </label>

                      <select
                        className="form-control w-auto"
                        id="membershipDuration"
                        name="membershipDuration"
                        value={formData.membershipDuration}
                        onChange={handleChange}
                      >
                        <option value="">Select duration</option>
                        <option value="12">12 hours</option>
                        <option value="20">20 hours</option>
                        <option value="24">24 hours</option>
                      </select>

                      <span className="ms-2">to the start date</span>
                    </div>

                    <textarea
                      className="form-control"
                      id="cancellationPolicy"
                      name="cancellationPolicy"
                      rows="3"
                      placeholder="Enter cancellation policy..."
                      value={formData.cancellationPolicy}
                      onChange={handleChange}
                    ></textarea>

                    {errors.cancellationPolicy && (
                      <div className="text-danger small mt-1">
                        Please enter cancellation policy
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button type="submit" className="btn btn-success me-2">
                    Create Membership
                  </button>
                  <button
                    type="reset"
                    onClick={handleClear}
                    className="btn btn-soft-blue"
                  >
                    Clear
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipForm;