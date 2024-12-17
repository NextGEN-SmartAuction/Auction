import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const AdminDashBoard = () => {
    const navigate = useNavigate();

    // Function to handle navigation and page reload
    const handleNavClick = (to) => {
        navigate(to);        // Navigate to the target route
        setTimeout(() => {    // Timeout to allow React Router navigation to complete
            window.location.reload();  // Reload the page
        }, 50);               // A small delay to ensure navigation happens before reloading
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Fixed Horizontal Navbar */}
            <nav
                style={{
                    background: "#333",
                    padding: "10px 20px",
                    color: "#fff",
                }}
            >
                <ul
                    style={{
                        display: "flex",
                        listStyle: "none",
                        justifyContent: "space-evenly",
                        padding: 0,
                        margin: 0,
                    }}
                >
                    <li>
                        <NavLink
                            to="/admin"
                            end
                            onClick={(e) => { e.preventDefault(); handleNavClick("/admin"); }}  // Prevent default NavLink behavior
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                        >
                            Admin Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/SaleCertificate"
                            onClick={(e) => { e.preventDefault(); handleNavClick("/admin/SaleCertificate"); }}  // Prevent default NavLink behavior
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                        >
                            Generate certificate
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/ViewCertificate"
                            onClick={(e) => { e.preventDefault(); handleNavClick("/admin/ViewCertificate"); }}  // Prevent default NavLink behavior
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                        >
                            View Certificate
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Content Area */}
            <div
                style={{
                    marginTop: "8px", // Adjusted for navbar height
                    padding: "20px",
                }}
            >
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashBoard;
