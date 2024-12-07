const mongoose = require('mongoose');

const bidderSchema = new mongoose.Schema({
    auctionId: { type: Number, required: true },
    
});

const Bidder = mongoose.model('Bidder', bidderSchema);

module.exports = Bidder;