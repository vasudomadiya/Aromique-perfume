const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/order");

dotenv.config();


// ==========================================
// CONNECT DATABASE
// ==========================================

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};


// ==========================================
// SEED DATABASE
// ==========================================

const seedData = async () => {
    try {

        // ======================================
        // DELETE OLD DATA
        // ======================================

        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        console.log("Old data deleted");


        // ======================================
        // USERS
        // ======================================

        const seedPassword = process.env.SEED_USER_PASSWORD;
        if (!seedPassword || seedPassword.length < 12) {
            throw new Error("SEED_USER_PASSWORD must be set and at least 12 characters long");
        }
        const seedAdminEmail = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
        const hashedPassword = await bcrypt.hash(seedPassword, 10);

        const users = await User.create([
            {
                name: "Admin User",
                email: seedAdminEmail,
                password: hashedPassword,
                role: "admin",
                verified: true
            },
            {
                name: "John Doe",
                email: "john@example.com",
                password: hashedPassword,
                role: "user",
                verified: true
            },
            {
                name: "Vasu Damadiya",
                email: "vasu@example.com",
                password: hashedPassword,
                role: "user",
                verified: true
            }
        ]);


        // ======================================
        // PRODUCTS
        // ======================================

        const products = await Product.create([
            {
                name: "iPhone 15",
                price: 69999,
                description: "Apple iPhone 15 with 128GB storage",
                category: "Electronics",
                stock: 20,
                imageUrls: "https://example.com/iphone15.jpg"
            },

            {
                name: "Samsung Galaxy S24",
                price: 74999,
                description: "Samsung Galaxy S24 smartphone",
                category: "Electronics",
                stock: 15,
                imageUrls: "https://example.com/samsung-s24.jpg"
            },

            {
                name: "Sony Headphones",
                price: 4999,
                description: "Wireless noise cancelling headphones",
                category: "Electronics",
                stock: 30,
                imageUrls: "https://example.com/sony-headphones.jpg"
            },

            {
                name: "Nike Air Max",
                price: 8999,
                description: "Comfortable Nike running shoes",
                category: "Shoes",
                stock: 25,
                imageUrls: "https://example.com/nike-air-max.jpg"
            },

            {
                name: "Laptop Backpack",
                price: 1999,
                description: "Water resistant laptop backpack",
                category: "Accessories",
                stock: 40,
                imageUrls: "https://example.com/laptop-backpack.jpg"
            }
        ]);

        console.log(`${products.length} products created`);


        // ======================================
        // ORDERS
        // ======================================

        const orders = await Order.create([

            {
                user: users[1]._id,

                items: [
                    {
                        productID: products[0]._id,
                        qty: 1,
                        price: products[0].price
                    },
                    {
                        productID: products[2]._id,
                        qty: 2,
                        price: products[2].price
                    }
                ],

                totalAmount:
                    products[0].price +
                    (products[2].price * 2),

                address: {
                    fullName: "John Doe",
                    street: "123 Main Street",
                    city: "Ahmedabad",
                    postalCode: "380001",
                    country: "India"
                },

                paymentId: "PAY-DEMO-001",
                status: "delivered"
            },


            {
                user: users[2]._id,

                items: [
                    {
                        productID: products[1]._id,
                        qty: 1,
                        price: products[1].price
                    }
                ],

                totalAmount: products[1].price,

                address: {
                    fullName: "Vasu Damadiya",
                    street: "Satellite Road",
                    city: "Ahmedabad",
                    postalCode: "380015",
                    country: "India"
                },

                paymentId: "PAY-DEMO-002",
                status: "shipped"
            },


            {
                user: users[1]._id,

                items: [
                    {
                        productID: products[3]._id,
                        qty: 1,
                        price: products[3].price
                    },
                    {
                        productID: products[4]._id,
                        qty: 1,
                        price: products[4].price
                    }
                ],

                totalAmount:
                    products[3].price +
                    products[4].price,

                address: {
                    fullName: "John Doe",
                    street: "123 Main Street",
                    city: "Ahmedabad",
                    postalCode: "380001",
                    country: "India"
                },

                paymentId: "PAY-DEMO-003",
                status: "pending"
            }

        ]);

        console.log(`${orders.length} orders created`);


        // ======================================
        // SUCCESS
        // ======================================

        console.log("");
        console.log("====================================");
        console.log("DATABASE SEEDED SUCCESSFULLY");
        console.log("====================================");

        console.log("Users    :", users.length);
        console.log("Products :", products.length);
        console.log("Orders   :", orders.length);

        console.log("");
        console.log("Admin Login:");
        console.log("Email    : admin@example.com");
        console.log("Seeded admin account:", seedAdminEmail);

        console.log("");
        console.log("User Login:");
        console.log("Email    : john@example.com");
        console.log("Seeded demo users with SEED_USER_PASSWORD");

        process.exit(0);

    } catch (error) {

        console.error("");
        console.error("====================================");
        console.error("SEED ERROR");
        console.error("====================================");
        console.error(error);

        process.exit(1);
    }
};


// ==========================================
// START
// ==========================================

const start = async () => {
    await connectDB();
    await seedData();
};

start();