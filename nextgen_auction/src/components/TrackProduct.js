import React, { useEffect, useState } from 'react'; // Import React hooks
import { useParams } from 'react-router-dom'; // Import useParams for route params
import axios from 'axios'; // Import axios for API requests
import Countdown from 'react-countdown';
import ReactImageMagnify from "react-image-magnify";
import Slider from "react-slick";
function TrackProduct() {
    const { hash } = useParams(); // Get the encoded productId (hash) from the URL
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [trackingData, setTrackingData] = useState(null); // To store tracking history
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeTab, setActiveTab] = useState('bidInfo');
    const [selectedBidder, setSelectedBidder] = useState(null);
    const [bidderIds, setBidderIds] = useState(null);
    const [bidderDetails, setBidderDetails] = useState(null);
    const [bidderInfo, setBidderInfo] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');  // Pad single digit day
        const month = String(date.getMonth() + 1).padStart(2, '0');  // Pad single digit month (months are 0-indexed)
        const year = date.getFullYear();  // Get the full year
        return `${day}-${month}-${year}`;
    };




    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };



    // Handle bidder selection from the dropdown
    const handleBidderChange = (event) => {
        const selectedBidderId = event.target.value;
        setSelectedBidder(selectedBidderId);
        console.log(bidderDetails.data[selectedBidderId])

        setBidderInfo(bidderDetails.data[selectedBidderId]);

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
                console.log(foundProduct);
                const imagesResponse = await axios.get(
                    `${process.env.REACT_APP_FlaskUrl}/get-product-images/${productId}`
                );
                setImages(imagesResponse.data.images);
                setSelectedImage(imagesResponse.data.images[0]);





            } catch (err) {
                console.error("Error fetching product details or images:", err.message);
            }
        };

        fetchProduct();
        const fetchTrackingData = async () => {
            let productId = atob(hash); // Decode the productId from hash
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_ServerUrl}/trackProduct`,
                    { productId }, // Pass the productId in the request body
                    { withCredentials: true }
                );
                setTrackingData(response.data); // Set the tracking data to state

                setBidderIds(response.data.map(item => item.bidder_id));

                console.log(response.data);
            } catch (error) {
                console.error('Error fetching tracking data:', error.message);
            }
        };

        const fetchBidderDetails = async () => {
            try {
                let auctionId = atob(hash);  // Decoding the auctionId from the hash
                const response = await axios.get(
                    `${process.env.REACT_APP_ServerUrl}/getBidderAnalytics`,
                    {
                        params: { auction_id: auctionId },  // Send auction_id as a query parameter
                        withCredentials: true
                    }
                );
                console.log('Bidder Details:', response.data);  // Handle the fetched bidder details here
                setBidderDetails(response.data);  // Store the details in state
            } catch (error) {
                console.error('Error fetching bidder details:', error.message);
            }
        };


        fetchBidderDetails()


        fetchTrackingData();
    }, [hash]);



    

    // Flatten and sort the data by timestamp
    const sortedTrackingData = trackingData
        ? trackingData
            .flatMap(entry =>
                entry.bid_details.map(bid => ({
                    bidder_id: entry.bidder_id,
                    timestamp: new Date(bid.timestamp),
                    amount: bid.amount,
                }))
            )
            .sort((a, b) => a.timestamp - b.timestamp) // Sort by timestamp
        : [];

    return (
        <div className='container-fluid row'>

            <div className=" p-2 col-5 border-2">
                <h2 className="text-center mb-4">Tracking History</h2>
                {sortedTrackingData.length > 0 ? (
                    <div >
                        <div className='row p-4'>
                            <div className="card col-4 text-center p-2 mx-3">

                                <h4>Product Tracking Details  </h4>
                            </div>

                            <div className="card col-6" >
                                <div className="card-header">
                                    Product ID
                                </div>
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item">{atob(hash)}</li>
                                </ul>
                            </div>
                        </div>
                        <table className="table table-bordered p-3 table-striped table-hover mx-4">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Bidder ID</th>
                                    <th>Timestamp</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTrackingData.map((entry, index) => {
                                    const isLastRow = index === sortedTrackingData.length - 1; // Check if it's the last row
                                    return (
                                        <tr
                                            key={index}
                                            style={isLastRow ? { backgroundColor: '#ffeeba', fontWeight: 'bold' } : {}}
                                        >
                                            <td>{index + 1}</td> {/* Serial Number */}
                                            <td>{entry.bidder_id}</td>
                                            <td>{entry.timestamp.toLocaleString()}</td>
                                            <td>
                                                {entry.amount} {isLastRow && '👑'} {/* Trophy emoji only for the last row */}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                    </div>
                ) : (
                    <div>No tracking data available.</div>
                )}
            </div>
            <div className=" p-5 col-6 border-2">

                {/* Nav Tabs */}
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'bidInfo' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bidInfo')}
                        >
                            Bid Info
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === 'productInfo' ? 'active' : ''}`}
                            onClick={() => setActiveTab('productInfo')}
                        >
                            Product Info
                        </button>
                    </li>
                </ul>

                {/* Tab Content */}
                <div className="tab-content mt-4">
                    {activeTab === 'productInfo' && (
                        <div className="row">
                            {product ? (
                                <>
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
                                        {/* Image with fixed height (250px) */}
                                        <div className="mb-3" style={{ height: '250px', width: '350px', overflow: 'hidden' }}>
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
                                        <div className="slider-container mt-3" style={{ width: '350px' }}>
                                            <Slider {...settings}>
                                                {images.map((image) => (
                                                    <div key={image}>
                                                        <img
                                                            src={`${process.env.REACT_APP_DataServer}/products/${image}`}
                                                            alt="Thumbnail"
                                                            className={`me-2  ${selectedImage === image ? 'active-thumbnail' : ''}`}
                                                            style={{
                                                                cursor: 'pointer',
                                                                width: '105px', // Adjust this as needed for the size of your images
                                                                height: '45px', // Optional: Maintain aspect ratio
                                                                opacity: selectedImage === image ? 1 : 0.6, // Optional: Highlight selected image
                                                            }}
                                                            onClick={() => setSelectedImage(image)} // Update selected image on click
                                                        />
                                                    </div>
                                                ))}
                                            </Slider>
                                        </div>

                                    </div>

                                </>
                            ) : (
                                <div className="col-12">
                                    <p className="text-center text-muted">No product information available.</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'bidInfo' && (

                        <div className="row">
                            {product ? (
                                <>


                                    <div className="col-12 d-flex flex-row">
                                        <div className="col-3 p-2">
                                            <div className="card mb-3" style={styles.card}>
                                                <h4>Min Price</h4>
                                                <p style={styles.price}>
                                                    ₹{product.minimumPrice || 0}
                                                </p>
                                            </div>


                                        </div>
                                        <div className="col-4 p-2">
                                            <div className="card mb-3" style={styles.card}>
                                                <h4>Highest Bid</h4>
                                                <p style={styles.highestBid}>
                                                    ₹{socketInfo.highestBid}
                                                </p>

                                            </div>
                                        </div>



                                        <div className="col-4 p-2">
                                            <div className="card mb-3" style={styles.card}>
                                                <h4>Increase(%)</h4>
                                                <p style={styles.percentageIncrease}>
                                                    {socketInfo.percentageIncrease ? `${socketInfo.percentageIncrease}%` : "N/A"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="col-4 p-2">
                                            <div className="card mb-3" style={styles.card}>
                                                <h4>No of Bids</h4>
                                                <p style={styles.bidCount}>{socketInfo.numberOfBids || 0}</p>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="col-12 d-flex flex-row">
                                        <div className="col-3 p-2">


                                            <div className="card mb-3" style={styles.card}>
                                                <Countdown
                                                    date={new Date(product.endDateTime).getTime()} // End date as target
                                                    renderer={({ days, hours, minutes, seconds, completed }) => {
                                                        if (completed) {
                                                            return <p>The timer has ended!</p>; // Message when the countdown ends
                                                        } else {
                                                            return (
                                                                <p style={styles.countdown}>
                                                                    {days}d {String(hours).padStart(2, '0')}h {String(minutes).padStart(2, '0')}m {String(seconds).padStart(2, '0')}s
                                                                </p>
                                                            );
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-4 p-2">
                                            <div className="card mb-3" style={styles.card}>
                                                <h4>Bidder</h4>
                                                <p style={styles.highestBid}>
                                                    {socketInfo.highestBidder ? `name: ${socketInfo.highestBidder}` : "Bidder: Loading..."}
                                                </p>

                                            </div>
                                        </div>
                                        <div className="col-4 p-2">
                                            <div className="card mb-3" style={styles.card}>
                                                <h4>Status</h4>
                                                <p style={styles.minimumPrice}>
                                                    Auction:  {product.auctionStatus}

                                                </p>



                                            </div>
                                        </div>
                                        <div className="col-4 p-2">
                                            <div className="card mb-3" style={styles.card}>
                                                <h4>Winner</h4>

                                                <p style={styles.minimumPrice}>
                                                    Winner:  {product.winner}

                                                </p>

                                            </div>
                                        </div>

                                    </div>
                                    <div className="container-fluid ">
                                        <div className="card mb-3" style={styles.card}>
                                            <h4>Bidder Analytics</h4>

                                            <div>
                                                <label htmlFor="bidderSelect">Select Bidder</label>
                                                <select id="bidderSelect" className="mx-3" onChange={handleBidderChange}>
                                                    <option value="">-- Select a Bidder --</option>
                                                    {
                                                        bidderIds && bidderIds.length > 0 ? (
                                                            bidderIds.map(bidderId => (
                                                                <option className="form-control" key={bidderId} value={bidderId}>
                                                                    {bidderId}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <option disabled>Loading bidders...</option> // Message if bidderIds is empty or still loading
                                                        )
                                                    }
                                                </select>

                                            </div>

                                            {/* Show selected bidder's analytics if available */}
                                            {bidderInfo ? (
                                                <div className="mt-4">
                                                    <h5>Bidder ID: {selectedBidder}</h5>
                                                    <ul>
                                                        <li><strong>Bidder Tendency:</strong> {bidderInfo.bidder_tendency}</li>
                                                        <li><strong>Highest Bid to Seller:</strong> {bidderInfo.highest_bid_to_seller}</li>
                                                        <li><strong>First Bid Time:</strong> {bidderInfo.first_bid_time} 's</li>
                                                        <li><strong>Last Bid Time:</strong> {bidderInfo.last_bid_time} 's</li>
                                                        <li><strong>Number of Bids:</strong> {bidderInfo.num_bids}</li>
                                                        <li><strong>Auction Duration:</strong> {bidderInfo.auction_duration} 's</li>
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div className="mt-4">
                                                    <p>Select a bidder to view analytics.</p>
                                                </div>
                                            )}


                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="col-12">
                                    <p className="text-center text-muted">No product information available.</p>
                                </div>
                            )}
                        </div>

                    )}
                </div>





            </div>
        </div>
    );
}

export default TrackProduct;


const styles = {
    highestBid: {
        fontSize: "18px",
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