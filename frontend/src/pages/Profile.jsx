import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../style/commerce.css";

const Profile = () => { const { user, logout } = useContext(AuthContext); const navigate = useNavigate(); if (!user) { navigate("/login", { state: { from: "/profile" } }); return null; } return <main className="commerce-page"><section className="profile-card"><span className="commerce-kicker">YOUR AROMIQUE ACCOUNT</span><div className="profile-avatar">{user.name?.charAt(0).toUpperCase()}</div><h1>{user.name}</h1><p>{user.email}</p><span className="profile-role">{user.role}</span><div className="profile-links"><Link to="/orders">Order history <span>-&gt;</span></Link><Link to="/shop">Browse fragrances <span>-&gt;</span></Link></div><button className="remove-button" onClick={() => { logout(); navigate("/"); }}>Sign out</button></section></main>; };

export default Profile;
