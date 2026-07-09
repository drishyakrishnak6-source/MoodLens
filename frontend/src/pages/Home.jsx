import { useEffect, useState } from "react";
import {
  getHistory,
  deleteHistory,
  clearHistory,
} from "../services/historyService";

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const result = await getHistory();
    setHistory(result.data);
  };

  const handleDelete = async (id) => {
    await deleteHistory(id);
    loadHistory();
  };

  const handleClear = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to clear all history?"
    );

    if (confirmDelete) {
      await clearHistory();
      loadHistory();
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Mood History</h1>

      <button onClick={handleClear}>
        Clear All
      </button>

      <br />
      <br />

      {history.length === 0 ? (
        <p>No history available.</p>
      ) : (
        history.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
            }}
          >
            <h3>{item.sentiment}</h3>

            <p>
              <strong>Text:</strong> {item.text}
            </p>

            <p>
              <strong>Confidence:</strong> {item.confidence}
            </p>

            <p>
              <strong>Date:</strong> {item.created_at}
            </p>

            <button onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default History;