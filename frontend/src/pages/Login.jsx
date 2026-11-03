import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Globe, ArrowRight } from "lucide-react";

import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const token = response.data.access_token;

      if (!token) {
        throw new Error("Authentication token was not received.");
      }

      localStorage.setItem("access_token", token);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.detail || "Login failed. Please try again."
        );
      } else {
        setError(
          err.message || "Unable to connect to the server."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left branding section */}
        <div className="login-brand">
          <div className="brand-logo">
            <Globe size={28} />
          </div>

          <h1>Website Preview</h1>

          <p className="brand-description">
            Save, organize, and revisit your favorite websites
            with beautiful visual previews.
          </p>

          <div className="brand-feature">
            <div className="feature-icon">01</div>
            <div>
              <h3>Instant Previews</h3>
              <p>Generate visual snapshots of websites.</p>
            </div>
          </div>

          <div className="brand-feature">
            <div className="feature-icon">02</div>
            <div>
              <h3>Save Bookmarks</h3>
              <p>Keep your important websites organized.</p>
            </div>
          </div>

          <div className="brand-feature">
            <div className="feature-icon">03</div>
            <div>
              <h3>Access Anywhere</h3>
              <p>Revisit your saved websites whenever you need.</p>
            </div>
          </div>

          <div className="brand-footer">
            © 2026 Website Preview. All rights reserved.
          </div>
        </div>

        {/* Right login section */}
        <div className="login-form-section">
          <div className="login-form-wrapper">

            <div className="mobile-logo">
              <Globe size={25} />
              <span>Website Preview</span>
            </div>

            <div className="form-heading">
              <span className="welcome-label">WELCOME BACK</span>

              <h2>Sign in to your account</h2>

              <p>
                Enter your credentials to access your saved websites.
              </p>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="email">Email address</label>

                <div className="input-wrapper">
                  <Mail size={19} />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <div className="input-wrapper">
                  <Lock size={19} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

            </form>

            <div className="login-bottom">
              <p>
                Don't have an account?{" "}
                <span>Sign-up functionality coming next.</span>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;