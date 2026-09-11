import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import "../style/commerce.css";

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const items = useSelector((state) => state.cart.cartItems);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const total = items.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);
    const [address, setAddress] = useState({ fullName: user?.name || "", street: "", city: "", postalCode: "", country: "India" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const update = (event) => setAddress({ ...address, [event.target.name]: event.target.value });
    const submit = async (event) => {
        event.preventDefault();
        if (!user) return navigate("/login", { state: { from: "/checkout" } });
        setLoading(true); setError("");
        try {
            const checkoutItems = items.map((item) => ({ productID: item._id || item.id, qty: item.qty }));
            const paymentOrder = await apiRequest("/payments/order", { method: "POST", body: JSON.stringify({ items: checkoutItems }) });
            if (!window.Razorpay) throw new Error("Payment gateway is unavailable. Please try again later.");
            const payment = await new Promise((resolve, reject) => { const gateway = new window.Razorpay({ key: paymentOrder.key_id || process.env.REACT_APP_RAZORPAY_KEY_ID, amount: paymentOrder.amount, currency: paymentOrder.currency, name: "Shopers", description: "Shopers order", order_id: paymentOrder.id, handler: resolve, modal: { ondismiss: () => reject(new Error("Payment was cancelled")) } }); gateway.open(); });
            await apiRequest("/payments/verify", { method: "POST", body: JSON.stringify({ razorpay_order_id: paymentOrder.id, razorpay_payment_id: payment.razorpay_payment_id, razorpay_signature: payment.razorpay_signature }) });
            const result = await apiRequest("/orders", { method: "POST", body: JSON.stringify({ items: checkoutItems, address, paymentId: payment.razorpay_payment_id, paymentOrderId: paymentOrder.id, paymentSignature: payment.razorpay_signature }) });
            dispatch(clearCart());
            navigate("/order-success", { state: { order: result.order } });
        } catch (submitError) { setError(submitError.message); } finally { setLoading(false); }
    };

    if (items.length === 0) return <main className="commerce-page"><div className="empty-state"><h1>Your bag is empty.</h1><Link className="commerce-button" to="/shop">Return to fragrances</Link></div></main>;
    return <main className="commerce-page"><section className="commerce-content checkout-layout"><form className="checkout-form" onSubmit={submit}><div className="section-heading"><span className="commerce-kicker">FINAL DETAILS</span><h1>Where should we send it?</h1></div>{error && <p className="commerce-error">{error}</p>}{["fullName", "street", "city", "postalCode", "country"].map((field) => <label key={field}>{field === "postalCode" ? "Postal code" : field.replace("fullName", "Full name").replace(/^[a-z]/, (letter) => letter.toUpperCase())}<input name={field} value={address[field]} onChange={update} required /></label>)}<button className="commerce-button" disabled={loading}>{loading ? "Processing payment..." : `Pay INR ${total.toFixed(2)}`}</button></form><aside className="summary-panel"><span className="commerce-kicker">SECURE CHECKOUT</span><h2>INR {total.toFixed(2)}</h2><p>Payment is handled securely through Razorpay. Your order is created only after payment verification.</p></aside></section></main>;
};

export default Checkout;
