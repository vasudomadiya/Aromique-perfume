import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { AuthContext } from "../context/AuthContext";
import { apiRequest, getProductById } from "../utils/api";
import ProductCard from "../components/ProductCard";
import "../style/commerce.css";

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isGalleryHovered, setIsGalleryHovered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        setLoading(true);
        setProduct(null);
        setActiveImageIndex(0);
        setMessage("");

        if (!id) {
            setMessage("Product ID is missing from the URL");
            setLoading(false);
            return;
        }

        const loadProduct = async () => {
            try {
                const [productData, products] = await Promise.all([
                    getProductById(id),
                    apiRequest("/products"),
                ]);
                setProduct(productData);
                setRelatedProducts(products.filter((item) => item._id !== productData._id && item.category === productData.category).slice(0, 4));
            } catch (error) {
                setMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const images = product ? (Array.isArray(product.imageUrls) ? product.imageUrls : [product.imageUrls].filter(Boolean)) : [];

    useEffect(() => {
        if (images.length < 2 || isGalleryHovered) return undefined;

        const interval = window.setInterval(() => {
            setActiveImageIndex((currentIndex) => (currentIndex + 1) % images.length);
        }, 4500);

        return () => window.clearInterval(interval);
    }, [images.length, isGalleryHovered]);

    if (loading) return <main className="commerce-page"><p className="commerce-message">Loading product...</p></main>;
    if (!product) return <main className="commerce-page"><p className="commerce-error">{message || "Product not found"}</p></main>;
    const image = images[activeImageIndex] || images[0] || "https://placehold.co/900x900/18181b/c9a86a?text=Aromique";
    const changeImage = (nextIndex) => {
        const normalizedIndex = (nextIndex + images.length) % images.length;
        setActiveImageIndex(normalizedIndex);
    };
    const soldOut = product.stock < 1;
    const handleAddToCart = () => {
        if (!user) {
            navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
            return;
        }

        dispatch(addToCart(product));
        setMessage("Added to your cart");
    };

    return <main className="commerce-page"><section className="product-detail-view"><div><div className="detail-gallery" onMouseEnter={() => setIsGalleryHovered(true)} onMouseLeave={() => setIsGalleryHovered(false)}><div className="detail-visual"><img src={image} alt={`${product.name} view ${activeImageIndex + 1}`} /></div>{images.length > 1 && <><button type="button" className="gallery-arrow gallery-arrow-left" onClick={() => changeImage(activeImageIndex - 1)} aria-label="Previous product image">&lt;</button><button type="button" className="gallery-arrow gallery-arrow-right" onClick={() => changeImage(activeImageIndex + 1)} aria-label="Next product image">&gt;</button><div className="gallery-dots" aria-label="Product image navigation">{images.map((thumbnail, index) => <button type="button" className={index === activeImageIndex ? "active" : ""} key={thumbnail} onClick={() => changeImage(index)} aria-label={`Show product image ${index + 1}`} />)}</div></>}</div>{images.length > 1 && <div className="detail-thumbnails">{images.map((thumbnail, index) => <button type="button" className={index === activeImageIndex ? "active" : ""} key={thumbnail} onClick={() => changeImage(index)}><img src={thumbnail} alt={`${product.name} thumbnail ${index + 1}`} /></button>)}</div>}</div><div className="detail-copy"><span className="commerce-kicker">{product.category}</span><h1>{product.name}</h1><p className="detail-price">INR {Number(product.price).toFixed(2)}</p><p className="detail-description">{product.description}</p><p className={soldOut ? "stock-out" : "stock-in"}>{soldOut ? "Currently unavailable" : `${product.stock} available now`}</p><div className="detail-actions"><button className="commerce-button" disabled={soldOut} onClick={handleAddToCart}>{soldOut ? "Sold out" : user ? "Add to cart" : "Sign in to add"}</button><Link className="commerce-button" to="/cart">View cart</Link></div>{message && <p className="success-message">{message}</p>}</div></section>{relatedProducts.length > 0 && <section className="related-products"><div className="section-intro section-row"><div><span className="home-kicker">COMPLETE THE EDIT</span><h2>More from this collection.</h2></div><Link className="text-link" to="/shop">View all fragrances ↗</Link></div><div className="product-grid">{relatedProducts.map((relatedProduct) => <ProductCard key={relatedProduct._id} product={relatedProduct} />)}</div></section>}</main>;
};

export default ProductDetails;
