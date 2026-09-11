import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";
import "../style/auth.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await apiRequest("/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email })
            });
            setMessage(response.message);
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-shell">
                <div className="auth-intro">
                    <span className="auth-kicker">ACCOUNT RECOVERY</span>
                    <h1>Back in control.</h1>
                    <p>We will send a secure link to the email address connected to your Shopers account.</p>
                    <div className="auth-stamp">S<span>H</span>OPERS</div>
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form-heading">
                        <span className="auth-step">01 / RECOVER</span>
                        <h2>Forgot password?</h2>
                        <p>Enter your email and check your inbox.</p>
                    </div>
                    {error && <div className="auth-alert" role="alert">{error}</div>}
                    {message && <div className="auth-success" role="status">{message}</div>}
                    <label htmlFor="forgot-email">Email address</label>
                    <input id="forgot-email" type="email" autoComplete="email" required value={email}
                        onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send reset link"}<span aria-hidden="true">-&gt;</span>
                    </button>
                    <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
                </form>
            </section>
        </main>
    );
};

export default ForgotPassword;
