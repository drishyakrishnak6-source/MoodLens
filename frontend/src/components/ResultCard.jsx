import React from "react";

export default function ResultCard({ result, violent, lang }) {
  if (!result) {
    return (
      <div className="ml-card ml-result ml-result-empty">
        <p>{lang === "es" ? "Envía algo para obtener análisis." : lang === "fr" ? "Envoyez quelque chose pour obtenir une analyse." : "Submit something to get analysis."}</p>
      </div>
    );
  }

  const sentiment = result.sentiment || "Neutral";
  const confidence = result.confidence != null ? Math.round(result.confidence * 100) : null;
  const emotions = result.emotions ? JSON.parse(result.emotions || "[]") : [];
  const entities = result.entities ? result.entities.split(",").map((item) => item.trim()).filter(Boolean) : [];

  return (
    <div className="ml-card ml-result">
      <div className="ml-card-header">
        <h2>{lang === "es" ? "Resultado del análisis" : lang === "fr" ? "Résultat de l'analyse" : "Analysis Result"}</h2>
      </div>

      <div className="ml-result-stats">
        <p>
          <strong>{lang === "es" ? "Sentimiento" : lang === "fr" ? "Sentiment" : "Sentiment"}:</strong> {sentiment}
        </p>
        {confidence != null && (
          <p>
            <strong>{lang === "es" ? "Confianza" : lang === "fr" ? "Confiance" : "Confidence"}:</strong> {confidence}%
          </p>
        )}
        {entities.length > 0 && (
          <p>
            <strong>{lang === "es" ? "Entidades" : lang === "fr" ? "Entités" : "Entities"}:</strong> {entities.join(", ")}
          </p>
        )}
      </div>

      {emotions.length > 0 && (
        <div className="ml-result-emotions">
          <strong>{lang === "es" ? "Emociones detectadas" : lang === "fr" ? "Émotions détectées" : "Detected Emotions"}:</strong>
          <ul>
            {emotions.map((emotion, idx) => (
              <li key={idx}>{emotion.label || emotion}</li>
            ))}
          </ul>
        </div>
      )}

      {violent && (
        <div className="ml-violence-note">
          <p>
            {lang === "es"
              ? "Hay enojo dirigido a otra persona. Busca ayuda antes de actuar." 
              : lang === "fr"
              ? "Il y a de la colère dirigée vers quelqu'un d'autre. Demandez de l'aide avant d'agir."
              : "There is anger directed at someone else. Seek help before acting."}
          </p>
        </div>
      )}
    </div>
  );
}
