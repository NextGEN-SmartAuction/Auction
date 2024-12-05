import React, { useEffect, useState } from "react";

const AuctionItems11 = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/data.json") // Ensure the file is in the public folder
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((json) => setData(json))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    if (!data) {
        return (
            <div style={styles.loaderContainer}>
                <p style={styles.loaderText}>Loading auction items...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {data.map((seller, sellerIndex) =>
                seller.items.map((item, itemIndex) => (
                    <div key={`${sellerIndex}-${itemIndex}`} style={styles.card}>
                        <img
                            src={item.itemImages[0]}
                            alt={item.itemName}
                            style={styles.image}
                        />
                        <div style={styles.cardContent}>
                            <h3 style={styles.title}>{item.itemName}</h3>
                            <p style={styles.sellerName}>
                                By: <strong>{seller.displayName}</strong> ({seller.orgName})
                            </p>
                            <p style={styles.description}>{item.itemDescription}</p>
                            <p style={styles.status}>
                                Status: <span>{item.auctionStatus.toUpperCase()}</span>
                            </p>
                            <p style={styles.bid}>
                                Current Bid: <strong>₹{item.currentBid}</strong>
                            </p>
                            <button style={styles.button}>BUY NOW</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        padding: "40px",
        gap: "30px",
        background: "linear-gradient(120deg, #f6d365, #fda085)", // Gradient background
        minHeight: "100vh",
    },
    loaderContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f8f8",
    },
    loaderText: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
    },
    card: {
        width: "300px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#fff",
        transition: "transform 0.3s, box-shadow 0.3s",
        cursor: "pointer",
    },
    cardContent: {
        padding: "20px",
        textAlign: "left",
    },
    image: {
        width: "100%",
        height: "200px",
        objectFit: "cover",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
    },
    title: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "10px",
    },
    sellerName: {
        fontSize: "14px",
        color: "#666",
        marginBottom: "8px",
    },
    description: {
        fontSize: "14px",
        color: "#555",
        marginBottom: "15px",
        lineHeight: "1.5",
    },
    status: {
        fontSize: "14px",
        color: "#ff6f61",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    bid: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#4caf50",
        marginBottom: "20px",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#ff6f61",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#e65c55",
    },
};

// Add hover effects using vanilla JS or CSS-in-JS
document.addEventListener("mouseover", (e) => {
    if (e.target.tagName === "BUTTON") {
        e.target.style.backgroundColor = "#e65c55";
    }
});

document.addEventListener("mouseout", (e) => {
    if (e.target.tagName === "BUTTON") {
        e.target.style.backgroundColor = "#ff6f61";
    }
});

export default AuctionItems11;
