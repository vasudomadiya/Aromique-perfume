import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../style/commerce.css";

const OrderSuccess = () => { const { state } = useLocation(); const order = state?.order; return <main className="commerce-page"><section className="success-card"><span className="success-icon">OK</span><span className="commerce-kicker">ORDER CONFIRMED</span><h1>Your scent is on its way.</h1><p>Thank you for choosing Aromique. We have received your order and will keep you updated.</p>{order && <p className="order-reference">Order reference: <strong>{order._id}</strong></p>}<div className="success-actions"><Link className="commerce-button" to="/orders">View my orders</Link><Link className="text-link" to="/shop">Continue shopping</Link></div></section></main>; };

export default OrderSuccess;
