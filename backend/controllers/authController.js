const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");


// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (id, tokenVersion = 0) => {
    return jwt.sign(
        { id, tokenVersion },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex");


// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {

    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    try {

        // Check required fields
        if (!name || !email || !password || password.length < 8) {
            return res.status(400).json({
                message: "Name, valid email and password of at least 8 characters are required"
            });
        }


        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        // ==========================================
        // HASH PASSWORD
        // ==========================================

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );


        // ==========================================
        // GENERATE OTP
        // ==========================================

        const otp = crypto.randomInt(100000, 1000000).toString();


        // ==========================================
        // OTP EXPIRES AFTER 5 MINUTES
        // ==========================================

        const otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );



        // ==========================================
        // CREATE USER
        // ==========================================

        const user = await User.create({

            name: name,

            email: email,

            password: hashedPassword,

            verified: false,

            otp: hashOtp(otp),
            otpAttempts: 0,

            otpExpiresAt: otpExpiresAt

        });



        // ==========================================
        // SEND OTP EMAIL
        // ==========================================

        const message = `
Welcome to Shopers, ${name}!

Thank you for registering.

Your OTP is:

${otp}

This OTP will expire in 5 minutes.

Please use this OTP to verify your account.
        `;


        const emailSent = await sendEmail(
            email,
            "Welcome to Shopers - OTP Verification",
            message
        );


        if (!emailSent) {

            // Remove user if email failed
            await User.findByIdAndDelete(user._id);

            return res.status(500).json({
                message: "Unable to send OTP email"
            });

        }


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({

            _id: user._id,

            name: user.name,

            email: user.email,

            role: user.role,

            verified: user.verified,

            message: "Registration successful. OTP sent to your email."

        });


    } catch (error) {

        console.error("Register Error:", error);

        res.status(500).json({
            message: "Unable to register account"
        });

    }
};



// ==========================================
// VERIFY OTP
// ==========================================

const verifyOTP = async (req, res) => {

    const email = req.body.email?.trim().toLowerCase();
    const otp = String(req.body.otp || "");

    try {

        // Check required fields
        if (!email || !/^\d{6}$/.test(otp)) {

            return res.status(400).json({
                message: "Email and OTP are required"
            });

        }


        // Find user
        const user = await User.findOne({ email });


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        // Check already verified
        if (user.verified) {

            return res.status(400).json({
                message: "User already verified"
            });

        }


        // Check OTP exists
        if (!user.otp || !user.otpExpiresAt || user.otpAttempts >= 5) {

            return res.status(400).json({
                message: "OTP not found"
            });

        }


        // ==========================================
        // CHECK OTP EXPIRY
        // ==========================================

        if (new Date() > user.otpExpiresAt) {

            // Remove expired OTP
            user.otp = null;
            user.otpExpiresAt = null;

            await user.save();

            return res.status(400).json({
                message: "OTP expired"
            });

        }


        // ==========================================
        // CHECK OTP
        // ==========================================

        const expectedOtp = Buffer.from(user.otp, "hex");
        const suppliedOtp = Buffer.from(hashOtp(otp), "hex");
        if (expectedOtp.length !== suppliedOtp.length || !crypto.timingSafeEqual(expectedOtp, suppliedOtp)) {
            user.otpAttempts = (user.otpAttempts || 0) + 1;
            if (user.otpAttempts >= 5) {
                user.otp = null;
                user.otpExpiresAt = null;
            }
            await user.save();

            return res.status(400).json({
                message: "Invalid OTP"
            });

        }


        // ==========================================
        // OTP SUCCESS
        // ==========================================

        user.verified = true;

        user.otp = null;

        user.otpExpiresAt = null;

        user.otpAttempts = 0;

        await user.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(200).json({

            message: "OTP verified successfully",

            _id: user._id,

            name: user.name,

            email: user.email,

            role: user.role,

            verified: true,

            token: generateToken(user._id, user.tokenVersion)

        });


    } catch (error) {

        console.error("OTP Verification Error:", error);

        res.status(500).json({
            message: "Unable to verify OTP"
        });

    }
};



// ==========================================
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {

    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    try {

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });


        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // ==========================================
        // CHECK PASSWORD
        // ==========================================

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });

        }


        // ==========================================
        // CHECK EMAIL VERIFICATION
        // ==========================================

        if (!user.verified) {

            return res.status(401).json({
                message: "Please verify your email with OTP first"
            });

        }


        // ==========================================
        // LOGIN SUCCESS
        // ==========================================

        res.json({

            _id: user._id,

            name: user.name,

            email: user.email,

            role: user.role,

            verified: user.verified,

            token: generateToken(user._id, user.tokenVersion)

        });


    } catch (error) {

        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }
};

const forgotPassword = async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const genericMessage = "If an account exists for that email, a password reset link has been sent.";

    try {
        if (!email) {
            return res.status(400).json({ message: "Email address is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: genericMessage });
        }

        const rawToken = crypto.randomBytes(32).toString("hex");
        user.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        user.passwordResetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${rawToken}`;
        const emailSent = await sendEmail(
            user.email,
            "Reset your Shopers password",
            `Hello ${user.name},\n\nUse this link to reset your Shopers password:\n${resetUrl}\n\nThis link expires in 15 minutes. If you did not request this, you can ignore this email.`
        );

        if (!emailSent) {
            user.passwordResetToken = null;
            user.passwordResetExpiresAt = null;
            await user.save();
            return res.status(500).json({ message: "Unable to send password reset email" });
        }

        return res.status(200).json({ message: genericMessage });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({ message: "Unable to process password reset request" });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpiresAt: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ message: "This password reset link is invalid or expired" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.tokenVersion = (user.tokenVersion || 0) + 1;
        user.passwordResetToken = null;
        user.passwordResetExpiresAt = null;
        await user.save();

        return res.status(200).json({ message: "Password reset successfully. You can now sign in." });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({ message: "Unable to reset password" });
    }
};



// ==========================================
// GET ALL USERS
// ==========================================

const getUsers = async (req, res) => {

    try {

        const users = await User
            .find({})
            .select("-password -otp -otpExpiresAt -passwordResetToken -passwordResetExpiresAt");

        res.json(users);

    } catch (error) {

        console.error("Get Users Error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }
};



// ==========================================
// EXPORT
// ==========================================

module.exports = {
    registerUser,
    verifyOTP,
    loginUser,
    forgotPassword,
    resetPassword,
    getUsers
};