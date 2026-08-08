import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { authApi } from "../../lib/endpoints";
import { useAsyncAction } from "../../hooks/useAsyncAction";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPending, run } = useAsyncAction();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await run(() => authApi.login({ email, password }));
    if (result == null) {
      setError("Invalid email or password.");
      return;
    }
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="bg-[#f3f6fc] min-h-screen flex flex-col items-center justify-center p-4">
      {/* Login Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-sm border border-gray-100/80">
        {/* Badge */}
        <div className="flex items-center justify-center mb-4">
          <span className="inline-flex items-center gap-2 bg-blue-50/70 border border-blue-100 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[11px] font-bold text-primary tracking-wide">
              Admin Access
            </span>
          </span>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-gray-400 mt-1.5 font-medium">
            Sign in to manage your store
          </p>
        </div>

        {error && (
          <div className="mb-5 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                placeholder="admin@lazapee.ph"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-[11px] text-gray-400 font-medium">
            Protected area — authorized personnel only
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;