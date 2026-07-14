import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { loginUser, loginWithGoogle, loginWithApple } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Social Login Mock States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProvider, setModalProvider] = useState(""); // "google" or "apple"
  const [mockEmail, setMockEmail] = useState("");
  const [mockName, setMockName] = useState("");
  const [isSubmittingOAuth, setIsSubmittingOAuth] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginUser(email, password);
      navigate("/analysis"); // change this to wherever your app should go after login
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleOAuthClick = (provider) => {
    setModalProvider(provider);
    setMockEmail("");
    setMockName("");
    setIsModalOpen(true);
  };

  const handleOAuthSubmit = async (selectedEmail, selectedName) => {
    setIsSubmittingOAuth(true);
    setError("");
    const finalEmail = selectedEmail || mockEmail;
    const finalName = selectedName || mockName;

    if (!finalEmail) {
      setError("Please select or enter an email address");
      setIsSubmittingOAuth(false);
      return;
    }

    try {
      const mockToken = `mock_${modalProvider}_${Date.now()}`;
      if (modalProvider === "google") {
        await loginWithGoogle(mockToken, finalEmail, finalName);
      } else {
        await loginWithApple(mockToken, finalEmail, finalName);
      }
      setIsModalOpen(false);
      navigate("/analysis");
    } catch (err) {
      setError(`Failed to sign in with ${modalProvider === "google" ? "Google" : "Apple"}`);
    } finally {
      setIsSubmittingOAuth(false);
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
          className="relative p-10 flex flex-col justify-between min-h-[600px] overflow-hidden"
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
              className="text-3xl font-semibold leading-snug flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
            >
              Welcome Back! <span>👋</span>
            </h2>
            <p className="mt-2 text-base" style={{ color: "var(--text-secondary)" }}>
              Login to continue analyzing your moods and emotions.
            </p>
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
              "This feeling is temporary, growth is not."
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div
          className="p-10 flex flex-col justify-center"
          style={{ background: "var(--solid-bg)" }}
        >
          <h2 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Login
          </h2>
          <p className="text-sm mt-1 mb-8" style={{ color: "var(--text-secondary)" }}>
            Glad to see you again!
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p
                className="text-sm rounded-lg px-3 py-2 text-center"
                style={{ color: "#dc2626", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}
              >
                {error}
              </p>
            )}

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
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label
                className="flex items-center gap-2 cursor-pointer select-none"
                style={{ color: "var(--text-secondary)" }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe((r) => !r)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: "var(--accent)" }}
                />
                Remember me
              </label>
              <a href="/login" className="hover:opacity-80" style={{ color: "var(--accent)" }}>
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-medium text-white hover:opacity-90 transition-opacity"
              style={{ background: "var(--gradient)" }}
            >
              Login
            </button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1" style={{ background: "var(--surface-08)" }} />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>or</span>
              <div className="h-px flex-1" style={{ background: "var(--surface-08)" }} />
            </div>

            <button
              type="button"
              onClick={() => handleOAuthClick("google")}
              className="w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors hover:opacity-80"
              style={{ border: "1px solid var(--surface-08)", color: "var(--text-primary)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
                <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z" />
                <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V6.5H1.4C.5 8.2 0 10.1 0 12s.5 3.8 1.4 5.5l4-3.1z" />
                <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              Don't have an account?{" "}
              <a href="/register" className="hover:opacity-80" style={{ color: "var(--accent)" }}>
                Register
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Simulation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          <div
            className="rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left"
            style={{ background: "var(--solid-bg)", border: "1px solid var(--surface-08)" }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-xl font-semibold flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {modalProvider === "google" ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
                        <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z" />
                        <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V6.5H1.4C.5 8.2 0 10.1 0 12s.5 3.8 1.4 5.5l4-3.1z" />
                        <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
                      </svg>
                      Google Sign-In Simulation
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text-primary)">
                        <path d="M16.3 1.5c0 1.2-.5 2.3-1.2 3.1-.8.9-2 1.6-3.2 1.5-.1-1.2.5-2.4 1.2-3.2.8-.9 2.2-1.6 3.2-1.4zM20.6 17c-.5 1.2-.8 1.7-1.5 2.7-1 1.4-2.4 3.2-4.1 3.2-1.5 0-1.9-1-4-1s-2.5 1-4 1c-1.7 0-3-1.6-4-3-2.7-3.9-3-8.5-1.3-11 1.2-1.8 3-2.9 4.8-2.9 1.6 0 2.6 1.1 4 1.1s1.9-1.1 4-1.1c1.4 0 2.9.6 4 2.2-3.5 1.9-2.9 6.9 1.1 8.8z" />
                      </svg>
                      Apple Sign-In Simulation
                    </>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-lg font-medium p-1 hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  ✕
                </button>
              </div>

              <p className="text-sm mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                You are in local simulation mode. Pick a preset account below, or input custom details to log in instantly.
              </p>

              {/* Preset accounts */}
              <div className="space-y-3 mb-6">
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Test Accounts
                </p>
                {modalProvider === "google" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOAuthSubmit("alex.mercer@gmail.com", "Alex Mercer")}
                      className="w-full text-left rounded-2xl p-3.5 transition-all flex items-center justify-between hover:opacity-90"
                      style={{ background: "var(--surface-05)", border: "1px solid var(--surface-06)" }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Alex Mercer</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>alex.mercer@gmail.com</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
                      >
                        Select
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuthSubmit("sarah.j@gmail.com", "Sarah Jenkins")}
                      className="w-full text-left rounded-2xl p-3.5 transition-all flex items-center justify-between hover:opacity-90"
                      style={{ background: "var(--surface-05)", border: "1px solid var(--surface-06)" }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Sarah Jenkins</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>sarah.j@gmail.com</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
                      >
                        Select
                      </span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOAuthSubmit("sandra.k@icloud.com", "Sandra Knight")}
                      className="w-full text-left rounded-2xl p-3.5 transition-all flex items-center justify-between hover:opacity-90"
                      style={{ background: "var(--surface-05)", border: "1px solid var(--surface-06)" }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Sandra Knight</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>sandra.k@icloud.com</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
                      >
                        Select
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuthSubmit("david.w@icloud.com", "David Wright")}
                      className="w-full text-left rounded-2xl p-3.5 transition-all flex items-center justify-between hover:opacity-90"
                      style={{ background: "var(--surface-05)", border: "1px solid var(--surface-06)" }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>David Wright</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>david.w@icloud.com</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ color: "var(--accent)", background: "var(--accent-soft)" }}
                      >
                        Select
                      </span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="h-px flex-1" style={{ background: "var(--surface-08)" }} />
                <span className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                  or enter custom details
                </span>
                <div className="h-px flex-1" style={{ background: "var(--surface-08)" }} />
              </div>

              {/* Custom inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                    Custom Name
                  </label>
                  <input
                    type="text"
                    value={mockName}
                    onChange={(e) => setMockName(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                    style={{ background: "var(--surface-05)", border: "1px solid var(--surface-08)", color: "var(--text-primary)" }}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                    Custom Email
                  </label>
                  <input
                    type="email"
                    value={mockEmail}
                    onChange={(e) => setMockEmail(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-colors"
                    style={{ background: "var(--surface-05)", border: "1px solid var(--surface-08)", color: "var(--text-primary)" }}
                    placeholder="jane.doe@example.com"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmittingOAuth}
                onClick={() => handleOAuthSubmit()}
                className="w-full py-3 rounded-xl font-medium text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ background: "var(--gradient)" }}
              >
                {isSubmittingOAuth ? "Signing In..." : "Continue with Custom Details"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}