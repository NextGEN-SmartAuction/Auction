import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';


const SellerOnboarding = () => {
    const [form, setForm] = useState({
        UserName:"",
        email: "",
        password: "",
        confirmPassword: "",
        sellerName: "",
        displayName: "",
        orgName: "",
        website: "",
        address: {
            country: "",
            state: "",
            city: "",
            pincode: "",
            location: "",
        },
        caption: "",
        role: "seller",
        logo: "",  // Store only the logo file name here
    });

    const [logoFile, setLogoFile] = useState(null);




    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });

    const totalSteps = 4;
    const countries = ["India", "USA", "Canada", "Australia", "Germany"]; // Updated list of countries
    const states = {
        India: ["Delhi", "Maharastra", "Karnataka", "Telangana", "Kolkata", "Chennai", "Lucknow", "Andhra Pradesh", "Kerala", "Punjab", "Uttar Pradesh", "Rajasthan"],
        USA: ["California", "Texas", "New York", "Florida", "Illinois", "Ohio", "Michigan"],
        Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Nova Scotia", "Manitoba", "Saskatchewan"],
        Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Australian Capital Territory"],
        Germany: ["Bavaria", "Berlin", "North Rhine-Westphalia", "Hamburg", "Hesse", "Baden-Württemberg", "Saxony"]
    };






    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        console.log("Updated form:", form);
    };
    


    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setLogoFile(files[0]);  // Store the actual file in the logoFile state
        setForm({ ...form, [name]: files[0].name });  // Store only the file name in the form state
    };
   
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, address: { ...form.address, [name]: value } });
    };

    const validateStep = () => {
        switch (step) {
            case 1:
                return form.email && form.password && form.confirmPassword && form.password === form.confirmPassword
            case 2:
                return form.sellerName && form.displayName && form.orgName && form.website && form.logo && form.caption;
            case 3:
                return (
                    form.address.country &&
                    form.address.state &&
                    form.address.city &&
                    form.address.pincode
                );
            case 4:
                return (
                    verificationStatus.emailVerified &&
                    verificationStatus.mobileVerified &&
                    verificationStatus.secondaryMobileVerified
                );
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(step + 1);
        } else {
            toast.error("Please complete all fields before proceeding.");
        }
        if (step === 1 && form.password !== form.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

    };

    const handlePrev = () => {
        setStep(step - 1);
    };

    const uploadLogo = async (file, userName) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("username", userName); // Use userName from form
        formData.append("foldername", "logo"); // Static folder name for logos
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_ServerUrl}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            return response.data; // Returns uploaded file details
        } catch (error) {
            console.error("Failed to upload logo:", error);
            throw new Error("Failed to upload logo!");
        }
    };
    
    

    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // Extract UserName from form data
            const userName = form.UserName; // Access UserName directly from the form object
            console.log("UserName:", userName);
    
            // Check if userName exists
            if (!userName) {
                toast.error("UserName is required!");
                return;
            }
    
            // First, upload the logo file if provided
            if (logoFile) {
                const uploadResponse = await uploadLogo(logoFile, userName);
                form.logo = uploadResponse.file.filename; // Save uploaded logo file name in the form
            }
    
            console.log("Final form data:", form);
    
            // Submit the form data
            const signupResponse = await signup(form);
            console.log("Signup successful:", signupResponse);
            toast.success("Form submitted successfully!");
        } catch (error) {
            console.error("Error in form submission:", error);
            toast.error("Form submission failed!");
        }
    };
    
    
    
    
    const signup = async (formData) => {
        try {
            // Replace the URL with your actual endpoint for user registration
            const response = await axios.post(`${process.env.REACT_APP_ServerUrl}/signup`, formData, {
                withCredentials: true  // Include credentials if needed
            });
            return response.data;  // Return response data from the API
        } catch (error) {
            throw new Error("Signup failed!");  // Propagate error if the request fails
        }
    };
    const handleStepChange = (targetStep) => {
        if (targetStep < step || validateStep()) {
            setStep(targetStep);
        } else {
            toast.error("Please complete the current step before proceeding.");
        }
    };



    const [verificationStatus, setVerificationStatus] = useState({
        emailVerified: false,
        mobileVerified: false,
        secondaryMobileVerified: false,
    });

    const handleVerification = async () => {
        // Simulate sending verification requests to email and mobile numbers.

        // Check if all fields are filled
        if (!form.email || !form.primaryMobile) {
            toast.error("Please provide both email and primary mobile number.");
            return;
        }

        // Simulate sending email verification
        try {
            // This would be an API call to your backend to send an email verification link
            console.log("Sending email verification to:", form.email);
            // Simulate delay
            setTimeout(() => {
                setVerificationStatus(prev => ({
                    ...prev,
                    emailVerified: true,
                }));
                toast.success("Email verification sent!");
            }, 1000);
        } catch (error) {
            console.error("Error sending email verification:", error);
            toast.error("Failed to send email verification.");
        }

        // Simulate sending mobile number verification (primary)
        try {
            // This would be an API call to send an OTP to the primary mobile number
            console.log("Sending OTP to primary mobile number:", form.primaryMobile);
            // Simulate delay
            setTimeout(() => {
                setVerificationStatus(prev => ({
                    ...prev,
                    mobileVerified: true,
                }));
                toast.success("OTP sent to primary mobile number!");
            }, 1000);
        } catch (error) {
            console.error("Error sending mobile verification:", error);
            toast.error("Failed to send mobile number verification.");
        }

        // Simulate sending secondary mobile verification (if entered)
        if (form.secondaryMobile) {
            try {
                // This would be an API call to send an OTP to the secondary mobile number
                console.log("Sending OTP to secondary mobile number:", form.secondaryMobile);
                // Simulate delay
                setTimeout(() => {
                    setVerificationStatus(prev => ({
                        ...prev,
                        secondaryMobileVerified: true,
                    }));
                    toast.success("OTP sent to secondary mobile number!");
                }, 1000);
            } catch (error) {
                console.error("Error sending secondary mobile verification:", error);
                toast.error("Failed to send secondary mobile verification.");
            }
        }
    };




    return (
        <div className="container col-6 mt-5">
            <h2 className="text-center mb-4">Seller Onboarding</h2>

            {/* Progress Bar */}
            <div className="progress mb-4" style={{ height: "30px" }}>
                <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                    aria-valuenow={step}
                    aria-valuemin="0"
                    aria-valuemax="100"
                >
                    <strong>Step {step} of {totalSteps}</strong>
                </div>
            </div>

            {/* Button Group Navigation */}
            <div className="btn-group mb-4 w-100">
                {["Login", "Details", "Address", "Info"].map((label, index) => (
                    <button
                        key={index}
                        className={`btn btn-${step === index + 1 ? "primary" : "secondary"}`}
                        onClick={() => handleStepChange(index + 1)}
                        disabled={index + 1 > step && !validateStep()} // Disable if skipping ahead without validation
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="card p-4 shadow-lg">
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
                            <h4>Login Details</h4>
                            <div className="mb-3">
                                <label>UserName</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="UserName" 
                                    value={form.UserName}
                                    onChange={handleInputChange}
                                    required
                                />

                            </div>
                            <div className="mb-3">
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
                            <div className="mb-3">
                                <label>Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword.password ? "text" : "password"}
                                        className="form-control"
                                        name="password"
                                        value={form.password}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            setShowPassword({
                                                ...showPassword,
                                                password: !showPassword.password,
                                            })
                                        }
                                    >
                                        {showPassword.password ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label>Confirm Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword.confirmPassword ? "text" : "password"}
                                        className="form-control"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleInputChange}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() =>
                                            setShowPassword({
                                                ...showPassword,
                                                confirmPassword: !showPassword.confirmPassword,
                                            })
                                        }
                                    >
                                        {showPassword.confirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h4>Seller Details</h4>
                            <div className="mb-3">
                                <label>Seller Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="sellerName"
                                    value={form.sellerName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Display Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="displayName"
                                    value={form.displayName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Organization Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="orgName"
                                    value={form.orgName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Website</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    name="website"
                                    value={form.website}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Logo</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="logo"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Caption</label>
                                <textarea
                                    className="form-control"
                                    name="caption"
                                    value={form.caption}
                                    onChange={handleInputChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                        </>
                    )}



                    {step === 3 && (
                        <>
                            <h4>Seller Address</h4>
                            <div className="mb-3">
                                <label>Country</label>
                                <select
                                    className="form-control"
                                    name="country"
                                    value={form.address.country}
                                    onChange={handleAddressChange}
                                    required
                                >
                                    <option value="">Select Country</option>
                                    {countries.map((country) => (
                                        <option key={country} value={country}>
                                            {country}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label>State</label>
                                <select
                                    className="form-control"
                                    name="state"
                                    value={form.address.state}
                                    onChange={handleAddressChange}
                                    required
                                >
                                    <option value="">Select State</option>
                                    {(states[form.address.country] || []).map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label>City</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="city"
                                    value={form.address.city}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Pincode</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="pincode"
                                    value={form.address.pincode}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Location</label>
                                <textarea
                                    className="form-control"
                                    name="location"
                                    value={form.address.location}
                                    onChange={handleAddressChange}
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                        </>
                    )}


                    {step === 4 && (
                        <>
                            <h4>Mobile and Email Verification</h4>

                            {/* Email Verification */}
                            <div className="mb-3">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={form.email}
                                    onChange={handleInputChange}
                                    required
                                />
                                <small className="form-text text-muted">We'll send a verification link to your email.</small>
                            </div>

                            {/* Mobile Number Verification */}
                            <div className="mb-3">
                                <label>Primary Mobile Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="primaryMobile"
                                    value={form.primaryMobile}
                                    onChange={handleInputChange}
                                    required
                                    pattern="^\+?[0-9]{10,15}$"  // Pattern for validating phone number
                                    placeholder="Enter your primary mobile number"
                                />
                                <small className="form-text text-muted">We'll send a verification code to this number.</small>
                            </div>

                            {/* Secondary Mobile Number */}
                            <div className="mb-3">
                                <label>Secondary Mobile Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="secondaryMobile"
                                    value={form.secondaryMobile}
                                    onChange={handleInputChange}
                                    pattern="^\+?[0-9]{10,15}$"  // Pattern for validating phone number
                                    placeholder="Enter your secondary mobile number (optional)"
                                />
                                <small className="form-text text-muted">Optional - You can provide a backup number.</small>
                            </div>

                            {/* Button to trigger verification */}
                            <div className="mb-3">
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleVerification}
                                >
                                    Verify Mobile & Email
                                </button>
                            </div>
                        </>
                    )}







                    {/* Other steps omitted for brevity but follow the same structure */}

                    <div className="d-flex justify-content-between mt-4">
                        {step > 1 && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handlePrev}
                            >
                                Previous
                            </button>
                        )}
                        {step < totalSteps ? (
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        ) : (
                            <button type="submit" className="btn btn-success">
                                Submit
                            </button>
                        )}
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default SellerOnboarding;












