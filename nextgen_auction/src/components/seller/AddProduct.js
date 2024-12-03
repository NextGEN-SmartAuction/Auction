import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AddProduct() {
    const [numberOfParameters, setNumberOfParameters] = useState(0);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [priceInterval, setPriceInterval] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [minimumPrice, setMinimumPrice] = useState('');
    const [auctionDuration, setAuctionDuration] = useState('');

    useEffect(() => {
        if (startDateTime && endDateTime) {
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);
            const duration = Math.abs(end - start) / (1000 * 60 * 60); // Duration in hours
            setAuctionDuration(duration ? `${duration.toFixed(2)} hours` : '');
        }
    }, [startDateTime, endDateTime]);

    const handleImageChange = (e) => {
        setProductImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Check for missing fields
        if (!productName || !category || !subCategory || !numberOfParameters || !productImage || !startDateTime || !endDateTime || !minimumPrice || !priceInterval) {
            toast.error('Please fill in all required fields!');
            return;
        }
        
        // Log the data to console
        console.log({
            numberOfParameters,
            category,
            subCategory,
            productImage,
            startDateTime,
            endDateTime,
            auctionDuration,
            priceInterval,
            productName,
            description,
            minimumPrice,
        });

        toast.success('Product added successfully!');
    };

    return (
        <div className="container  p-4 col-9 border-2">
            <h2 className="text-center mb-4">Add Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="card shadow borderp">
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-lg-8 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="productName" className="form-label">Product Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productName"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="numberOfParameters" className="form-label">
                                        Quantity (Number of Parameters):
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="numberOfParameters"
                                        value={numberOfParameters}
                                        onChange={(e) => setNumberOfParameters(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-6 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">Category:</label>
                                    <select
                                        id="category"
                                        className="form-select"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">- Select Category -</option>
                                        <option value="Vintage Products">Vintage Products</option>
                                        <option value="cars">cars</option>
                                        <option value="hokka">crzzy</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-lg-6 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="subCategory" className="form-label">Sub-Category:</label>
                                    <select
                                        id="subCategory"
                                        className="form-select"
                                        value={subCategory}
                                        onChange={(e) => setSubCategory(e.target.value)}
                                    >
                                        <option value="">- Select Sub-Category -</option>
                                        <option value="supra">supra</option>
                                        <option value="toyota">toyota</option>
                                    </select>
                                </div>
                            </div>

                           

                            <div className="col-lg-4 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="startDateTime" className="form-label">Start Session:</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="startDateTime"
                                        value={startDateTime}
                                        onChange={(e) => setStartDateTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="endDateTime" className="form-label">End Session:</label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        id="endDateTime"
                                        value={endDateTime}
                                        onChange={(e) => setEndDateTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-lg-4 mb-4">
                                <div className="mb-3">
                                    <label className="form-label">Auction Duration:</label>
                                    <p className="form-control">{auctionDuration || 'Duration will appear here'}</p>
                                </div>
                            </div>
                            <div className="col-lg-6 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="productImage" className="form-label">Product Image:</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="productImage"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            <div className="col-3 mb-4">
                                <label htmlFor="minimumPrice" className="form-label">Minimum Price:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="minimumPrice"
                                    value={minimumPrice}
                                    onChange={(e) => setMinimumPrice(e.target.value)}
                                />
                            </div>
                            <div className="col-3 mb-4">
                                <label htmlFor="priceInterval" className="form-label">Price Interval:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="priceInterval"
                                    value={priceInterval}
                                    onChange={(e) => setPriceInterval(e.target.value)}
                                />
                            </div>

                            <div className="col-lg-12 mb-4">
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Product Description:</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-dark w-50">Submit</button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Toast notifications */}
            <ToastContainer />
        </div>
    );
}

export default AddProduct;
