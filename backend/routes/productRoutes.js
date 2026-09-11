const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const { getProducts, createProduct, getProductById, updateProduct, deleteProduct } = require("../controllers/productController.js");
const multer = require("multer");
const path = require("path");
const upload = multer({
    dest: path.join(__dirname, "../uploads/"),
    limits: { files: 8, fileSize: 5 * 1024 * 1024, fieldSize: 100 * 1024 },
    fileFilter: (req, file, callback) => callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)),
});

const router = express.Router();
//all product display
router.route("/").get(getProducts).post(protect, admin, upload.array('images', 8), createProduct);

//specific product display, update and delete
router.route("/:id").get(getProductById).put(protect, admin, upload.array('images', 8), updateProduct).delete(protect, admin, deleteProduct);

module.exports = router;