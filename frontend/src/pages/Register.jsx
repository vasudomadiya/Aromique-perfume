import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../style/auth.css";

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (form.password.length < 6) {
            setError("Your password must be at least 6 characters.");
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, password: form.password });
            navigate("/verify-email", { state: { email: form.email } });
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section className="auth-shell auth-shell-register">
                <div className="auth-intro">
                    <span className="auth-kicker">JOIN THE EDIT</span>
                    <h1>Make room for better finds.</h1>
                    <p>Create your Aromique account for a more personal way to discover fragrance.</p>
                    <div className="auth-benefits"><span>01</span> Faster checkout<br /><span>02</span> Order updates<br /><span>03</span> Curated for you</div>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form-heading">
                        <span className="auth-step">01 / NEW ACCOUNT</span>
                        <h2>Create account</h2>
                        <p>It takes less than a minute.</p>
                    </div>

                    {error && <div className="auth-alert" role="alert">{error}</div>}

                    <label htmlFor="register-name">Full name</label>
                    <input id="register-name" type="text" autoComplete="name" required value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" />

                    <label htmlFor="register-email">Email address</label>
                    <input id="register-email" type="email" autoComplete="email" required value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />

                    <div className="auth-field-row">
                        <div><label htmlFor="register-password">Password</label><input id="register-password" type="password" autoComplete="new-password" required value={form.password}
                            onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="6+ characters" /></div>
                        <div><label htmlFor="register-confirm">Confirm</label><input id="register-confirm" type="password" autoComplete="new-password" required value={form.confirmPassword}
                            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Repeat it" /></div>
                    </div>

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? "Creating account..." : "Create account"}<span aria-hidden="true">-&gt;</span>
                    </button>
                    <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
                </form>
            </section>
        </main>
    );
};

export default Register;
