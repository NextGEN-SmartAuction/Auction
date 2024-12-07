const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const SellerDetailsModel = require('../models/SellerDetailsModel');
const BidderDetailsModel = require('../models/BidderDetailsModel');
const ProductDetailsModal = require('../models/ProductDetailsModal');
const ProductsModal = require('../models/ProductsModal');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Auction = require('../models/AuctionModel'); // Adjust the path if needed
const BiddersAuction = require('../models/BiddersAuctionModel');
const FormData = require('form-data');

const axios = require('axios');

const maxAge = 3 * 24 * 60 * 60 * 1000;

var otp1 = 1;





const generateToken = (user) => {
    return jwt.sign({ username: user.username ,role:user.role,displayName: user.displayName ,userId :user.userId}, 'secret_key is blash');
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
                logoName : req.body.logoName,
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
                bidderId:req.body.userId,
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
            userId:req.body.userId,
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


const addProduct = async (req, res) => {
    try {
        const { 
            role, 
            username, 
            productId, 
            auctionStatus, 
            productStatus, 
            userId, 
            startDateTime, 
            endDateTime, 
            startingPrice, 
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
            auctionStatus: auctionStatus || 'upcoming',
            winner: 'tbd', // Default winner to 'tbd'
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
            starting_price: startingPrice,
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
            const decoded = jwt.verify(token, 'secret_key is blash');
            const { username,role,displayName,userId } = decoded;
            res.json({ username,role ,displayName,userId});
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


const placeBid = async (auctionId, bidderId, bidAmount) => {
    try {
    
        // Fetch the auction details
        const auction = await Auction.findById(auctionId);
        if (!auction) {
            throw new Error('Auction not found');
        }

        // Check if the auction is active
        const currentTime = new Date();
        if (currentTime < auction.auction_start_time || currentTime > auction.auction_end_time) {
            throw new Error('Auction is not active');
        }

        // Check if the bid is higher than the current highest bid
        if (bidAmount <= auction.highest_bid) {
            throw new Error('Bid amount must be higher than the current highest bid');
        }

        // Fetch the bidder details
        let bidder = await BiddersAuction.findById(bidderId);
        if (!bidder) {
            // If the bidder doesn't exist, create a new record
            bidder = new BiddersAuction({
                _id: bidderId,
                bid_history: new Map()
            });
        }

        // Update the auction details
        auction.highest_bid = bidAmount;
        auction.total_bids += 1;
        const existingBid = auction.bids.find(b => b.bidder_id === bidderId);
        if (existingBid) {
            existingBid.num_bids += 1;
            existingBid.last_bid_time = currentTime;
        } else {
            auction.bids.push({
                bidder_id: bidderId,
                num_bids: 1,
                first_bid_time: currentTime,
                last_bid_time: currentTime
            });
        }

        // Update the bidder details
        if (!bidder.bid_history.has(auctionId)) {
            bidder.total_auctions_participated += 1;
            bidder.bid_history.set(auctionId, []);
        }
        bidder.bid_history.get(auctionId).push({
            amount: bidAmount,
            timestamp: currentTime
        });

        // Save the updated auction and bidder details
        await auction.save();
        await bidder.save();

        return { success: true, message: 'Bid placed successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};






module.exports = {
    genotp,
    getSellerDetails,
    placeBid,
    signup,
    login,
    getProfile,
    getotp,
    getProductDetails,
    addProduct
};
