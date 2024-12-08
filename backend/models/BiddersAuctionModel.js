const mongoose = require('mongoose');

// Define the Bidder schema
const BidderAuctionSchema = new mongoose.Schema({
    bidder_id: { type: String, required: true },
    starting_price_average: { type: Number, default: 0 },
    winning_auctions: { type: Number, default: 0 },
    total_starting_price: { type: Number, default: 0 },
    total_auctions_participated: { type: Number, default: 0 },
    winning_ratio: { type: Number, default: 0 },
    bid_history: {
        type: Map,
        of: [
            {
                amount: { type: Number, required: true },
                timestamp: { type: Date, required: true }
            }
        ]
    }
}, { versionKey: false });

const BiddersAuction = mongoose.model('BiddersAuction', BidderAuctionSchema);
module.exports = BiddersAuction;
