import React from 'react';

const FooterComponent = () => {
    return (
        <footer style={styles.footer}>
            {/* First Box - Company Name */}
            <div  className ="mx-4 "style={styles.companyBox}>
                <h3 style={styles.companyName}>Nextgen Auction Ltd</h3>
            </div>

            {/* Second Box - Copyright */}
            <div style={styles.copyrightBox}>
                <span style={styles.copyrightText}>© 2024 Nextgen Auction Ltd</span>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    companyBox: {
        width: '100%',
        backgroundColor: '#1abc9c', // First box color (teal)
        color: '#ffffff', // Light text for contrast
        padding: '20px',
        textAlign: 'left', // Text aligned to the left
        borderBottom: '1px solid #16a085',
    },
    companyName: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    copyrightBox: {
        width: '100%',
        backgroundColor: '#34495e', // Second box color (dark gray)
        color: '#ecf0f1', // Light text for contrast
        padding: '15px',
        textAlign: 'center', // Copyright text centered
    },
    copyrightText: {
        fontSize: '14px',
    },
};

export default FooterComponent;
