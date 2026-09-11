import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-grid">
                <div className="footer-brand"><span className="footer-kicker">AROMIQUE</span><h2>Discover your<br />signature scent.</h2><p>Modern fragrance compositions for every chapter of your story.</p></div>
                <div><span className="footer-label">Explore</span><Link to="/shop">All fragrances</Link><Link to="/shop?category=Men">Men</Link><Link to="/shop?category=Women">Women</Link><Link to="/shop?category=Unisex">Unisex</Link></div>
                <div><span className="footer-label">Care</span><Link to="/about">Our story</Link><Link to="/return">Returns</Link><Link to="/disclaimer">Disclaimer</Link><Link to="/login">Account</Link></div>
                <div><span className="footer-label">Stay close</span><p>New scents, rituals, and stories in your inbox.</p><a href="mailto:hello@aromique.example">hello@aromique.example</a></div>
            </div>
            <div className="footer-bottom"><span>© {new Date().getFullYear()} Aromique. All rights reserved.</span><span>Made for the beautifully particular.</span></div>
        </footer>
    );
};



export default Footer;