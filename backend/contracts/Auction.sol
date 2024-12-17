// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2;

contract Auction {
    address admin = 0xd5811715C61e8E5287c09a7Aac969ba25be5FacC;

    modifier onlyadmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    struct ProductInfo {
        string productId;
        string productName;
        string sellerId;
        string sellerName;
        string bidderId;
        string bidderName;
        uint256 amount;
        string transactionId;
        string date;
        string time;
        string ipfsHash;
    }

    mapping(string => ProductInfo) private products;
    string[] private productIds;

    // Add purchase information to the contract
    function addPurchase(
        string memory productId,
        string memory productName,
        string memory sellerId,
        string memory sellerName,
        string memory bidderId,
        string memory bidderName,
        uint256 amount,
        string memory transactionId,
        string memory date,
        string memory time,
        string memory ipfsHash
    ) public onlyadmin {
        require(bytes(products[productId].productId).length == 0, "Product ID already exists");

        products[productId] = ProductInfo({
            productId: productId,
            productName: productName,
            sellerId: sellerId,
            sellerName: sellerName,
            bidderId: bidderId,
            bidderName: bidderName,
            amount: amount,
            transactionId: transactionId,
            date: date,
            time: time,
            ipfsHash: ipfsHash
        });

        productIds.push(productId);
    }

    // Get all products
    function getAllProducts() public view returns (ProductInfo[] memory) {
        ProductInfo[] memory allProducts = new ProductInfo[](productIds.length);
        for (uint256 i = 0; i < productIds.length; i++) {
            allProducts[i] = products[productIds[i]];
        }
        return allProducts;
    }

    // Get product by product ID
    function getProductById(string memory productId) public view returns (ProductInfo memory) {
        require(bytes(products[productId].productId).length != 0, "Product ID does not exist");
        return products[productId];
    }

    // Get products by product ID and seller ID
    function getProductByIdAndSeller(string memory productId, string memory sellerId) public view returns (ProductInfo memory) {
        require(bytes(products[productId].productId).length != 0, "Product ID does not exist");
        require(
            keccak256(abi.encodePacked(products[productId].sellerId)) == keccak256(abi.encodePacked(sellerId)),
            "Seller ID does not match"
        );
        return products[productId];
    }

    // Get products by bidder ID and product ID
    function getProductByIdAndBidder(string memory productId, string memory bidderId) public view returns (ProductInfo memory) {
        require(bytes(products[productId].productId).length != 0, "Product ID does not exist");
        require(
            keccak256(abi.encodePacked(products[productId].bidderId)) == keccak256(abi.encodePacked(bidderId)),
            "Bidder ID does not match"
        );
        return products[productId];
    }

    // Get all product IDs
    function getAllProductIds() public view returns (string[] memory) {
        return productIds;
    }
}