const Order = require('../model/order');
const Product = require('../model/Product');
const sendMail = require('../utils/sendMail');
const Razorpay = require('razorpay');
const crypto = require('crypto');


// ==========================================
// CREATE NEW ORDER
// ==========================================

const createOrder = async (req, res) => {
    try {
        const {
            items,
            totalAmount,
            address,
            paymentId,
            paymentOrderId,
            paymentSignature
        } = req.body;

        // Check order data
        if (!Array.isArray(items) || items.length === 0 || !address || !paymentId || !paymentOrderId || !paymentSignature) {
            return res.status(400).json({
                message: 'Invalid order data'
            });
        }

        const productIds = [...new Set(items.map((item) => item.productID).filter(Boolean))];
        const products = await Product.find({ _id: { $in: productIds } });
        const productMap = new Map(products.map((product) => [product._id.toString(), product]));
        const quantities = new Map();

        let calculatedTotal = 0;
        const verifiedItems = [];

        for (const item of items) {
            const product = productMap.get(item.productID?.toString());
            const quantity = Number(item.qty);

            if (!product || !Number.isInteger(quantity) || quantity < 1) {
                return res.status(400).json({ message: 'One or more products are unavailable' });
            }

            quantities.set(product._id.toString(), (quantities.get(product._id.toString()) || 0) + quantity);
            calculatedTotal += product.price * quantity;
            verifiedItems.push({ productID: product._id, qty: quantity, price: product.price });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: 'Payment gateway is not configured' });
        }

        const existingPayment = await Order.findOne({ $or: [{ paymentId }, { paymentOrderId }] }).select('_id');
        if (existingPayment) return res.status(409).json({ message: 'This payment has already been used' });

        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${paymentOrderId}|${paymentId}`)
            .digest('hex');
        if (generatedSignature.length !== paymentSignature.length || !crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(paymentSignature))) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
        const paymentOrder = await razorpay.orders.fetch(paymentOrderId);
        const payment = await razorpay.payments.fetch(paymentId);
        if (paymentOrder.currency !== 'INR' || paymentOrder.amount !== Math.round(calculatedTotal * 100) || payment.order_id !== paymentOrderId || payment.amount !== paymentOrder.amount || payment.status !== 'captured') {
            return res.status(400).json({ message: 'Payment amount or status could not be verified' });
        }

        const decremented = [];
        try {
            for (const [productId, quantity] of quantities) {
                const result = await Product.updateOne({ _id: productId, stock: { $gte: quantity } }, { $inc: { stock: -quantity } });
                if (result.modifiedCount !== 1) throw new Error('One or more products are unavailable');
                decremented.push({ productId, quantity });
            }

            const newOrder = new Order({ user: req.user._id, items: verifiedItems, totalAmount: calculatedTotal, address, paymentId, paymentOrderId });
            await newOrder.save();
            return res.status(201).json({ message: 'Order created successfully', order: newOrder });
        } catch (error) {
            await Promise.all(decremented.map(({ productId, quantity }) => Product.updateOne({ _id: productId }, { $inc: { stock: quantity } })));
            throw error;
        }

    } catch (error) {
        res.status(500).json({
            message: 'Unable to create order'
        });
    }
};


// ==========================================
// GET MY ORDERS
// ==========================================

const myorders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id
        }).populate(
            'items.productID',
            'name price'
        );

        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({
            message: 'Unable to fetch orders'
        });
    }
};


// ==========================================
// GET ALL ORDERS
// ==========================================

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.productID', 'name price');

        res.status(200).json(orders);

    } catch (error) {
        res.status(500).json({
            message: 'Unable to fetch orders'
        });
    }
};


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

const updateOrderStatus = async (req, res) => {
    try {
        if (!['pending', 'shipped', 'delivered'].includes(req.body.status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        const previousStatus = order.status;
        order.status = req.body.status || order.status;

        await order.save();

        let notificationSent = false;
        if (order.status !== previousStatus && order.user?.email) {
            notificationSent = await sendMail(
                order.user.email,
                `Order #${order._id.toString().slice(-7).toUpperCase()} status updated`,
                `Hello ${order.user.name || 'there'},\n\nYour Shopers order #${order._id.toString().slice(-7).toUpperCase()} is now ${order.status}.\n\nThank you for shopping with us.`
            );
        }

        res.status(200).json({
            message: 'Order status updated successfully',
            order,
            notificationSent
        });

    } catch (error) {
        res.status(500).json({
            message: 'Unable to update order status'
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    createOrder,
    myorders,
    getOrders,
    updateOrderStatus
};