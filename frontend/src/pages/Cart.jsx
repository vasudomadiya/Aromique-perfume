import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import "../style/commerce.css";

const Cart = () => {
    const items = useSelector((state) => state.cart.cartItems);
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const total = items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);

    if (!user) {
        return <main className="commerce-page"><section className="commerce-content"><div className="empty-state"><span className="commerce-kicker">ACCOUNT REQUIRED</span><h2>Sign in to view your bag.</h2><p>Your selected fragrances are waiting in your Aromique account.</p><Link className="commerce-button" to="/login" state={{ from: "/cart" }}>Sign in to continue</Link></div></section></main>;
    }

    return <main className="commerce-page"><section className="commerce-content cart-layout"><div><div className="section-heading"><span className="commerce-kicker">YOUR SELECTION</span><h1>Shopping bag</h1></div>{items.length === 0 ? <div className="empty-state"><h2>Your bag is waiting.</h2><p>Browse the collection and add something worth bringing home.</p><Link className="commerce-button" to="/shop">Explore fragrances</Link></div> : <div className="cart-list">{items.map((item) => { const id = item._id || item.id; const image = (Array.isArray(item.imageUrls) ? item.imageUrls[0] : item.imageUrls) || item.image || "https://placehold.co/200x200/18181b/c9a86a?text=Aromique"; return <article className="cart-item" key={id}><img src={image} alt={item.name} /><div className="cart-item-copy"><h2>{item.name}</h2><p>₹{Number(item.price).toLocaleString("en-IN")}</p><div className="quantity"><button aria-label={`Decrease ${item.name} quantity`} onClick={() => dispatch(updateQuantity({ id, qty: item.qty - 1 }))}>-</button><span>{item.qty}</span><button aria-label={`Increase ${item.name} quantity`} onClick={() => dispatch(updateQuantity({ id, qty: item.qty + 1 }))}>+</button></div></div><button className="remove-button" onClick={() => dispatch(removeFromCart(id))}>Remove</button></article>; })}</div>}</div>{items.length > 0 && <aside className="summary-panel"><span className="commerce-kicker">ORDER SUMMARY</span><div><span>Subtotal</span><strong>₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></div><p>Shipping and taxes are calculated at checkout.</p><button className="commerce-button" onClick={() => navigate("/checkout")}>Continue to checkout</button></aside>}</section></main>;
};

export default Cart;
