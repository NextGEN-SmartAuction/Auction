const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const SellerDetailsModel = require('../models/SellerDetailsModel');
const BidderDetailsModel = require('../models/BidderDetailsModel');
const ProductDetailsModal = require('../models/ProductDetailsModal');
const Transaction= require('../models/TransactionsModal');
const ProductsModal = require('../models/ProductsModal');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const Auction = require('../models/AuctionModel'); // Adjust the path if needed
const BiddersAuction = require('../models/BiddersAuctionModel');
const FormData = require('form-data');

const axios = require('axios');

const maxAge = 3 * 24 * 60 * 60 * 1000;

var otp1 = 1;

dotenv.config({ path: './.env' });







const generateToken = (user) => {
    return jwt.sign({ username: user.username, role: user.role, displayName: user.displayName, userId: user.userId }, process.env.REACT_APP_SecretKey);
};

const getotp = async (req, res) => {
    res.json({ otp: otp1 });
};

const genotp = async (req, res) => {
    const { userId, email } = req.body;

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("user id is", userId)

    console.log("email id  is", email)
    console.log("otp  is")
    console.log(otp)
    otp1 = otp

    const transporter = nodemailer.createTransport({
        service: "hotmail",
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.REACT_APP_email,
            pass: process.env.REACT_APP_password,
        },
    });

    const mailOptions = {
        from: process.env.REACT_APP_email,
        to: userId,
        subject: 'OTP Verification from our medical vqa team',
        text: `Your OTP for verification is: ${otp}`,
    };


    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};


const signup = async (req, res) => {
    try {
        // Check if role is "seller"
        if (req.body.role === 'seller') {
            // If role is "seller", save the seller details first
            const newSeller = new SellerDetailsModel({
                userName: req.body.userName,
                sellerId: req.body.userId,
                sellerName: req.body.sellerName,
                displayName: req.body.displayName,
                website: req.body.website,
                orgName: req.body.orgName,
                caption: req.body.caption,
                logoName: req.body.logoName,
                email: req.body.email,
                primaryMobile: req.body.primaryMobile,
                secondaryMobile: req.body.secondaryMobile,
                address: req.body.address,
            });

            // Save the seller details
            const sellerResult = await newSeller.save();
            console.log('Seller details saved:', sellerResult);
        }


        if (req.body.role === 'bidder') {
            const newBidder = new BidderDetailsModel({
                userName: req.body.userName,
                bidderId: req.body.userId,
                name: req.body.name,
                displayName: req.body.displayName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
            });

            const bidderResult = await newBidder.save();
            console.log('Bidder details saved:', bidderResult);
        }

        // Now save the user information (this applies for both "seller" and other roles)
        const newUser = new UserModel({
            username: req.body.userName,
            userId: req.body.userId,
            displayName: req.body.displayName,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        });

        // Save the user details
        const result = await newUser.save();
        console.log('User saved:', result);



        res.sendStatus(200);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};


const getTransactionDetails = async (req, res) => {
    try {
        // Fetch all product details from the database
        const products = await Transaction.find();

        // Send the data as a JSON response
        res.status(200).json({
            success: true,
            message: "Product details fetched successfully",
            data: products,
        });
    } catch (error) {
        console.error("Error fetching product details:", error);

        // Send an error response
        res.status(500).json({
            success: false,
            message: "Failed to fetch product details",
            error: error.message,
        });
    }
};


const updateIpfsHash = async (req, res) => {
    const { productId, ipfsHash } = req.body;

    if (!productId || !ipfsHash) {
        return res.status(400).json({ message: 'productId and ipfsHash are required' });
    }

    try {
        // Find the transaction by productId
        const transaction = await Transaction.findOne({ productId });

        if (!transaction) {
            return res.status(404).json({ message: `Transaction with productId ${productId} not found` });
        }

        // Update the ipfsHash
        transaction.ipfsHash = ipfsHash;

        // Save the updated transaction
        await transaction.save();

        return res.status(200).json({ message: 'IPFS Hash updated successfully', transaction });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating IPFS hash', error: error.message });
    }
};


const getProductDetails = async (req, res) => {
    try {
        // Fetch all product details from the database
        const products = await ProductDetailsModal.find();

        // Send the data as a JSON response
        res.status(200).json({
            success: true,
            message: "Product details fetched successfully",
            data: products,
        });
    } catch (error) {
        console.error("Error fetching product details:", error);

        // Send an error response
        res.status(500).json({
            success: false,
            message: "Failed to fetch product details",
            error: error.message,
        });
    }
};



// Backend: Updated getProductDetailsById
const getProductDetailsById = async (req, res) => {
    try {
        const { productId } = req.body; 
        console.log("im called");// Extract productId from request body
        console.log(productId);// Extract productId from request body

        // Fetch product details from ProductDetailsModal
        const product = await ProductDetailsModal.findOne({ productId });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Fetch auction details to get highest bid and bidder information
        const auction = await Auction.findOne({ auction_id: productId });
        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction details not found",
            });
        }

        // Fetch seller and bidder details from UserModel
        const seller = await UserModel.findOne({ userId: auction.seller_id });
        const bidder = await UserModel.findOne({ userId: auction.highest_bidder_id });

        const response = {
            productName: product.productName,
            minimumPrice: product.minimumPrice,
            logo:product.logoImageName,
            seller: {
                userId: seller?.userId || null,
                username: seller?.username || null,
            },
            bidder: {
                userId: bidder?.userId || null,
                username: bidder?.username || null,
            },
            highestBid: auction.highest_bid || 0,
        };

        res.status(200).json({
            success: true,
            message: "Product details fetched successfully",
            data: response,
        });
    } catch (error) {
        console.error("Error fetching product details:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product details",
            error: error.message,
        });
    }
};


