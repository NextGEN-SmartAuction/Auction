import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navabar';
import Login from './components/Login';
import Home from './components/Home';

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <main>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
