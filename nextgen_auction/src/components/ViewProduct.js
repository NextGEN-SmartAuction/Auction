import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";

const ViewProduct = () => {
    const { hash } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [activeTab, setActiveTab] = useState("placeBid");
    const [selectedImage, setSelectedImage] = useState(null);

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

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <p>Loading product details...</p>
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
        <div className="container mt-5">
            <div className="row">
                {/* Left Side */}
                <div className="col-md-6">
                    {/* Product Name and Highest Bid */}
                    <div className="card mb-3">
                        <div className="card-body">
                            <h2>{product.productName}</h2>
                            <p>
                                <strong>Highest Bid:</strong> ₹{product.highestBid || "No bids yet"}
                            </p>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="d-flex">
                        <div className="d-flex flex-column me-3">
                            {images.map((image, index) => (
                                <img
                                    key={image}
                                    src={`${process.env.REACT_APP_DataServer}/products/${image}`}
                                    alt={`Thumbnail ${index + 1}`}
                                    className={`img-thumbnail mb-2 ${
                                        selectedImage === image ? "border-primary border-2" : ""
                                    }`}
                                    style={{ cursor: "pointer", width: "100px", height: "100px" }}
                                    onClick={() => setSelectedImage(image)}
                                />
                            ))}
                        </div>
                        <ReactImageMagnify
                            {...{
                                smallImage: {
                                    alt: "Selected Product Image",
                                    isFluidWidth: false,
                                    width: 450,
                                    height: 450,
                                    src: `${process.env.REACT_APP_DataServer}/products/${selectedImage}`,
                                },
                                largeImage: {
                                    src: `${process.env.REACT_APP_DataServer}/products/${selectedImage}`,
                                    width: 1200,
                                    height: 1200,
                                },
                                enlargedImagePosition: "beside",
                                enlargedImageContainerStyle: {
                                    zIndex: 1050, // Ensure it stays on top
                                },
                            }}
                        />
                    </div>

                    {/* Seller Details */}
                    <div className="card mt-3">
                        <div className="card-body">
                            <h4>Seller Details</h4>
                            <p><strong>Name:</strong> John Doe</p>
                            <p><strong>Caption:</strong> "Best Deals Guaranteed!"</p>
                            <img
                                src="https://via.placeholder.com/100"
                                alt="Seller Logo"
                                className="img-fluid"
                                style={{ width: "100px", height: "100px" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            {/* Navigation Tabs */}
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "placeBid" ? "active" : ""
                                        }`}
                                        onClick={() => handleTabChange("placeBid")}
                                    >
                                        Place Bid
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "auctionHistory" ? "active" : ""
                                        }`}
                                        onClick={() => handleTabChange("auctionHistory")}
                                    >
                                        Auction History
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "winner" ? "active" : ""
                                        }`}
                                        onClick={() => handleTabChange("winner")}
                                    >
                                        Winner
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${
                                            activeTab === "delivery" ? "active" : ""
                                        }`}
                                        onClick={() => handleTabChange("delivery")}
                                    >
                                        Delivery
                                    </button>
                                </li>
                            </ul>

                            {/* Tab Content */}
                            <div className="tab-content mt-3">
                                {activeTab === "placeBid" && (
                                    <div>
                                        <h4>Place Your Bid</h4>
                                        <input
                                            type="number"
                                            className="form-control my-2"
                                            placeholder="Enter your bid amount"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                        />
                                        <button className="btn btn-primary">Submit Bid</button>
                                    </div>
                                )}
                                {activeTab === "auctionHistory" && (
                                    <div>Auction history will be shown here.</div>
                                )}
                                {activeTab === "winner" && <div>Winner: To be decided</div>}
                                {activeTab === "delivery" && <div>Delivers in 10 working days.</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProduct;
