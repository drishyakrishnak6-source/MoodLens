import {
  FaChartBar,
  FaSmile,
  FaFrown,
  FaMeh,
} from "react-icons/fa";

const StatsCards = ({ history }) => {
  const total = history.length;

  const positive = history.filter(
    (item) => item.sentiment === "Positive"
  ).length;

  const negative = history.filter(
    (item) => item.sentiment === "Negative"
  ).length;

  const neutral = history.filter(
    (item) => item.sentiment === "Neutral"
  ).length;

  const positiveRate =
    total > 0 ? Math.round((positive / total) * 100) : 0;

  const stats = [
    {
      icon: <FaChartBar />,
      title: "Total Analyses",
      value: total,
      color: "#6366f1",
    },
    {
      icon: <FaSmile />,
      title: "Positive",
      value: positive,
      color: "#22c55e",
    },
    {
      icon: <FaFrown />,
      title: "Negative",
      value: negative,
      color: "#ef4444",
    },
    {
      icon: <FaMeh />,
      title: "Neutral",
      value: neutral,
      color: "#64748b",
    },
  ];

  return (
    <>
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-card"
            style={{
              borderTop: `5px solid ${stat.color}`,
            }}
          >
            <div
              className="stat-icon"
              style={{ color: stat.color }}
            >
              {stat.icon}
            </div>

            <h2>{stat.value}</h2>

            <p>{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="summary-card">
        <div className="summary-left">
          <FaChartBar className="summary-icon" />

          <div>
            <h3>Overall Mood Trend</h3>
            <p>
              {positiveRate}% of your analyses are positive.
            </p>
          </div>
        </div>

        <div className="summary-right">
          {positiveRate >= 60 ? "😊 Positive" : "😐 Balanced"}
        </div>
      </div>
    </>
  );
};

export default StatsCards;