const addProduct = async (req, res) => {
    try {
        const {
            username,
            productId,
            auctionStatus,
            productStatus,
            userId,
            startDateTime,
            endDateTime,
            priceInterval,
            minimumPrice
        } = req.body;

        // Ensure user exists and has the correct role (seller)
        const user = await UserModel.findOne({ username });
        if (!user || user.role !== 'seller') {
            return res.status(400).send('User does not exist or is not a seller.');
        }

        // Check if the productId already exists in the seller's product list (ProductsModal)
        const existingProducts = await ProductsModal.findOne({ username });
        if (existingProducts) {
            const productExists = existingProducts.products.some(product => product.productId === productId);
            if (productExists) {
                return res.status(400).send('Product with this ID already exists.');
            }
        }

        // Create a new product in the ProductDetailsModal
        const newProductDetails = new ProductDetailsModal({
            productId,
            sellerId: userId,
            noOfParts: req.body.noOfParts || 1, // Default to 1 if not provided
            category: req.body.category,
            subCategory: req.body.subCategory,
            startDateTime,
            endDateTime,
            auctionDuration: req.body.auctionDuration,
            priceInterval,
            minimumPrice,
            reservedPrice: req.body.reservedPrice,
            productName: req.body.productName,
            description: req.body.description,
            productStatus: productStatus || 'unsold',
            logoImageName: req.body.logoImageName,
            auctionStatus: auctionStatus || 'upcoming',
        });

        const productDetailsResult = await newProductDetails.save();
        console.log('Product details saved:', productDetailsResult);

        // Add the product to the seller's product list
        const product = {
            productId,
            auctionStatus: auctionStatus || 'upcoming',
            productStatus: productStatus || 'unsold',
        };

        const existingSeller = await ProductsModal.findOne({ username });

        if (existingSeller) {
            const updatedProducts = await ProductsModal.findOneAndUpdate(
                { username },
                { $push: { products: product } }, // Add new product to the 'products' array
                { new: true } // Return the updated document
            );
            console.log('Product added to seller\'s product list:', updatedProducts);
        } else {
            const newProductsModal = new ProductsModal({
                username,
                sellerId: userId,
                products: [product]
            });

            const savedProductList = await newProductsModal.save();
            console.log('New ProductsModal document created:', savedProductList);
        }

        // Create a new auction entry
        const newAuction = new Auction({
            auction_id: productId, // Use productId as the auction ID
            auction_start_time: new Date(startDateTime),
            auction_end_time: new Date(endDateTime),
            auction_duration: (new Date(endDateTime) - new Date(startDateTime)) / 1000, // Duration in seconds
            total_bids: 0,
            highest_bid: 0,
            starting_price: minimumPrice,
            seller_id: userId,
            bids: [] // Initialize with an empty bids array
        });

        const auctionResult = await newAuction.save();
        console.log('Auction created successfully:', auctionResult);

        res.status(200).send('Product and auction added successfully.');

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
};


const completePayment = async (req, res) => {
    try {
        const { 
            sellerId, sellerName, bidderId, bidderName, 
            amount, transactionId, productId ,productName,logoImageName
        } = req.body;

        // Get current date and time
        const currentDate = new Date();

        // Format date as dd-mm-yyyy
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = currentDate.getFullYear(); // Full year
        const formattedDate = `${day}-${month}-${year}`;  // Updated to dd-mm-yyyy

        // Format time as hh:mm:ss
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        // Create a new transaction
        const newTransaction = new Transaction({
            productId,
            productName,
            logoImageName,
            sellerId,
            sellerName,
            bidderId,
            bidderName,
            amount,
            transactionId,
            date: formattedDate,  // Store formatted date
            time: formattedTime   // Store formatted time
        });
        await newTransaction.save();

        // Update payment status in ProductDetailsModal
        await ProductDetailsModal.updateOne(
            { productId },
            { $set: { paymentStatus: 'completed' } }
        );

        // Update payment status in ProductsModal
        await ProductsModal.updateOne(
            { 'products.productId': productId },
            { $set: { 'products.$.paymentStatus': 'completed' } }
        );

        res.status(200).json({ message: 'Payment completed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to complete payment.' });
    }
};




const login = async (req, res) => {
    console.log('Received login request:', req.query);
    const { identifier, password } = req.query;

    try {
        const user = await UserModel.findOne({
            $or: [
                { username: identifier },
                { email: identifier },
            ],
        });

        if (user) {
            bcrypt.compare(password, user.password, function (err, result) {
                if (result === true) {
                    const token = generateToken(user);

                    res.cookie("jwt", token, {
                        withCredentials: true,
                        httpOnly: false,
                        maxAge: maxAge,
                    });
                    res.json({ status: 'success', token, created: true, user: user.username });
                } else {
                    console.log("wrong pasword........")
                    res.status(401).json({ error: 'IncorrectPassword', message: 'Incorrect password' });
                }
            });
        } else {
            console.log("wrong user........")
            res.status(401).json({ error: 'UserNotFound', message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

const getProfile = (req, res) => {
    const token = req.cookies.jwt;
    console.log(token)
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.REACT_APP_SecretKey);
            const { username, role, displayName, userId } = decoded;
            res.json({ username, role, displayName, userId });
        } catch (err) {
            res.sendStatus(401); // Invalid token
        }
    } else {
        res.sendStatus(401); // No token found
    }
};


const getSellerDetails = async (req, res) => {
    try {
        const sellerId = req.params.sellerId;  // Get sellerId from the request parameters

        // Find the seller by sellerId in the database
        const seller = await SellerDetailsModel.findOne({ sellerId });

        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        // Respond with the seller details
        res.status(200).json(seller);
    } catch (err) {
        console.error("Error fetching seller details:", err);
        res.status(500).json({ message: "Failed to fetch seller details" });
    }
};

const trackProduct = async (req, res) => {
    try {
        const { productId } = req.body; // Extract productId from request body

        // Query the database to find bidders with bids for the specified productId
        const biddersData = await BiddersAuction.find({ [`bid_history.${productId}`]: { $exists: true } });

        // Iterate through the bidders and map out their bid history for the given productId
        const matchedBidders = biddersData.map(bidder => {
            // Get the bids for the specific productId from the Map
            const matchedBids = bidder.bid_history.get(productId) || [];

            // Include the productId in the response
            return {
                bidder_id: bidder.bidder_id,
                bidder_name: bidder.bidder_name,
                product_id: productId,
                bid_details: matchedBids.map(bid => ({
                    amount: bid.amount,
                    timestamp: bid.timestamp,
                })),
            };
        });

        // If we have matching bidders, return them
        if (matchedBidders.length > 0) {
            return res.status(200).json(matchedBidders);
        }

        // If no bidders were found for the specified productId
        return res.status(404).json({ message: 'No bidders found for this product.' });
    } catch (error) {
        console.error('Error in tracking product:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const placeBid = async (req, res) => {
    const { auctionId, bidderId, bidAmount, bidderName } = req.body;

    try {
        // Fetch the auction details
        const auction = await Auction.findOne({ auction_id: auctionId });
        if (!auction) {
            return res.status(404).json({ success: false, message: 'Auction not found' });
        }

        // Check if the auction is active
        const currentTime = new Date();
        if (currentTime < auction.auction_start_time || currentTime > auction.auction_end_time) {
            return res.status(400).json({ success: false, message: 'Auction is not active' });
        }


        // Determine dynamic percentage increment based on the highest bid
        const getDynamicIncrementPercentage = (highestBid) => {

            if (highestBid < 500) {
                // Bids below ₹1,000
                const percentages = [200, 250, 300]; // Subcategories
                return percentages[Math.floor(Math.random() * percentages.length)];
            }
            if (highestBid < 1000) {
                // Bids below ₹1,000
                const percentages = [80, 90, 100, 120]; // Subcategories
                return percentages[Math.floor(Math.random() * percentages.length)];
            }
            if (highestBid < 10000) {
                // Bids ₹1,000–₹10,000
                const percentages = [40, 50, 60]; // Subcategories
                return percentages[Math.floor(Math.random() * percentages.length)];
            }
            if (highestBid < 100000) {
                // Bids ₹10,000–₹1,00,000
                const percentages = [15, 20, 25]; // Subcategories
                return percentages[Math.floor(Math.random() * percentages.length)];
            }
            if (highestBid < 1000000) {
                // Bids ₹1,00,000–₹10,00,000
                const percentages = [8, 10, 12]; // Subcategories
                return percentages[Math.floor(Math.random() * percentages.length)];
            }
            if (highestBid < 10000000) {
                // Bids ₹10,00,000–₹1,00,00,000
                const percentages = [4, 5, 6]; // Subcategories
                return percentages[Math.floor(Math.random() * percentages.length)];
            }
            // Bids above ₹1,00,00,000
            const percentages = [1, 2, 3]; // Subcategories
            return percentages[Math.floor(Math.random() * percentages.length)];
        };

        // Get the dynamic percentage


        const MAX_INCREMENT_PERCENTAGE = getDynamicIncrementPercentage(auction.highest_bid);
        console.log(MAX_INCREMENT_PERCENTAGE);
        console.log(auction.highest_bid);

        // Calculate the valid bid range
        let minBid = auction.highest_bid === 0 ? auction.starting_price : auction.highest_bid + 1;
        let maxBid = auction.highest_bid === 0 ? auction.starting_price * (1 + MAX_INCREMENT_PERCENTAGE / 100) : auction.highest_bid * (1 + MAX_INCREMENT_PERCENTAGE / 100);


        // Check if the bid amount is within the valid range
        if (bidAmount < minBid || bidAmount > maxBid) {
            return res.status(400).json({
                success: false,
                message: `Bid amount must be between ₹${minBid.toFixed(2)} and ₹${maxBid.toFixed(2)}.`,
            });
        }

        // Check if the bid amount is valid
        if (bidAmount <= auction.highest_bid) {
            return res.status(400).json({
                success: false,
                message: 'Bid amount must be higher than the current highest bid',
            });
        }

        // Fetch or create the bidder details
        let bidder = await BiddersAuction.findOne({ bidder_id: bidderId });
        if (!bidder) {
            bidder = new BiddersAuction({
                bidder_id: bidderId,
                bidder_name: bidderName,
                total_auctions_participated: 0,
                bid_history: new Map(),
            });
        }

        // If the bidder is new to this auction, update their starting price stats
        if (!bidder.bid_history.has(auctionId)) {
            bidder.total_auctions_participated += 1;
            bidder.bid_history.set(auctionId, []);
        }

        // Calculate bid times in seconds relative to auction_start_time
        const auctionStartTime = new Date(auction.auction_start_time).getTime();
        const bidTimeInSeconds = Math.floor((currentTime.getTime() - auctionStartTime) / 1000);

        // Check if the current bidder is the highest bidder and increment self-outbids if necessary
        const existingBid = auction.bids.find((b) => b.bidder_id === bidderId);
        if (auction.highest_bidder_id === bidderId) {
            if (existingBid) {
                existingBid.self_outbids += 1;
            }
        }

        // Update auction details
        auction.highest_bid = bidAmount;
        auction.highest_bidder_id = bidderId;
        auction.total_bids += 1;

        if (existingBid) {
            existingBid.num_bids += 1;
            existingBid.last_bid_time = bidTimeInSeconds;
        } else {
            auction.bids.push({
                bidder_id: bidderId,
                num_bids: 1,
                self_outbids: 0,
                first_bid_time: bidTimeInSeconds,
                last_bid_time: bidTimeInSeconds,
            });
        }

        // Update bidder's bid history
        bidder.bid_history.get(auctionId).push({
            amount: bidAmount,
            timestamp: currentTime,
        });

        // Save changes
        await auction.save();
        await bidder.save();

        return res.status(200).json({
            success: true,
            message: 'Bid placed successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};


const getTotalBids = async () => {
    try {
        // Step 1: Fetch all auctions
        const auctions = await Auction.find({});
        // console.log('Auctions fetched:', auctions.length);

        // Step 2: Fetch all product details
        const productDetails = await ProductDetailsModal.find({});
        // console.log('Product details fetched:', productDetails.length);

        // Step 3: Create a map for product details (productId -> shillBiddingStatus)
        const productMap = {};
        productDetails.forEach((product) => {
            productMap[product.productId] = product.shillBiddingStatus;
        });

        // console.log('Product map created:', Object.keys(productMap).length);

        // Step 4: Create an empty array to store the total_bids for valid auctions
        const totalBidsArray = [];

        // Step 5: Iterate over each auction and check corresponding product details
        for (const auction of auctions) {
            const productShillBiddingStatus = productMap[auction.auction_id];  // Match productId with auctionId

            // Check if the shillBiddingStatus is not 'happened'
            if (productShillBiddingStatus !== 'happened') {
                // If the status is not 'happened', add the total_bids to the array
                totalBidsArray.push(auction.total_bids);
                // console.log(`Auction with ID ${auction.auction_id} added to totalBidsArray (Total Bids: ${auction.total_bids})`);
            }
        }

        // Step 6: Return the array of total_bids for valid auctions
        // console.log('Total Bids Array:', totalBidsArray.length);
        return totalBidsArray;  // Return the array of total_bids
    } catch (error) {
        console.error("Error fetching auction data:", error.message);
        throw new Error("Failed to fetch auction data");
    }
};


const getStartingBids = async () => {
    try {
        // Step 1: Fetch all auctions
        const auctions = await Auction.find({});
        // console.log('Auctions fetched:', auctions.length);

        // Step 2: Fetch all product details
        const productDetails = await ProductDetailsModal.find({});
        // console.log('Product details fetched:', productDetails.length);

        // Step 3: Create a map for product details (productId -> shillBiddingStatus)
        const productMap = {};
        productDetails.forEach((product) => {
            productMap[product.productId] = product.shillBiddingStatus;
        });

        // console.log('Product map created:', Object.keys(productMap).length);

        // Step 4: Create an array to store the starting prices for valid auctions
        const startingPricesArray = [];

        // Step 5: Iterate over each auction and check corresponding product details
        for (const auction of auctions) {
            const productShillBiddingStatus = productMap[auction.auction_id]; // Match productId with auctionId

            // Check if the shillBiddingStatus is not 'happened'
            if (productShillBiddingStatus !== 'happened') {
                startingPricesArray.push(auction.starting_price);
                // console.log(`Auction with ID ${auction.auction_id} added to startingPricesArray (Starting Price: ${auction.starting_price})`);
            }
        }

        // Step 6: Return the array of starting prices for valid auctions
        // console.log('Starting Prices Array:', startingPricesArray.length);
        return startingPricesArray; // Return the array of starting prices
    } catch (error) {
        console.error("Error fetching starting prices:", error.message);
        throw new Error("Failed to fetch starting prices");
    }
};


const getFlaskInfoById = async (auction_id) => {
    try {
        // Step 1: Fetch all auctions and bidders
        const auctions = await Auction.find({});
        const bidders = await BiddersAuction.find({});

        // Step 2: Call `getTotalBids` to get the total_bids for valid auctions
        const totalBidsArray = await getTotalBids();

        // Step 3: Call `getStartingBids` to get the starting prices for valid auctions
        const startingPricesArray = await getStartingBids();
        const minStartingPrice = Math.min(...startingPricesArray);
        const maxStartingPrice = Math.max(...startingPricesArray);

        // console.log('Min Starting Price:', minStartingPrice);
        // console.log('Max Starting Price:', maxStartingPrice);

        // Step 4: Calculate min_bids and max_bids
        const minBids = Math.min(...totalBidsArray);
        const maxBids = Math.max(...totalBidsArray);

        // console.log('Min Bids:', minBids);
        // console.log('Max Bids:', maxBids);

        // Step 5: Map bidders data to make it easily accessible
        const bidderMap = {};
        bidders.forEach((bidder) => {
            bidderMap[bidder.bidder_id] = {
                winning_ratio: bidder.winning_ratio,
            };
        });

        // Step 6: Prepare auction data
        const auctionData = {};

        auctions.forEach((auction) => {
            const auctionId = auction.auction_id;
            auctionData[auctionId] = auctionData[auctionId] || [];

            auction.bids.forEach((bid) => {
                const bidderData = bidderMap[bid.bidder_id] || {
                    winning_ratio: 0,
                };

                // Calculate additional stats
                const totalAuctionCount = auctions.filter((a) =>
                    a.bids.some((b) => b.bidder_id === bid.bidder_id)
                ).length;

                const sameSellerAuctionCount = auctions.filter(
                    (a) =>
                        a.seller_id === auction.seller_id &&
                        a.bids.some((b) => b.bidder_id === bid.bidder_id)
                ).length;

                const bidderTendency = sameSellerAuctionCount / (totalAuctionCount || 1);

                // Step 7: Push the necessary data including min_bids and max_bids
                auctionData[auctionId].push({
                    bidder_tendency: bidderTendency,
                    bidding_ratio: bid.num_bids / (auction.total_bids || 1),
                    successive_outbidding: bid.self_outbids / (bid.num_bids || 1),
                    last_bidding: 1 - (bid.last_bid_time / auction.auction_duration),
                    early_bidding: bid.first_bid_time / auction.auction_duration,
                    auction_bids: auction.total_bids,
                    current_starting_price: auction.starting_price,
                    min_starting_price: minStartingPrice,
                    max_starting_price: maxStartingPrice,
                    winning_ratio: bidderData.winning_ratio,
                    auction_duration: auction.auction_duration,
                    min_bids: minBids,
                    max_bids: maxBids,
                });
            });
        });

        // console.log("Auction Data:", auctionData[auction_id]);

        // Step 8: Return the auction data for the specific auction_id
        return auctionData[auction_id] || {}; // Returning the specific auction data
    } catch (error) {
        console.error("Error fetching Flask info by ID:", error.message);
        throw new Error("Failed to fetch Flask info by ID");
    }
};


const getBidderAnalytics = async (req, res) => {
    try {
        // Step 1: Extract auction_id from the request body
        const { auction_id } = req.query;
        console.log(auction_id);
        if (!auction_id) {
            return res.status(400).json({
                success: false,
                message: "auction_id is required",
            });
        }

        // Step 2: Fetch the specific auction and its bids
        const auction = await Auction.findOne({ auction_id });
        if (!auction) {
            return res.status(404).json({
                success: false,
                message: "Auction not found",
            });
        }

        // Step 3: Prepare bidder analytics
        const bidderAnalytics = {};

        auction.bids.forEach((bid) => {
            const bidderId = bid.bidder_id;

            // Initialize entry for bidder if not exists
            if (!bidderAnalytics[bidderId]) {
                bidderAnalytics[bidderId] = {
                    bidder_tendency: 0,
                    highest_bid_to_seller: auction.highest_bid,
                    first_bid_time: bid.first_bid_time,
                    last_bid_time: bid.last_bid_time,
                    num_bids: bid.num_bids,
                    auction_duration: auction.auction_duration,
                };
            }

            // Update analytics for the bidder
            const totalAuctionCount = 1; // Only current auction is relevant
            const sameSellerAuctionCount = auction.seller_id === auction.seller_id ? 1 : 0;

            bidderAnalytics[bidderId].bidder_tendency =
                sameSellerAuctionCount / totalAuctionCount;
            bidderAnalytics[bidderId].first_bid_time = Math.min(
                bidderAnalytics[bidderId].first_bid_time,
                bid.first_bid_time
            );
            bidderAnalytics[bidderId].last_bid_time = Math.max(
                bidderAnalytics[bidderId].last_bid_time,
                bid.last_bid_time
            );
        });

        // Step 4: Return the processed data
        return res.status(200).json({
            success: true,
            data: bidderAnalytics,
        });
    } catch (error) {
        console.error("Error fetching analytics:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch bidder analytics",
            error: error.message,
        });
    }
};





const updateAuctionStatus = async (req, res) => {
    const { productId, newStatus } = req.body; // Receive productId and newStatus from the frontend

    if (!productId || !newStatus) {
        return res.status(400).json({
            success: false,
            message: "Product ID and new status are required."
        });
    }

    try {
        // Update the product in the ProductsModal
        const productsResult = await ProductsModal.findOneAndUpdate(
            { "products.productId": productId }, // Match the product in the products array
            { $set: { "products.$.auctionStatus": newStatus } }, // Update the auctionStatus of the matched product
            { new: true } // Return the updated document
        );

        if (!productsResult) {
            return res.status(404).json({
                success: false,
                message: "Product not found in ProductsModal."
            });
        }

        // Update the product in the ProductDetailsModal
        const productDetailsResult = await ProductDetailsModal.findOneAndUpdate(
            { productId }, // Match by productId
            { $set: { auctionStatus: newStatus } }, // Update the auctionStatus
            { new: true } // Return the updated document
        );

        if (!productDetailsResult) {
            return res.status(404).json({
                success: false,
                message: "Product not found in ProductDetailsModal."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Auction status updated successfully in both models.",
            updatedProductsModal: productsResult,
            updatedProductDetailsModal: productDetailsResult,
        });
    } catch (error) {
        console.error("Error updating auction status:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Could not update auction status.",
        });
    }
};


const updateProductStatus = async (req, res) => {
    const { productId, newStatus } = req.body; // Receive productId and newStatus from the frontend

    if (!productId || !newStatus) {
        return res.status(400).json({
            success: false,
            message: "Product ID and new status are required."
        });
    }

    try {
        // Update the product in the ProductsModal
        const productsResult = await ProductsModal.findOneAndUpdate(
            { "products.productId": productId }, // Match the product in the products array
            { $set: { "products.$.productStatus": newStatus } }, // Update the productStatus of the matched product
            { new: true } // Return the updated document
        );

        if (!productsResult) {
            return res.status(404).json({
                success: false,
                message: "Product not found in ProductsModal."
            });
        }

        // Update the product in the ProductDetailsModal
        const productDetailsResult = await ProductDetailsModal.findOneAndUpdate(
            { productId }, // Match by productId
            { $set: { productStatus: newStatus } }, // Update the productStatus
            { new: true } // Return the updated document
        );

        if (!productDetailsResult) {
            return res.status(404).json({
                success: false,
                message: "Product not found in ProductDetailsModal."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Auction status updated successfully in both models.",
        });
    } catch (error) {
        console.error("Error updating auction status:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error. Could not update auction status.",
        });
    }
};





const completeAuction = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Fetch auction and product details from MongoDB
        const auction = await Auction.findOne({ auction_id: productId });
        const product = await ProductDetailsModal.findOne({ productId });

        if (!auction || !product) {
            return res.status(404).json({ message: "Auction or Product not found" });
        }

        // Call getFlaskInfoById with the provided auction_id
        const auctionData = await getFlaskInfoById(productId);

        // Call Flask API to handle auction completion
        const flaskApiUrl = `${process.env.REACT_APP_FLASK_API_URL}/complete-auction`;
        const flaskResponse = await axios.post(flaskApiUrl, {
            auctionData,  // Send the obtained auction data
        });

        if (flaskResponse.status !== 200) {
            throw new Error("Flask API responded with an error");
        }

        const { shill_status } = flaskResponse.data;
        console.log(shill_status); // Log the renamed status

        // Determine the auction status
        let newAuctionStatus = 'completed';
        let winner = auction.highest_bidder_id || "Item didn't meet required price";

        if (auction.highest_bid <= parseFloat(product.reservedPrice)) {
            newAuctionStatus = 'withDrawn';
            winner = "Item didn't meet required price";
        }

        let payment_status = "no_need"; // Default value
        if (winner.startsWith("BID")) {
            payment_status = "pending";
        }

        // Update the auction and product details in MongoDB
        await Auction.updateOne(
            { auction_id: productId },
            { $set: { auction_status: newAuctionStatus } }
        );

        await ProductDetailsModal.updateOne(
            { productId },
            {
                $set: {
                    auctionStatus: newAuctionStatus,
                    winner,
                    shillBiddingStatus: shill_status,
                    paymentStatus: payment_status,
                },
            }
        );

        // Update the respective product in ProductsModal
        await ProductsModal.updateOne(
            { "products.productId": productId }, // Find the specific product in the array
            {
                $set: {
                    "products.$.auctionStatus": newAuctionStatus,
                    "products.$.shillBiddingStatus": shill_status,
                    "products.$.paymentStatus": payment_status,
                },
            }
        );

        // Respond with a success message
        res.status(200).json({
            message: "Auction completed successfully",
            data: { auctionStatus: newAuctionStatus, winner, shill_status },
        });
    } catch (err) {
        console.error("Error completing auction:", err);
        res.status(500).json({ message: "Failed to complete auction", error: err.message });
    }
};



// Get participated bids for the logged-in user
const fetchBids = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(`Fetching bids for userId: ${userId}`);
        
        const bidderData = await BiddersAuction.findOne({ bidder_id: userId });
        if (!bidderData) {
            return res.status(404).json({ message: 'No bids found for this user.' });
        }

        const participatedBids = [];
        for (const [productId, bidHistory] of bidderData.bid_history.entries()) {
            const product = await ProductDetailsModal.findOne({ productId });
            if (product) {
                participatedBids.push({
                    productId: product.productId,
                    productName: product.productName,
                    auctionStatus: product.auctionStatus,
                    winner: product.winner,
                    logo:product.logoImageName,
                    base:product.minimumPrice,
                    bidHistory, // Include the bid history
                });
            }
        }

        // console.log(participatedBids);
        res.json(participatedBids);
    } catch (error) {
        console.error('Error fetching participated bids:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


const fetchWonBids = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log(userId)

        const wonBids = await ProductDetailsModal.find({
            winner: userId,
        }).select('productId productName paymentStatus logoImageName');

        if (!wonBids.length) {
            return res.status(404).json({ message: 'No won bids found.' });
        }

        res.json(wonBids);
    } catch (error) {
        console.error('Error fetching won bids:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};





module.exports = {
    genotp,
    getSellerDetails,
    placeBid,
    updateIpfsHash,
    fetchWonBids,
    fetchBids,
    getTransactionDetails,
    updateAuctionStatus,
    getProductDetailsById,
    trackProduct,
    getBidderAnalytics,
    updateProductStatus,
    signup,
    login,
    getProfile,
    completeAuction,
    getotp,
    getProductDetails,
    completePayment,
    addProduct
};
