// analysisService.js
// -----------------------------------------------------------------------------
// Calls the real backend: POST /analyze on the FastAPI server, which runs
// the text through Hugging Face models (sentiment + emotion) and saves the
// result. Uses fetch (not axios) to match historyService.js's pattern
// exactly and avoid an unnecessary extra dependency.
// -----------------------------------------------------------------------------

const API_URL = "http://localhost:8000/analyze";

export async function analyzeText(text) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    let detail = "Analysis failed.";
    try {
      const errBody = await response.json();
      detail = errBody.detail || detail;
    } catch {
      // response wasn't JSON, keep default message
    }
    throw new Error(detail);
  }

  return await response.json();
}