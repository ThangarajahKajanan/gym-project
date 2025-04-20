import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import icon_placeholder from '../images/No_image_available.png'

const MembershipForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { editData } = location.state || {};

    const [isUpdated, setIsUpdated] = useState(false);
    const [existingPhotoPath, setExistingPhotoPath] = useState("");
    const [membershipPhoto, setMembershipPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');

    

    const [formData, setFormData] = useState({
        membershipName: "",
        membershipDescription: "",
        membershipType: "",
        membershipPeriod: "",
        isJoinFee: false,
        charge: "",
        isStartDateOfPurches: false,
        cancellationPolicy: "",
        cancellationDuration: "",
    });

    const [errors, setErrors] = useState({
        membershipName: false,
        membershipDescription: false,
        membershipType: false,
        membershipPeriod: false,
        charge: false,
        cancellationPolicy: false,
        cancellationDuration: false,
        chargeRange: false,
        periodRange: false,
    });

    useEffect(() => {
        if (editData) {
            setIsUpdated(true);
            setFormData({
                membershipName: editData.membershipName,
                membershipDescription: editData.membershipDescription,
                membershipType: editData.membershipType,
                membershipPhoto: editData.membershipPhoto,
                membershipPeriod: editData.membershipPeriod,
                isJoinFee: editData.isJoinFee,
                charge: editData.charge,
                isStartDateOfPurches: editData.isStartDateOfPurches,
                cancellationPolicy: editData.cancellationPolicy,
                cancellationDuration: editData.cancellationDuration
            });
            setExistingPhotoPath(editData.membershipPhoto || "");
        }
    }, [editData]);

    const handleMembershipManagement = () => {
        navigate("/membershipManagement");
    };

    const handleFileChange = (e) => {
        setMembershipPhoto(e.target.files[0]);
    };

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
            charge: formData.charge === "" || isNaN(formData.charge),
            cancellationPolicy: formData.cancellationPolicy.trim() === "",
            cancellationDuration: formData.cancellationDuration === "",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

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
            setIsLoading(false);
            return;
        }

        const formDataWithFile = new FormData();

        // Append form fields
        Object.keys(formData).forEach((key) => {
            if (key !== "membershipPhoto" || membershipPhoto || !existingPhotoPath) {
                formDataWithFile.append(key, formData[key]);
            }
        });
        
        // Append the image file if a new one was selected
        if (membershipPhoto) {
            formDataWithFile.append("membershipPhoto", membershipPhoto);
        }
        
        // If in edit mode and no new photo was selected, keep the existing photo
        if (isUpdated && !membershipPhoto && existingPhotoPath) {
            formDataWithFile.append("existingPhotoPath", existingPhotoPath);
        }
        
        try {
            const endpoint = isUpdated 
                ? `http://localhost:5100/api/updateMembership/${editData._id}` 
                : "http://localhost:5100/api/createMembership";

            const method = isUpdated ? "put" : "post";

            const response = await axios[method](endpoint, formDataWithFile, {
                headers: {
                    "Content-Type": "multipart/form-data",
                     'Authorization': `Bearer ${token}`
                },
            });
            
            console.log("Form submitted:", response.data);
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: isUpdated ? "Membership updated successfully!" : "Membership created successfully!",
                confirmButtonColor: "#3085d6",
            });
            handleClear();
            handleMembershipManagement();

        } catch (error) {
            console.log("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: `An error occurred while ${isUpdated ? "updating" : "creating"} membership`,
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            membershipName: "",
            membershipDescription: "",
            membershipType: "",
            membershipPhoto: "",
            membershipPeriod: "",
            isJoinFee: false,
            charge: "",
            isStartDateOfPurches: false,
            cancellationPolicy: "",
            cancellationDuration: "",
        });
        setExistingPhotoPath("");
        setMembershipPhoto(null);
        setErrors({
            membershipName: false,
            membershipDescription: false,
            membershipType: false,
            membershipPeriod: false,
            charge: false,
            cancellationPolicy: false,
            cancellationDuration: false,
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
                                    onClick={handleMembershipManagement}
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
                                        <label htmlFor="membershipDescription" className="form-label">
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
                                        />
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
{/*                                     <div className="mb-3">
                                        <label htmlFor="membershipPhoto" className="form-label">
                                            Upload Membership Photo
                                        </label>
                                        {existingPhotoPath && !membershipPhoto && (
                                            <div className="mb-2">
                                                <p>Current Photo:</p>
                                                <img 
                                                    src={`http://localhost:5100/${existingPhotoPath}`} 
                                                    alt="Current membership" 
                                                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                                                />
                                            </div>
                                        )} 
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="form-control"
                                            id="membershipPhoto"
                                            name="membershipPhoto"
                                            onChange={handleFileChange}
                                        />
                                        {membershipPhoto && (
                                            <div className="mt-2">
                                                <p>New Photo Selected: {membershipPhoto.name}</p>
                                            </div>
                                        )}
                                    </div>
 */}



<div className="mb-3">
  <label htmlFor="membershipPhoto" className="form-label">
    Upload Membership Photo
  </label>

  {/* Display current or selected photo */}
  {membershipPhoto ? (
    <div className="mb-2">
      <p>New Photo Preview:</p>
      <img
        src={URL.createObjectURL(membershipPhoto)}
        alt="New membership"
        style={{ maxWidth: "120px", maxHeight: "100px" }}
      />
    </div>
  ) : existingPhotoPath ? (
    <div className="mb-2">
      <p>Current Photo:</p>
      <img
        src={`http://localhost:5100/${existingPhotoPath}`}
        alt="Current membership"
        style={{ maxWidth: "120px", maxHeight: "100px" }}
      />
    </div>
  ) : (
    <div className="mb-2">
      <p>No photo uploaded.</p>
      <img
  src={icon_placeholder}
        alt="Placeholder"
        style={{ maxWidth: "120px", maxHeight: "100px" }}
      />
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    className="form-control"
    id="membershipPhoto"
    name="membershipPhoto"
    onChange={handleFileChange}
  />

  {membershipPhoto && (
    <div className="mt-2">
      <p>New Photo Selected: {membershipPhoto.name}</p>
    </div>
  )}
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
                                                id="isJoinFee"
                                                name="isJoinFee"
                                                checked={formData.isJoinFee}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="isJoinFee">
                                                {formData.isJoinFee ? "Yes" : "No"}
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
                                                id="isStartDateOfPurches"
                                                name="isStartDateOfPurches"
                                                checked={formData.isStartDateOfPurches}
                                                onChange={handleChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="isStartDateOfPurches"
                                            >
                                                {formData.isStartDateOfPurches ? "Yes" : "No"}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Cancellation Policy */}
                                    <div className="mb-3">
                                        <label htmlFor="cancellationPolicy" className="form-label">
                                            Add a cancel policy *
                                        </label>

                                        <div className="d-flex align-items-center mb-3">
                                            <label
                                                htmlFor="cancellationDuration"
                                                className="form-label mb-0 me-2"
                                            >
                                                This membership can be cancelled
                                            </label>

                                            <select
                                                className="form-control w-auto"
                                                id="cancellationDuration"
                                                name="cancellationDuration"
                                                value={formData.cancellationDuration}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select duration</option>
                                                <option value="12">12 hours</option>
                                                <option value="20">20 hours</option>
                                                <option value="24">24 hours</option>
                                            </select>

                                            <span className="ms-2">to the start date</span>
                                        </div>
                                        {errors.cancellationDuration && (
                                            <div className="text-danger small mt-1">
                                                Please select cancellation duration
                                            </div>
                                        )}

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
                                    <button 
                                        type="submit" 
                                        className="btn btn-success me-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        ) : isUpdated ? (
                                            "Update Membership"
                                        ) : (
                                            "Create Membership"
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="btn btn-soft-blue me-2"
                                        disabled={isLoading}
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleMembershipManagement}
                                        className="btn btn-danger"
                                        disabled={isLoading}
                                    >
                                        Close
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