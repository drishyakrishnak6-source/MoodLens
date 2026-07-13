import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getHistory,
  searchHistory,
  deleteHistory,
  exportHistory,
} from "../services/historyService";

import "../styles/history.css";
import {
  FaHome,
  FaBrain,
  FaHistory,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaChevronDown,
  FaFileCsv,
  FaEllipsisV,
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendarAlt,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { motion } from "framer-motion";
import DailyQuote from "../components/DailyQuote";
import Logo from "../components/Logo";

const PAGE_SIZE = 4;
const SEARCH_DEBOUNCE_MS = 400;

const moodMeta = {
  positive: { emoji: "😊", className: "positive" },
  negative: { emoji: "🙁", className: "negative" },
  neutral: { emoji: "😐", className: "neutral" },
};

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const dateInputRef = useRef(null);

  const openDatePicker = () => {
    if (dateInputRef.current) {
      if (dateInputRef.current.showPicker) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Debounced backend search — falls back to full history when search is empty
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() === "") {
        loadHistory();
      } else {
        runSearch(search);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const result = await getHistory();
      setHistory(result.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const runSearch = async (keyword) => {
    setLoading(true);
    try {
      const result = await searchHistory(keyword);
      setHistory(result.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const [deleteModalId, setDeleteModalId] = useState(null);

  const handleDelete = (id) => {
    setDeleteModalId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteHistory(deleteModalId);
      setDeleteModalId(null);
      loadHistory();
    } catch (err) {
      console.log(err);
    }
  };

  const [exportOpen, setExportOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [exportIncludeText, setExportIncludeText] = useState(true);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportHistory(exportFormat, exportIncludeText);
      setExportOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setExporting(false);
    }
  };

  // Sentiment + date filters run client-side (backend search only covers keyword)
  const filteredHistory = useMemo(() => {
    let data = history.filter((item) => {
      const matchesFilter =
        filter === "All" || item.sentiment.toLowerCase() === filter.toLowerCase();

      const matchesDate =
        !selectedDate ||
        new Date(item.created_at).toLocaleDateString("en-CA") === selectedDate;
      // "en-CA" gives YYYY-MM-DD, matching the native date input's format

      return matchesFilter && matchesDate;
    });

    data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return data;
  }, [history, filter, selectedDate]);

  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE));
  const pagedHistory = filteredHistory.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => {
    setPage(1);
  }, [search, filter, selectedDate]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const datePart = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${datePart} · ${timePart}`;
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
          <a href="/history" className="active">
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
            <h1>History</h1>
            <p>View all your previous mood analyses.</p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div className="export-wrapper">
              <button
                className="icon-btn"
                onClick={() => setExportOpen((o) => !o)}
                disabled={history.length === 0}
                title="Export options"
              >
                <FaFileCsv /> Export
              </button>

              {exportOpen && (
                <div className="export-menu">
                  <p className="export-menu-label">Format</p>
                  <div className="export-format-toggle">
                    <button
                      className={exportFormat === "csv" ? "active" : ""}
                      onClick={() => setExportFormat("csv")}
                    >
                      CSV
                    </button>
                    <button
                      className={exportFormat === "pdf" ? "active" : ""}
                      onClick={() => setExportFormat("pdf")}
                    >
                      PDF
                    </button>
                  </div>

                  <label className="export-checkbox">
                    <input
                      type="checkbox"
                      checked={exportIncludeText}
                      onChange={(e) => setExportIncludeText(e.target.checked)}
                    />
                    Include full diary entry text
                  </label>

                  <button
                    className="export-download-btn"
                    onClick={handleExport}
                    disabled={exporting}
                  >
                    {exporting
                      ? "Exporting..."
                      : `Download ${exportFormat.toUpperCase()}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search your analyses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="date-filter-wrapper">
            <button
              className={`icon-btn calendar-btn ${selectedDate ? "active" : ""}`}
              title={selectedDate ? `Filtering: ${selectedDate}` : "Filter by date"}
              onClick={openDatePicker}
            >
              <FaRegCalendarAlt />
            </button>

            <input
              ref={dateInputRef}
              type="date"
              className="hidden-date-input"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            {selectedDate && (
              <button
                className="clear-date-btn"
                title="Clear date filter"
                onClick={() => setSelectedDate("")}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="filter-dropdown">
            <button onClick={() => setFilterOpen((o) => !o)}>
              {filter === "All" ? "All Moods" : filter}
              <FaChevronDown className="chevron" />
            </button>
            {filterOpen && (
              <ul className="filter-menu">
                {["All", "Positive", "Negative", "Neutral"].map((opt) => (
                  <li
                    key={opt}
                    onClick={() => {
                      setFilter(opt);
                      setFilterOpen(false);
                    }}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {loading ? (
            <div className="loading">Loading...</div>
          ) : pagedHistory.length === 0 ? (
            <div className="loading">No analyses found.</div>
          ) : (
            <div className="history-list">
              {pagedHistory.map((item) => {
                const mood =
                  moodMeta[item.sentiment.toLowerCase()] || moodMeta.neutral;

                return (
                  <div
                    className="history-card clickable"
                    key={item.id}
                    onClick={() => navigate(`/history/${item.id}`)}
                  >
                    <div className={`mood-icon ${mood.className}`}>
                      {mood.emoji}
                    </div>

                    <div className="card-text">
                      <h3 className="journal-entry">“{item.text}”</h3>
                      {item.emotions && (
                        <p className="emotion-tag">Feeling: {item.emotions}</p>
                      )}
                    </div>

                    <div className="card-meta">
                      <span className="card-date">
                        {formatDate(item.created_at)}
                      </span>
                      <span className={`badge ${mood.className}`}>
                        {item.sentiment}
                      </span>
                    </div>

                    <button
                      className="menu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      <FaEllipsisV />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {!loading && filteredHistory.length > 0 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`page-btn ${page === n ? "active" : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </main>

      {deleteModalId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteModalId(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setDeleteModalId(null)}
            >
              <FaTimes />
            </button>
            <div className="modal-icon">
              <FaTrash />
            </div>
            <h3>Delete this analysis?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="modal-cancel-btn"
                onClick={() => setDeleteModalId(null)}
              >
                Cancel
              </button>
              <button className="modal-delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;