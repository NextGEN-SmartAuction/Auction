import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Navbar = () => {
    const [user, setUser] = useState(null); // User state to store username and role
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user details if logged in
        const jwtToken = Cookies.get('jwt');
        if (jwtToken) {
            axios
                .get(`${process.env.REACT_APP_ServerUrl}/profile`, {
                    withCredentials: true,
                })
                .then((response) => {
                    console.log(response.data)
                    const { username, role ,displayName} = response.data;
                    setUser({ displayName, role });
                })
                .catch((error) => {
                    console.error('Failed to fetch user details:', error);
                });
        }
    }, []);

    const handleLogoClick = () => {
        if (user?.role) {
            navigate(`/${user.role}`); // Redirect to role-specific page
        } else {
            navigate('/'); // Default to home page if not logged in
        }
    };

    const handleEditProfile = () => {
        navigate('/edit-profile'); // Redirect to edit profile page
    };

    const handleLogout = () => {
        // Delete all cookies and clear user state
        Cookies.remove('jwt');
        setUser(null);
        navigate('/'); 
        window.location.reload()// Redirect to the home page
    };


    return (
        <nav style={styles.navbar}>
            <div style={styles.logoContainer} className="p-2">
                <div
                    onClick={handleLogoClick}
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <img
                        src="https://media.licdn.com/dms/image/D5612AQEglNXFBaW8ow/article-cover_image-shrink_720_1280/0/1693372240579?e=2147483647&v=beta&t=_JDNHUoa9vfM8_1zinTiCC_c7wP-7d7jVCRyPgGxXVI"
                        alt="Logo"
                        style={styles.logo}
                    />
                    <h1 style={styles.title}>NextGen Auction</h1>
                </div>
            </div>
            <div style={styles.menu}>
                {user ? (
                    <>
                        {/* Show username and role */}
                        <span style={styles.userInfo}>
                           [ {user.displayName}] [{user.role}]
                        </span>
                        {/* Edit Profile Button */}
                        <button style={styles.navButton} onClick={handleEditProfile}>
                            Edit Profile
                        </button>
                        {/* Logout Button */}
                        <button style={styles.navButton} onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        {/* Show default navigation links */}
                        <NavLink
                            to="/SellerOnboarding"
                            style={({ isActive }) => (isActive ? { ...styles.navItem, ...styles.active } : styles.navItem)}
                        >
                            Seller Onboarding
                        </NavLink>
                        <NavLink
                            to="/BidderOnboarding"
                            style={({ isActive }) => (isActive ? { ...styles.navItem, ...styles.active } : styles.navItem)}
                        >
                            Bidder Onboarding
                        </NavLink>
                        <NavLink
                            to="/login"
                            style={({ isActive }) => (isActive ? { ...styles.navItem, ...styles.active } : styles.navItem)}
                        >
                            Login
                        </NavLink>
                    </>
                )}
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
        color: '#fff',
    },
    menu: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    navItem: {
        backgroundColor: '#4B0082',
        color: '#FFD700',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
        textDecoration: 'none',
    },
    active: {
        backgroundColor: '#FFD700',
        color: '#4B0082',
    },
    userInfo: {
        fontSize: '16px',
        color: '#FFD700',
        marginRight: '10px',
        fontWeight: 'bold',
    },
    navButton: {
        backgroundColor: '#FFD700',
        color: '#4B0082',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease',
    },
};

export default Navbar;
