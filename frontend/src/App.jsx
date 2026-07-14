import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import History from "./pages/History";
import HistoryDetail from "./pages/HistoryDetail";
import Settings from "./pages/Settings";
import Analysis from "./pages/Analysis"; // 1. Import your Analysis component

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;