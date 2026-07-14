import React from "react";

export default function TextInput({ value, onChange, onAnalyze, loading, lang }) {
  return (
    <div className="ml-card ml-input-card">
      <div className="ml-card-header">
        <h2>{lang === "es" ? "Analizar texto" : lang === "fr" ? "Analyser le texte" : "Analyze text"}</h2>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          lang === "es"
            ? "Escribe lo que sientes..."
            : lang === "fr"
            ? "Écrivez ce que vous ressentez..."
            : "Write what you're feeling..."
        }
        rows={8}
      />
      <button className="ml-analyze-btn" onClick={onAnalyze} disabled={loading || !value.trim()}>
        {loading ? (lang === "es" ? "Analizando..." : lang === "fr" ? "Analyse en cours..." : "Analyzing...") : (lang === "es" ? "Analizar" : lang === "fr" ? "Analyser" : "Analyze")}
      </button>
    </div>
  );
}
