const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const SellerDetailsModel = require('../models/SellerDetailsModel');
const BidderDetailsModel = require('../models/BidderDetailsModel');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const FormData = require('form-data');

const axios = require('axios');

const maxAge = 3 * 24 * 60 * 60 * 1000;

var otp1 = 1;





const generateToken = (user) => {
    return jwt.sign({ username: user.username }, 'secret_key is blash');
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
                sellerName: req.body.sellerName,
                displayName: req.body.displayName,
                website: req.body.website,
                orgName: req.body.orgName,
                caption: req.body.caption,
                email: req.body.email,
                primaryMobile: req.body.primaryMobile,
                secondaryMobile: req.body.secondaryMobile,
                address: req.body.address,   // Assuming address is sent in the request body
                logo: req.body.logo, // Assuming logo is sent in the request body
            });

            // Save the seller details
            const sellerResult = await newSeller.save();
            console.log('Seller details saved:', sellerResult);
        }


        if (req.body.role === 'bidder') {
            const newBidder = new BidderDetailsModel({
                email: req.body.email,
                name: req.body.name,
                displayName: req.body.displayName,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
            });

            const bidderResult = await newBidder.save();
            console.log('Bidder details saved:', bidderResult);
        }

        // Now save the user information (this applies for both "seller" and other roles)
        const newUser = new UserModel({
            username: req.body.userName,
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
            const { username } = decoded;
            res.json({ username });
        } catch (err) {
            res.sendStatus(401); // Invalid token
        }
    } else {
        res.sendStatus(401); // No token found
    }
};









module.exports = {
    genotp,
    signup,
    login,
    getProfile,
    getotp
};
