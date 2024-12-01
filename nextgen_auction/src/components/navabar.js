import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 20px',
                borderBottom: '1px solid #ddd',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '60px',
                width: '100%',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Logo or Home button can go here if needed in the future */}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Login Button */}
                <button className="btn btn-dark" onClick={() => navigate('/login')}>
                    Log In
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
