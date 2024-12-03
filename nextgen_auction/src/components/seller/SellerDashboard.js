import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const SellerDashBoard = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column"}}>
            {/* Fixed Horizontal Navbar */}
            <nav
                style={{
                    background: "#333",
                    padding: "10px 20px",
                    color: "#fff",
                }}
            >
                <ul style={{ display: "flex", listStyle: "none"}} className="p-2 d-flex justify-content-evenly">
                    <li >
                        <NavLink
                            to="/seller"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                            })}
                        >
                            Auction Home
                        </NavLink>
                    </li>
                    <li >
                        <NavLink
                            to="/seller/AddProduct"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
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
                            })}
                        >
                            My Products
                        </NavLink>
                    </li>
                    <li >
                        <NavLink
                            to="/seller/WinnersList"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                            })}
                        >
                            Winners List
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/seller/orders"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                            })}
                        >
                            View Orders
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
