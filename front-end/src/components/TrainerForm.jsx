import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const TrainerForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { editData } = location.state || {};
    const [isUpdated, setIsUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        trainerEmail: '',
        trainerName: "",
        trainerAge: "",
        trainerLocation: "",
        trainerExperience: "",
    });

    const [errors, setErrors] = useState({
        trainerEmail: false,
        trainerName: false,
        trainerAge: false,
        trainerLocation: false,
        trainerExperience: false,
    });

    useEffect(() => {
        if (editData) {
            setIsUpdated(true);
            setFormData({
                trainerEmail: editData.trainerEmail || "",
                trainerName: editData.trainerName || "",
                trainerAge: editData.trainerAge || "",
                trainerLocation: editData.trainerLocation || "",
                trainerExperience: editData.trainerExperience || "",
            });
        }
    }, [editData]);

    const handleTrainerManagement = () => {
        handleClear();
        navigate("/trainerManagement");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (value.trim() !== "" && errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: false,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            trainerEmail: formData.trainerEmail.trim() === "",
            trainerName: formData.trainerName.trim() === "",
            trainerAge: formData.trainerAge === "" || isNaN(formData.trainerAge),
            trainerLocation: formData.trainerLocation.trim() === "",
            trainerExperience: formData.trainerExperience === "" || isNaN(formData.trainerExperience),
        };

        // Validate trainerExperience range (0 - 80)
        const experience = parseInt(formData.trainerExperience);
        if (
            formData.trainerExperience &&
            (isNaN(experience) || experience < 0 || experience > 80)
        ) {
            newErrors.trainerExperience = true;
        }

        const age = parseInt(formData.trainerAge);
        if (isNaN(age) || age < 20 || age > 80) {
            newErrors.trainerAge = true;
        }
        

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!validateForm()) {
            let errorMessage = "Please fill all required fields!";
            
            if (errors.trainerExperience) {
                errorMessage = "Experience must be between 0 and 80";
            } else if (errors.trainerAge) {
                errorMessage = "Age must be between 20 and 80 ";
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

        try {
            const endpoint = isUpdated
                ? `http://localhost:5100/api/updateTrainer/${editData._id}`
                : "http://localhost:5100/api/createTrainer";
            const method = isUpdated ? "put" : "post";

            const response = await axios[method](endpoint, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                  }
            });

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: isUpdated
                    ? "Trainer updated successfully!"
                    : "Trainer created successfully!",
                confirmButtonColor: "#3085d6",
            });

            handleClear();
            handleTrainerManagement();
        }catch (error) {
            console.error("Error:", error);
            const errorMessage = error.response?.data?.message || "An error occurred.";
        
            if (errorMessage === "Trainer already exists") {
                Swal.fire({
                    icon: "error",
                    title: "Email Already Registered",
                    text: "A trainer with this email already exists.",
                    confirmButtonColor: "#3085d6",
                });
            } else if (errorMessage === "Username already exists") {
                Swal.fire({
                    icon: "error",
                    title: "Username Taken",
                    text: "Please choose a different trainer name.",
                    confirmButtonColor: "#3085d6",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `An error occurred while ${
                        isUpdated ? "updating" : "creating"
                    } trainer.`,
                    confirmButtonColor: "#3085d6",
                });
            }
        }finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            trainerEmail: '',
            trainerName: "",
            trainerAge: "",
            trainerLocation: "",
            trainerExperience: "",
        });
        setErrors({
            trainerEmail: false,
            trainerName: false,
            trainerAge: false,
            trainerLocation: false,
            trainerExperience: false,
        });
    };

    return (
        <div className="content" style={{ overflowY: "auto", height: "100vh" }}>
            <div className="container-fluid" style={{ marginTop: "20px" }}>
                <div className="card" style={{ boxShadow: "rgba(0, 0, 0, 0.75) 0px 0px 4px -1px" }}>
                    <div className="card-body">
                        <div className="d-flex justify-content-end mb-3">
                            <button className="btn btn-blue" onClick={handleTrainerManagement}>
                                Trainer Management
                            </button>
                        </div>
                        <div style={{ padding: "20px", backgroundColor: "#f0f4f8" }}>
                            <div
                                style={{
                                    backgroundColor: "#ffffff",
                                    padding: "20px",
                                    borderRadius: "10px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <form onSubmit={handleSubmit}>
                                    {/* Trainer Email */}
                                    {!isUpdated && (
                                        <div className="mb-3">
                                            <label htmlFor="trainerEmail" className="form-label">
                                                Trainer Email *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="trainerEmail"
                                                name="trainerEmail"
                                                placeholder="Enter trainer email"
                                                value={formData.trainerEmail}
                                                onChange={handleChange}
                                            />
                                            {errors.trainerEmail && (
                                                <div className="text-danger small mt-1">
                                                    Please enter trainer email
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Trainer Name */}
                                    <div className="mb-3">
                                        <label htmlFor="trainerName" className="form-label">
                                            Trainer Name *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="trainerName"
                                            name="trainerName"
                                            placeholder="Enter trainer name"
                                            value={formData.trainerName}
                                            onChange={handleChange}
                                        />
                                        {errors.trainerName && (
                                            <div className="text-danger small mt-1">
                                                Please enter trainer name
                                            </div>
                                        )}
                                    </div>

                                    {/* Trainer Location */}
                                    <div className="mb-3">
                                        <label htmlFor="trainerLocation" className="form-label">
                                            Trainer Location *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="trainerLocation"
                                            name="trainerLocation"
                                            placeholder="Enter location"
                                            value={formData.trainerLocation}
                                            onChange={handleChange}
                                        />
                                        {errors.trainerLocation && (
                                            <div className="text-danger small mt-1">
                                                Please enter trainer location
                                            </div>
                                        )}
                                    </div>

                                    {/* Trainer Age */}
                                    <div className="mb-3">
                                        <label htmlFor="trainerAge" className="form-label">
                                            Trainer Age *
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="trainerAge"
                                            name="trainerAge"
                                            placeholder="Enter age"
                                            value={formData.trainerAge}
                                            onChange={handleChange}
                                        />
                                        {errors.trainerAge && (
                                            <div className="text-danger small mt-1">
                                                Trainer Age must be between 20 and 80
                                            </div>
                                        )}
                                    </div>

                                    {/* Trainer Experience */}
                                    <div className="mb-3">
                                        <label htmlFor="trainerExperience" className="form-label">
                                            Trainer Experience *
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="trainerExperience"
                                            name="trainerExperience"
                                            placeholder="Enter experience"
                                            value={formData.trainerExperience}
                                            onChange={handleChange}
                                        />
                                        {errors.trainerExperience && (
                                            <div className="text-danger small mt-1">
                                                Trainer experience must be between 0 and 80
                                            </div>
                                        )}
                                    </div>

                                    {/* Buttons */}
                                    <button
                                        type="submit"
                                        className="btn btn-success me-2"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                        ) : isUpdated ? (
                                            "Update Trainer"
                                        ) : (
                                            "Create Trainer"
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
                                        onClick={handleTrainerManagement}
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

export default TrainerForm;
