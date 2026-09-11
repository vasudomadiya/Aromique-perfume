const Razorpay = require("razorpay");
const crypto = require("crypto");
const Product = require("../model/Product");
require("dotenv").config();

const getRazorpay = () => new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
    try {
        const items = Array.isArray(req.body.items) ? req.body.items : [];
        if (items.length === 0) return res.status(400).json({ message: "At least one product is required" });

        const productIds = [...new Set(items.map((item) => item.productID).filter(Boolean))];
        const products = await Product.find({ _id: { $in: productIds } });
        const productMap = new Map(products.map((product) => [product._id.toString(), product]));
        const quantities = new Map();
        let amount = 0;
        for (const item of items) {
            const product = productMap.get(String(item.productID));
            const quantity = Number(item.qty);
            if (!product || !Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ message: "One or more products are invalid" });
            quantities.set(String(item.productID), (quantities.get(String(item.productID)) || 0) + quantity);
        }
        for (const [productId, quantity] of quantities) {
            const product = productMap.get(productId);
            if (quantity > product.stock) return res.status(400).json({ message: `${product.name} does not have enough stock` });
            amount += product.price * quantity;
        }

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({ message: "A valid payment amount is required" });
        }

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({ message: "Payment gateway is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/.env." });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };
        const order = await getRazorpay().orders.create(options);
        res.status(200).json({ ...order, key_id: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        console.error("Razorpay order creation failed:", error.message);
        res.status(500).json({ message: "Unable to create payment order" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !process.env.RAZORPAY_KEY_SECRET) {
            return res.status(400).json({ message: "Payment verification data is incomplete" });
        }
        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');
        if (generatedSignature.length !== razorpay_signature.length || !crypto.timingSafeEqual(Buffer.from(generatedSignature), Buffer.from(razorpay_signature))) return res.status(400).json({ message: "Payment verification failed" });

        const razorpay = getRazorpay();
        const paymentOrder = await razorpay.orders.fetch(razorpay_order_id);
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        if (paymentOrder.currency !== "INR" || payment.order_id !== razorpay_order_id || payment.status !== "captured") {
            return res.status(400).json({ message: "Payment verification failed" });
        }

        res.status(200).json({ message: "Payment verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createOrder, verifyPayment };