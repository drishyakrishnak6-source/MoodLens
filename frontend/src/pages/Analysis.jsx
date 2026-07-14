import React, { useState } from "react";
import TextInput from "../components/TextInput.jsx";
import ResultCard from "../components/ResultCard.jsx";
import CrisisPanel from "../components/CrisisPanel.jsx";
import { analyzeText } from "../services/analysisService.js";
import { detectCrisis, detectViolentIdeation } from "../crisisDetection.js";

export default function Analyze({ lang, onNewResult }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [crisis, setCrisis] = useState(false);
  const [violent, setViolent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalysis() {
    setLoading(true);
    setResult(null);
    setError(null);
    setCrisis(false);
    setViolent(false);

    // Safety checks run client-side, BEFORE calling the backend -- this
    // means self-harm language never even gets sent to the Hugging Face
    // models or saved to the database, and the response is instant rather
    // than waiting on a network round-trip.
    if (detectCrisis(text, lang)) {
      setCrisis(true);
      setLoading(false);
      return;
    }

    const isViolent = detectViolentIdeation(text);

    try {
      const analysis = await analyzeText(text);
      setResult(analysis);
      setViolent(isViolent);
      onNewResult?.(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ml-main">
      <TextInput value={text} onChange={setText} onAnalyze={handleAnalysis} loading={loading} lang={lang} />
      {crisis ? (
        <div className="ml-card ml-result">
          <h2>Analysis Result</h2>
          <CrisisPanel />
        </div>
      ) : error ? (
        <div className="ml-card ml-result">
          <h2>Analysis Result</h2>
          <div className="ml-error-panel">
            <p>⚠️ {error}</p>
            <button className="ml-analyze-btn" onClick={handleAnalysis}>Retry</button>
          </div>
        </div>
      ) : (
        <ResultCard result={result} violent={violent} lang={lang} />
      )}
    </div>
  );
}