import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddProduct() {
    const [productId] = useState(`PID-${Date.now()}`); // Generate unique product ID
    const [noOfParts, setNoOfParts] = useState(1); // Default value for No of Parts
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [priceInterval, setPriceInterval] = useState('');
    const [minimumPrice, setMinimumPrice] = useState('');
    const [reservedPrice, setReservedPrice] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [auctionDuration, setAuctionDuration] = useState('');
    const [primaryImage, setPrimaryImage] = useState('');
    const [imageList, setImageList] = useState([]);
    const [productStatus] = useState('unsold'); // Default product status
    const [auctionStatus, setAuctionStatus] = useState(''); // Dynamically calculated auction status
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);
    const [subCategoryOptions, setSubCategoryOptions] = useState([]);

    const categories = {
        "Electronics": {
            "Mobile Phones": ["Apple", "Samsung", "OnePlus", "Xiaomi", "Oppo", "Vivo", "Google", "Motorola", "Sony", "Nokia"],
            "Tablets": ["Apple", "Samsung", "Lenovo", "Microsoft", "Amazon Fire", "Huawei"],
            "Laptops": ["Dell", "HP", "Lenovo", "Apple", "Acer", "Asus", "Microsoft", "Razer"],
            "Desktops": ["Dell", "HP", "Lenovo", "Apple", "Acer", "Asus", "MSI", "iBUYPOWER"],
            "Smart Watches": ["Apple", "Samsung", "Garmin", "Fitbit", "Fossil", "Amazfit"],
            "Gaming Consoles": ["Sony PlayStation", "Microsoft Xbox", "Nintendo Switch", "Steam Deck"],
            "Audio Devices": ["Sony", "Bose", "JBL", "Sennheiser", "Beats", "Anker"],
            "Cameras & Photography": ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic", "Olympus"],
            "Home Electronics": ["Samsung", "LG", "Sony", "TCL", "Vizio"],
            "Accessories": ["Belkin", "Anker", "Ugreen", "Baseus", "Logitech"]
        },
        "Fashion": {
            "Men's Clothing": ["H&M", "Zara", "Levi's", "Uniqlo", "Tommy Hilfiger", "Nike"],
            "Women's Clothing": ["H&M", "Zara", "Forever 21", "Levi's", "Uniqlo"],
            "Kid's Clothing": ["Carter's", "H&M Kids", "The Children's Place", "BabyGap"],
            "Footwear": ["Nike", "Adidas", "Puma", "Reebok", "Skechers"],
            "Jewelry": ["Tiffany & Co.", "Pandora", "Swarovski", "Cartier", "Blue Nile"],
            "Watches": ["Casio", "Rolex", "Fossil", "Seiko", "Titan", "Omega"],
            "Bags": ["Louis Vuitton", "Gucci", "Prada", "Samsonite", "Herschel"],
            "Eyewear": ["Ray-Ban", "Oakley", "Persol", "Carrera", "Tom Ford"]
        },
        "Home & Living": {
            "Furniture": ["IKEA", "Wayfair", "Ashley Furniture", "West Elm", "Home Centre"],
            "Home Décor": ["Pottery Barn", "West Elm", "Crate & Barrel", "IKEA"],
            "Kitchen Appliances": ["KitchenAid", "Cuisinart", "Breville", "Instant Pot", "Vitamix"],
            "Lighting": ["Philips Hue", "GE Lighting", "Lutron", "Cree", "Legrand"],
            "Bedding": ["Casper", "Saatva", "Tempur-Pedic", "Brooklinen", "Parachute"],
            "Storage Solutions": ["IKEA", "Sterilite", "ClosetMaid", "The Container Store"],
            "Garden Supplies": ["Fiskars", "Scotts", "Black & Decker", "Gardena"]
        },
        "Vehicles": {
            "Cars": ["Toyota", "Honda", "Ford", "Hyundai", "Tata", "Suzuki", "BMW", "Mercedes-Benz", "Audi", "Tesla"],
            "Motorcycles": ["Harley-Davidson", "Yamaha", "Honda", "Kawasaki", "Ducati", "Suzuki"],
            "Bicycles": ["Trek", "Specialized", "Giant", "Cannondale", "Schwinn", "Hero"],
            "Boats": ["Bayliner", "Sea Ray", "Yamaha", "MasterCraft", "Beneteau"],
            "Auto Parts & Accessories": ["Michelin", "Bridgestone", "Bosch", "Castrol", "Goodyear"]
        },
        "Sports & Outdoors": {
            "Sports Equipment": ["Nike", "Adidas", "Puma", "Wilson", "Spalding", "Yonex"],
            "Fitness Equipment": ["Bowflex", "NordicTrack", "Peloton", "ProForm", "Life Fitness"],
            "Outdoor Gear": ["The North Face", "Columbia", "Patagonia", "Osprey", "REI"],
            "Cycling": ["Shimano", "Trek", "Specialized", "Giant", "Cannondale"]
        },
        "Books & Media": {
            "Books": ["Penguin Random House", "HarperCollins", "Simon & Schuster", "Macmillan", "Hachette"],
            "Magazines": ["Time", "National Geographic", "Forbes", "Vogue", "The Economist"],
            "Music": ["Sony Music", "Universal Music", "Warner Music", "Yamaha Instruments", "Fender"],
            "Movies & TV": ["Disney", "Warner Bros", "Universal Pictures", "HBO", "Paramount"],
            "Games": ["Sony PlayStation", "Microsoft Xbox", "Nintendo", "Epic Games", "Ubisoft"]
        },
        "Health & Beauty": {
            "Skincare": ["The Ordinary", "Neutrogena", "Cerave", "Olay", "Clinique"],
            "Haircare": ["L'Oréal", "Pantene", "Garnier", "Tresemmé", "Aussie"],
            "Makeup": ["MAC", "Maybelline", "L'Oréal", "Sephora", "NARS"],
            "Personal Care": ["Gillette", "Oral-B", "Dove", "Colgate", "Braun"],
            "Fitness Supplements": ["Optimum Nutrition", "MuscleTech", "Dymatize", "BSN", "GNC"],
            "Medical Equipment": ["Omron", "Accu-Chek", "Philips", "Medtronic"]
        },
        "Collectibles": {
            "Antiques": ["Christie’s", "Sotheby’s", "Heritage Auctions"],
            "Coins": ["US Mint", "Royal Canadian Mint", "Perth Mint"],
            "Stamps": ["Stanley Gibbons", "Scott Catalogue"],
            "Art": ["Pablo Picasso", "Claude Monet", "Vincent van Gogh", "Banksy"],
            "Vintage Items": ["Rolex", "Louis Vuitton", "Hermès", "Gucci"],
            "Memorabilia": ["Topps", "Panini", "Fanatics", "Upper Deck"]
        },
        "Industrial & Business": {
            "Office Equipment": ["HP", "Canon", "Epson", "Brother"],
            "Industrial Tools": ["Bosch", "DeWalt", "Makita", "Hilti", "Stanley"],
            "Commercial Kitchen Equipment": ["Vollrath", "Robot Coupe", "Blodgett", "True Refrigeration"],
            "Construction Equipment": ["Caterpillar", "JCB", "Komatsu", "John Deere"],
            "Agricultural Tools": ["John Deere", "Kubota", "Mahindra", "New Holland"]
        },
        "Real Estate": {
            "Residential Properties": ["Lodha", "DLF", "Sobha", "Godrej Properties"],
            "Commercial Properties": ["WeWork", "Regus", "DLF", "Embassy"],
            "Land": ["RE/MAX", "Century 21"],
            "Vacation Rentals": ["Airbnb", "Vrbo", "Expedia"]
        },
        "Toys & Baby Products": {
            "Baby Gear": ["Graco", "Chicco", "Fisher-Price", "Britax"],
            "Baby Essentials": ["Huggies", "Pampers", "Johnson & Johnson"],
            "Toys for Kids": ["Lego", "Mattel", "Hasbro", "Fisher-Price", "Hot Wheels"]
        },
        "Food & Beverages": {
            "Packaged Food": ["Nestle", "Kraft Heinz", "Mondelez", "PepsiCo"],
            "Beverages": ["Coca-Cola", "Pepsi", "Red Bull", "Starbucks"],
            "Gourmet & Specialty Food": ["Godiva", "Lindt", "Toblerone", "Ferrero Rocher"]
        },
        "Software & Services": {
            "Digital Products": ["Microsoft Office", "Adobe Creative Suite", "Google Workspace"],
            "Online Subscriptions": ["Netflix", "Spotify", "Amazon Prime", "Hulu"],
            "Professional Services": ["Fiverr", "Upwork", "Toptal", "99designs"]
        },
        "Others": {
            "Tickets": ["Ticketmaster", "StubHub", "Eventbrite"],
            "Gift Cards": ["Amazon", "iTunes", "Google Play", "Starbucks"],
            "Miscellaneous": ["eBay", "Alibaba", "Wish", "Walmart"]
        }
    }






    useEffect(() => {
        const jwtToken = Cookies.get('jwt');
        if (jwtToken) {
            const checkAuthenticationStatus = async () => {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_ServerUrl}/profile`,
                        { withCredentials: true }
                    );
                    const { username ,userId} = response.data;
                    setUsername(username);
                    setUserId(userId);
                } catch (error) {
                    console.error('Authentication check failed:', error);
                }
            };
            checkAuthenticationStatus();
        }
    }, []);


    useEffect(() => {
        const calculateAuctionStatus = () => {
            if (!startDateTime || !endDateTime) {
                setAuctionStatus('');
                return;
            }

            const now = new Date();
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);

            if (now < start) {
                setAuctionStatus('upcoming');
            } else if (now >= start && now <= end) {
                setAuctionStatus('ongoing');
            } else {
                setAuctionStatus('completed');
            }
        };

        calculateAuctionStatus();
    }, [startDateTime, endDateTime]);

    useEffect(() => {
        if (startDateTime && endDateTime) {
            const start = new Date(startDateTime);
            const end = new Date(endDateTime);
            const duration = Math.abs(end - start) / (1000 * 60 * 60); // Duration in hours
            setAuctionDuration(duration ? `${duration.toFixed(2)} hours` : '');
        }
    }, [startDateTime, endDateTime]);

    const handleImageAdd = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageList([...imageList, file]);
        }
    };

    const handleImageDelete = (index) => {
        const imageName = imageList[index].name;
        setImageList(imageList.filter((_, idx) => idx !== index));
        if (imageName === primaryImage) {
            setPrimaryImage(''); // Reset primary image if deleted
        }
    };



    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);

        // Set sub-category options dynamically based on the selected category
        if (selectedCategory && categories[selectedCategory]) {
            setSubCategoryOptions(Object.keys(categories[selectedCategory]));
        } else {
            setSubCategoryOptions([]);
        }
        setSubCategory(''); // Reset sub-category when category changes
    };

    const handleSubCategoryChange = (e) => {
        setSubCategory(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!productName || !category || !subCategory || !startDateTime || !endDateTime || !minimumPrice || !reservedPrice || !priceInterval || !primaryImage) {
            toast.error('Please fill in all required fields!');
            return;
        }
          // Get the file extension of the primary image
        const primaryImageExtension = primaryImage.split('.').pop(); // Extracts the extension (e.g., 'jpeg')
        
        // Create the logo name using userId and the original image extension
        const logoImageName = `${productId}_P.${primaryImageExtension}`;

        // Prepare the form data for the first API call
        const formData = {
            username,
            userId,
            productId, // Assuming you have a unique productId generated somewhere
            noOfParts,
            category,
            subCategory,
            startDateTime,
            endDateTime,
            auctionDuration, // Assuming this is calculated somewhere
            priceInterval,
            minimumPrice,
            reservedPrice,
            productName,
            description,
            productStatus,
            logoImageName,
            auctionStatus,
            primaryImage,
            otherImages: imageList.filter((image) => image.name !== primaryImage).map((img) => img.name),
        };

        // Log form data (for debugging)
        console.log('Form Data:', formData);
        console.log('Images:', imageList);

        try {
            // Call your backend API to save the product
            const response = await axios.post(`${process.env.REACT_APP_ServerUrl}/addProduct`, formData, {
                withCredentials: true, // Include credentials if needed
            });

            if (response.status === 200) {
                toast.success('Product added successfully!');
            } else {
                toast.error('Failed to add product');
                return; // Stop further execution if the product is not added successfully
            }
        } catch (error) {
            toast.error('Error adding product');
            console.error('Error:', error);
            return; // Stop further execution on error
        }

        // Prepare the form data for the second API call (image upload)
        const formData1 = new FormData();
        formData1.append("productData", JSON.stringify(formData));
        formData1.append("primaryImage", imageList.find((img) => img.name === primaryImage));
        imageList
            .filter((img) => img.name !== primaryImage)
            .forEach((img, index) => {
                formData1.append(`otherImages${index + 1}`, img);
            });

        try {
            const response = await axios.post(`${process.env.REACT_APP_FlaskUrl}/uploadProductImages`, formData1, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success('Product and images uploaded successfully!');
            } else {
                toast.error('Failed to upload product and images');
            }
        } catch (error) {
            toast.error('Error uploading product and images');
            console.error('Error:', error);
        }
    };



    return (
        <div className="container p-2 col-11 border-2">
            <h2 className="text-center mb-4">Add Product</h2>
            <form onSubmit={handleSubmit}>
                <div className="card shadow borderp">
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-lg-12 mb-4">
                                <label className="form-label">Product ID:</label>
                                <p className="form-control">{productId}</p>
                            </div>
                            <div className="col-lg-8 mb-4">
                                <label className="form-label">Product Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-4 mb-4">
                                <label className="form-label">No of Parts:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={noOfParts}
                                    onChange={(e) => setNoOfParts(e.target.value)}
                                    min="1"
                                />
                            </div>
                            <div className="row">
                                <div className="col-lg-6 mb-4">
                                    <label className="form-label">Category:</label>
                                    <select
                                        className="form-select"
                                        value={category}
                                        onChange={handleCategoryChange}
                                    >
                                        <option value="">- Select Category -</option>
                                        {Object.keys(categories).map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-lg-6 mb-4">
                                    <label className="form-label">Sub-Category:</label>
                                    <select
                                        className="form-select"
                                        value={subCategory}
                                        onChange={handleSubCategoryChange}
                                        disabled={!subCategoryOptions.length}
                                    >
                                        <option value="">- Select Sub-Category -</option>
                                        {subCategoryOptions.map((subCat) => (
                                            <option key={subCat} value={subCat}>
                                                {subCat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4 mb-4">
                                <label className="form-label">Start Session:</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={startDateTime}
                                    onChange={(e) => setStartDateTime(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-4 mb-4">
                                <label className="form-label">End Session:</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={endDateTime}
                                    onChange={(e) => setEndDateTime(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-4 mb-4">
                                <label className="form-label">Auction Duration:</label>
                                <p className="form-control">{auctionDuration || 'Duration will appear here'}</p>
                            </div>
                            <div className="col-lg-4 mb-4">
                                <label className="form-label">Minimum Price:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={minimumPrice}
                                    onChange={(e) => setMinimumPrice(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-4 mb-4">
                                <label className="form-label">Reserved Price:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={reservedPrice}
                                    onChange={(e) => setReservedPrice(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-4 mb-4">
                                <label className="form-label">Price Interval:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={priceInterval}
                                    onChange={(e) => setPriceInterval(e.target.value)}
                                />
                            </div>
                            <div className="col-lg-6 mb-4">
                                <label className="form-label">Product Status:</label>
                                <p className="form-control">{productStatus}</p>
                            </div>
                            <div className="col-lg-6 mb-4">
                                <label className="form-label">Auction Status:</label>
                                <p className="form-control">{auctionStatus || 'Status will appear here'}</p>
                            </div>
                            <div className="col-lg-12 mb-4">
                                <label className="form-label">Product Images:</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageAdd}
                                />
                                <table className="table mt-3">
                                    <thead>
                                        <tr>
                                            <th>Preview</th>
                                            <th>Image Name</th>
                                            <th>Set Primary</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {imageList.map((image, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt="Preview"
                                                        style={{ width: '50px', height: '50px' }}
                                                    />
                                                </td>
                                                <td>{image.name}</td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className={`btn ${primaryImage === image.name ? 'btn-success' : 'btn-secondary'}`}
                                                        onClick={() => setPrimaryImage(image.name)}
                                                    >
                                                        {primaryImage === image.name ? 'Primary' : 'Set as Primary'}
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => handleImageDelete(index)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-lg-12 mb-4">
                                <label className="form-label">Product Description:</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="text-center">
                            <button type="submit" className="btn btn-dark w-50">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}

export default AddProduct;
