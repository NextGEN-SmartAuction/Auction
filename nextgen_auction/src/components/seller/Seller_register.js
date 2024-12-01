import React, { useState } from "react";
// import "./SellerRegister.css"; // Import the custom CSS file

const Seller_register = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        verifyEmail: false,
        verifyPhone: false,
        sellerName: "",
        displayName: "",
        orgName: "",
        website: "",
        secondPhone: "",
        address: {
            country: "",
            state: "",
            city: "",
            pincode: "",
            location: "",
        },
        logo: null,
        caption: "",
        license: null,
        aadhaar: null,
        pan: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        setForm({ ...form, [name]: e.target.files[0] });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, address: { ...form.address, [name]: value } });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", form);
    };

    const handleReset = () => {
        setForm({
            email: "",
            password: "",
            confirmPassword: "",
            verifyEmail: false,
            verifyPhone: false,
            sellerName: "",
            displayName: "",
            orgName: "",
            website: "",
            secondPhone: "",
            address: {
                country: "",
                state: "",
                city: "",
                pincode: "",
                location: "",
            },
            logo: null,
            caption: "",
            license: null,
            aadhaar: null,
            pan: null,
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Seller Signup</h2>
            <form onSubmit={handleSubmit}>
                {/* Login Details */}
                <div className="card p-4 mb-4">
                    <h4>Seller Login Details</h4>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Seller Details */}
                <div className="card p-4 mb-4">
                    <h4>Seller Details</h4>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Seller Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="sellerName"
                                value={form.sellerName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Display Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="displayName"
                                value={form.displayName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Organization Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="orgName"
                                value={form.orgName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Website</label>
                            <input
                                type="url"
                                className="form-control"
                                name="website"
                                value={form.website}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Second Phone Number</label>
                            <input
                                type="tel"
                                className="form-control"
                                name="secondPhone"
                                value={form.secondPhone}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Address Section */}
                <div className="card p-4 mb-4">
                    <h4>Address Details</h4>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label>Country</label>
                            <input
                                type="text"
                                className="form-control"
                                name="country"
                                value={form.address.country}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>State</label>
                            <input
                                type="text"
                                className="form-control"
                                name="state"
                                value={form.address.state}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>City</label>
                            <input
                                type="text"
                                className="form-control"
                                name="city"
                                value={form.address.city}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Pincode</label>
                            <input
                                type="text"
                                className="form-control"
                                name="pincode"
                                value={form.address.pincode}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Location</label>
                            <input
                                type="text"
                                className="form-control"
                                name="location"
                                value={form.address.location}
                                onChange={handleAddressChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Document Upload Section */}
                <div className="card p-4 mb-4">
                    <h4>Documents</h4>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Seller Logo</label>
                            <input
                                type="file"
                                className="form-control"
                                name="logo"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Caption/Description</label>
                            <textarea
                                className="form-control"
                                name="caption"
                                value={form.caption}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Seller License</label>
                            <input
                                type="file"
                                className="form-control"
                                name="license"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>Aadhaar</label>
                            <input
                                type="file"
                                className="form-control"
                                name="aadhaar"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label>PAN Card</label>
                            <input
                                type="file"
                                className="form-control"
                                name="pan"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="text-center">
                    <button type="submit" className="btn btn-primary me-2">
                        Save
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Seller_register;
