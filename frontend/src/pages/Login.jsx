import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import "../style/auth.css";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await apiRequest("/auth/login", {
                method: "POST",
                body: JSON.stringify(form),
            });

            login(data);
            navigate(location.state?.from || "/");
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
                    <span className="auth-kicker">WELCOME BACK</span>
                    <h1>Good to see you again.</h1>
                    <p>Sign in to pick up where you left off and keep your Aromique rituals close.</p>
                    <div className="auth-stamp">A<span>R</span>OMIQUE</div>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="auth-form-heading">
                        <span className="auth-step">01 / ACCOUNT</span>
                        <h2>Sign in</h2>
                        <p>Your account, ready when you are.</p>
                    </div>

                    {location.state?.message && <div className="auth-success" role="status">{location.state.message}</div>}
                    {error && <div className="auth-alert" role="alert">{error}</div>}

                    <label htmlFor="login-email">Email address</label>
                    <input id="login-email" type="email" autoComplete="email" required value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" />

                    <label htmlFor="login-password">Password</label>
                    <input id="login-password" type="password" autoComplete="current-password" required value={form.password}
                        onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Enter your password" />

                    <p className="auth-forgot"><Link to="/forgot-password">Forgot your password?</Link></p>

                    <button className="auth-submit" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign in"}<span aria-hidden="true">-&gt;</span>
                    </button>
                    <p className="auth-switch">New to Aromique? <Link to="/register">Create an account</Link></p>
                </form>
            </section>
        </main>
    );
};

export default Login;
