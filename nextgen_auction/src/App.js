import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navabar';
import Seller_register from './components/seller/Seller_register';
import Add from "./components/seller/Add_product";

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Seller_register/>} />
                        <Route path="/add" element={<Add />}/>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
