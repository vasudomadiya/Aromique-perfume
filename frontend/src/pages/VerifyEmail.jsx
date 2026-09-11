import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../style/auth.css";

const VerifyEmail = () => {
    const { verifyEmail } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            await verifyEmail(email, otp);
            navigate("/");
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-shell auth-shell-verify">
                <div className="auth-intro"><span className="auth-kicker">ONE LAST STEP</span><h1>Check your inbox.</h1><p>We sent a six-digit code to finish setting up your Aromique account.</p><div className="auth-otp-mark">6<span>0</span>6</div></div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form-heading"><span className="auth-step">02 / VERIFY</span><h2>Verify email</h2><p>Enter the code before it expires.</p></div>
                    {error && <div className="auth-alert" role="alert">{error}</div>}
                    <label htmlFor="verify-email">Email address</label>
                    <input id="verify-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
                    <label htmlFor="verify-otp">Verification code</label>
                    <input className="auth-otp-input" id="verify-otp" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" required value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="000000" />
                    <button className="auth-submit" type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify email"}<span aria-hidden="true">-&gt;</span></button>
                    <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
                </form>
            </section>
        </main>
    );
};

export default VerifyEmail;