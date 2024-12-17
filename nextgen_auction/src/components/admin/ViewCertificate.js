import React, { useState, useEffect } from "react";
import Web3 from "web3";
import axios from 'axios';

const ViewCertificate = () => {
    const [contract, setContract] = useState(null);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState("");

    // Initialize Web3 and contract
    const initializeWeb3 = async () => {
        const { ethereum } = window;
        try {
            const ABI = JSON.parse(process.env.REACT_APP_CONTRACT_ABI);
            const Address = process.env.REACT_APP_AdminAddress;
            const web3 = new Web3(ethereum);
            const contractInstance = new web3.eth.Contract(ABI, Address);
            setContract(contractInstance);
        } catch (error) {
            console.error("Error initializing Web3:", error);
        }
    };

    // Fetch all products
    const fetchAllProducts = async () => {
        if (!contract) return; // Ensure contract is initialized
    
        try {
            // Fetch product data from the blockchain
            const productIds = await contract.methods.getAllProductIds().call();
            const productData = await Promise.all(
                productIds.map((id) => contract.methods.getProductById(id).call())
            );
    
            // Fetch certificate details from the server
            const { data: certificates } = await axios.get(
                `${process.env.REACT_APP_ServerUrl}/getTransactionDetails`,
                { withCredentials: true }
            );
    
            // Map through product data and attach LogoImageName if productId matches
            const updatedProducts = productData.map((product) => {
                const matchingCertificate = certificates.data.find(
                    (cert) => cert.productId === product.productId // Adjust 'product.id' based on your blockchain product structure
                );
    
                return {
                    ...product,
                    logoImageName: matchingCertificate ? matchingCertificate.logoImageName : null,
                };
            });
    
            setProducts(updatedProducts); // Set the updated products
            setError(""); // Clear any error
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Failed to fetch products. Please try again.");
        }
    };
    
    // Initialize Web3 once on mount
    useEffect(() => {
        initializeWeb3();
    }, []); // Dependency array is empty to run only on mount

    // Fetch products when the contract is ready
    useEffect(() => {
        if (contract) {
            fetchAllProducts();
        }
    }, [contract]); // Dependency is the contract

    // Function to view a certificate
    const viewCertificate = (ipfsHash) => {
        const fileUrl = `https://${process.env.REACT_APP_PinataGateway}/ipfs/${ipfsHash}`;
        window.open(fileUrl, "_blank");
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>All Certificates</h2>

            {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

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
    );
};

export default ViewCertificate;
