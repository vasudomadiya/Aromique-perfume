import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import "../style/commerce.css";

const Orders = () => { const { user } = useContext(AuthContext); const navigate = useNavigate(); const [orders, setOrders] = useState([]); const [error, setError] = useState(""); useEffect(() => { if (!user) { navigate("/login", { state: { from: "/orders" } }); return; } apiRequest("/orders/myorders").then(setOrders).catch((requestError) => setError(requestError.message)); }, [user, navigate]); return <main className="commerce-page"><section className="commerce-content"><div className="section-heading"><span className="commerce-kicker">YOUR HISTORY</span><h1>Orders</h1></div>{error && <p className="commerce-error">{error}</p>}{orders.length === 0 && !error ? <div className="empty-state"><h2>No orders yet.</h2><p>Your next great find is still out there.</p><Link className="commerce-button" to="/shop">Start shopping</Link></div> : <div className="orders-list">{orders.map((order) => <article className="order-card" key={order._id}><div><span className="commerce-kicker">{new Date(order.createdAt).toLocaleDateString()}</span><h2>Order #{order._id.slice(-7).toUpperCase()}</h2></div><div><strong>INR {Number(order.totalAmount).toFixed(2)}</strong><span className={`order-status ${order.status}`}>{order.status}</span></div><ul>{order.items.map((item) => <li key={item._id}>{item.productID?.name || "Product"} x {item.qty}</li>)}</ul></article>)}</div>}</section></main>; };

export default Orders;
