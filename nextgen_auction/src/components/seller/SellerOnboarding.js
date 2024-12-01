// import React, { useState } from "react";

// const SellerOnboarding = () => {
//     const [form, setForm] = useState({
//         email: "",
//         password: "",
//         confirmPassword: "",
//         verifyEmail: false,
//         verifyPhone: false,
//         sellerName: "",
//         displayName: "",
//         orgName: "",
//         website: "",
//         secondPhone: "",
//         address: {
//             country: "",
//             state: "",
//             city: "",
//             pincode: "",
//             location: "",
//         },
//         logo: null,
//         caption: "",
//         license: null,
//         aadhaar: null,
//         pan: null,
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setForm({ ...form, [name]: value });
//     };

//     const handleFileChange = (e) => {
//         const { name } = e.target;
//         setForm({ ...form, [name]: e.target.files[0] });
//     };

//     const handleAddressChange = (e) => {
//         const { name, value } = e.target;
//         setForm({ ...form, address: { ...form.address, [name]: value } });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Form submitted:", form);
//     };

//     const handleReset = () => {
//         setForm({
//             email: "",
//             password: "",
//             confirmPassword: "",
//             verifyEmail: false,
//             verifyPhone: false,
//             sellerName: "",
//             displayName: "",
//             orgName: "",
//             website: "",
//             secondPhone: "",
//             address: {
//                 country: "",
//                 state: "",
//                 city: "",
//                 pincode: "",
//                 location: "",
//             },
//             logo: null,
//             caption: "",
//             license: null,
//             aadhaar: null,
//             pan: null,
//         });
//     };

//     return (
//         <div className="container mt-5">
//             <h2 className="text-center mb-4">Seller Signup</h2>
//             <form onSubmit={handleSubmit}>
//                 {/* Login Details */}
//                 <div className="card p-4 mb-4">
//                     <h4>Seller Login Details</h4>
//                     <div className="row">
//                         <div className="col-md-6 mb-3">
//                             <label>Email</label>
//                             <input
//                                 type="email"
//                                 className="form-control"
//                                 name="email"
//                                 value={form.email}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Password</label>
//                             <input
//                                 type="password"
//                                 className="form-control"
//                                 name="password"
//                                 value={form.password}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Confirm Password</label>
//                             <input
//                                 type="password"
//                                 className="form-control"
//                                 name="confirmPassword"
//                                 value={form.confirmPassword}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Seller Details */}
//                 <div className="card p-4 mb-4">
//                     <h4>Seller Details</h4>
//                     <div className="row">
//                         <div className="col-md-6 mb-3">
//                             <label>Seller Name</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="sellerName"
//                                 value={form.sellerName}
//                                 onChange={handleInputChange}
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Display Name</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="displayName"
//                                 value={form.displayName}
//                                 onChange={handleInputChange}
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Organization Name</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="orgName"
//                                 value={form.orgName}
//                                 onChange={handleInputChange}
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Website</label>
//                             <input
//                                 type="url"
//                                 className="form-control"
//                                 name="website"
//                                 value={form.website}
//                                 onChange={handleInputChange}
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Second Phone Number</label>
//                             <input
//                                 type="tel"
//                                 className="form-control"
//                                 name="secondPhone"
//                                 value={form.secondPhone}
//                                 onChange={handleInputChange}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Address Section */}
//                 <div className="card p-4 mb-4">
//                     <h4>Address Details</h4>
//                     <div className="row">
//                         <div className="col-md-4 mb-3">
//                             <label>Country</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="country"
//                                 value={form.address.country}
//                                 onChange={handleAddressChange}
//                             />
//                         </div>
//                         <div className="col-md-4 mb-3">
//                             <label>State</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="state"
//                                 value={form.address.state}
//                                 onChange={handleAddressChange}
//                             />
//                         </div>
//                         <div className="col-md-4 mb-3">
//                             <label>City</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="city"
//                                 value={form.address.city}
//                                 onChange={handleAddressChange}
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Pincode</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="pincode"
//                                 value={form.address.pincode}
//                                 onChange={handleAddressChange}
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Location</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 name="location"
//                                 value={form.address.location}
//                                 onChange={handleAddressChange}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Document Upload Section */}
//                 <div className="card p-4 mb-4">
//                     <h4>Documents</h4>
//                     <div className="row">
//                         <div className="col-md-6 mb-3">
//                             <label>Seller Logo</label>
//                             <input
//                                 type="file"
//                                 className="form-control"
//                                 name="logo"
//                                 onChange={handleFileChange}
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Caption/Description</label>
//                             <textarea
//                                 className="form-control"
//                                 name="caption"
//                                 value={form.caption}
//                                 onChange={handleInputChange}
//                             ></textarea>
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Seller License</label>
//                             <input
//                                 type="file"
//                                 className="form-control"
//                                 name="license"
//                                 onChange={handleFileChange}
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>Aadhaar</label>
//                             <input
//                                 type="file"
//                                 className="form-control"
//                                 name="aadhaar"
//                                 onChange={handleFileChange}
//                             />
//                         </div>
//                         <div className="col-md-6 mb-3">
//                             <label>PAN Card</label>
//                             <input
//                                 type="file"
//                                 className="form-control"
//                                 name="pan"
//                                 onChange={handleFileChange}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="text-center">
//                     <button type="submit" className="btn btn-primary me-2">
//                         Save
//                     </button>
//                     <button type="button" className="btn btn-secondary" onClick={handleReset}>
//                         Reset
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default SellerOnboarding;




