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

const defaultDevJwtSecret = "dev-secret-change-me-in-production-32chars";

const normalizeJwtSecret = (value) => value?.trim() || "";
const isStrongJwtSecret = (value) => {
    const secret = normalizeJwtSecret(value);
    if (!secret || secret.length < 32) return false;
    return !weakJwtSecrets.has(secret.toLowerCase());
};

const rawJwtSecret = normalizeJwtSecret(process.env.JWT_SECRET);
const isProduction = process.env.NODE_ENV === "production";

if (!rawJwtSecret && !isProduction) {
    console.warn("JWT_SECRET is not set. Using the local development fallback secret.");
}

if (isProduction && !rawJwtSecret) {
    throw new Error("JWT_SECRET is required in production");
}

if (isProduction && !isStrongJwtSecret(rawJwtSecret)) {
    throw new Error("JWT_SECRET must be a strong random value in production");
}

const jwtSecret = rawJwtSecret || defaultDevJwtSecret;

module.exports = { jwtSecret, isStrongJwtSecret };
