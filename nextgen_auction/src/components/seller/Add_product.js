// // import React, { useState } from 'react';

// // function AddProduct() {
// //     const [numberOfParameters, setNumberOfParameters] = useState(0);
// //     const [category, setCategory] = useState('');
// //     const [subCategory, setSubCategory] = useState('');
// //     const [auctionType, setAuctionType] = useState('');
// //     const [productImage, setProductImage] = useState(null);
// //     const [startDate, setStartDate] = useState('');
// //     const [priceInterval, setPriceInterval] = useState('');
// //     const [productName, setProductName] = useState('');
// //     const [description, setDescription] = useState('');
// //     const [minimumPrice, setMinimumPrice] = useState('');

// //     const handleImageChange = (e) => {
// //         setProductImage(e.target.files[0]);
// //     };

// //     const handleSubmit = (e) => {
// //         e.preventDefault();
// //         // Handle form submission logic here, including image upload and API calls
// //         console.log({
// //             numberOfParameters,
// //             category,
// //             subCategory,
// //             auctionType,
// //             productImage,
// //             startDate,
// //             priceInterval,
// //             productName,
// //             description,
// //             minimumPrice
// //         });
// //     };

// //     return (
// //         <div className="container mt-5">
// //             <h2 className="text-center mb-4">Add Product</h2>
// //             <form onSubmit={handleSubmit}>
// //                 <div className="mb-3">
// //                     <label htmlFor="numberOfParameters" className="form-label">Number of Parameters:</label>
// //                     <input
// //                         type="number"
// //                         className="form-control"
// //                         id="numberOfParameters"
// //                         value={numberOfParameters}
// //                         onChange={(e) => setNumberOfParameters(e.target.value)}
// //                     />
// //                 </div>

// //                 <div className="mb-3">
// //                     <label htmlFor="category" className="form-label">Category:</label>
// //                     <select
// //                         id="category"
// //                         className="form-select"
// //                         value={category}
// //                         onChange={(e) => setCategory(e.target.value)}
// //                     >
// //                         <option value="">- Select Category -</option>
// //                         <option value="Vintage Products">Vintage Products</option>
// //                         {/* Add more options as needed */}
// //                     </select>
// //                 </div>

// //                 <div className="mb-3">
// //                     <label htmlFor="subCategory" className="form-label">Sub-Category:</label>
// //                     <select
// //                         id="subCategory"
// //                         className="form-select"
// //                         value={subCategory}
// //                         onChange={(e) => setSubCategory(e.target.value)}
// //                     >
// //                         <option value="">- Select Sub-Category -</option>
// //                         {/* Add sub-categories based on the selected category */}
// //                     </select>
// //                 </div>

// //                 <div className="mb-3">
// //                     <label htmlFor="auctionType" className="form-label">Auction Type:</label>
// //                     <select
// //                         id="auctionType"
// //                         className="form-select"
// //                         value={auctionType}
// //                         onChange={(e) => setAuctionType(e.target.value)}
// //                     >
// //                         <option value="">- Select Auction Type -</option>
// //                         {/* Add auction type options */}
// //                     </select>
// //                 </div>

// //                 <div className="mb-3">
// //                     <label htmlFor="productImage" className="form-label">Product Image:</label>
// //                     <input
// //                         type="file"
// //                         className="form-control"
// //                         id="productImage"
// //                         accept="image/*"
// //                         onChange={handleImageChange}
// //                     />
// //                 </div>

// //                 <div className="mb-3">
// //                     <label htmlFor="startDate" className="form-label">Start Session Date:</label>
// //                     <input
// //                         type="date"
// //                         className="form-control"
// //                         id="startDate"
// //                         value={startDate}
// //                         onChange={(e) => setStartDate(e.target.value)}
// //                     />
// //                 </div>

// //                 <div className="mb-3">
// //                     <label htmlFor="priceInterval" className="form-label">Price Interval:</label>
// //                     <input
// //                         type="text"
// //                         className="form-control"
// //                         id="priceInterval"
// //                         value={priceInterval}
// //                         onChange={(e) => setPriceInterval(e.target.value)}
// //                     />
// //                 </div>

