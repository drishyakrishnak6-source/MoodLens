import { useTheme, THEMES } from "../context/ThemeContext";
import DailyQuote from "../components/DailyQuote";
import Logo from "../components/Logo";
import {
  FaHome,
  FaBrain,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaCheck,
} from "react-icons/fa";
import "../styles/history.css"; // reuses sidebar + shared layout styles
import "../styles/settings.css";

const Settings = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="history-page">
      <aside className="sidebar">
        <Logo />

        <nav>
          <a href="/profile">
            <FaUser /> Profile
          </a>
          <a href="/analysis">
            <FaBrain /> AI Analysis
          </a>
          <a href="/history">
            <FaHistory /> History
          </a>
          <a href="/dashboard">
            <FaHome /> Dashboard
          </a>
          <a href="/settings" className="active">
            <FaCog /> Settings
          </a>
          <a href="/logout" className="logout">
            <FaSignOutAlt /> Logout
          </a>
        </nav>

        <DailyQuote />
      </aside>

      <main className="history-content">
        <div className="header">
          <div>
            <h1>Settings</h1>
            <p>Customize how MoodLens looks and feels.</p>
          </div>
        </div>

        <div className="settings-section">
          <h2>Theme</h2>
          <p className="settings-subtext">
            Choose a color theme for the whole app. Your choice is saved
            automatically.
          </p>

          <div className="theme-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`theme-card ${theme === t.id ? "selected" : ""}`}
                onClick={() => setTheme(t.id)}
              >
                <span
                  className="theme-swatch"
                  style={{ background: t.swatch }}
                >
                  {theme === t.id && <FaCheck />}
                </span>
                <span className="theme-label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;