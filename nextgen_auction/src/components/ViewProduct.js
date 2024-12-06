import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ViewProduct = () => {
    const { hash } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [activeTab, setActiveTab] = useState("placeBid");
    const [selectedImage, setSelectedImage] = useState(null);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };

    const styles = {
        highestBid: {
            fontSize: "22px",
            fontWeight: "bold",
            color: "#007bff",
        },
        card: {
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px", // Ensure some space between the card and product details
            padding: "20px",
            backgroundColor: "#fff",
        },
        sellerCard: {
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            padding: "15px",
            backgroundColor: "#fff",
            marginBottom: "20px", // Space between the card and product details
            transition: "box-shadow 0.3s ease",
        },
        sellerCardHover: {
            boxShadow: "0 4px 20px rgba(0, 123, 255, 0.3)",
        },
        sellerLogo: {
            width: "50px",
            height: "50px",
            objectFit: "cover",
            borderRadius: "50%",
            marginRight: "15px",
        },
        sellerInfo: {
            display: "flex",
            alignItems: "center",
        },
        sellerName: {
            fontSize: "18px",
            fontWeight: "bold",
        },
        sellerCaption: {
            fontSize: "14px",
            color: "#6c757d",
        },
        intervalPrice: {
            fontSize: "14px",
            color: "#6c757d",
            marginTop: "10px",
        },
        bidInput: {
            fontSize: "16px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ddd",
        },
        bidButton: {
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            marginTop: "10px",
        },
        bidContainer: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
        },
        buttonGroup: {
            display: "flex",
            justifyContent: "space-between", // Align the buttons side by side
            gap: "10px",
        },
        navPillsCardHeader: {
            padding: "0.5rem 1rem",
            backgroundColor: "#f8f9fa", // Light background for the pills section
            borderBottom: "1px solid #ddd",
        },
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const productId = atob(hash);

                const productResponse = await axios.get(
                    `${process.env.REACT_APP_ServerUrl}/products`,
                    { withCredentials: true }
                );
                const foundProduct = productResponse.data.data.find(
                    (prod) => prod.productId === productId
                );

                if (!foundProduct) {
                    throw new Error("Product not found.");
                }
                setProduct(foundProduct);

                const imagesResponse = await axios.get(
                    `${process.env.REACT_APP_FlaskUrl}/get-product-images/${productId}`
                );
                setImages(imagesResponse.data.images);
                setSelectedImage(imagesResponse.data.images[0]);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching product details or images:", err.message);
                setError("Failed to fetch product details or images! Please try again.");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [hash]);

    const handleTabChange = (tab) => setActiveTab(tab);

    const handleAddInterval = () => {
        const highestBid = parseFloat(product.highestBid || product.minimumPrice);
        const intervalPrice = parseFloat(product.priceInterval || 0);
        const newBid = highestBid + intervalPrice;

        setBidAmount(newBid);
    };

    const handleSubmitBid = () => {
        console.log("Bid Submitted:");
        console.log("Bid Amount:", bidAmount);
        console.log("Product Details:", product);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-6">
                    {/* Image with fixed height (250px) */}
                    <div className="mb-3" style={{ height: '450px', overflow: 'hidden' }}>
                        <ReactImageMagnify
                            {...{
                                smallImage: {
                                    alt: "Product Image",
                                    isFluidWidth: true,
                                    src: `${process.env.REACT_APP_DataServer}/products/${selectedImage}`,
                                },
                                largeImage: {
                                    src: `${process.env.REACT_APP_DataServer}/products/${selectedImage}`,
                                    width: 1200,
                                    height: 1200,
                                },
                                lensStyle: { backgroundColor: "rgba(0,0,0,0.4)" },
                                isHintEnabled: true,
                                enlargedImagePosition: "over",
                            }}
                            style={{ height: '100%' }} // Ensures the magnified image stays within the 250px height limit
                        />
                    </div>

                    {/* Slider below the image */}
                    <div className="slider-container mt-3">
                        <Slider {...settings}>
                            {images.map((image) => (
                                <div key={image}>
                                    <img
                                        src={`${process.env.REACT_APP_DataServer}/products/${image}`}
                                        alt="Thumbnail"
                                        className={`me-2 p-2 mx-3 ${selectedImage === image ? 'active-thumbnail' : ''}`}
                                        style={{
                                            cursor: 'pointer',
                                            width: '160px', // Adjust this as needed for the size of your images
                                            height: '90px', // Optional: Maintain aspect ratio
                                            opacity: selectedImage === image ? 1 : 0.6, // Optional: Highlight selected image
                                        }}
                                        onClick={() => setSelectedImage(image)} // Update selected image on click
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-6">
                    {/* Seller Card */}
                    <div
                        className="card mb-3"
                        style={{ ...styles.sellerCard, ...styles.sellerCardHover }}
                    >
                        <div className="card-body d-flex align-items-center">
                            <img
                                src={`${process.env.REACT_APP_DataServer}/sellers/${product.sellerLogo}`}
                                alt="Seller Logo"
                                style={styles.sellerLogo}
                            />
                            <div>
                                <div style={styles.sellerName}>{product.sellerName}</div>
                                <div style={styles.sellerCaption}>{product.sellerCaption}</div>
                            </div>
                        </div>
                    </div>

                    {/* Highest Bid & Product Details */}
                    <div className="row">
                        <div className="col-6">
                            <div className="card mb-3" style={styles.card}>
                                <h4>Product Details</h4>
                                <p><strong>Category:</strong> {product.category}</p>
                                <p><strong>Sub-category:</strong> {product.subCategory}</p>
                                <p><strong>Description:</strong> {product.description}</p>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="card mb-3" style={styles.card}>
                                <h4>Highest Bid</h4>
                                <p style={styles.highestBid}>
                                    ₹{product.highestBid || "No bids yet"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pills Navigation in Card Header */}
                    <div className="card mb-3" style={styles.card}>
                        <div className="card-header  " style={styles.navPillsCardHeader}>
                            <ul className="nav nav-pills p-2">
                                {["placeBid", "auctionHistory", "winner", "delivery"].map((tab) => (
                                    <li className="nav-item" key={tab}>
                                        <button
                                            className={`nav-link ${activeTab === tab ? "active" : ""}`}
                                            onClick={() => handleTabChange(tab)}
                                        >
                                            {tab.replace(/([A-Z])/g, " $1")}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="card-body">
                            {/* Tab Content */}
                            {activeTab === "placeBid" && (
                                <div>
                                    <h4>Place Your Bid</h4>
                                    <div style={styles.bidContainer}>
                                        <input
                                            type="number"
                                            className="form-control"
                                            placeholder="Enter your bid amount"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            style={styles.bidInput}
                                        />
                                        <div style={styles.buttonGroup}>
                                            <button
                                                className="btn btn-primary"
                                                style={styles.bidButton}
                                                onClick={handleAddInterval}
                                            >
                                                Add Interval (+)
                                            </button>
                                            <button
                                                className="btn btn-success"
                                                style={styles.bidButton}
                                                onClick={handleSubmitBid}
                                            >
                                                Submit Bid
                                            </button>
                                        </div>
                                        <div style={styles.intervalPrice}>
                                            Interval Amount: ₹{product.priceInterval || 0}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === "auctionHistory" && <p>Auction history will be shown here.</p>}
                            {activeTab === "winner" && <p>Winner: To be decided.</p>}
                            {activeTab === "delivery" && <p>Delivery in 10 working days.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;