// //                 <div className="mb-3">
// //                     <label htmlFor="productName" className="form-label">Product Name:</label>
// //                     <input
// //                         type="text"
// //                         className="form-control"
// //                         id="productName"
// //                         value={productName}
// //                         onChange={(e) => setProductName(e.target.value)}
// //                     />
// //                 </div>

// //                 <div className="mb-3">
// //                     <label htmlFor="description" className="form-label">Description:</label>
// //                     <textarea
// //                         className="form-control"
// //                         id="description"
// //                         value={description}
// //                         onChange={(e) => setDescription(e.target.value)}
// //                         rows="3"
// //                     />
// //                 </div>

// //                 <div className="mb-3">
// //                     <label htmlFor="minimumPrice" className="form-label">Minimum Price:</label>
// //                     <input
// //                         type="number"
// //                         className="form-control"
// //                         id="minimumPrice"
// //                         value={minimumPrice}
// //                         onChange={(e) => setMinimumPrice(e.target.value)}
// //                     />
// //                 </div>

// //                 <button type="submit" className="btn btn-primary w-100">Submit</button>
// //             </form>
// //         </div>
// //     );
// // }

// // export default AddProduct;




// // // import React, { useState } from 'react';
// // // // import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure Bootstrap is imported

// // // function AddProduct() {
// // //     const [numberOfParameters, setNumberOfParameters] = useState(0);
// // //     const [category, setCategory] = useState('');
// // //     const [subCategory, setSubCategory] = useState('');
// // //     const [auctionType, setAuctionType] = useState('');
// // //     const [productImage, setProductImage] = useState(null);
// // //     const [startDate, setStartDate] = useState('');
// // //     const [priceInterval, setPriceInterval] = useState('');
// // //     const [productName, setProductName] = useState('');
// // //     const [description, setDescription] = useState('');
// // //     const [minimumPrice, setMinimumPrice] = useState('');

// // //     const handleImageChange = (e) => {
// // //         setProductImage(e.target.files[0]);
// // //     };

// // //     const handleSubmit = (e) => {
// // //         e.preventDefault();
// // //         // Handle form submission logic here, including image upload and API calls
// // //         console.log({
// // //             numberOfParameters,
// // //             category,
// // //             subCategory,
// // //             auctionType,
// // //             productImage,
// // //             startDate,
// // //             priceInterval,
// // //             productName,
// // //             description,
// // //             minimumPrice
// // //         });
// // //     };

// // //     return (
// // //         <div className="container mt-5">
// // //             <h2 className="text-center mb-4">Add Product</h2>
// // //             <form onSubmit={handleSubmit}>
// // //                 <div className="mb-3">
// // //                     <label htmlFor="numberOfParameters" className="form-label">Number of Parameters:</label>
// // //                     <input
// // //                         type="number"
// // //                         className="form-control"
// // //                         id="numberOfParameters"
// // //                         value={numberOfParameters}
// // //                         onChange={(e) => setNumberOfParameters(e.target.value)}
// // //                     />
// // //                 </div>

// // //                 <div className="mb-3">
// // //                     <label htmlFor="category" className="form-label">Category:</label>
// // //                     <select
// // //                         id="category"
// // //                         className="form-select"
// // //                         value={category}
// // //                         onChange={(e) => setCategory(e.target.value)}
// // //                     >
// // //                         <option value="">- Select Category -</option>
// // //                         <option value="Vintage Products">Vintage Products</option>
// // //                         {/* Add more options as needed */}
// // //                     </select>
// // //                 </div>

// // //                 <div className="mb-3">
// // //                     <label htmlFor="subCategory" className="form-label">Sub-Category:</label>
// // //                     <select
// // //                         id="subCategory"
// // //                         className="form-select"
// // //                         value={subCategory}
// // //                         onChange={(e) => setSubCategory(e.target.value)}
// // //                     >
// // //                         <option value="">- Select Sub-Category -</option>
// // //                         {/* Add sub-categories based on the selected category */}
// // //                     </select>
// // //                 </div>

// // //                 <div className="mb-3">
// // //                     <label htmlFor="auctionType" className="form-label">Auction Type:</label>
// // //                     <select
// // //                         id="auctionType"
// // //                         className="form-select"
// // //                         value={auctionType}
// // //                         onChange={(e) => setAuctionType(e.target.value)}
// // //                     >
// // //                         <option value="">- Select Auction Type -</option>
// // //                         {/* Add auction type options */}
// // //                     </select>
// // //                 </div>

