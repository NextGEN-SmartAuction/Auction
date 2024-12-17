const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    logoImageName: { type: String, required: true },
    sellerId: { type: String, required: true },
    sellerName: { type: String, required: true },
    bidderId: { type: String, required: true },
    bidderName: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    ipfsHash: { type: String, default: null },
    date: { type: String, required: true },
    time: { type: String, required: true }
}, { versionKey: false });


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
