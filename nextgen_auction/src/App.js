import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import Hero from './components/Hero';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import SellerOnboarding from './components/seller/SellerOnboarding';
import BidderOnboarding from './components/bidder/BidderOnboarding';
import AddProduct from './components/seller/AddProduct';
import SellerDashBoard from './components/seller/SellerDashboard';
import SignUp from './components/signup';
import ViewProduct from './components/ViewProduct';

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const jwtToken = Cookies.get('jwt');
        if (jwtToken) {
            const checkAuthenticationStatus = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_ServerUrl}/profile`,
                        { withCredentials: true }
                    );
                    const { role } = response.data;
                    setLoggedIn(true);
                    setRole(role);
                } catch (error) {
                    console.error('Authentication check failed:', error);
                }
            };
            checkAuthenticationStatus();
        }
    }, []);

    const renderRoutes = () => {
        if (!loggedIn) {
            return (
                <Routes>
                    <Route path="/" element={<Hero />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/SellerOnboarding" element={<SellerOnboarding />} />
                    <Route path="/BidderOnboarding" element={<BidderOnboarding />} />
                </Routes>
            );
        }

        switch (role) {
            case 'admin':
                return (
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {/* Add more admin-specific routes here */}
                    </Routes>
                );
            case 'seller':
                return (
                    <Routes>
                        <Route
                            path="/seller"
                            element={
                                <>
                                    <SellerDashBoard />
                                    <Hero />
                                </>
                            }
                        />
                        <Route path="/seller/*" element={<SellerDashBoard />} />
                        <Route
                            path="/seller/AddProduct"
                            element={
                                <>
                                    <SellerDashBoard />

                                    <AddProduct />
                                </>
                            }
                        />
                        {/* Add more seller-specific routes here */}
                    </Routes>
                );

            case 'bidder':
                return (
                    <Routes>
                        <Route path="/bidder" element={<Home />} />
                        <Route path="/bidder/viewproduct/:hash" element={<ViewProduct />} />

                        {/* Add more bidder-specific routes here */}
                    </Routes>
                );
            default:
                return (
                    <Routes>
                        <Route path="/" element={<Hero />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/SellerOnboarding" element={<SellerOnboarding />} />
                        <Route path="/BidderOnboarding" element={<BidderOnboarding />} />
                    </Routes>
                );
        }
    };

    return (
        <Router>
            <div>
                <Navbar />
                <main>{renderRoutes()}</main>
            </div>
        </Router>
    );
}

export default App;
