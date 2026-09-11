const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { jwtSecret } = require("../config/env");

const protect = async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, jwtSecret);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user || (decoded.tokenVersion || 0) !== (req.user.tokenVersion || 0)) {
            return res.status(401).json({ message: "User no longer exists" });
        }

        return next();
    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};

module.exports = { protect };