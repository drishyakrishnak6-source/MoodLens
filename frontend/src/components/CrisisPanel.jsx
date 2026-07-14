import React from "react";
import { CRISIS_RESOURCES } from "../crisisDetection.js";

export default function CrisisPanel({ lang }) {
  return (
    <div className="crisis-panel">
      <p>
        {lang === "es"
          ? "Su contenido sugiere una crisis. Por favor busca ayuda inmediata." 
          : lang === "fr"
          ? "Votre contenu suggère une crise. Veuillez demander de l'aide immédiatement."
          : "Your content suggests a crisis. Please seek immediate help."}
      </p>
      <ul>
        {CRISIS_RESOURCES.map((resource) => (
          <li key={resource.tel}>
            <strong>{resource.label}</strong>
            <br />
            <a href={`tel:${resource.tel}`}>{resource.value}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
