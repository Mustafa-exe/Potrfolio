import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { hasConfig } from "../../firebase";
import "./Admin.css";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigate("/admin/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/admin/dashboard", { replace: true });
    }
  };

  return (
    <div className="admin-login" id="admin-login">
      <div className="admin-login-bg" />
      <motion.div
        className="admin-login-card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h2>Admin Access</h2>
          <p>Sign in to manage your portfolio content</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email">Email Address</label>
            <input
              type="email"
              id="admin-email"
              className="form-input"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="admin-password"
                className="form-input"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}

                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {loginError && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: [0, -4, 4, -4, 4, 0] }}
              transition={{ duration: 0.35 }}
            >
              {loginError}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
          >
            {loading ? "Verifying..." : "Login"}
          </motion.button>
        </form>

        {!hasConfig && (
          <div className="firebase-hint" style={{ marginTop: "1rem" }}>
            <p>
              Using local password authentication. To enable Firebase auth with email login, add your credentials to the <code>.env</code> file.
            </p>
          </div>
        )}

        <div className="admin-login-footer">
          <Link to="/">Back to Portfolio</Link>
        </div>
      </motion.div>
    </div>
  );
}
