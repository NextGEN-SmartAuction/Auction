const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Auction = require('./models/AuctionModel'); // Assuming Auction schema is defined

dotenv.config({ path: './.env' });

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Connect to MongoDB
mongoose.connect(process.env.REACT_APP_MongoLink)
    .then(() => console.log('Connected to MongoDB for SSE server'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// SSE Endpoint for auction updates
app.get('/auction/:auctionId/updates', async (req, res) => {
    const { auctionId } = req.params;
    console.log("hello im sse server",auctionId)

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial data
    const auction = await Auction.findOne({ auction_id: auctionId });
    if (auction) {
        res.write(`data: ${JSON.stringify({
            highestBid: auction.highest_bid || 'No bids yet',
            numberOfBids: auction.total_bids || 0,
            percentageIncrease: auction.highest_bid
                ? (((auction.highest_bid - auction.starting_price) / auction.starting_price) * 100).toFixed(2)
                : 'N/A',
        })}\n\n`);
    }

    // Simulate updates (replace this with real logic in production)
    const interval = setInterval(async () => {
        const updatedAuction = await Auction.findOne({ auction_id: auctionId });
        if (updatedAuction) {
            res.write(`data: ${JSON.stringify({
                highestBid: updatedAuction.highest_bid,
                numberOfBids: updatedAuction.total_bids,
                percentageIncrease: (((updatedAuction.highest_bid - updatedAuction.starting_price) / updatedAuction.starting_price) * 100).toFixed(2),
            })}\n\n`);
        }
    }, 5000); // Send updates every 5 seconds

    // Cleanup when the client disconnects
    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
});

// Start server on port 5003
const PORT = 5003;
app.listen(PORT, () => console.log(`SSE server running on port ${PORT}`));

