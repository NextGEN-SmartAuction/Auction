import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

<<<<<<< Updated upstream
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setIsLoggedIn(true);
      setUserDetails(user);
    } else {
      setIsLoggedIn(false);
    }
  }, []);
=======
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className="btn btn-dark" onClick={() => navigate('/AddProduct')}>
                AddProduct
                </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className="btn btn-dark" onClick={() => navigate('/SellerOnboarding')}>
                SellerOnboarding
                </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <button className="btn btn-dark" onClick={() => navigate('/BidderOnboarding')}>
                BidderOnboarding
                </button>
            </div>
            
        </nav>
    );
}
>>>>>>> Stashed changes

  const handleLogin = () => {
    const user = { name: "John Doe", email: "johndoe@example.com" };
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoggedIn(true);
    setUserDetails(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserDetails(null);
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img
          src="https://media.licdn.com/dms/image/D5612AQEglNXFBaW8ow/article-cover_image-shrink_720_1280/0/1693372240579?e=2147483647&v=beta&t=_JDNHUoa9vfM8_1zinTiCC_c7wP-7d7jVCRyPgGxXVI"
          alt="Logo"
          style={styles.logo}
        />
        <h1 style={styles.title}>NextGen_Auction</h1>
      </div>
      <div style={styles.menu}>
        <button style={styles.navItem}>Auction Status</button>
        <button style={styles.navItem}>Auction Search</button>
        <button style={styles.navItem}>Department Onboarding</button>
        <button style={styles.navItem}>Bidder Enrollment</button>
        {isLoggedIn ? (
          <div style={styles.userSection}>
            <p style={styles.welcomeText}>Welcome, {userDetails.name}</p>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} style={styles.loginButton}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    position: 'fixed',
    top: 0,
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
  navItem: {
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
  loginButton: {
    backgroundColor: '#FF4081',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '15px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  welcomeText: {
    fontSize: '14px',
    color: '#FFD700',
  },
};

// Add hover effects
Object.keys(styles).forEach((key) => {
  if (key.includes('navItem') || key.includes('Button')) {
    styles[key]['&:hover'] = {
      backgroundColor: '#4B0082',
      color: '#FFD700',
    };
  }
});

export default Navbar;