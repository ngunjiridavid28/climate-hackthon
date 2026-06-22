import React, { useState } from "react";
import { api, setToken } from "../lib/api.js";
import { UserProfile } from "../types.js";
import { Mail, Lock, User as UserIcon, Building, MapPin, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthService } from "../services/authService.js";

interface AuthCardProps {
  onSuccess: (user: UserProfile) => void;
  showToast: (msg: string, type: "success" | "error" | "info") => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onSuccess, showToast }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Forgot password flow state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"SELLER" | "RECYCLER" | "MANUFACTURER" | "EPR">("SELLER");
  const [organizationName, setOrganizationName] = useState("");
  const [location, setLocation] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await AuthService.loginWithEmail(email, password);
        onSuccess(result.user);
        showToast(`Welcome back, ${result.user.name}!`, "success");
      } else {
        const result = await AuthService.registerWithEmail(email, password, {
          name,
          role,
          organizationName,
          location
        });
        onSuccess(result.user);
        
        if (role === "RECYCLER" || role === "MANUFACTURER") {
          showToast("Account registered! Access is pending brief administrative review.", "info");
        } else {
          showToast(`Account registered successfully as ${role}!`, "success");
        }
      }
    } catch (err: any) {
      showToast(err.message || "Authentication attempt failed. Please check parameters.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const result = await AuthService.loginWithGoogle();
      onSuccess(result.user);
      showToast(`Welcome, ${result.user.name}!`, "success");
    } catch (err: any) {
      showToast(err.message || "Google Sign-In failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    showToast("Google Sign-In failed", "error");
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setLoading(true);

    try {
      const response = await api.forgotPassword(forgotEmail);
      showToast(response.message, "success");
      setShowForgotPassword(false);
      setForgotEmail("");
    } catch (err: any) {
      showToast(err.message || "Failed to trigger recovery email.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden" id="auth-panel-container">
      {/* Decorative colored glow meshes */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-48 h-48 bg-teal-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-[80px]" />

      {!showForgotPassword ? (
        <>
          <div className="text-center mb-8 relative z-10" id="auth-header">
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">UziLink</span>
              <ShieldCheck className="w-7 h-7 text-teal-400" />
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              {isLogin 
                ? "B2B AI circular textile waste hub" 
                : "Create account to swap or recycle fabric waste"}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl mb-6 border border-slate-800/80 relative z-10" id="auth-tabs">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                isLogin ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
              id="auth-tab-login"
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                !isLogin ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
              }`}
              id="auth-tab-register"
            >
              Register
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 relative z-10" id="auth-form">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">FullName</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-400">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-teal-400 hover:text-teal-300 transition"
                    id="btn-forgot-password"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-200 text-sm pl-10 pr-10 py-2.5 rounded-xl outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 text-teal-500 focus:ring-teal-500"
                />
                <label htmlFor="remember-me" className="text-xs text-slate-400">Remember me</label>
              </div>
            )}

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 pt-1"
                id="panel-register-fields"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Account Role type</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-200 text-sm px-3 py-2.5 rounded-xl outline-none transition"
                  >
                    <option value="SELLER">Textile Waste Seller (Trader/Factory)</option>
                    <option value="RECYCLER">Recycling Firm (Fiber Shredder/Processor)</option>
                    <option value="MANUFACTURER">Product Manufacturer (Spinning mill/weaver)</option>
                    <option value="EPR">EPR Compliance Officer (KEPRO/Inspector)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 block truncate">Company/Trader Name</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="e.g. Eco Sorting"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-200 text-xs pl-9 pr-2 py-2.5 rounded-xl outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Location Base</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Nairobi"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-200 text-xs pl-9 pr-2 py-2.5 rounded-xl outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-teal-500/10 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed text-sm"
              id="btn-auth-submit"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </div>
              ) : isLogin ? "Sign In to marketplace" : "Register and continue"}
            </button>

            {isLogin && (
              <>
                <div className="flex items-center gap-2 my-4">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-xs text-slate-500">Or continue with</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    text="signin_with"
                    size="large"
                    theme="dark"
                  />
                </div>
              </>
            )}
          </form>

          {/* Authentication actions info */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Secure enterprise B2B registration. All data is securely processed in the cloud.
          </div>
        </>
      ) : (
        /* Password Reset View */
        <div id="forgot-password-panel">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white">Reset Password</h2>
            <p className="text-xs text-slate-400 mt-2">Enter your email and we'll send you recovery steps.</p>
          </div>

          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition text-xs"
              >
                Back to Sign In
              </button>
              <button
                type="submit"
                disabled={loading || !forgotEmail}
                className="flex-1 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold py-2.5 rounded-xl transition text-xs disabled:opacity-50"
              >
                Send Instructions
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
