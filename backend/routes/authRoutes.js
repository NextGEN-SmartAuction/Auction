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
router.post('/addProduct', authController.addProduct);
router.get('/login', authController.login);
router.get('/products', authController.getProductDetails);
router.get('/profile', authController.getProfile);
router.get('/getFlaskInfo', authController.getFlaskInfo);
router.get('/getotp', authController.getotp);
router.post('/placeBid', authController.placeBid);
router.get('/sellers/:sellerId', authController.getSellerDetails);





module.exports = router;
