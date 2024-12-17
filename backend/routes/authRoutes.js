const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const formData = require('express-form-data');

// Create an instance of express-form-data
const formMiddleware = formData.parse();

// Use the middleware for parsing form data
router.use(formMiddleware);

router.post('/genotp', authController.genotp);
router.post('/signup', authController.signup);
router.post('/updateProductStatus', authController.updateProductStatus);
router.post('/addProduct', authController.addProduct);
router.post('/updateIpfsHash', authController.updateIpfsHash);
router.get('/login', authController.login);
router.get('/products', authController.getProductDetails);
router.post('/completeAuction', authController.completeAuction);
router.get('/profile', authController.getProfile);
router.post('/trackProduct', authController.trackProduct);
router.post('/updateAuctionStatus', authController.updateAuctionStatus);
router.get('/getBidderAnalytics', authController.getBidderAnalytics);
router.get('/getotp', authController.getotp);
router.get('/getTransactionDetails', authController.getTransactionDetails);
router.post('/placeBid', authController.placeBid);
router.post('/fetchBids', authController.fetchBids);
router.post('/fetchWonBids', authController.fetchWonBids);
router.post('/getProductDetailsById', authController.getProductDetailsById);
router.post('/completePayment', authController.completePayment);
router.get('/sellers/:sellerId', authController.getSellerDetails);





module.exports = router;
