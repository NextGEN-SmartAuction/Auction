import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function WinnerList() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);



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


                // Fetch certificates (transaction details)
                const certificates = await axios.get(
                    `${process.env.REACT_APP_ServerUrl}/getTransactionDetails`,
                    { withCredentials: true }
                );

                // Filter products by IPFS hash and matching product IDs
                const filteredProducts = certificates.data.data.filter(product =>
                    product.ipfsHash !== null &&
                    product.ipfsHash !== undefined &&
                    product.sellerId === userId
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

    const viewCertificate = (ipfsHash) => {
        const fileUrl = `https://${process.env.REACT_APP_PinataGateway}/ipfs/${ipfsHash}`;
        window.open(fileUrl, "_blank");
    };

    return (
        <div className="container p-3">
            <h2 className="text-center mb-4">My Transaction Certificates</h2>
            <ToastContainer />
            <div className="tab-content mt-4">

                <div>
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
                                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product ID</th>
                                    <th style={{ padding: "10px", border: "1px solid #ddd" }}>Product Logo</th>
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
                                            {product.productId}
                                        </td>
                                        <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                                            <img
                                                src={`${process.env.REACT_APP_DataServer}/products/${product.logoImageName}`}
                                                alt={product.productName}
                                                widht="115px" height="115px"
                                            />
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
            </div>
        </div>
    );
}

export default WinnerList;
