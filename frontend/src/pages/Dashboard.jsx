import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getDashboard } from "../services/dashboardService";
import {
  FaHome,
  FaBrain,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaFire,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import Logo from "../components/Logo";
import DailyQuote from "../components/DailyQuote";
import "../styles/history.css";
import "../styles/dashboard.css";

const PIE_COLORS = ["#a855f7", "#22c55e", "#3b82f6", "#f97316", "#ec4899", "#06b6d4"];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getDashboard();
        setData(result);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

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
          <a href="/dashboard" className="active">
            <FaHome /> Dashboard
          </a>
          <a href="/settings">
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
            <h1>Dashboard</h1>
            <p>Overview of your mood insights.</p>
          </div>
        </div>

        {loading && <div className="loading">Loading...</div>}
        {!loading && error && (
          <div className="loading">Could not load dashboard data.</div>
        )}

        {!loading && !error && data && data.total_analyses === 0 && (
          <div className="loading">
            No analyses yet — head to AI Analysis to get started.
          </div>
        )}

        {!loading && !error && data && data.total_analyses > 0 && (
          <>
            <div className="stats-container">
              <div className="stat-card">
                <span className="stat-label">Positive</span>
                <span className="stat-value positive">{data.positive}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Negative</span>
                <span className="stat-value negative">{data.negative}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Neutral</span>
                <span className="stat-value">{data.neutral}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Total Analyses</span>
                <span className="stat-value">{data.total_analyses}</span>
              </div>
            </div>

            <div className="dashboard-charts-row">
              <div className="dashboard-chart-card">
                <h2>Sentiment Trend (last 7 days)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={data.sentiment_trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} />
                    <YAxis stroke="var(--text-secondary)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--modal-bg, var(--solid-bg))",
                        border: "1px solid var(--border-color)",
                        borderRadius: 8,
                        color: "var(--text-primary)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="var(--accent)"
                      strokeWidth={2}
                      dot={{ fill: "var(--accent)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="dashboard-chart-card">
                <h2>Emotion Distribution</h2>
                {data.emotion_distribution.length === 0 ? (
                  <p className="dashboard-empty-note">No emotion data yet.</p>
                ) : (
                  <div className="dashboard-donut-row">
                    <ResponsiveContainer width="55%" height={200}>
                      <PieChart>
                        <Pie
                          data={data.emotion_distribution}
                          dataKey="percentage"
                          nameKey="emotion"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={2}
                        >
                          {data.emotion_distribution.map((entry, index) => (
                            <Cell key={entry.emotion} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "var(--modal-bg, var(--solid-bg))",
                            border: "1px solid var(--border-color)",
                            borderRadius: 8,
                            color: "var(--text-primary)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="dashboard-legend">
                      {data.emotion_distribution.map((entry, index) => (
                        <div className="dashboard-legend-item" key={entry.emotion}>
                          <span
                            className="dashboard-legend-dot"
                            style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <span className="dashboard-legend-label">{entry.emotion}</span>
                          <span className="dashboard-legend-pct">{entry.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="stats-container">
              <div className="stat-card">
                <span className="stat-label">Most Common Emotion</span>
                <span className="stat-value" style={{ textTransform: "capitalize" }}>
                  {data.most_common_emotion || "—"}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">
                  <FaFire /> Longest Streak
                </span>
                <span className="stat-value">{data.longest_streak} days</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">
                  <FaClock /> Last Analysis
                </span>
                <span className="stat-value" style={{ fontSize: 16 }}>
                  {formatDate(data.last_analysis_date)}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">
                  <FaShieldAlt /> Avg. Confidence
                </span>
                <span className="stat-value">{data.average_confidence}%</span>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;