// // //                 <div className="mb-3">
// // //                     <label htmlFor="productImage" className="form-label">Product Image:</label>
// // //                     <input
// // //                         type="file"
// // //                         className="form-control"
// // //                         id="productImage"
// // //                         accept="image/*"
// // //                         onChange={handleImageChange}
// // //                     />
// // //                 </div>

// // //                 <div className="mb-3">
// // //                     <label htmlFor="startDate" className="form-label">Start Session Date:</label>
// // //                     <input
// // //                         type="date"
// // //                         className="form-control"
// // //                         id="startDate"
// // //                         value={startDate}
// // //                         onChange={(e) => setStartDate(e.target.value)}
// // //                     />
// // //                 </div>

// // //                 <div className="mb-3">
// // //                     <label htmlFor="priceInterval" className="form-label">Price Interval:</label>
// // //                     <input
// // //                         type="text"
// // //                         className="form-control"
// // //                         id="priceInterval"
// // //                         value={priceInterval}
// // //                         onChange={(e) => setPriceInterval(e.target.value)}
// // //                     />
// // //                 </div>

// // //                 <div className="mb-3">
// // //                     <label htmlFor="productName" className="form-label">Product Name:</label>
// // //                     <input
// // //                         type="text"
// // //                         className="form-control"
// // //                         id="productName"
// // //                         value={productName}
// // //                         onChange={(e) => setProductName(e.target.value)}
// // //                     />
// // //                 </div>

// // //                 <div className="mb-3">
// // //                     <label htmlFor="description" className="form-label">Description:</label>
// // //                     <textarea
// // //                         className="form-control"
// // //                         id="description"
// // //                         value={description}
// // //                         onChange={(e) => setDescription(e.target.value)}
// // //                         rows="3"
// // //                     />
// // //                 </div>

// // //                 <div className="mb-3">
// // //                     <label htmlFor="minimumPrice" className="form-label">Minimum Price:</label>
// // //                     <input
// // //                         type="number"
// // //                         className="form-control"
// // //                         id="minimumPrice"
// // //                         value={minimumPrice}
// // //                         onChange={(e) => setMinimumPrice(e.target.value)}
// // //                     />
// // //                 </div>

// // //                 <button type="submit" className="btn btn-primary w-100">Submit</button>
// // //             </form>
// // //         </div>
// // //     );
// // // }

// // // export default AddProduct;




// // import React, { useState } from 'react';
// // import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

// // function AddProduct() {
// //     const [numberOfParameters, setNumberOfParameters] = useState(0);
// //     const [category, setCategory] = useState('');
// //     const [subCategory, setSubCategory] = useState('');
// //     const [auctionType, setAuctionType] = useState('');
// //     const [productImage, setProductImage] = useState(null);
// //     const [startDate, setStartDate] = useState('');
// //     const [priceInterval, setPriceInterval] = useState('');
// //     const [productName, setProductName] = useState('');
// //     const [description, setDescription] = useState('');
// //     const [minimumPrice, setMinimumPrice] = useState('');

// //     const handleImageChange = (e) => {
// //         setProductImage(e.target.files[0]);
// //     };

// //     const handleSubmit = (e) => {
// //         e.preventDefault();
// //         // Handle form submission logic here, including image upload and API calls
// //         console.log({
// //             numberOfParameters,
// //             category,
// //             subCategory,
// //             auctionType,
// //             productImage,
// //             startDate,
// //             priceInterval,
// //             productName,
// //             description,
// //             minimumPrice
// //         });
// //     };

// //     return (
// //         <div className="container mt-5">
// //             <div className="row">
// //                 {/* Left Column for Form */}
// //                 <div className="col-lg-6 mb-4">
// //                     <h2 className="text-center mb-4">Add Product</h2>
// //                     <form onSubmit={handleSubmit}>
// //                         <div className="mb-3">
// //                             <label htmlFor="numberOfParameters" className="form-label">Number of Parameters:</label>
// //                             <input
// //                                 type="number"
// //                                 className="form-control"
// //                                 id="numberOfParameters"
// //                                 value={numberOfParameters}
// //                                 onChange={(e) => setNumberOfParameters(e.target.value)}
// //                             />
// //                         </div>

