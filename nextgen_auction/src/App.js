import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navabar';

function App() {
    return (
        <Router>
            <div>
                <Navbar />
            </div>
        </Router>
    );
}

export default App;
