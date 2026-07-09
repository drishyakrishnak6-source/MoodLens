const API_URL = "http://localhost:8000/history";

// TEMPORARY DEMO FALLBACK — until a real /login exists, auto-fill a valid
// test token so the page always works without manually pasting one into
// DevTools each time. Safe to delete this whole block once real login exists.
const DEMO_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzgzMDc2NDI3fQ.74rY9fBxyYkjrJw6Rc9XcXYiJNxwXEsWHNGp4lFsCAQ";

if (!localStorage.getItem("token")) {
  localStorage.setItem("token", DEMO_TOKEN);
}

// ASSUMPTION: token is stored in localStorage under the key "token"
// after login. Update this if your teammate's login flow stores it
// somewhere else (e.g. a different key, or in a context/cookie).
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

// Get all history for the logged-in user
export const getHistory = async () => {
  const response = await fetch(API_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch history");
  }

  return await response.json(); // { data: [...] }
};

// Get a single history item by ID (used by the detail view page)
export const getHistoryItem = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch analysis");
  }

  return await response.json();
};

// Search history by keyword (hits backend /history/search)
export const searchHistory = async (keyword) => {
  const response = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(keyword)}`,
    { headers: getAuthHeaders() }
  );

  if (!response.ok) {
    throw new Error("Failed to search history");
  }

  return await response.json(); // { data: [...] }
};

// Delete one history item
export const deleteHistory = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete analysis");
  }

  return await response.json();
};

// Export history — format: "csv" | "pdf", includeText: whether to include the full entry text
export const exportHistory = async (format = "csv", includeText = true) => {
  const params = new URLSearchParams({
    format,
    include_text: includeText,
  });

  const response = await fetch(`${API_URL}/export?${params}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to export history");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `mood_history.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// NOTE: there is no "clear all" endpoint in the architecture doc's API list
// (only DELETE /history/{id}). If you want a "Clear History" button that
// actually works against the real backend, either:
//   (a) ask your lead to add a DELETE /history route that wipes all of a
//       user's analyses in one call, or
//   (b) loop single deletes client-side (slower, more requests).
// clearHistory() below does (b) so the button keeps working either way.
export const clearHistory = async (ids) => {
  await Promise.all(ids.map((id) => deleteHistory(id)));
};