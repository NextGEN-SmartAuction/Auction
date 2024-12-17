import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Web3 from "web3";

function MyBids() {
    const [activeTab, setActiveTab] = useState('participated');
    const [participatedBids, setParticipatedBids] = useState([]);
    const [wonBids, setWonBids] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();


    // 2nd useEffect: Fetch bids data only if the contract is available
    useEffect(() => {


        const fetchBidsData = async () => {
            try {
                console.log('Starting fetchBidsData...');

                // Check for JWT Token
                const jwtToken = Cookies.get('jwt');
                if (!jwtToken) {
                    toast.error('JWT Token not found.');
                    setLoading(false);
                    return;
                }
                console.log('JWT Token:', jwtToken);

                // Fetch user profile
                const userResponse = await axios.get(`${process.env.REACT_APP_ServerUrl}/profile`, {
                    withCredentials: true,
                });
                console.log('User Profile Response:', userResponse.data);
                const { userId } = userResponse.data;

                // Fetch participated bids
                const participatedResponse = await axios.post(
                    `${process.env.REACT_APP_ServerUrl}/fetchBids`,
                    { userId },
                    { withCredentials: true }
                );
                console.log('Participated Bids Response:', participatedResponse.data);
                setParticipatedBids(participatedResponse.data);

                // Fetch won bids
                const wonResponse = await axios.post(
                    `${process.env.REACT_APP_ServerUrl}/fetchWonBids`,
                    { userId },
                    { withCredentials: true }
                );
                console.log('Won Bids Response:', wonResponse.data);
                setWonBids(wonResponse.data);

                // Get product IDs from the won bids
                const requireProductIds = wonResponse.data.map(bid => bid.productId);
                console.log('Product IDs:', requireProductIds);
                if (requireProductIds.length === 0) {
                    console.log('No product IDs found.');
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                // Fetch certificates (transaction details)
                const certificates = await axios.get(
                    `${process.env.REACT_APP_ServerUrl}/getTransactionDetails`,
                    { withCredentials: true }
                );

                // Filter products by IPFS hash and matching product IDs
                const filteredProducts = certificates.data.data.filter(product =>
                    product.ipfsHash !== null &&
                    product.ipfsHash !== undefined &&
                    requireProductIds.includes(product.productId)
                );
                console.log('Filtered Products:', filteredProducts);

                // If no products match, set an empty array
                if (filteredProducts.length === 0) {
                    setProducts([]);
                } else {
                    setProducts(filteredProducts);
                }

            } catch (error) {
                console.error('Error fetching bids or products:', error.response?.data || error.message);
                toast.error('Failed to fetch data. Please try again.');
            } finally {
                setLoading(false);
            }
        };


        fetchBidsData();
    }, []);
    // Run when the contract instance changes

    const handleTabSwitch = (tab) => setActiveTab(tab);

    const handleMakePayment = (productId) => {
        const hash = btoa(`${productId}`);  // Encode the productId to base64
        navigate(`/bidder/payment/${hash}`);  // Redirect to the encoded payment URL
    };

    const viewCertificate = (ipfsHash) => {
        const fileUrl = `https://${process.env.REACT_APP_PinataGateway}/ipfs/${ipfsHash}`;
        window.open(fileUrl, "_blank");
    };

    return (
        <div className="container p-3">
            <h2 className="text-center mb-4">My Bids</h2>
            <ToastContainer />
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'participated' && 'active'}`}
                        onClick={() => handleTabSwitch('participated')}
                    >
                        Participated Bids
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'won' && 'active'}`}
                        onClick={() => handleTabSwitch('won')}
                    >
                        Won Bids
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'certificates' && 'active'}`}
                        onClick={() => handleTabSwitch('certificates')}
                    >
                        Sale Certificates
                    </button>
                </li>
            </ul>


            <div className="tab-content mt-4">
                {activeTab === 'participated' && (
                    <div>
                        <div className="accordion" id="participatedBidsAccordion">
                            {participatedBids.map((bid, index) => (
                                <div className="accordion-item" key={bid.productId}>
                                    <h2 className="accordion-header" id={`heading-${index}`}>
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse-${index}`}
                                            aria-expanded="false"
                                            aria-controls={`collapse-${index}`}
                                        >
                                            <div className="d-flex text-center">
                                                <div>

                                                    <img
                                                        src={`${process.env.REACT_APP_DataServer}/products/${bid.logo}`}
                                                        alt={bid.productName}
                                                        widht="60px" height="60px"
                                                    />
                                                </div>
                                                <div>
                                                    <h5 className='mx-3'>{bid.productName}</h5>

                                                </div>
                                            </div>
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse-${index}`}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading-${index}`}
                                        data-bs-parent="#participatedBidsAccordion"
                                    >
                                        <div className="accordion-body">
                                            <p><strong>Winner ID:</strong> {bid.winner}</p>
                                            <p><strong>Base Price:</strong> {bid.base}</p>
                                            <p><strong>Auction Status:</strong> {bid.auctionStatus}</p>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Amount</th>
                                                        <th>Timestamp</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bid.bidHistory.map((history, idx) => (
                                                        <tr key={idx}>
                                                            <td>{history.amount}</td>
                                                            <td>{new Date(history.timestamp).toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {activeTab === 'won' && (
                    <div>
                        <h4>Won Bids</h4>
                        {wonBids.length === 0 ? (
                            <p>No won bids found.</p>
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Product Image</th>
                                        <th>Product Name</th>
                                        <th>Payment Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wonBids.map((bid) => (
                                        <tr key={bid.productId}>
                                            <td>
                                                <img
                                                    src={`${process.env.REACT_APP_DataServer}/products/${bid.logoImageName}`}
                                                    alt={bid.productName}
                                                    widht="75px" height="75px"
                                                />
                                            </td>
                                            <td>{bid.productName}</td>
                                            <td>{bid.paymentStatus === 'pending' ? 'Pending' : 'Completed'}</td>
                                            <td>
                                                {bid.paymentStatus === 'pending' ? (
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleMakePayment(bid.productId)}
                                                    >
                                                        Make Payment
                                                    </button>
                                                ) : (
                                                    <span className="text-success">Payment Complete</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                {activeTab === 'certificates' && (
                    <div>
                        Sale Certificates content...
                        {products.length > 0 ? (
                            <table
                                style={{
                                    width: "90%",
                                    margin: "20px auto",
                                    borderCollapse: "collapse",
                                }}
                            >
                                <thead>
                                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product Name</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product Logo</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product ID</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Seller Name</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Bid Winner</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Amount (ETH)</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Transaction ID</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Date</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Time</th>
                                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product, index) => (
                                        <tr key={index}>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                {product.productName}
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                <img
                                                    src={`${process.env.REACT_APP_DataServer}/products/${product.logoImageName}`}
                                                    alt={product.productName}
                                                    widht="115px" height="115px"
                                                />
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                {product.productId}
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                {product.sellerName}
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                {product.bidderName}
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                {product.amount.toString()}₹
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                {product.transactionId}
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                {product.date}
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                {product.time}
                                            </td>
                                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                                <button
                                                    onClick={() => viewCertificate(product.ipfsHash)}
                                                    style={{
                                                        padding: "5px 10px",
                                                        backgroundColor: "#007BFF",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No certificates found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyBids;
