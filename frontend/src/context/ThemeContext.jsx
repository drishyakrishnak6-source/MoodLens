import { createContext, useContext, useEffect, useState } from "react";

// Shared theme system — any page/component can use this via useTheme().
// Adding a new theme = add an entry here + matching CSS block in themes.css

export const THEMES = [
  // Light themes
  { id: "sky-blue-white", label: "Sky Blue & White (Default)", swatch: "#38bdf8" },
  { id: "lavender-light", label: "Lavender (Light)", swatch: "#9333ea" },
  { id: "mint-light", label: "Mint (Light)", swatch: "#16a34a" },
  { id: "peach-light", label: "Peach (Light)", swatch: "#f97316" },
  { id: "mint-wellness", label: "Mint Wellness (Light)", swatch: "#2dd4bf" },
  { id: "peach-coral", label: "Peach & Coral (Light)", swatch: "#ff7f50" },

  // Dark themes
  { id: "purple", label: "Purple (Dark)", swatch: "#a855f7" },
  { id: "green", label: "Forest Green (Dark)", swatch: "#22c55e" },
  { id: "rose", label: "Dark Rose (Dark)", swatch: "#e11d48" },
  { id: "blue", label: "Ocean Blue (Dark)", swatch: "#3b82f6" },
  { id: "pink", label: "Blossom Pink (Dark)", swatch: "#ec4899" },
  { id: "charcoal-ice-blue", label: "Charcoal + Ice Blue (Dark)", swatch: "#7dd3fc" },
  { id: "aurora-blue-dark", label: "Aurora Blue (Dark)", swatch: "#22d3ee" },
];

// Logo emoji per theme — matches the mood of each reference design
export const LOGO_ICONS = {
  purple: "💜",
  green: "🌿",
  rose: "🥀",
  blue: "🌙",
  pink: "🌸",
  "lavender-light": "💜",
  "mint-light": "🌿",
  "peach-light": "🍑",
  "mint-wellness": "🌿",
  "peach-coral": "🍑",
  "sky-blue-white": "☀️",
  "charcoal-ice-blue": "🌙",
  "aurora-blue-dark": "✨",
};

// Which react-icon renders inside the gradient logo badge, per theme
export const LOGO_ICON_KEYS = {
  purple: "magic",
  green: "leaf",
  rose: "heart",
  blue: "moon",
  pink: "feather",
  "lavender-light": "magic",
  "mint-light": "leaf",
  "peach-light": "feather",
  "mint-wellness": "leaf",
  "peach-coral": "feather",
  "sky-blue-white": "sun",
  "charcoal-ice-blue": "moon",
  "aurora-blue-dark": "star",
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("moodlens-theme") || "sky-blue-white"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("moodlens-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);