const Product = require("../model/Product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");

const uploadImages = async (files = []) => {
    const uploadedImages = [];
    for (const file of files) {
        try {
            const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
            uploadedImages.push(result.secure_url);
        } finally {
            await fs.unlink(file.path).catch(() => { });
        }
    }
    return uploadedImages;
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error("Product list error:", error.message);
        res.status(500).json({ message: "Unable to fetch products" });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        console.error("Product lookup error:", error.message);
        res.status(500).json({ message: "Unable to fetch product" });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        if (!name?.trim() || name.trim().length > 120 || !description?.trim() || description.trim().length > 5000 || !category?.trim() || category.trim().length > 80 || !Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
            return res.status(400).json({ message: "Valid product name, description, category, price, and stock are required" });
        }
        const imageUrls = await uploadImages(req.files);

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrls
        });

        const createdProduct = await newProduct.save();

        res.status(201).json(createdProduct);

    } catch (error) {
        console.error("Product creation error:", error.message);
        res.status(500).json({ message: "Unable to create product" });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            if (name !== undefined) product.name = name.trim();
            if (description !== undefined) product.description = description.trim();
            if (price !== undefined) product.price = Number(price);
            if (category !== undefined) product.category = category.trim();
            if (stock !== undefined) product.stock = Number(stock);
            if (!product.name || product.name.length > 120 || !product.description || product.description.length > 5000 || !product.category || product.category.length > 80 || !Number.isFinite(product.price) || product.price < 0 || !Number.isInteger(product.stock) || product.stock < 0) {
                return res.status(400).json({ message: "Product fields are invalid" });
            }

            if (req.files?.length) {
                product.imageUrls = await uploadImages(req.files);
            }

            const updatedProduct = await product.save();

            res.json(updatedProduct);

        } else {
            res.status(404).json({
                message: "Product not found"
            });
        }

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne();

            res.json({
                message: "Product removed"
            });

        } else {
            res.status(404).json({
                message: "Product not found"
            });
        }

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid product ID" });
        }
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
};