import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const SellerDashBoard = () => {
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
                            to="/seller"
                            end
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                        >
                            Auction Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/seller/AddProduct"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                        >
                            Add Product
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/seller/MyProducts"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                        >
                            My Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/seller/WinnersList"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                        >
                            Winners List
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

export default SellerDashBoard;
