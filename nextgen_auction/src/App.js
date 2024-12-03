import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import Home from './components/Home';
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import Login from './components/Login';
import Navbar from './components/Navbar';
import SellerOnboarding from './components/seller/SellerOnboarding';
import BidderOnboarding from './components/bidder/BidderOnboarding';
import AddProduct from "./components/seller/AddProduct";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (Cookies.get('jwt')) {
            const checkAuthenticationStatus = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_ServerUrl}/profile`, { withCredentials: true });
                    const { username } = response.data;

                    setLoggedIn(true);
                } catch (error) {
                    console.error(error);
                } finally {
                    console.log("hello ")
                }
            };
            checkAuthenticationStatus();
        }
    }, []);
    return (
        <Router>
            <div>
                <Navbar />
                <main>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                loggedIn ? (
                                    <Home />
                                ) : (
                                    <Hero />
                                )
                            }
                        />
                        <Route path="/login" element={<Login />} />
                        <Route path="/SellerOnboarding" element={<SellerOnboarding />} />
                        <Route path="/BidderOnboarding" element={<BidderOnboarding />} />
                        <Route path="/AddProduct" element={<AddProduct />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
