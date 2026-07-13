import React from "react";
import HistoryCard from "./HistoryCard";

const HistoryList = ({ history, onDelete }) => {
  if (!history.length) {
    return (
      <div className="empty-history">
        <h2>No History Found</h2>
        <p>Your mood analyses will appear here.</p>
      </div>
    );
  }

  return (
    <div className="history-list">
      {history.map((item) => (
        <HistoryCard
          key={item.id}
          item={item}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default HistoryList;