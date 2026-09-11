import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import "../style/productCard.css";

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const image = (Array.isArray(product.imageUrls) ? product.imageUrls[0] : product.imageUrls) || product.image || "https://placehold.co/800x800/18181b/c9a86a?text=Aromique";
    const productId = product?._id;

    const handleAddToBag = () => dispatch(addToCart(product));

    return (
        <article className="product-card">
            <Link to={productId ? `/product/${productId}` : "/shop"} className="product-image-wrap">
            <img src={image} alt={product.name} className="product-image" />
            <span className="product-image-action">View fragrance</span>
            </Link>
            <div className="product-info">
                <span className="product-category">{product.category || "Aromique collection"}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{Number(product.price).toLocaleString("en-IN")}</p>
                {productId ? (
                    <div className="product-actions"><Link to={`/product/${productId}`} className="view-details-button">View details</Link><button type="button" className="quick-add" onClick={handleAddToBag}>Add to bag <span aria-hidden="true">+</span></button></div>
                ) : (
                    <span className="view-details-button" aria-disabled="true">Details unavailable</span>
                )}
            </div>
        </article>
    );
};

export default ProductCard;     
