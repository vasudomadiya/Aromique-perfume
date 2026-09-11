const mongoose = require('mongoose');
const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    stock: { type: Number, required: true, min: 0, validate: Number.isInteger },
    imageUrls: { type: mongoose.Schema.Types.Mixed, required: true },
    createdAt: { type: Date, default: Date.now },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;