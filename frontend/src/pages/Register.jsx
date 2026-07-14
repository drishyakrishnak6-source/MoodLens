import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";
import { registerUser } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerUser(username, email, password);
      navigate("/analyze");
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Username or email already registered");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ background: "var(--bg-gradient)" }}
    >
      <div
        className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: "1px solid var(--surface-08)" }}
      >
        {/* Left panel */}
        <div
          className="relative p-10 flex flex-col justify-between min-h-[640px] overflow-hidden"
          style={{ background: "var(--bg-gradient)" }}
        >
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "var(--accent-soft)", filter: "blur(40px)" }}
          />
          <div
            className="absolute bottom-0 -left-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: "var(--accent-soft)", filter: "blur(40px)" }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "var(--gradient)" }}
              >
                <Heart size={18} className="text-white" fill="white" />
              </div>
              <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                Mood<span style={{ color: "var(--accent)" }}>Lens</span>
              </h1>
            </div>
            <p className="text-sm mt-1 ml-11" style={{ color: "var(--text-secondary)" }}>
              AI-Powered Mood Analyzer
            </p>
          </div>

          <div className="relative z-10">
            <h2
              className="text-3xl font-semibold leading-snug"
              style={{ color: "var(--text-primary)" }}
            >
              Start your <span style={{ color: "var(--accent)" }}>journey.</span>
              <br />
              Track every <span style={{ color: "var(--accent)" }}>feeling.</span>
            </h2>
          </div>

          <div
            className="relative z-10 rounded-xl px-4 py-3 max-w-xs"
            style={{ background: "var(--surface-05)", border: "1px solid var(--surface-08)" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5"
              style={{ color: "var(--accent)" }}
            >
              <Sparkles size={12} /> Daily Quote
            </p>
            <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
              "Your feelings are valid. Your story matters."
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div
          className="p-10 flex flex-col justify-center"
          style={{ background: "var(--solid-bg)" }}
        >
          <h2 className="text-2xl font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            Create Account <span>🌙</span>
          </h2>
          <p className="text-sm mt-1 mb-8" style={{ color: "var(--text-secondary)" }}>
            Begin understanding your emotions
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p
                className="text-sm rounded-lg px-3 py-2"
                style={{ color: "#dc2626", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}
              >
                {error}
              </p>
            )}

            <div>
              <label className="text-sm mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                Username
              </label>
              <div
                className="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-colors"
                style={{ background: "var(--surface-05)", border: "1px solid var(--surface-08)" }}
              >
                <User size={16} style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: "var(--text-primary)" }}
                  placeholder="yourname"
                />
              </div>
            </div>

            <div>
              <label className="text-sm mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                Email
              </label>
              <div
                className="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-colors"
                style={{ background: "var(--surface-05)", border: "1px solid var(--surface-08)" }}
              >
                <Mail size={16} style={{ color: "var(--text-muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: "var(--text-primary)" }}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                Password
              </label>
              <div
                className="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-colors"
                style={{ background: "var(--surface-05)", border: "1px solid var(--surface-08)" }}
              >
                <Lock size={16} style={{ color: "var(--text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: "var(--text-primary)" }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} style={{ color: "var(--text-muted)" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                Confirm Password
              </label>
              <div
                className="flex items-center gap-2 rounded-xl px-3.5 py-3 transition-colors"
                style={{ background: "var(--surface-05)", border: "1px solid var(--surface-08)" }}
              >
                <Lock size={16} style={{ color: "var(--text-muted)" }} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                  style={{ color: "var(--text-primary)" }}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm((s) => !s)} style={{ color: "var(--text-muted)" }}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-medium text-white hover:opacity-90 transition-opacity mt-2"
              style={{ background: "var(--gradient)" }}
            >
              Create Account
            </button>

            <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <a href="/login" className="hover:opacity-80" style={{ color: "var(--accent)" }}>
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}