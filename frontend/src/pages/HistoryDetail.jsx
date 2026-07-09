import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHistoryItem } from "../services/historyService";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/history.css";
import "../styles/historyDetail.css";

const moodMeta = {
  positive: { emoji: "😊", className: "positive" },
  negative: { emoji: "🙁", className: "negative" },
  neutral: { emoji: "😐", className: "neutral" },
};

// Builds a short, human-readable summary from the stored sentiment/emotions/
// confidence fields, since we don't store a separate AI-written paragraph.
const buildSummary = (item) => {
  const moodWord = item.sentiment.toLowerCase();
  const emotionList = item.emotions
    ? item.emotions.split(",").map((e) => e.trim()).join(", ")
    : "a mix of feelings";

  const confidencePct = Math.round(item.confidence * 100);

  if (moodWord === "positive") {
    return `Your mood is positive. This entry expresses ${emotionList}, and reflects a genuinely good moment. The model is ${confidencePct}% confident in this reading.`;
  }
  if (moodWord === "negative") {
    return `Your mood is negative. This entry expresses ${emotionList}. It might help to take things one step at a time today. The model is ${confidencePct}% confident in this reading.`;
  }
  return `Your mood is neutral. This entry expresses ${emotionList}, without leaning strongly positive or negative. The model is ${confidencePct}% confident in this reading.`;
};

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getHistoryItem(id);
        setItem(data);
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " · " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  return (
    <div className="history-page">
      <main className="history-content detail-page">
        <button className="back-link" onClick={() => navigate("/history")}>
          <FaArrowLeft /> Back to History
        </button>

        {loading && <div className="loading">Loading...</div>}

        {!loading && error && (
          <div className="loading">Could not load this analysis.</div>
        )}

        {!loading && !error && item && (
          <>
            {(() => {
              const mood = moodMeta[item.sentiment.toLowerCase()] || moodMeta.neutral;
              return (
                <>
                  <div className="detail-header">
                    <div className={`mood-icon detail-mood-icon ${mood.className}`}>
                      {mood.emoji}
                    </div>
                    <div className="detail-header-text">
                      <h1>{item.text.length > 60 ? item.text.slice(0, 60) + "…" : item.text}</h1>
                      <p className="detail-date">{formatDate(item.created_at)}</p>
                    </div>
                    <span className={`badge ${mood.className}`}>{item.sentiment}</span>
                  </div>

                  <div className="detail-section">
                    <h2>Your Entry</h2>
                    <p className="detail-entry-text">{item.text}</p>
                  </div>

                  <div className="detail-section">
                    <h2>AI Analysis</h2>
                    <p className="detail-summary-text">{buildSummary(item)}</p>
                  </div>

                  <div className="detail-section">
                    <h2>Confidence Score</h2>
                    <div className="confidence-bar-track">
                      <div
                        className={`confidence-bar-fill ${mood.className}`}
                        style={{ width: `${Math.round(item.confidence * 100)}%` }}
                      />
                    </div>
                    <span className="confidence-bar-label">
                      {Math.round(item.confidence * 100)}%
                    </span>
                  </div>
                </>
              );
            })()}
          </>
        )}
      </main>
    </div>
  );
};

export default HistoryDetail;