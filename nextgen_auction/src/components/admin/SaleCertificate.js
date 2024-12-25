import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SaleCertificate = () => {
    const [products, setProducts] = useState(null);

    const navigate = useNavigate();

    // Fetch products and update auction status
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_ServerUrl}/getTransactionDetails`,
                    {
                        withCredentials: true,
                    }
                );

                // Filter to keep only products where ipfsHash is null
                const filteredProducts = response.data.data.filter(
                    (product) => product.ipfsHash === null || product.ipfsHash.length === 0
                );

                setProducts(filteredProducts);
                console.log(filteredProducts); // Check the filtered products with null ipfsHash
            } catch (err) {
                console.error(
                    "Error fetching product details:",
                    err.response?.data || err.message
                );
            }
        };

        fetchProducts();
    }, []);

    const handleGenerateCertificate = (product) => {
        navigate("/admin/generateCertificate", { state: { product } });
    };

    return (
        <div className="container py-4">
            <h2 className="text-center mb-4">Sale Certificate Panel</h2>
            {products === null ? (
                <p className="text-center text-muted">Loading...</p>
            ) : products.length > 0 ? (
                <div className="row g-3">
                    {products.map((product, index) => (
                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                            <div className="card h-100 shadow-sm">
                                <img
                                    src={
                                        product.logoImageName
                                            ? `${process.env.REACT_APP_DataServer}/products/${product.logoImageName}`
                                            : "https://via.placeholder.com/150"
                                    }
                                    alt={product.productName}
                                    className="card-img-top"
                                    style={{ objectFit: "cover", height: "150px" }}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title text-truncate">
                                        {product.productName}
                                    </h5>
                                    <p className="card-text mb-2">
                                        <strong>Seller:</strong> {product.sellerName}
                                    </p>
                                    <p className="card-text mb-2">
                                        <strong>Winner:</strong> {product.bidderName}
                                    </p>
                                    <p className="card-text mb-2">
                                        <strong>Bid:</strong> {product.amount} ₹
                                    </p>
                                    <button
                                        className="btn btn-primary btn-sm mt-2"
                                        onClick={() => handleGenerateCertificate(product)}
                                    >
                                        Generate Certificate
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No products arrived</p>
            )}
        </div>
    );
};

export default SaleCertificate;
