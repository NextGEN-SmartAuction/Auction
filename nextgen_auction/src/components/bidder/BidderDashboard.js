import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const BidderDashBoard = () => {
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
                            to="/bidder"
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
                            to="/bidder/MyBids"
                            style={({ isActive }) => ({
                                textDecoration: "none",
                                color: isActive ? "#4CAF50" : "#fff",
                                fontWeight: isActive ? "bold" : "normal",
                            })}
                        >
                            My Bids
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

export default BidderDashBoard;
