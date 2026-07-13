import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import quotes from "../data/quotes";
import {
  FaQuoteRight,
  FaSeedling,
  FaHeart,
  FaMoon,
  FaFeatherAlt,
  FaSun,
  FaStar,
} from "react-icons/fa";

// One decorative icon per theme, matching the mood of each reference design
const THEME_ICONS = {
  purple: FaQuoteRight,
  green: FaSeedling,
  rose: FaHeart,
  blue: FaMoon,
  pink: FaFeatherAlt,
  "lavender-light": FaQuoteRight,
  "mint-light": FaSeedling,
  "peach-light": FaFeatherAlt,
  "mint-wellness": FaSeedling,
  "peach-coral": FaFeatherAlt,
  "sky-blue-white": FaSun,
  "charcoal-ice-blue": FaMoon,
  "aurora-blue-dark": FaStar,
};

const DailyQuote = () => {
  const { theme } = useTheme();

  // useMemo with no deps = picked once per mount, i.e. once per page load/refresh
  const quote = useMemo(
    () => quotes[Math.floor(Math.random() * quotes.length)],
    []
  );

  const Icon = THEME_ICONS[theme] || FaQuoteRight;

  return (
    <div className="daily-quote-card">
      <Icon className="daily-quote-icon" />
      <span className="daily-quote-label">Daily Quote</span>
      <p className="daily-quote-text">{quote}</p>
    </div>
  );
};

export default DailyQuote;