import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../utils/api";
import "../style/auth.css";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await apiRequest(`/auth/reset-password/${token}`, {
                method: "POST",
                body: JSON.stringify({ password })
            });
            navigate("/login", { state: { message: "Password reset successfully. You can now sign in." } });
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
                    <span className="auth-kicker">NEW CREDENTIALS</span>
                    <h1>Choose a fresh start.</h1>
                    <p>Create a new password with at least six characters, then return to your account.</p>
                    <div className="auth-stamp">S<span>H</span>OPERS</div>
                </div>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form-heading">
                        <span className="auth-step">02 / RESET</span>
                        <h2>New password</h2>
                        <p>Your reset link is valid for 15 minutes.</p>
                    </div>
                    {error && <div className="auth-alert" role="alert">{error}</div>}
                    <label htmlFor="new-password">New password</label>
                    <input id="new-password" type="password" autoComplete="new-password" minLength="6" required value={password}
                        onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" />
                    <label htmlFor="confirm-password">Confirm password</label>
                    <input id="confirm-password" type="password" autoComplete="new-password" minLength="6" required value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" />
                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update password"}<span aria-hidden="true">-&gt;</span>
                    </button>
                    <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
                </form>
            </section>
        </main>
    );
};

export default ResetPassword;
