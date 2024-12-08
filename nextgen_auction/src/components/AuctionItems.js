import React, { useEffect, useState } from "react";
import axios from "axios";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";

const AuctionItems = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalData, setModalData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_ServerUrl}/products`, {
                    withCredentials: true,
                });
                setProducts(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product details:", err.response?.data || err.message);
                setError("Failed to fetch product details! Please try again.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const groupedProducts = {
        ongoing: products.filter((p) => p.auctionStatus === "ongoing"),
        upcoming: products.filter((p) => p.auctionStatus === "upcoming"),
        completed: products.filter((p) => p.auctionStatus === "completed"),
    };

    const openModal = (product) => setModalData(product);
    const closeModal = () => setModalData(null);

    const renderCountdown = ({ days, hours, minutes, seconds, completed }, isUpcoming) => {
        if (completed) {
            return <span style={styles.countdown}>{isUpcoming ? "Auction Started" : "Auction Ended"}</span>;
        }
        return (
            <span style={styles.countdown}>
                {isUpcoming ? "Auction starts in: " : "Auction ends in: "}
                {days}d {hours.toString().padStart(2, "0")}:
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
            </span>
        );
    };

 

    const handlePlaceBid = (productId) => {
        const hash = btoa(productId); // Hash the product ID
        navigate(`/bidder/viewproduct/${hash}`);
    };

    const renderSection = (title, items, isUpcoming) => (
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{title}</h2>
            <div style={styles.container}>
                {items.map((product) => (
                    <div key={product.productId} style={styles.card}>
                        <img
                            src={`${process.env.REACT_APP_DataServer}/products/${product.logoImageName}`}
                            alt={product.productName}
                            style={styles.image}
                        />
                        <div style={styles.cardContent}>
                            <h3 style={styles.title}>{product.productName}</h3>
                            <p style={styles.category}>Category: {product.category}</p>
                            <p style={styles.auctionStatus}>
                                <Countdown
                                    date={isUpcoming ? new Date(product.startDateTime) : new Date(product.endDateTime)}
                                    renderer={(props) => renderCountdown(props, isUpcoming)}
                                />
                            </p>
                            <p style={styles.minimumPrice}>
                                Minimum Price: <strong>₹{product.minimumPrice}</strong>
                            </p>
                            <div style={styles.buttonGroup}>
                                <button style={styles.button} className="mx-2"onClick={() => openModal(product)}>
                                    View Details
                                </button>
                                {product.auctionStatus === "ongoing" && (
                                    <button style={styles.button} className="mx-3" onClick={() => handlePlaceBid(product.productId)}>
                                        Place Bid
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div style={styles.loaderContainer}>
                <p style={styles.loaderText}>Loading auction items...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <p style={styles.errorText}>{error}</p>
            </div>
        );
    }

    return (
        <>
            {renderSection("Upcoming Auctions", groupedProducts.upcoming, true)}
            {renderSection("Ongoing Auctions", groupedProducts.ongoing, false)}
            {renderSection("Completed Auctions", groupedProducts.completed)}

            {modalData && (
                <div style={styles.modalOverlay} onClick={closeModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>{modalData.productName}</h2>
                        <p style={styles.modalText}>{modalData.description}</p>
                        <button style={styles.modalCloseButton} onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    container: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "30px",
        padding: "20px",
    },
    section: {
        padding: "20px",
    },
    sectionTitle: {
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
    },
    loaderContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    },
    loaderText: {
        fontSize: "20px",
        fontWeight: "bold",
    },
    card: {
        width: "300px",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.2)",
    },
    cardContent: {
        padding: "15px",
    },
    image: {
        width: "100%",
        height: "200px",
        objectFit: "cover",
    },
    title: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    auctionStatus: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#f00",
    },
    countdown: {
        color: "#4caf50",
        fontWeight: "bold",
    },
    button: {
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#ff6f61",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "400px",
        textAlign: "center",
    },
    modalTitle: {
        fontSize: "20px",
        fontWeight: "bold",
    },
    modalText: {
        margin: "10px 0",
    },
    modalCloseButton: {
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#ff6f61",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default AuctionItems;
