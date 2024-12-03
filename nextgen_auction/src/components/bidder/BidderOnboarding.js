import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

const BidderSignup = () => {
    const [form, setForm] = useState({
        email: "",
        role: "bidder",
        password: "",
        confirmPassword: "",
        name: "",
        displayName: "",
        phoneNumber: "",
        address: {
            country: "",
            state: "",
            city: "",
            pincode: "",
            location: "",
        },
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const countries = ["India", "USA", "Canada"];
    const states = {
        India: ["Delhi", "Mumbai", "Bangalore"],
        USA: ["California", "Texas", "New York"],
        Canada: ["Ontario", "Quebec", "British Columbia"],
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address")) {
            const addressField = name.split(".")[1];
            setForm((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value,
                },
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!form.email) newErrors.email = "Email is required";
        if (!form.password) newErrors.password = "Password is required";
        if (form.password !== form.confirmPassword)
            newErrors.confirmPassword = "Passwords must match";
        if (!form.name) newErrors.name = "Name is required";
        if (!form.displayName) newErrors.displayName = "Display Name is required";
        if (!form.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
        if (!form.address.country) newErrors.country = "Country is required";
        if (!form.address.state) newErrors.state = "State is required";
        if (!form.address.city) newErrors.city = "City is required";
        if (!form.address.pincode) newErrors.pincode = "Pincode is required";
        if (!form.address.location) newErrors.location = "Location is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const signup = async (formData) => {
        try {
            // Replace with your actual backend URL
            const response = await axios.post(`${process.env.REACT_APP_ServerUrl}/signup`, formData, {
                withCredentials: true, // Include credentials if required
            });
            return response.data;
        } catch (error) {
            console.error("Signup failed:", error.response?.data || error.message);
            throw new Error("Signup failed! Please try again."); // Throw error for handleSubmit to catch
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Call the signup function with the form data
                const result = await signup(form);
                console.log(result); // Log response from the server
                toast.success("Signup successful!");
            } catch (error) {
                toast.error(error.message); // Display error message from signup function
            }
        } else {
            toast.error("Please fill in all fields correctly.");
        }
    };
    return (
        <div className="container-fluid col-7 mt-4 p-3">
            <div className="card shadow border-5 p-2" >
                <div className="card-body">
                    <h2 className="text-center mb-4">Bidder Signup</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                    id="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="input-group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <div className="invalid-feedback">{errors.confirmPassword}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="displayName" className="form-label">Display Name</label>
                            <input
                                type="text"
                                className={`form-control ${errors.displayName ? "is-invalid" : ""}`}
                                id="displayName"
                                name="displayName"
                                value={form.displayName}
                                onChange={handleChange}
                                required
                            />
                            {errors.displayName && <div className="invalid-feedback">{errors.displayName}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <input
                                type="text"
                                className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
                                id="phoneNumber"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                            {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="country" className="form-label">Country</label>
                            <select
                                className={`form-select ${errors.country ? "is-invalid" : ""}`}
                                id="country"
                                name="address.country"
                                value={form.address.country}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                            {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                        </div>

                        {form.address.country && (
                            <div className="mb-3">
                                <label htmlFor="state" className="form-label">State</label>
                                <select
                                    className={`form-select ${errors.state ? "is-invalid" : ""}`}
                                    id="state"
                                    name="address.state"
                                    value={form.address.state}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select State</option>
                                    {states[form.address.country].map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                                {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="city" className="form-label">City</label>
                            <input
                                type="text"
                                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                id="city"
                                name="address.city"
                                value={form.address.city}
                                onChange={handleChange}
                                required
                            />
                            {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="pincode" className="form-label">Pincode</label>
                            <input
                                type="text"
                                className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                                id="pincode"
                                name="address.pincode"
                                value={form.address.pincode}
                                onChange={handleChange}
                                required
                            />
                            {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="location" className="form-label">Location</label>
                            <input
                                type="text"
                                className={`form-control ${errors.location ? "is-invalid" : ""}`}
                                id="location"
                                name="address.location"
                                value={form.address.location}
                                onChange={handleChange}
                                required
                            />
                            {errors.location && <div className="invalid-feedback">{errors.location}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary ">
                            Signup
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default BidderSignup;
