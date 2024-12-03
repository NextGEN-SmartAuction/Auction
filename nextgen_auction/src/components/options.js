import React from 'react';

const NavbarWithHover = () => {
    const menuItems = [
        { label: 'Active Auctions', icon: '🔨' },
        { label: 'Results of Auction', icon: '👍' },
        { label: 'Auctions By Value', icon: '₹' },
        { label: 'Auctions By Org', icon: '🏢' },
        { label: 'Auctions By Prod Category', icon: '🛒' },
    ];

    return (
        <nav style={styles.navbar}>
            {menuItems.map((item, index) => (
                <div key={index} style={styles.menuItem} className="menu-item">
                    <span style={styles.icon}>{item.icon}</span>
                    <span style={styles.label}>{item.label}</span>
                </div>
            ))}
            {/* Include a style tag for hover effects */}
            <style>
                {`
          .menu-item {
            transition: background-color 0.3s ease, color 0.3s ease, transform 0.3s ease;
          }
          .menu-item:hover {
            background-color: grey; /* Change background on hover */
            color: white; /* Change text color on hover */
            transform: translateY(-5px); /* Slightly raise the item */
          }
          .menu-item:active {
            transform: translateY(2px); /* Slightly lower the item when clicked */
          }
        `}
            </style>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: '10px 0',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        borderBottom: '2px solid #e0e0e0', /* Add a bottom border for more definition */
    },
    menuItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '12px 35px', /* Increased padding for more space */
        cursor: 'pointer',
        borderRadius: '10px',
        transition: 'all 0.3s ease', /* Smooth transition for all properties */
    },
    icon: {
        fontSize: '22px', /* Slightly larger icon size */
        marginBottom: '8px',
        transition: 'transform 0.3s ease', /* Smooth icon scaling */
    },
    label: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
        transition: 'color 0.3s ease', /* Smooth transition for text color */
    },
};

export default NavbarWithHover;
