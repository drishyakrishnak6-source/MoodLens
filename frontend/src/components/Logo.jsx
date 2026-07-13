import { useTheme, LOGO_ICON_KEYS } from "../context/ThemeContext";
import {
  FaMagic,
  FaLeaf,
  FaHeart,
  FaMoon,
  FaFeatherAlt,
  FaSun,
  FaStar,
} from "react-icons/fa";

const ICON_COMPONENTS = {
  magic: FaMagic,
  leaf: FaLeaf,
  heart: FaHeart,
  moon: FaMoon,
  feather: FaFeatherAlt,
  sun: FaSun,
  star: FaStar,
};

const Logo = () => {
  const { theme } = useTheme();
  const Icon = ICON_COMPONENTS[LOGO_ICON_KEYS[theme]] || FaMagic;

  return (
    <div className="logo">
      <span className="logo-badge">
        <Icon />
      </span>
      Mood<span className="logo-accent">Lens</span>
    </div>
  );
};

export default Logo;