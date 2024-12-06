const mongoose = require('mongoose');

// Product Schema for each product object in the array
const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    auctionStatus: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'], // Restrict to valid statuses
        required: true,
    },
    productStatus: {
        type: String,
        default: 'unsold', // Default value
    }
}, { _id: false }); // Disable _id generation for the product sub-document

// Products Modal Schema
const productsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure one document per user
    },
    sellerId: {
        type: String,
        required: true,
        unique: true, // Ensure one document per user
    },
    products: {
        type: [productSchema],
        default: [], // Default to an empty array
    }
}, { versionKey: false });

const ProductsModal = mongoose.model('Products', productsSchema);
module.exports = ProductsModal;
