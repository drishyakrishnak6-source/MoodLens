import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0a17] p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
        <div className="relative bg-[#0b0a17] p-10 flex flex-col justify-between min-h-[600px] overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 600" preserveAspectRatio="xMidYMax slice">
            <defs>
              <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#241b3d" />
                <stop offset="100%" stopColor="#150f26" />
              </linearGradient>
              <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1430" />
                <stop offset="100%" stopColor="#0d0a1a" />
              </linearGradient>
              <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a1f4a" />
                <stop offset="100%" stopColor="#0b0a17" />
              </linearGradient>
            </defs>
            {Array.from({ length: 40 }).map((_, i) => (
              <circle key={i} cx={Math.random() * 500} cy={Math.random() * 260} r={Math.random() * 1.3 + 0.3} fill="#e9d8fd" opacity={Math.random() * 0.7 + 0.2} />
            ))}
            <circle cx="230" cy="160" r="90" fill="url(#moonGlow)" />
            <path d="M255 100a70 70 0 1 0 0 120 55 55 0 1 1 0-120z" fill="#f3e8ff" />
            <path d="M0 340 L90 260 L180 330 L260 250 L340 320 L420 270 L500 340 L500 420 L0 420 Z" fill="url(#mtn2)" />
            <path d="M0 380 L120 300 L220 370 L320 290 L420 360 L500 320 L500 430 L0 430 Z" fill="url(#mtn1)" />
            <rect x="0" y="420" width="500" height="180" fill="url(#water)" />
            <line x1="180" y1="440" x2="250" y2="440" stroke="#c084fc" strokeOpacity="0.25" strokeWidth="2" />
            <line x1="160" y1="460" x2="270" y2="460" stroke="#c084fc" strokeOpacity="0.15" strokeWidth="2" />
            <g fill="#2dd4bf" opacity="0.5">
              <circle cx="20" cy="560" r="6" />
              <circle cx="45" cy="580" r="8" />
              <circle cx="10" cy="590" r="5" />
            </g>
            <g fill="#a78bfa" opacity="0.6">
              <circle cx="470" cy="540" r="7" />
              <circle cx="490" cy="565" r="5" />
              <circle cx="455" cy="575" r="6" />
            </g>
          </svg>

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center">
                <Heart size={18} className="text-white" fill="white" />
              </div>
              <h1 className="text-xl font-semibold text-white">
                Mood<span className="text-purple-300">Lens</span>
              </h1>
            </div>
            <p className="text-sm text-white/50 mt-1 ml-11">AI-Powered Mood alaysisr</p>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-semibold text-white leading-snug">
              Understand your <span className="text-teal-300">emotions.</span>
              <br />
              Improve your <span className="text-purple-300">well-being.</span>
            </h2>
          </div>

          <div className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3 max-w-xs">
            <p className="text-sm text-white/70 italic flex items-center gap-2">
              "Your feelings are valid. Your story matters."{" "}
              <Heart size={14} className="text-purple-300" fill="currentColor" />
            </p>
          </div>
        </div>

        <div className="bg-[#0f0d1c] p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            Welcome Back! <span>✨</span>
          </h2>
          <p className="text-white/50 text-sm mt-1 mb-8">Login to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 text-center">
                {error}
              </p>
            )}

            <div>
              <label className="text-sm text-white/70 mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 bg-[#181528] border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-purple-400/60 transition-colors">
                <Mail size={16} className="text-white/40" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent outline-none text-white text-sm w-full placeholder:text-white/30" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 bg-[#181528] border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-purple-400/60 transition-colors">
                <Lock size={16} className="text-white/40" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent outline-none text-white text-sm w-full placeholder:text-white/30" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-white/40 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/60 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe((r) => !r)} className="accent-purple-500 w-4 h-4 rounded" />
                Remember me
              </label>
              <a href="/login" className="text-purple-300 hover:text-purple-200">Forgot password?</a>
            </div>

            <button type="submit" className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 hover:opacity-90 transition-opacity">
              Login
            </button>

            <p className="text-center text-sm text-white/50">
              Don't have an account?{" "}
              <a href="/register" className="text-purple-300 hover:text-purple-200">Sign up</a>
            </p>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs text-white/30">or</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <button type="button" onClick={() => handleOAuthClick("google")} className="w-full py-3 rounded-xl border border-white/10 text-white/80 text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
                <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z" />
                <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.6.4-2.4V6.5H1.4C.5 8.2 0 10.1 0 12s.5 3.8 1.4 5.5l4-3.1z" />
                <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
              </svg>
              Continue with Google
            </button>

            <button type="button" onClick={() => handleOAuthClick("apple")} className="w-full py-3 rounded-xl border border-white/10 text-white/80 text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M16.3 1.5c0 1.2-.5 2.3-1.2 3.1-.8.9-2 1.6-3.2 1.5-.1-1.2.5-2.4 1.2-3.2.8-.9 2.2-1.6 3.2-1.4zM20.6 17c-.5 1.2-.8 1.7-1.5 2.7-1 1.4-2.4 3.2-4.1 3.2-1.5 0-1.9-1-4-1s-2.5 1-4 1c-1.7 0-3-1.6-4-3-2.7-3.9-3-8.5-1.3-11 1.2-1.8 3-2.9 4.8-2.9 1.6 0 2.6 1.1 4 1.1s1.9-1.1 4-1.1c1.4 0 2.9.6 4 2.2-3.5 1.9-2.9 6.9 1.1 8.8z" />
              </svg>
              Continue with Apple
            </button>
          </form>
        </div>
      </div>

      {/* Simulation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0f0d1c] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-left">
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
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
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                        <path d="M16.3 1.5c0 1.2-.5 2.3-1.2 3.1-.8.9-2 1.6-3.2 1.5-.1-1.2.5-2.4 1.2-3.2.8-.9 2.2-1.6 3.2-1.4zM20.6 17c-.5 1.2-.8 1.7-1.5 2.7-1 1.4-2.4 3.2-4.1 3.2-1.5 0-1.9-1-4-1s-2.5 1-4 1c-1.7 0-3-1.6-4-3-2.7-3.9-3-8.5-1.3-11 1.2-1.8 3-2.9 4.8-2.9 1.6 0 2.6 1.1 4 1.1s1.9-1.1 4-1.1c1.4 0 2.9.6 4 2.2-3.5 1.9-2.9 6.9 1.1 8.8z" />
                      </svg>
                      Apple Sign-In Simulation
                    </>
                  )}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/40 hover:text-white/70 transition-colors text-lg font-medium p-1"
                >
                  ✕
                </button>
              </div>

              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                You are in local simulation mode. Pick a preset account below, or input custom details to log in instantly.
              </p>

              {/* Preset accounts */}
              <div className="space-y-3 mb-6">
                <p className="text-xs text-white/40 font-semibold uppercase tracking-wider">Test Accounts</p>
                {modalProvider === "google" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOAuthSubmit("alex.mercer@gmail.com", "Alex Mercer")}
                      className="w-full text-left bg-[#181528] hover:bg-[#201d33] border border-white/5 hover:border-purple-500/30 rounded-2xl p-3.5 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">Alex Mercer</p>
                        <p className="text-xs text-white/40">alex.mercer@gmail.com</p>
                      </div>
                      <span className="text-xs text-purple-300 font-semibold bg-purple-500/10 px-2.5 py-1 rounded-full">Select</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuthSubmit("sarah.j@gmail.com", "Sarah Jenkins")}
                      className="w-full text-left bg-[#181528] hover:bg-[#201d33] border border-white/5 hover:border-purple-500/30 rounded-2xl p-3.5 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">Sarah Jenkins</p>
                        <p className="text-xs text-white/40">sarah.j@gmail.com</p>
                      </div>
                      <span className="text-xs text-purple-300 font-semibold bg-purple-500/10 px-2.5 py-1 rounded-full">Select</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOAuthSubmit("sandra.k@icloud.com", "Sandra Knight")}
                      className="w-full text-left bg-[#181528] hover:bg-[#201d33] border border-white/5 hover:border-purple-500/30 rounded-2xl p-3.5 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">Sandra Knight</p>
                        <p className="text-xs text-white/40">sandra.k@icloud.com</p>
                      </div>
                      <span className="text-xs text-purple-300 font-semibold bg-purple-500/10 px-2.5 py-1 rounded-full">Select</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOAuthSubmit("david.w@icloud.com", "David Wright")}
                      className="w-full text-left bg-[#181528] hover:bg-[#201d33] border border-white/5 hover:border-purple-500/30 rounded-2xl p-3.5 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">David Wright</p>
                        <p className="text-xs text-white/40">david.w@icloud.com</p>
                      </div>
                      <span className="text-xs text-purple-300 font-semibold bg-purple-500/10 px-2.5 py-1 rounded-full">Select</span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="h-px bg-white/10 flex-1" />
                <span className="text-xs text-white/30 text-center">or enter custom details</span>
                <div className="h-px bg-white/10 flex-1" />
              </div>

              {/* Custom inputs */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs text-white/70 mb-1.5 block">Custom Name</label>
                  <input
                    type="text"
                    value={mockName}
                    onChange={(e) => setMockName(e.target.value)}
                    className="w-full bg-[#181528] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-purple-400/60 transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/70 mb-1.5 block">Custom Email</label>
                  <input
                    type="email"
                    value={mockEmail}
                    onChange={(e) => setMockEmail(e.target.value)}
                    className="w-full bg-[#181528] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none focus:border-purple-400/60 transition-colors"
                    placeholder="jane.doe@example.com"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmittingOAuth}
                onClick={() => handleOAuthSubmit()}
                className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-400 to-violet-600 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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