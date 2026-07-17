import { useState } from "react";

import {
  FaHome,
  FaBrain,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import Logo from "../components/Logo";

// Display info for the 7 labels the Hugging Face emotion model
// (j-hartmann/emotion-english-distilroberta-base) returns.
const EMOTION_DISPLAY = {
  joy: { emoji: "😊", name: "Joy" },
  sadness: { emoji: "😔", name: "Sadness" },
  anger: { emoji: "😠", name: "Anger" },
  fear: { emoji: "😨", name: "Fear" },
  disgust: { emoji: "🤢", name: "Disgust" },
  surprise: { emoji: "😲", name: "Surprise" },
  neutral: { emoji: "😐", name: "Neutral" },
};

const CRISIS_RESOURCES = [
  { label: "🇮🇳 KIRAN Mental Health Helpline (24/7)", value: "1800-599-0019", tel: "18005990019" },
  { label: "🇮🇳 Vandrevala Foundation (24/7)", value: "1860-2662-345", tel: "18602662345" },
  { label: "🌍 International / US", value: "988", tel: "988" },
];

// Backend packs the FULL emotion breakdown (all 28 labels + scores) as a
// JSON string in "emotions" -- see server/app/app_ai.py's analyze(). This
// parses that back out; falls back gracefully if an older cached record
// only has the plain top-emotion string (from before that change).
function parseEmotions(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) {
    return [{ label: raw, score: 1 }]; // old format: plain label string
  }
  return [];
}

const Home = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [crisis, setCrisis] = useState(false);
  const [violent, setViolent] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setCrisis(false);
    setViolent(false);

    // Safety check runs client-side, before this ever reaches the backend
    // or the Hugging Face models -- self-harm language gets an instant,
    // dedicated response instead of being scored and saved as a "mood."
    if (detectCrisis(text)) {
      setCrisis(true);
      setLoading(false);
      return;
    }
    const isViolent = detectViolentIdeation(text);

    try {
      const data = await analyzeText(text);
      setResult(data);
      setViolent(isViolent);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const allEmotions = parseEmotions(result?.emotions); // sorted strongest-first
  const topEmotion = (allEmotions[0]?.label || "neutral").toLowerCase();
  const emotionDisplay = EMOTION_DISPLAY[topEmotion] || { emoji: "😐", name: allEmotions[0]?.label || "Neutral" };
  // Backend returns "sentiment" capitalized, e.g. "Positive" / "Negative"
  const isPositive = result?.sentiment === "Positive";
  // Backend returns "entities" as a single comma-joined string, e.g. "Paris, Sarah"
  const entityList = (result?.entities || "").split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="history-page">
      <aside className="sidebar">
        <Logo />
        <nav>
          <a href="/profile">
            <FaUser /> Profile
          </a>
          <a href="/" className="active">
            <FaBrain /> AI Analysis
          </a>
          <a href="/history">
            <FaHistory /> History
          </a>
          <a href="/dashboard">
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
            <h1>AI Analysis</h1>
            <p>Share your thoughts and let AI understand your emotions.</p>
          </div>
        </div>

        <div className="analyze-input-section">
          <h2>How are you feeling today?</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write anything that's on your mind..."
          />
          <span className="char-count">{text.length} characters</span>

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
          >
            {loading ? "Analyzing..." : "✨ Analyze Mood"}
          </button>
        </div>

        {error && (
          <div className="analyze-error">
            {error}{" "}
            <button className="analyze-btn" style={{ width: "auto", padding: "6px 14px", marginLeft: 8 }} onClick={handleAnalyze}>
              Retry
            </button>
          </div>
        )}

        {crisis && (
          <div className="analyze-result-section crisis-section">
            <h3>💜 You are not alone</h3>
            <p>
              What you wrote sounds serious, and it matters more than any mood score. Please reach
              out to someone right now.
            </p>
            <ul className="crisis-list">
              {CRISIS_RESOURCES.map((r) => (
                <li key={r.tel}>
                  <span>{r.label}</span>
                  <a href={`tel:${r.tel}`}>{r.value}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result && !crisis && (
          <div className="analyze-result-section">
            <div className="result-top-row">
              <div className={`result-emoji-circle ${isPositive ? "positive" : "negative"}`}>
                {emotionDisplay.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <p>
                  Primary emotion: <strong>{emotionDisplay.name}</strong>
                </p>
                <p>
                  Sentiment:{" "}
                  <strong className={isPositive ? "sentiment-positive" : "sentiment-negative"}>
                    {result.sentiment}
                  </strong>
                </p>
                <p>
                  Confidence: <strong>{Math.round(result.confidence * 100)}%</strong>
                </p>
              </div>
            </div>

            {violent && topEmotion === "anger" && (
              <p className="violence-note">
                💜 There's real anger here, and it reads as directed at someone else. That's
                serious — please talk to someone before acting on it, or contact local emergency
                services if you're worried you might.
              </p>
            )}

            {allEmotions.filter((e) => e.score >= 0.05).length > 1 && (
              <div className="all-emotions-block">
                <p style={{ marginBottom: 8 }}>Emotions detected in this entry:</p>
                {allEmotions
                  .filter((e) => e.score >= 0.05) // hide near-zero noise from the other ~20 labels
                  .map((e) => {
                    const display = EMOTION_DISPLAY[e.label?.toLowerCase()] || { emoji: "❔", name: e.label };
                    const pct = Math.round(e.score * 100);
                    return (
                      <div className="emotion-bar-row" key={e.label}>
                        <span className="emotion-bar-label">
                          {display.emoji} {display.name}
                        </span>
                        <div className="emotion-bar-track">
                          <div className="emotion-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="emotion-bar-pct">{pct}%</span>
                      </div>
                    );
                  })}
              </div>
            )}

            {entityList.length > 0 && (
              <div className="entities-block">
                <p>Mentioned in your entry: {entityList.join(", ")}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;