import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiRequest("/products");
                setProducts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <main className="home-container">
            <section className="home-hero">
                <div className="hero-copy"><span className="home-kicker">THE ART OF FRAGRANCE</span><h1>Wear the mood.<br /><em>Leave the memory.</em></h1><p>Discover a scent that becomes part of your identity.</p><div className="hero-actions"><Link to="/shop" className="home-button">Shop collection</Link><Link to="/about" className="hero-text-link">Our story <span>↗</span></Link></div></div>
                <div className="hero-bottle" aria-label="A perfume bottle surrounded by warm light"><div className="bottle-glow" /><div className="bottle"><span /></div><span className="hero-orbit">A / 01</span></div>
            </section>
            <section className="home-section category-section"><div className="section-intro"><span className="home-kicker">A SCENT FOR EVERY SELF</span><h2>Find your signature.</h2></div><div className="category-grid">{[['Men', 'For the assured'], ['Women', 'For the luminous'], ['Unisex', 'For the free-spirited'], ['New arrivals', 'For what comes next']].map(([label, description]) => <Link className="category-tile" to={`/shop${label === 'New arrivals' ? '' : `?category=${label}`}`} key={label}><span>{label}</span><small>{description}</small><b>↗</b></Link>)}</div></section>
            <section className="home-section product-section"><div className="section-intro section-row"><div><span className="home-kicker">THE COMMUNITY EDIT</span><h2>Best sellers.</h2><p>Fragrances loved by our community.</p></div><Link to="/shop" className="text-link">View all fragrances ↗</Link></div>
                {loading ? (
                    <p className="home-message">Loading the collection...</p>
                ) : (
                    <div className="product-grid">{products.slice(0, 4).map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}</div>
                )}
            </section><section className="home-band"><div><span className="home-kicker">THE NOIR COLLECTION</span><h2>Bold. Mysterious.<br />Unforgettable.</h2><Link to="/shop" className="home-button home-button-light">Explore collection</Link></div><span className="band-index">02 / 04</span></section>
            <section className="home-section promise-section"><div><span className="home-kicker">THE AROMIQUE STANDARD</span><h2>Made to linger.</h2></div><div className="promise-grid">{[['01', 'Thoughtful composition', 'Fine ingredients, balanced to tell a story.'], ['02', 'Authentic fragrances', 'Original creations you can wear with confidence.'], ['03', 'A considered delivery', 'From our studio to your door, carefully handled.']].map(([number, title, description]) => <div className="promise" key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></div>)}</div></section>
        </main>
    );
};

export default Home;    