// //                         <div className="mb-3">
// //                             <label htmlFor="category" className="form-label">Category:</label>
// //                             <select
// //                                 id="category"
// //                                 className="form-select"
// //                                 value={category}
// //                                 onChange={(e) => setCategory(e.target.value)}
// //                             >
// //                                 <option value="">- Select Category -</option>
// //                                 <option value="Vintage Products">Vintage Products</option>
// //                                 {/* Add more options as needed */}
// //                             </select>
// //                         </div>

// //                         <div className="mb-3">
// //                             <label htmlFor="subCategory" className="form-label">Sub-Category:</label>
// //                             <select
// //                                 id="subCategory"
// //                                 className="form-select"
// //                                 value={subCategory}
// //                                 onChange={(e) => setSubCategory(e.target.value)}
// //                             >
// //                                 <option value="">- Select Sub-Category -</option>
// //                                 {/* Add sub-categories based on the selected category */}
// //                             </select>
// //                         </div>

// //                         <div className="mb-3">
// //                             <label htmlFor="auctionType" className="form-label">Auction Type:</label>
// //                             <select
// //                                 id="auctionType"
// //                                 className="form-select"
// //                                 value={auctionType}
// //                                 onChange={(e) => setAuctionType(e.target.value)}
// //                             >
// //                                 <option value="">- Select Auction Type -</option>
// //                                 {/* Add auction type options */}
// //                             </select>
// //                         </div>

// //                         <div className="mb-3">
// //                             <label htmlFor="productImage" className="form-label">Product Image:</label>
// //                             <input
// //                                 type="file"
// //                                 className="form-control"
// //                                 id="productImage"
// //                                 accept="image/*"
// //                                 onChange={handleImageChange}
// //                             />
// //                         </div>

// //                         <div className="mb-3">
// //                             <label htmlFor="startDate" className="form-label">Start Session Date:</label>
// //                             <input
// //                                 type="date"
// //                                 className="form-control"
// //                                 id="startDate"
// //                                 value={startDate}
// //                                 onChange={(e) => setStartDate(e.target.value)}
// //                             />
// //                         </div>

// //                         <div className="mb-3">
// //                             <label htmlFor="priceInterval" className="form-label">Price Interval:</label>
// //                             <input
// //                                 type="text"
// //                                 className="form-control"
// //                                 id="priceInterval"
// //                                 value={priceInterval}
// //                                 onChange={(e) => setPriceInterval(e.target.value)}
// //                             />
// //                         </div>

// //                         <div className="mb-3">
// //                             <label htmlFor="productName" className="form-label">Product Name:</label>
// //                             <input
// //                                 type="text"
// //                                 className="form-control"
// //                                 id="productName"
// //                                 value={productName}
// //                                 onChange={(e) => setProductName(e.target.value)}
// //                             />
// //                         </div>

// //                         <div className="mb-3">
// //                             <label htmlFor="description" className="form-label">Description:</label>
// //                             <textarea
// //                                 className="form-control"
// //                                 id="description"
// //                                 value={description}
// //                                 onChange={(e) => setDescription(e.target.value)}
// //                                 rows="3"
// //                             />
// //                         </div>

// //                         <div className="mb-3">
// //                             <label htmlFor="minimumPrice" className="form-label">Minimum Price:</label>
// //                             <input
// //                                 type="number"
// //                                 className="form-control"
// //                                 id="minimumPrice"
// //                                 value={minimumPrice}
// //                                 onChange={(e) => setMinimumPrice(e.target.value)}
// //                             />
// //                         </div>

// //                         <button type="submit" className="btn btn-primary w-100">Submit</button>
// //                     </form>
// //                 </div>

// //                 {/* Right Column for Image or Any Content */}
// //                 <div className="col-lg-6">
// //                     <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
// //                         {/* Example: Displaying an image on the right */}
// //                         <img
// //                             src="https://via.placeholder.com/500"
// //                             alt="Product Image"
// //                             className="img-fluid"
// //                         />
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default AddProduct;





// import React, { useState } from 'react';