import React, { useState } from "react";

const SellerOnboarding = () => {
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
        <div className="seller-register-container mt-5">
            <h2 className="text-center mb-4">Seller Signup</h2>
            <form onSubmit={handleSubmit} className="onboarding-form">
                
                {/* Seller Login Details */}
                <div className="card p-4 mb-4 shadow-sm">
                    <h4 className="mb-3">Seller Login Details</h4>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                value={form.password}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={handleInputChange}
                                required
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>
                </div>

                {/* Seller Details */}
                <div className="card p-4 mb-4 shadow-sm">
                    <h4 className="mb-3">Seller Details</h4>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label>Seller Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="sellerName"
                                value={form.sellerName}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
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
                                placeholder="Enter your display name"
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
                                placeholder="Enter organization name"
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
                                placeholder="https://yourwebsite.com"
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
                                placeholder="Enter another phone number"
                            />
                        </div>
                    </div>

                    {/* Address */}
                    <h5 className="mt-4">Address</h5>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label>Country</label>
                            <input
                                type="text"
                                className="form-control"
                                name="country"
                                value={form.address.country}
                                onChange={handleAddressChange}
                                placeholder="Country"
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
                                placeholder="State"
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
                                placeholder="City"
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
                                placeholder="Pincode"
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
                                placeholder="Specific location"
                            />
                        </div>
                    </div>

                    {/* File Uploads */}
                    <h5 className="mt-4">Documents</h5>
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
                                placeholder="Describe your business or products"
                            ></textarea>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Seller License</label>
                            <input
                                type="file"
                                className="form-control"
                                name="license"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label>Aadhaar</label>
                            <input
                                type="file"
                                className="form-control"
                                name="aadhaar"
                                onChange={handleFileChange}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
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

                {/* Action Buttons */}
                <div className="text-center mb-5">
                    <button type="submit" className="btn btn-primary me-2">
                        Save
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </form>

            {/* Inline CSS for Better Visual Experience */}
            <style jsx>{`
                .seller-register-container {
                    max-width: 900px;
                    margin: 0 auto;
                }

                .card {
                    border-radius: 8px;
                    padding: 25px;
                    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.05);
                }

                .form-control {
                    border-radius: 5px;
                    padding: 12px;
                    font-size: 1rem;
                    margin-bottom: 12px;
                }

                .form-control:focus {
                    border-color: #0066cc;
                    box-shadow: 0 0 5px rgba(0, 102, 204, 0.5);
                }

                label {
                    font-weight: 500;
                    margin-bottom: 5px;
                }

                textarea.form-control {
                    resize: vertical;
                }

                .btn {
                    border-radius: 5px;
                    padding: 12px 25px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .btn-primary {
                    background-color: #0066cc;
                    border: none;
                }

                .btn-primary:hover {
                    background-color: #0057a8;
                    cursor: pointer;
                }

                .btn-secondary {
                    background-color: #f0f0f0;
                    border: none;
                }

                .btn-secondary:hover {
                    background-color: #dcdcdc;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .col-md-4, .col-md-6 {
                        flex: 0 0 100%;
                        max-width: 100%;
                    }

                    .card {
                        padding: 15px;
                    }

                    .form-control {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default SellerOnboarding;
