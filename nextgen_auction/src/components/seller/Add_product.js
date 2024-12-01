import React, { useState } from 'react';

function AddProduct() {
    const [numberOfParameters, setNumberOfParameters] = useState(0);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [auctionType, setAuctionType] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [priceInterval, setPriceInterval] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [minimumPrice, setMinimumPrice] = useState('');

    const handleImageChange = (e) => {
        setProductImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            numberOfParameters,
            category,
            subCategory,
            auctionType,
            productImage,
            startDateTime,
            priceInterval,
            productName,
            description,
            minimumPrice
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Add Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-lg-6 mb-4">
                        <div className="mb-3">
                            <label htmlFor="numberOfParameters" className="form-label">Number of Parameters:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="numberOfParameters"
                                value={numberOfParameters}
                                onChange={(e) => setNumberOfParameters(e.target.value)}
                            />
                        </div>

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
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="subCategory" className="form-label">Sub-Category:</label>
                            <select
                                id="subCategory"
                                className="form-select"
                                value={subCategory}
                                onChange={(e) => setSubCategory(e.target.value)}
                            >
                                <option value="">- Select Sub-Category -</option>
                            </select>
                        </div>

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

                    <div className="col-lg-6 mb-4">

                        <div className="mb-3">
                            <label htmlFor="startDateTime" className="form-label">Start Session (Date & Time):</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="startDateTime"
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="startDateTime" className="form-label">End Session (Date & Time):</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                id="startDateTime"
                                value={endDateTime}
                                onChange={(e) => setEndDateTime(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="minimumPrice" className="form-label">Minimum Price:</label>
                            <input
                                type="number"
                                className="form-control"
                                id="minimumPrice"
                                value={minimumPrice}
                                onChange={(e) => setMinimumPrice(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="priceInterval" className="form-label">Price Interval:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="priceInterval"
                                value={priceInterval}
                                onChange={(e) => setPriceInterval(e.target.value)}
                            />
                        </div>


                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description:</label>
                            <textarea
                                className="form-control"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="3"
                            />
                        </div>


                    </div>
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '12vh' }}>
                        <button type="submit" className="btn btn-dark w-50">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddProduct;
