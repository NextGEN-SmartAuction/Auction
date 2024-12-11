import React, { useState } from 'react';
import AuctionItems from './AuctionItems';
import axios from 'axios';

const Home = () => {
    const [auctionValidationData, setAuctionValidationData] = useState({});

    const getAuctionValidationData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_ServerUrl}/getFlaskInfo`);
            if (response.data.success) {
                console.log("Auction Validation Data:", response.data.data);
                setAuctionValidationData(response.data.data);
                alert("Auction validation data fetched successfully.");
            } else {
                console.error("Failed to fetch data:", response.data.message);
                alert(`Failed to fetch data: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error fetching auction validation data:", error.message);
            alert("An error occurred while fetching auction validation data. Check the console for details.");
        }
    };

    return (
        <div>
            <AuctionItems />


                <div>
                    <div className='d-flex flex-row'>
                        <h3 className='p-2'>Auction Validation Data</h3>
                        <button className="btn btn-primary mx-4" onClick={getAuctionValidationData}>
                            Get Auction Validation Data
                        </button>
                    </div>

                    {Object.entries(auctionValidationData).map(([auctionId, dataArray]) => (
                        <div key={auctionId} className="mb-4">
                            <h4>Auction ID: {auctionId}</h4>
                            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr>
                                        <th>Bidder Tendency</th>
                                        <th>Bidding Ratio</th>
                                        <th>Successive Outbidding</th>
                                        <th>Last Bidding</th>
                                        <th>Early Bidding</th>
                                        <th>Auction Bids</th>
                                        <th>Starting Price Average</th>
                                        <th>Winning Ratio</th>
                                        <th>Auction Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataArray.map((data, index) => (
                                        <tr key={index}>
                                            <td>{data.bidder_tendency.toFixed(2)}</td>
                                            <td>{data.bidding_ratio.toFixed(2)}</td>
                                            <td>{data.successive_outbidding.toFixed(2)}</td>
                                            <td>{data.last_bidding.toFixed(2)}</td>
                                            <td>{data.early_bidding.toFixed(2)}</td>
                                            <td>{data.auction_bids}</td>
                                            <td>{data.starting_price_average.toFixed(2)}</td>
                                            <td>{data.winning_ratio.toFixed(2)}</td>
                                            <td>{data.auction_duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
        </div>
    );
};

export default Home;
