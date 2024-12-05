import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const navigate = useNavigate(); // Hook to navigate between pages

    // Navigation functions
    const handleSellerSignUp = () => {
        navigate('/SellerOnboarding');
    };

    const handleBidderSignUp = () => {
        navigate('/BidderOnboarding');
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    // Define styles as constants
    const styles = {
        image: {
            maxWidth: '80%',
            height: 'auto',
            marginBottom: '20px',
        },
        heading: {
            fontSize: '22px',
            marginBottom: '8px',
        },
        description: {
            fontSize: '14px',
            marginBottom: '20px',
        },
        button: {
            backgroundColor: 'white',
            color: '#333',
            fontSize: '12px', // Reduced font size
            fontWeight: '600',
            width: '100%',
            padding: '10px', // Reduced padding
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
            height: '50px', // Increased height
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#FF9A8B',
        },
        linkButton: {
            background: 'none',
            color: 'white',
            border: 'none',
            fontSize: '14px',
            textDecoration: 'underline',
            cursor: 'pointer',
        },
        linkButtonHover: {
            color: '#FF9A8B',
        },
    };

    return (
        <div className="d-flex">
            {/* Left Section - Seller Onboarding */}
            <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center text-center p-4"
                style={{ background: 'linear-gradient(to bottom, #FF6F61, #FF9A8B)' }}
            >
                <img
                    src="https://media.istockphoto.com/id/472376163/vector/online-shopping-and-delivery-from-your-tablet.jpg?s=612x612&w=0&k=20&c=z3sGF1W2VtskPMDozh0yDw-Pm0VsadbRlta9IfKxB8Y="
                    alt="Seller Onboarding"
                    style={styles.image}
                    className="p-4"
                    width={612}
                    height={612}
                />
                <h1 style={styles.heading} className="mt-3">Seller Onboarding</h1>
                <p style={styles.description}>Join us as a seller and start your business journey!</p>
                <button
                    onClick={handleSellerSignUp}
                    style={styles.button}
                    className="btn"
                    onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                >
                    Sign Up as Seller
                </button>
                <button
                    onClick={handleLoginRedirect}
                    style={styles.linkButton}
                    onMouseEnter={(e) => (e.target.style.color = styles.linkButtonHover.color)}
                    onMouseLeave={(e) => (e.target.style.color = 'white')}
                >
                    Already have an account? Login
                </button>
            </div>

            {/* Right Section - Bidder Onboarding */}
            <div className="col-12 col-md-6 d-flex flex-column align-items-center justify-content-center text-center p-4"
                style={{ background: 'linear-gradient(to bottom, #00B4D8, #48C9B0)' }}
            >
                <img
                    src="https://media.istockphoto.com/id/1194209496/vector/car-auction-online-vector-concept-for-web-banner-website-page.jpg?s=612x612&w=0&k=20&c=MeowyJmB5FeDsyW-Aod5iwPHSeSY2tPcl20iC34StSc="
                    alt="Bidder Onboarding"
                    style={styles.image}
                    className="p-4"
                    width={612}
                    height={612}
                />
                <h1 style={styles.heading} className="mt-3">Bidder Onboarding</h1>
                <p style={styles.description}>Join us as a bidder and start participating in exciting bids!</p>
                <button
                    onClick={handleBidderSignUp}
                    style={styles.button}
                    className="btn"
                    onMouseEnter={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = 'white')}
                >
                    Sign Up as Bidder
                </button>
                <button
                    onClick={handleLoginRedirect}
                    style={styles.linkButton}
                    onMouseEnter={(e) => (e.target.style.color = styles.linkButtonHover.color)}
                    onMouseLeave={(e) => (e.target.style.color = 'white')}
                >
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
}

export default SignUp;
