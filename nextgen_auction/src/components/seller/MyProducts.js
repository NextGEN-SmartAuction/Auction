import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'; // Import Link for routing

function MyProducts() {
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);
    const [products, setProducts] = useState([]); // To store fetched products
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch user data and products in one useEffect
    useEffect(() => {
        const jwtToken = Cookies.get('jwt');
        if (jwtToken) {
            const fetchData = async () => {
                try {
                    // Fetch user data
                    const response = await axios.get(
                        `${process.env.REACT_APP_ServerUrl}/profile`,
                        { withCredentials: true }
                    );
                    const { username, userId } = response.data;
                    setUsername(username);
                    setUserId(userId);

                    // Fetch products after getting the user data
                    const productResponse = await axios.get(
                        `${process.env.REACT_APP_ServerUrl}/products`,
                        { withCredentials: true }
                    );

                    // Filter products where sellerId matches the userId
                    const filteredProducts = productResponse.data.data.filter(product => product.sellerId === userId);
                    setProducts(filteredProducts);
                } catch (error) {
                    console.error('Error:', error.response?.data || error.message);
                    toast.error('Failed to fetch data.');
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        } else {
            toast.error('JWT Token not found.');
            setLoading(false);
        }
    }, [userId]); // Re-run if userId changes

    const encodeProductId = (productId) => {
        return btoa(productId); // Encode product ID using btoa
    };

    return (
        <div className="container p-2 col-11 border-2">
            <h2 className="text-center mb-4">My Products</h2>
            <ToastContainer />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Product image</th>
                            <th>Category</th>
                            <th>SubCategory</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Minimum Price</th>
                            <th>Status</th>
                            <th>Track Auction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map(product => (
                                <tr key={product.productId}>
                                    <td>{product.productName}</td>
                                    <td className='p-4'>
                                        <img
                                            src={`${process.env.REACT_APP_DataServer}/products/${product.logoImageName}`}
                                            alt={product.productName}
                                            widht="85px" height="85px"
                                        />
                                    </td>
                                    <td>{product.category}</td>
                                    <td>{product.subCategory}</td>
                                    <td>{new Date(product.startDateTime).toLocaleString()}</td>
                                    <td>{new Date(product.endDateTime).toLocaleString()}</td>
                                    <td>{product.minimumPrice}</td>
                                    <td>{product.auctionStatus}</td>
                                    <td>
                                        <Link
                                            to={`/trackproduct/${encodeProductId(product.productId)}`}
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent the default Link behavior
                                                window.open(
                                                    `/trackproduct/${encodeProductId(product.productId)}`,
                                                    '_blank' // Open in a new tab
                                                );
                                            }}
                                        >
                                            Track
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center">No products found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MyProducts;
