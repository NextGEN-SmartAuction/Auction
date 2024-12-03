import React from 'react';
import { NavLink } from 'react-router-dom';  // Import NavLink for routing

const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.logoContainer} >
                <img
                    src="https://media.licdn.com/dms/image/D5612AQEglNXFBaW8ow/article-cover_image-shrink_720_1280/0/1693372240579?e=2147483647&v=beta&t=_JDNHUoa9vfM8_1zinTiCC_c7wP-7d7jVCRyPgGxXVI"
                    alt="Logo"
                    style={styles.logo}
                />
                <h1 style={styles.title}>NextGen Auction</h1>
            </div>
            <div style={styles.menu}>
                {/* Use NavLink to handle routing and active state */}
                <NavLink
                    to="/SellerOnboarding"
                    style={({ isActive }) => isActive ? { ...styles.navItem, ...styles.active } : styles.navItem}
                >
                    Seller Onboarding
                </NavLink>
                <NavLink
                    to="/BidderOnboarding"
                    style={({ isActive }) => isActive ? { ...styles.navItem, ...styles.active } : styles.navItem}
                >
                    Bidder Onboarding
                </NavLink>
                <NavLink
                    to="/login"
                    style={({ isActive }) => isActive ? { ...styles.navItem, ...styles.active } : styles.navItem}
                >
                    Login
                </NavLink>
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        width: '100%',
        backgroundColor: '#4B0082',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        color: '#fff',
        zIndex: 1000,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        width: '50px',
        height: '50px',
        marginRight: '10px',
        borderRadius: '50%',
        border: '2px solid #fff',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    menu: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    // Normal state: purple background and yellow text
    navItem: {
        backgroundColor: '#4B0082', // Purple background for normal state
        color: '#FFD700', // Yellow text for normal state
        border: 'none',
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        textDecoration: 'none', // Remove underline from links
    },
    // Active state: yellow background and purple text
    active: {
        backgroundColor: '#FFD700', // Yellow background for active state
        color: '#4B0082', // Purple text for active state
    },
};

export default Navbar;
