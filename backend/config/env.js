const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const weakJwtSecrets = new Set([
    "your_jwt_secret_key",
    "replace-with-a-long-random-secret",
    "your-secret-key",
    "secret",
    "change-me",
]);

const jwtSecret = process.env.JWT_SECRET?.trim();
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && (!jwtSecret || jwtSecret.length < 32 || weakJwtSecrets.has(jwtSecret.toLowerCase()))) {
    throw new Error("JWT_SECRET must be a strong random value in production");
}

module.exports = { jwtSecret };
