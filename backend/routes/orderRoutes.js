const express = require('express');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

const {
    createOrder,
    getOrders,
    myorders,
    updateOrderStatus
} = require('../controllers/orderController');

const router = express.Router();


// Create order / Get all orders
router.route('/')
    .post(protect, createOrder)
    .get(protect, admin, getOrders);


// Get my orders
router.route('/myorders')
    .get(protect, myorders);


// Update order status
router.route('/:id/status')
    .put(protect, admin, updateOrderStatus);


module.exports = router;