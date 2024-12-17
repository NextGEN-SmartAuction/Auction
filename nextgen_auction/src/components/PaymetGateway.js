import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentComponent() {
    const { hash } = useParams();
    const navigate = useNavigate(); // Hook for navigation
    const [productDetails, setProductDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [generatedUTR, setGeneratedUTR] = useState('');
    const [storedId, setStoredId] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const decodedHash = atob(hash);
        const productId = decodedHash;
        setStoredId(productId);
        const fetchProductDetails = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_ServerUrl}/getProductDetailsById`,
                    { productId },
                    { withCredentials: true }
                );
                setProductDetails(response.data.data);
            } catch (error) {
                console.error('Error fetching product details:', error.response?.data || error.message);
            }
        };

        fetchProductDetails();
    }, [hash]);

    const handleGenerateUTR = () => {
        if (!productDetails) return;

        const dataToHash = JSON.stringify({
            sellerId: productDetails.seller.userId,
            bidderId: productDetails.bidder.userId,
            amount: productDetails.highestBid,
            productId: productDetails.productId,
        });

        const encodedHash = btoa(dataToHash);
        const truncatedUTR = encodedHash.substring(0, 32);

        // Prepend "UTR-" to the truncated UTR and set it
        const finalUTR = `UTR-${truncatedUTR}`;
        setGeneratedUTR(finalUTR);
    };

    const handleCompletePayment = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method!');
            return;
        }

        try {
            setLoading(true);
            await axios.post(
                `${process.env.REACT_APP_ServerUrl}/completePayment`,
                {
                    sellerId: productDetails.seller.userId,
                    sellerName: productDetails.seller.username,
                    bidderId: productDetails.bidder.userId,
                    logoImageName: productDetails.logo,
                    bidderName: productDetails.bidder.username,
                    amount: productDetails.highestBid,
                    transactionId: generatedUTR,
                    productId: storedId,
                    productName: productDetails.productName,
                },
                { withCredentials: true }
            );
            alert('Payment completed successfully!');

            // Delay of 2 seconds before navigating
            setTimeout(() => {
                navigate('/bidder/MyBids');
            }, 2000);
        } catch (error) {
            console.error('Error completing payment:', error);
            alert('Failed to complete payment.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5" style={{ minHeight: '100vh' }}>
            <h2 className="text-center mb-4">Complete Your Payment</h2>
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card shadow-sm border-2">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Order Details</h5>
                            {productDetails ? (
                                <>
                                    <div className="text-center mb-3">
                                        <img
                                            src={`${process.env.REACT_APP_DataServer}/products/${productDetails.logo}`}
                                            alt={productDetails.productName}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '200px' }}
                                        />
                                    </div>
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td><strong>Product Name</strong></td>
                                                <td>{productDetails.productName}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Seller Name</strong></td>
                                                <td>{productDetails.seller.username}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Bidder Name</strong></td>
                                                <td>{productDetails.bidder.username}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Amount</strong></td>
                                                <td>₹{productDetails.highestBid}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <p>Loading order details...</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card shadow-sm border-3">
                        <div className="card-body">
                            <h5 className="card-title mb-3">Select Payment Method</h5>
                            <div className="d-flex flex-wrap">
                                {['UPI', 'Card', 'Net Banking', 'Cash on Delivery (COD)'].map((method) => (
                                    <div
                                        key={method}
                                        className={`p-3 m-2 rounded border ${paymentMethod === method ? 'border-primary bg-light' : ''}`}
                                        style={{ cursor: 'pointer', flex: '1 1 calc(50% - 1rem)' }}
                                        onClick={() => setPaymentMethod(method)}
                                    >
                                        <h6 className="text-center m-0">{method}</h6>
                                    </div>
                                ))}
                            </div>
                            <div className="d-flex justify-content-center mt-4">
                                <button
                                    className="btn btn-primary mx-2"
                                    onClick={handleGenerateUTR}
                                    disabled={!productDetails}
                                >
                                    Generate UTR
                                </button>
                                <button
                                    className="btn btn-success mx-2"
                                    onClick={handleCompletePayment}
                                    disabled={!paymentMethod || loading || !generatedUTR}
                                >
                                    {loading ? 'Processing...' : 'Make Payment'}
                                </button>
                            </div>
                            {generatedUTR && (
                                <div className="mt-3 text-center">
                                    <strong>Generated UTR:</strong> <span>{generatedUTR}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentComponent;
