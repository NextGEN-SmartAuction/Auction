const mongoose = require('mongoose');

// Address Schema for nested structure
const addressSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    }
}, { _id: false }); // Disable _id generation for the address sub-document

// BidderDetails Schema
const bidderDetailsSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure unique email addresses
        trim: true,  // Remove any extra spaces from email
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: addressSchema,
        required: true,
    },
}, { versionKey: false });

const BidderDetailsModel = mongoose.model('BidderDetails', bidderDetailsSchema);

module.exports = BidderDetailsModel;
