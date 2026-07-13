import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
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
      navigate('/analysis');
    } catch (err) {
      if (err.response?.status === 400) {
        setError("Username or email already registered");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0a17] p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
        <div className="relative bg-[#0b0a17] p-10 flex flex-col justify-between min-h-[640px] overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 600" preserveAspectRatio="xMidYMax slice">
            <defs>
              <radialGradient id="moonGlow2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="mtn1b" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#241b3d" />
                <stop offset="100%" stopColor="#150f26" />
              </linearGradient>
              <linearGradient id="mtn2b" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1430" />
                <stop offset="100%" stopColor="#0d0a1a" />
              </linearGradient>
              <linearGradient id="waterb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a1f4a" />
                <stop offset="100%" stopColor="#0b0a17" />
              </linearGradient>
            </defs>
            {Array.from({ length: 40 }).map((_, i) => (
              <circle key={i} cx={Math.random() * 500} cy={Math.random() * 260} r={Math.random() * 1.3 + 0.3} fill="#e9d8fd" opacity={Math.random() * 0.7 + 0.2} />
            ))}
            <circle cx="230" cy="160" r="90" fill="url(#moonGlow2)" />
            <path d="M255 100a70 70 0 1 0 0 120 55 55 0 1 1 0-120z" fill="#f3e8ff" />
            <path d="M0 340 L90 260 L180 330 L260 250 L340 320 L420 270 L500 340 L500 420 L0 420 Z" fill="url(#mtn2b)" />
            <path d="M0 380 L120 300 L220 370 L320 290 L420 360 L500 320 L500 430 L0 430 Z" fill="url(#mtn1b)" />
            <rect x="0" y="420" width="500" height="180" fill="url(#waterb)" />
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
              Start your <span className="text-teal-300">journey.</span>
              <br />
              Track every <span className="text-purple-300">feeling.</span>
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
            Create Account <span>🌙</span>
          </h2>
          <p className="text-white/50 text-sm mt-1 mb-8">Begin understanding your emotions</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label className="text-sm text-white/70 mb-1.5 block">Username</label>
              <div className="flex items-center gap-2 bg-[#181528] border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-purple-400/60 transition-colors">
                <User size={16} className="text-white/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-transparent outline-none text-white text-sm w-full placeholder:text-white/30"
                  placeholder="yourname"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 bg-[#181528] border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-purple-400/60 transition-colors">
                <Mail size={16} className="text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent outline-none text-white text-sm w-full placeholder:text-white/30"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 bg-[#181528] border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-purple-400/60 transition-colors">
                <Lock size={16} className="text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent outline-none text-white text-sm w-full placeholder:text-white/30"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-white/40 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm text-white/70 mb-1.5 block">Confirm Password</label>
              <div className="flex items-center gap-2 bg-[#181528] border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-purple-400/60 transition-colors">
                <Lock size={16} className="text-white/40" />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent outline-none text-white text-sm w-full placeholder:text-white/30"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowConfirm((s) => !s)} className="text-white/40 hover:text-white/70 transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600 hover:opacity-90 transition-opacity mt-2"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-white/50">
              Already have an account?{" "}
              <a href="/login" className="text-purple-300 hover:text-purple-200">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}