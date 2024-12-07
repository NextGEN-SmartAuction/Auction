const mongoose = require('mongoose');

// Define the Bid sub-schema
const BidSchema = new mongoose.Schema({
    bidder_id:
    {
        type: String, required: true
    },
    num_bids: {
        type: Number, default: 0

    },
    self_outbids: {
        type: Number, default: 0

    },
    first_bid_time: {
        type: Number, default: 0

    },
    last_bid_time: {
        type: Number, default: 0

    }
}, { _id: false }); // Disable `_id` for sub-schema

// Define the Auction schema
const AuctionSchema = new mongoose.Schema({
    auction_id: {
        type: String,
        required: true

    },
    auction_start_time: {
        type: Date,
        required: true

    },
    auction_end_time: {
        type: Date,
        required: true

    },
    auction_duration: {
        type: Number,
        default: 0
    }
    ,
    total_bids: {
        type: Number,
        default: 0

    },
    highest_bid: {
        type: Number,
        default: 0

    },
    starting_price: {
        type: Number,
        default: 0

    },
    seller_id: {
        type: String,
        required: true

    },
    bids: [BidSchema] // Use the Bid sub-schema here
}, { versionKey: false }); // Disable versionKey for the main schema

// Export the model
const Auction = mongoose.model('Auction', AuctionSchema);
module.exports = Auction;
