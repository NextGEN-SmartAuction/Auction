import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Hero from './components/Hero';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import NavbarWithHover from './components/options';
import AddProduct from "./components/seller/AddProduct";
import SellerOnboarding from './components/seller/SellerOnboarding';

function App() {
    return (
        <Router>
            <Hero/>
            <NavbarWithHover/>
            <div>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/SellerOnboarding" element={<SellerOnboarding/>} />
                        <Route path="/AddProduct" element={<AddProduct />}/>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