// function AddProduct() {
//     const [numberOfParameters, setNumberOfParameters] = useState(0);
//     const [category, setCategory] = useState('');
//     const [subCategory, setSubCategory] = useState('');
//     const [auctionType, setAuctionType] = useState('');
//     const [productImage, setProductImage] = useState(null);
//     const [startDate, setStartDate] = useState('');
//     const [priceInterval, setPriceInterval] = useState('');
//     const [productName, setProductName] = useState('');
//     const [description, setDescription] = useState('');
//     const [minimumPrice, setMinimumPrice] = useState('');

//     const handleImageChange = (e) => {
//         setProductImage(e.target.files[0]);
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle form submission logic here, including image upload and API calls
//         console.log({
//             numberOfParameters,
//             category,
//             subCategory,
//             auctionType,
//             productImage,
//             startDate,
//             priceInterval,
//             productName,
//             description,
//             minimumPrice
//         });
//     };

//     return (
//         <div className="container mt-5">
//             <h2 className="text-center mb-4">Add Product</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="row">
//                     {/* Left Column (First Section) */}
//                     <div className="col-lg-6 mb-4">
//                         <div className="mb-3">
//                             <label htmlFor="numberOfParameters" className="form-label">Number of Parameters:</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 id="numberOfParameters"
//                                 value={numberOfParameters}
//                                 onChange={(e) => setNumberOfParameters(e.target.value)}
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="category" className="form-label">Category:</label>
//                             <select
//                                 id="category"
//                                 className="form-select"
//                                 value={category}
//                                 onChange={(e) => setCategory(e.target.value)}
//                             >
//                                 <option value="">- Select Category -</option>
//                                 <option value="Vintage Products">Vintage Products</option>
//                                 {/* Add more options as needed */}
//                             </select>
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="subCategory" className="form-label">Sub-Category:</label>
//                             <select
//                                 id="subCategory"
//                                 className="form-select"
//                                 value={subCategory}
//                                 onChange={(e) => setSubCategory(e.target.value)}
//                             >
//                                 <option value="">- Select Sub-Category -</option>
//                                 {/* Add sub-categories based on the selected category */}
//                             </select>
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="auctionType" className="form-label">Auction Type:</label>
//                             <select
//                                 id="auctionType"
//                                 className="form-select"
//                                 value={auctionType}
//                                 onChange={(e) => setAuctionType(e.target.value)}
//                             >
//                                 <option value="">- Select Auction Type -</option>
//                                 {/* Add auction type options */}
//                             </select>
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="productImage" className="form-label">Product Image:</label>
//                             <input
//                                 type="file"
//                                 className="form-control"
//                                 id="productImage"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                             />
//                         </div>
//                     </div>

//                     {/* Right Column (Second Section) */}
//                     <div className="col-lg-6 mb-4">
//                         <div className="mb-3">
//                             <label htmlFor="startDate" className="form-label">Start Session Date:</label>
//                             <input
//                                 type="date"
//                                 className="form-control"
//                                 id="startDate"
//                                 value={startDate}
//                                 onChange={(e) => setStartDate(e.target.value)}
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="priceInterval" className="form-label">Price Interval:</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 id="priceInterval"
//                                 value={priceInterval}
//                                 onChange={(e) => setPriceInterval(e.target.value)}
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="productName" className="form-label">Product Name:</label>
//                             <input
//                                 type="text"
//                                 className="form-control"
//                                 id="productName"
//                                 value={productName}
//                                 onChange={(e) => setProductName(e.target.value)}
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="description" className="form-label">Description:</label>
//                             <textarea
//                                 className="form-control"
//                                 id="description"
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                                 rows="3"
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="minimumPrice" className="form-label">Minimum Price:</label>
//                             <input
//                                 type="number"
//                                 className="form-control"
//                                 id="minimumPrice"
//                                 value={minimumPrice}
//                                 onChange={(e) => setMinimumPrice(e.target.value)}
//                             />
//                         </div>

//                     </div>
//                         <button type="submit" className="btn btn-primary w-100">Submit</button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default AddProduct;




import React, { useState } from 'react';

function AddProduct() {
    const [numberOfParameters, setNumberOfParameters] = useState(0);
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [auctionType, setAuctionType] = useState('');
    const [productImage, setProductImage] = useState(null);
    const [startDateTime, setStartDateTime] = useState('');
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
                                value={startDateTime}
                                onChange={(e) => setStartDateTime(e.target.value)}
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
