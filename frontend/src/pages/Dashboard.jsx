import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  LogOut,
  Link as LinkIcon,
  ExternalLink,
  RefreshCw,
  Camera,
  Trash2,
} from "lucide-react";

import api from "../services/api";

const API_URL = "http://127.0.0.1:8000";

function Dashboard() {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchWebsites = async () => {
    try {
      setFetching(true);

      const response = await api.get("/websites/");
      setWebsites(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError("Unable to load your saved websites.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login", { replace: true });
      return;
    }

    fetchWebsites();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login", { replace: true });
  };

  const handleGeneratePreview = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    let formattedUrl = url.trim();

    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError("Please enter a valid website URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/websites/preview", {
        url: formattedUrl,
      });

      setWebsites((previous) => [
        response.data,
        ...previous,
      ]);

      setUrl("");
      setSuccess("Website preview generated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Unable to generate preview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScreenshotUrl = (path) => {
    if (!path) return null;

    return `${API_URL}/${path.replace(/^\/+/, "")}`;
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <Globe size={26} />
          <h2>Website Preview</h2>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={17} />
          Logout
        </button>
      </header>

      <main className="dashboard-content">

        {/* INTRODUCTION */}
        <section className="dashboard-intro">
          <span className="welcome-label">YOUR WORKSPACE</span>

          <h1>Your Website Library</h1>

          <p>
            Generate visual previews and keep all your favorite
            websites organized in one place.
          </p>
        </section>

        {/* URL INPUT */}
        <section className="url-input-card">
          <div className="url-card-heading">
            <div className="url-icon">
              <LinkIcon size={21} />
            </div>

            <div>
              <h2>Generate Website Preview</h2>
              <p>Enter a website URL to capture its preview.</p>
            </div>
          </div>

          <form
            className="url-form"
            onSubmit={handleGeneratePreview}
          >
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw size={17} className="spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Camera size={17} />
                  Generate Preview
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="dashboard-error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="dashboard-success" role="status">
              {success}
            </div>
          )}

          {loading && (
            <p className="loading-description">
              Opening website and capturing screenshot.
              This may take a few seconds.
            </p>
          )}
        </section>

        {/* SAVED WEBSITES */}
        <section className="saved-section">

          <div className="saved-heading">
            <div>
              <h2>Saved Websites</h2>
              <p>
                {websites.length} website
                {websites.length !== 1 ? "s" : ""} saved
              </p>
            </div>

            <button
              className="refresh-button"
              onClick={fetchWebsites}
              disabled={fetching}
              title="Refresh websites"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          {fetching ? (
            <div className="empty-state">
              Loading your websites...
            </div>
          ) : websites.length === 0 ? (
            <div className="empty-state">
              <Globe size={45} />

              <h3>No websites saved yet</h3>

              <p>
                Enter a URL above to generate your first website preview.
              </p>
            </div>
          ) : (
            <div className="website-grid">
              {websites.map((website) => (
                <article className="website-card" key={website.id}>

                  <div className="website-image">
                    {website.screenshot_path ? (
                      <a
                        href={getScreenshotUrl(website.screenshot_path)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={getScreenshotUrl(website.screenshot_path)}
                          alt={`Preview of ${website.url}`}
                          loading="lazy"
                        />
                      </a>
                    ) : (
                      <div className="no-preview">
                        <Camera size={35} />
                        <span>No screenshot available</span>
                      </div>
                    )}
                  </div>

                  <div className="website-details">
                    <h3 title={website.url}>
                      {website.url}
                    </h3>

                    <div className="website-actions">
                      <a
                        href={website.url}
                        target="_blank"
                        rel="noreferrer"
                        className="visit-button"
                      >
                        Visit Website
                        <ExternalLink size={15} />
                      </a>

                      <span className="website-date">
                        {website.created_at
                          ? new Date(website.created_at).toLocaleDateString()
                          : ""}
                      </span>
                    </div>
                  </div>

                </article>
              ))}
            </div>
          )}

        </section>
      </main>
    </div>
  );
}

export default Dashboard;