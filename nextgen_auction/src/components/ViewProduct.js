import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Countdown from 'react-countdown';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ViewProduct = () => {
    const { hash } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [seller, setSeller] = useState(null); // State for storing seller details
    const [activeSellerTab, setActiveSellerTab] = useState("profile");
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);
    const [auctionHistory, setAuctionHistory] = useState(null);

    const handleSellerTabChange = (tab) => setActiveSellerTab(tab);
    const [activeTab, setActiveTab] = useState("placeBid");
    const [selectedImage, setSelectedImage] = useState(null);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };



    const [socketInfo, setSocketInfo] = useState({
        highestBid: 0,
        highestBidder: "Loading...", // Updated highestBidder
        highestBidderId: "Loading...", // Added highestBidderId to the state
        numberOfBids: "Loading...",
        percentageIncrease: 0,
    });

    useEffect(() => {
        const productId = atob(hash); // Decode the productId from hash

        const eventSource = new EventSource(`${process.env.REACT_APP_SseServerUrl}/auction/${productId}/updates`);

        // alert(`http://${process.env.REACT_APP_SseServerUrl}/auction/${productId}/updates`)

        // Handle incoming SSE messages
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            // Update state with new auction information
            setSocketInfo({
                highestBid: data.highestBid,
                highestBidder: data.highestBidder,
                highestBidderId: data.highestBidderId, // Update highestBidderId
                numberOfBids: data.numberOfBids,
                percentageIncrease: data.percentageIncrease,
            });
        };

        // Handle SSE errors
        eventSource.onerror = (error) => {
            console.error("SSE error:", error);
            eventSource.close(); // Close connection on error
        };

        // Cleanup: close the EventSource connection when the component unmounts
        return () => {
            eventSource.close();
        };
    }, [hash]); // Re-run effect if hash changes



    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check for JWT token
                const jwtToken = Cookies.get('jwt');
                if (!jwtToken) {
                    throw new Error("JWT token not found.");
                }

                // Fetch user authentication details
                const authResponse = await axios.get(
                    `${process.env.REACT_APP_ServerUrl}/profile`,
                    { withCredentials: true }
                );
                const { username, userId } = authResponse.data;

                setUsername(username);
                setUserId(userId);

                // Decode productId from hash
                const productId = atob(hash);

                // Fetch product details
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

                // Fetch product images
                const imagesResponse = await axios.get(
                    `${process.env.REACT_APP_FlaskUrl}/get-product-images/${productId}`
                );
                setImages(imagesResponse.data.images);
                setSelectedImage(imagesResponse.data.images[0]);

                // Fetch participated bids and filter by productId
                try {
                    const participatedResponse = await axios.post(
                        `${process.env.REACT_APP_ServerUrl}/fetchBids`,
                        { userId },
                        { withCredentials: true }
                    );

                    // Check if the response contains any bids
                    if (participatedResponse.data && participatedResponse.data.length > 0) {
                        // Find the bid for the specific product
                        const productBids = participatedResponse.data.find(
                            (bid) => bid.productId === foundProduct.productId
                        );

                        // If bids exist for the product, set them in auctionHistory
                        if (productBids) {
                            setAuctionHistory(productBids.bidHistory);
                        } else {
                            // No bids for the found product
                            setAuctionHistory([]);
                        }
                    } else {
                        // No bids data or empty array returned
                        setAuctionHistory([]);
                    }
                } catch (error) {
                    console.error("Error fetching bids:", error);
                    // Handle the error, maybe display a message to the user
                    setAuctionHistory([]);
                }


                // Fetch seller details
                const sellerResponse = await axios.get(
                    `${process.env.REACT_APP_ServerUrl}/sellers/${foundProduct.sellerId}`,
                    { withCredentials: true }
                );
                setSeller(sellerResponse.data);

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error.message);
                setError("Failed to fetch data! Please try again.");
                setLoading(false);
            }
        };

        fetchData();
    }, [hash]);





    const handleTabChange = (tab) => setActiveTab(tab);

    const handleAddInterval = () => {
        const highestBid = parseFloat(socketInfo.highestBid || product.minimumPrice);
        const intervalPrice = parseFloat(product.priceInterval || 0);
        const newBid = highestBid + intervalPrice;

        setBidAmount(newBid);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');  // Pad single digit day
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Pad single digit month (months are 0-indexed)
        const year = date.getFullYear();  // Get the full year
        return `${day}-${month}-${year}`;
    };

    const handleSubmitBid = async () => {
        // Input validation
        if (!bidAmount || bidAmount <= 0) {
            toast.error("Please enter a valid bid amount.");
            return;
        }

        if (!product?.productId) {
            toast.error("Auction ID is missing.");
            return;
        }

        if (!userId) {
            toast.error("User ID is missing.");
            return;
        }

        try {
            console.log("Bid Submitted:");
            console.log("Bid Amount:", bidAmount);
            console.log("Auction ID:", product.productId);
            console.log("User ID:", userId);

            const response = await axios.post(
                `${process.env.REACT_APP_ServerUrl}/placeBid`,
                {
                    auctionId: product.productId,
                    bidderId: userId,
                    bidAmount: bidAmount,
                    bidderName: username,
                },
                { withCredentials: true }
            );

            console.log(response);

            if (response.data.success) {
                console.log("Bid placed successfully:", response.data.message);
                toast.success(`Bid placed successfully: ${response.data.message}`);
            } else {
                console.error("Failed to place bid:", response.data.message);
                toast.error(`Failed to place bid: ${response.data.message}`);
            }
        } catch (error) {
            if (error.response) {
                // Server responded with a status code outside the 2xx range
                console.error("Server Error:", error.response.data);
                toast.error(
                    `Failed to place bid: ${error.response.data.message || "Unknown error"}`
                );
            } else if (error.request) {
                // No response was received
                console.error("Network Error: No response received", error.request);
                toast.error("Network error: Unable to reach the server.");
            } else {
                // Something else caused the error
                console.error("Error:", error.message);
                toast.error(`An error occurred: ${error.message}`);
            }
        }
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


                    {/* Seller Card */}
                    <div className="card mb-3 mt-5 my-5" style={styles.sellerCard}>
                        <div className="card-header">
                            <h5 className="ms-3">Seller Details</h5>
                        </div>

                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src={`${process.env.REACT_APP_DataServer}/logos/${seller?.logoName}`}
                                    alt="Seller Logo"
                                    style={styles.sellerLogo}
                                />
                                <h5 className="ms-3">{seller?.sellerName}</h5>
                            </div>

                            {/* Navs for Tabs */}
                            <ul className="nav nav-pills mt-3" id="sellerNav" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeSellerTab === "profile" ? "active" : ""}`}
                                        onClick={() => handleSellerTabChange("profile")}
                                        id="profile-tab"
                                        data-bs-toggle="pill"
                                        href="#profile"
                                        role="tab"
                                    >
                                        Profile
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeSellerTab === "moreInfo" ? "active" : ""}`}
                                        onClick={() => handleSellerTabChange("moreInfo")}
                                        id="moreInfo-tab"
                                        data-bs-toggle="pill"
                                        href="#moreInfo"
                                        role="tab"
                                    >
                                        More Info
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeSellerTab === "contact" ? "active" : ""}`}
                                        onClick={() => handleSellerTabChange("contact")}
                                        id="contact-tab"
                                        data-bs-toggle="pill"
                                        href="#contact"
                                        role="tab"
                                    >
                                        Contact
                                    </a>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={`nav-link ${activeSellerTab === "address" ? "active" : ""}`}
                                        onClick={() => handleSellerTabChange("address")}
                                        id="address-tab"
                                        data-bs-toggle="pill"
                                        href="#address"
                                        role="tab"
                                    >
                                        Address
                                    </a>
                                </li>
                            </ul>

                            <div className="tab-content mt-3">
                                {/* Profile Tab */}
                                <div
                                    className={`tab-pane fade ${activeSellerTab === "profile" ? "show active" : ""}`}
                                    id="profile"
                                    role="tabpanel"
                                >
                                    <p className="mb-1"><strong>Display Name:</strong> {seller?.displayName}</p>
                                    <p><strong>Caption:</strong> {seller?.caption}</p>
                                </div>

                                {/* More Info Tab */}
                                <div
                                    className={`tab-pane fade ${activeSellerTab === "moreInfo" ? "show active" : ""}`}
                                    id="moreInfo"
                                    role="tabpanel"
                                >
                                    <p><strong>Organization:</strong> {seller?.orgName}</p>
                                    <p><strong>Website:</strong> <a href={seller?.website} target="_blank" rel="noopener noreferrer">{seller?.website}</a></p>
                                </div>

                                {/* Contact Tab */}
                                <div
                                    className={`tab-pane fade ${activeSellerTab === "contact" ? "show active" : ""}`}
                                    id="contact"
                                    role="tabpanel"
                                >
                                    <p><strong>Email:</strong> {seller?.email}</p>
                                    <p><strong>Primary Mobile:</strong> {seller?.primaryMobile}</p>
                                    <p><strong>Secondary Mobile:</strong> {seller?.secondaryMobile}</p>
                                </div>

                                {/* Address Tab */}
                                <div
                                    className={`tab-pane fade ${activeSellerTab === "address" ? "show active" : ""}`}
                                    id="address"
                                    role="tabpanel"
                                >
                                    <p><strong>Country:</strong> {seller?.address.country}</p>
                                    <p><strong>State:</strong> {seller?.address.state}</p>
                                    <p><strong>City:</strong> {seller?.address.city}</p>
                                    <p><strong>Pincode:</strong> {seller?.address.pincode}</p>
                                    <p><strong>Location:</strong> {seller?.address.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Right Column */}
                <div className="col-6">
                    {/* Highest Bid & Product Details */}
                    <div className="row">
                        <div className="col-8">
                            <div className="card mb-3" style={styles.card}>
                                <h4>Product Details</h4>
                                <p><strong>Category:</strong> {product.category}</p>
                                <p><strong>Sub-category:</strong> {product.subCategory}</p>
                                <p><strong>Description:</strong> {product.description}</p>
                                <p><strong>Start date:</strong> {formatDate(product.startDateTime)}</p>
                                <p><strong>End date:</strong> {formatDate(product.endDateTime)}</p>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="card mb-3" style={styles.card}>
                                <h4>Minimum Price</h4>
                                <p style={styles.price}>
                                    ₹{product.minimumPrice || 0}
                                </p>
                            </div>

                            <div className="card mb-3" style={styles.card}>
                                <h4>Auction Timer</h4>
                                {/* Countdown Component */}
                                <Countdown
                                    date={new Date(product.endDateTime).getTime()} // End date as target
                                    renderer={({ days, hours, minutes, seconds, completed }) => {
                                        if (completed) {
                                            return <p>The timer has ended!</p>; // Message when the countdown ends
                                        } else {
                                            return (
                                                <p style={styles.countdown}>
                                                    {days}d {String(hours).padStart(2, '0')}h {String(minutes).padStart(2, '0')}m {String(seconds).padStart(2, '0')}s
                                                </p> // Format time as Xd Xh Xm Xs
                                            );
                                        }
                                    }}
                                />
                            </div>



                        </div>
                        <div className="col-12 d-flex flex-row">
                            <div className="col-4 p-2">
                                <div className="card mb-3" style={styles.card}>
                                    <h4>Highest Bid</h4>
                                    <p style={styles.highestBid}>
                                        ₹{socketInfo.highestBid}
                                    </p>
                                    <p style={{ fontSize: '0.9rem', color: '#6c757d', marginTop: '5px' }}>
                                        {socketInfo.highestBidder ? `Bidder: ${socketInfo.highestBidder}` : "Bidder: Loading..."}
                                    </p>
                                </div>
                            </div>

                            <div className="col-4 p-2">

                                <div className="card mb-3" style={styles.card}>
                                    <h4>No of Bids</h4>
                                    <p style={styles.bidCount}>{socketInfo.numberOfBids || 0}</p>
                                </div>
                            </div>
                            <div className="col-4 p-2">
                                <div className="card mb-3" style={styles.card}>
                                    <h4> Increase(%)</h4>
                                    <p style={styles.percentageIncrease}>
                                        {socketInfo.percentageIncrease ? `${socketInfo.percentageIncrease}%` : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>










                    </div>

                    {/* Pills Navigation in Card Header */}
                    <div className="card mb-3" style={styles.card}>
                        <div className="card-header" style={styles.navPillsCardHeader}>
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
                                                data-bs-toggle="modal"
                                                data-bs-target="#confirmModal"
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

                            {activeTab === "auctionHistory" && (
                                <div>
                                    <h4>Auction History</h4>
                                    {auctionHistory.length > 0 ? (
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Timestamp</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {auctionHistory.map((entry, index) => (
                                                    <tr key={index}>
                                                        <td>{new Date(entry.timestamp).toLocaleString()}</td>
                                                        <td>{entry.amount}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>No bid history available for this product.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === "winner" && <p>Winner: To be decided.</p>}
                            {activeTab === "delivery" && <p>Delivery in 10 working days.</p>}
                        </div>
                    </div>
                </div>


            </div>
            {/* Modal */}
            {/* Modal */}
            <div className="modal fade" id="confirmModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Your Bid</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to place a bid of ₹{bidAmount} for this product?
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    setTimeout(() => handleSubmitBid(), 1500);
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />


        </div>
    );
};

export default ViewProduct;



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
    // New styles for the additional information
    bidCount: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#28a745", // Green color to indicate a positive value
    },
    price: {
        fontSize: "18px",
        color: "#6c757d", // Muted gray for price display
    },
    countdown: {
        fontSize: "18px",
        color: "red", // Setting the color to red
        textAlign: "center",
    },
    priceIncrease: {
        fontSize: "18px",
        color: "#ffc107", // Yellow for raise in value
    },
    percentageIncrease: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#dc3545", // Red for percentage increase, as it could signify an important metric
    },
    tabTitle: {
        fontWeight: "bold",
        color: "#007bff",
    },
    tabContent: {
        fontSize: "16px",
        color: "#555",
    },
    tabLink: {
        fontSize: "16px",
        padding: "10px 20px",
        borderRadius: "30px", // Rounded tabs for modern look
        transition: "all 0.3s ease",
    },
    activeTabLink: {
        backgroundColor: "#007bff", // Active tab background
        color: "#fff",
    },
    tabContentText: {
        fontSize: "16px",
        lineHeight: "1.5",
        color: "#555",
    },
    tabHeader: {
        fontWeight: "bold",
        fontSize: "18px",
        color: "#333",
        marginBottom: "10px",
    },
    tabLinkContainer: {
        marginTop: "20px",
    },
};