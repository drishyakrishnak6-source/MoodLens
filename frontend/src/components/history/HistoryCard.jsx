import React from "react";

const sentimentColors = {
  Positive: "#22c55e",
  Negative: "#ef4444",
  Neutral: "#facc15",
};

const sentimentEmoji = {
  Positive: "😊",
  Negative: "😔",
  Neutral: "😐",
};

const HistoryCard = ({ item, onDelete }) => {
  const confidence = Math.round((item.confidence || 0) * 100);

  const formattedDate = new Date(item.created_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const emotions = item.emotions
    ? item.emotions.split(",").map((e) => e.trim())
    : [];

  return (
    <div className="history-card">
      <div className="history-header">
        <div
          className="sentiment-badge"
          style={{
            backgroundColor:
              sentimentColors[item.sentiment] || "#6366f1",
          }}
        >
          {sentimentEmoji[item.sentiment] || "🧠"} {item.sentiment}
        </div>
<button
  className="delete-btn"
  onClick={() => onDelete(item.id)}
>
  🗑 Delete
</button>
      </div>

      <div className="history-text">
        {item.text}
      </div>

      <div className="confidence-section">
        <div className="confidence-row">
          <span>Confidence</span>
          <span>{confidence}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${confidence}%`,
              background:
                sentimentColors[item.sentiment] || "#6366f1",
            }}
          />
        </div>
      </div>

      <div className="emotion-section">
        {emotions.length > 0 ? (
          emotions.map((emotion, index) => (
            <span className="emotion-chip" key={index}>
              {emotion}
            </span>
          ))
        ) : (
          <span className="emotion-chip">No emotions</span>
        )}
      </div>

      <div className="history-footer">
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default HistoryCard;