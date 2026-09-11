const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config({ path: path.join(__dirname, ".env") });

if (process.env.NODE_ENV === "production" && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32 || process.env.JWT_SECRET === "your_jwt_secret_key")) {
    throw new Error("JWT_SECRET must be a strong random value in production");
}

connectDB();

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
}));

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: false,
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use('/api/auth', require("./routes/authRoutes.js"));
app.use('/api/products', require("./routes/productRoutes.js"));
app.use('/api/orders', require("./routes/orderRoutes.js"));
app.use('/api/payments', require("./routes/paymentRoutes.js"));
app.use('/api/analytics', require("./routes/analyticsRoutes.js"));
// app.use('/api/categories', require("./routes/categoryRoutes.js"));
// app.use('/api/cart', require("./routes/cartRoutes.js"));
// app.use('/api/wishlist', require("./routes/wishlistRoutes.js"));
// app.use('/api/reviews', require("./routes/reviewRoutes.js"));
// app.use('/api/checkout', require("./routes/checkoutRoutes.js"));
// app.use('/api/admin', require("./routes/adminRoutes.js"));
// app.use('/api/analytics', require("./routes/analyticsRoutes.js"));
// app.use('/api/notifications', require("./routes/notificationRoutes.js"));
// app.use('/api/addresses', require("./routes/addressRoutes.js"));
// app.use('/api/coupons', require("./routes/couponRoutes.js"));
// app.use('/api/returns', require("./routes/returnRoutes.js"));
// app.use('/api/discounts', require("./routes/discountRoutes.js"));
// app.use('/api/subscriptions', require("./routes/subscriptionRoutes.js"));
// app.use('/api/support', require("./routes/supportRoutes.js"));
// app.use('/api/reports', require("./routes/reportRoutes.js"));
// app.use('/api/settings', require("./routes/settingsRoutes.js"));

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.code === "LIMIT_FILE_SIZE" || error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_FIELD_SIZE") {
        return res.status(400).json({ message: "Uploaded files or fields exceed the allowed limits" });
    }
    if (error instanceof multer.MulterError || error.message === "Unexpected field") {
        return res.status(400).json({ message: "Invalid upload request" });
    }
    console.error("Unhandled request error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
});

const frontendBuildPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendBuildPath));
app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(frontendBuildPath, "index.html"), (error) => {
        if (error) next();
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});