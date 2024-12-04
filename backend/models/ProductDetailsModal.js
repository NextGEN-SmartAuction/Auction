const mongoose = require('mongoose'); // Add this line to import mongoose

const productDetailsSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true, // Ensure productId is unique
    },
    noOfParts: {
        type: Number,
        default: 1, // Default value
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    startDateTime: {
        type: Date,
        required: true,
    },
    endDateTime: {
        type: Date,
        required: true,
    },
    auctionDuration: {
        type: String,
        required: true,
    },
    priceInterval: {
        type: String,
        required: true,
    },
    minimumPrice: {
        type: String,
        required: true,
    },
    reservedPrice: {
        type: String,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    productStatus: {
        type: String,
        default: 'unsold', // Default value
    },
    auctionStatus: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'], // Restrict to valid statuses
        required: true,
    },
    primaryImage: {
        type: String,
        required: true,
    },
    otherImages: {
        type: [String],
        default: [], // Default to an empty array
    },
    winner: {
        type: String,
        default: 'tbd', // Default value
    }
}, { versionKey: false });

const ProductDetailsModal = mongoose.model('ProductDetails', productDetailsSchema);

module.exports = ProductDetailsModal;

