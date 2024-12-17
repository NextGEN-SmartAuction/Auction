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
    const [liveData, setLiveData] = useState({});

    // Fetch products and update auction status
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

    useEffect(() => {
        const eventSources = {};
    
        // Filter only ongoing products for SSE
        const ongoingProducts = products.filter(product => product.auctionStatus === "ongoing");
    
        // Iterate over ongoing products and start SSE for each
        ongoingProducts.forEach((product) => {
            const eventSource = new EventSource(
                `${process.env.REACT_APP_SseServerUrl}/auction/${product.productId}/updates`
            );
    
            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    
                    // Update the liveData state for the specific product
                    setLiveData((prev) => ({
                        ...prev,
                        [product.productId]: {
                            highestBid: data.highestBid || "No bids yet",
                            highestBidder: data.highestBidder || "N/A",
                            numberOfBids: data.numberOfBids || 0,
                            percentageIncrease: data.percentageIncrease || "N/A",
                        },
                    }));
                } catch (err) {
                    console.error("Error parsing SSE data:", err);
                }
            };
    
            eventSource.onerror = (err) => {
                console.error("SSE connection error:", err);
                eventSource.close();
            };
    
            eventSources[product.productId] = eventSource;
        });
    
        return () => {
            // Cleanup on unmount
            Object.values(eventSources).forEach((source) => source.close());
        };
    }, [products]); // Dependency: Only when products change (as ongoing products are derived from this)
    
    const groupedProducts = {
        ongoing: products.filter((p) => p.auctionStatus === "ongoing"),
        upcoming: products.filter((p) => p.auctionStatus === "upcoming"),
        completed: products.filter((p) => p.auctionStatus === "completed"),
    };

    const openModal = (product) => setModalData(product);
    const closeModal = () => setModalData(null);

    // Handle auction status update from upcoming to ongoing
    const updateAuctionStatus = async (productId) => {
        try {
            await axios.post(
                `${process.env.REACT_APP_ServerUrl}/updateAuctionStatus`,
                { productId, newStatus: "ongoing" },
                { withCredentials: true }
            );
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p.productId === productId ? { ...p, auctionStatus: "ongoing" } : p
                )
            );
        } catch (err) {
            console.error("Error updating auction status:", err.response?.data || err.message);
        }
    };

    const handleAuctionComplete = async (productId) => {
        try {
            await axios.post(
                `${process.env.REACT_APP_ServerUrl}/completeAuction`,
                { productId },
                { withCredentials: true }
            );
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p.productId === productId ? { ...p, auctionStatus: "completed" } : p
                )
            );
        } catch (err) {
            console.error("Error completing auction:", err.response?.data || err.message);
        }
    };

    // Countdown Renderer
    const renderCountdown = (isUpcoming, product) => (
        <Countdown
            date={isUpcoming ? new Date(product.startDateTime) : new Date(product.endDateTime)}
            onComplete={() => {
                if (isUpcoming) {
                    updateAuctionStatus(product.productId);
                } else if (product.auctionStatus === "ongoing") {
                    handleAuctionComplete(product.productId);
                }
            }}
            renderer={({ days, hours, minutes, seconds, completed }) =>
                completed ? (
                    <span style={styles.countdown}>
                        {isUpcoming ? "Auction Started" : "Auction Ended"}
                    </span>
                ) : (
                    <span style={styles.countdown}>
                        {isUpcoming ? "Auction starts in: " : "Auction ends in: "}
                        {days}d {hours.toString().padStart(2, "0")}:
                        {minutes.toString().padStart(2, "0")}:
                        {seconds.toString().padStart(2, "0")}
                    </span>
                )
            }
        />
    );

    const handlePlaceBid = (productId) => {
        const hash = btoa(productId); // Hash the product ID
        navigate(`/bidder/viewproduct/${hash}`);
    };

    // Section Renderer
    const renderSection = (title, items, isUpcoming, hidePrice = false) => (
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
                                {renderCountdown(isUpcoming, product)}
                            </p>
                            {/* Render live data for ongoing auctions */}
                            {product.auctionStatus === "ongoing" && liveData[product.productId] && (
                                <div style={styles.liveData}>
                                    <p><strong>Highest Bid:</strong> ₹{liveData[product.productId].highestBid}</p>
                                    {/* <p><strong>Highest Bidder:</strong> {liveData[product.productId].highestBidder}</p> */}
                                    <p><strong>Number of Bids:</strong> {liveData[product.productId].numberOfBids}</p>
                                    <p><strong>Percentage Increase:</strong> {liveData[product.productId].percentageIncrease}%</p>
                                </div>
                            )}
                            {!hidePrice && (
                                <p style={styles.startingPrice}>
                                    Starting Price: <strong>₹{product.minimumPrice}</strong>
                                </p>
                            )}
                            <div style={styles.buttonGroup}>
                                <button
                                    style={styles.button}
                                    className="mx-2"
                                    onClick={() => openModal(product)}
                                >
                                    View Details
                                </button>
                                {product.auctionStatus === "ongoing" && (
                                    <button
                                        style={styles.button}
                                        className="mx-3"
                                        onClick={() => handlePlaceBid(product.productId)}
                                    >
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
            {renderSection("Completed Auctions", groupedProducts.completed, false, true)}

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


export default AuctionItems;



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