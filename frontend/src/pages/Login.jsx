import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  // We'll update AuthContext later to handle the sync logic automatically

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      // On success, AuthContext's onAuthStateChange will trigger
      // and redirect to the correct dashboard based on role
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMsg("Email atau password salah. Pastikan akun sudah terdaftar dan diverifikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Sign in to continue"
      subtitle="Masuk untuk melanjutkan perjalanan belajarmu."
      showGoogle={true}
    >
      <form onSubmit={handleLogin} className="relative z-10 flex flex-col gap-4">
        {errorMsg && (
          <div className="rounded-xl bg-red-500/10 p-3 text-center text-xs font-semibold text-red-400 border border-red-500/20">
            {errorMsg}
          </div>
        )}

        {/* =================================================
            EMAIL
        ================================================== */}
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Email
          </label>
          <div className="group relative">
            <User size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B] duration-300 group-focus-within:text-[#F59E0B]" />
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[54px] w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/80 pl-12 pr-5 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-[#475569] hover:bg-slate-100 dark:hover:bg-[#1E293B]/80 hover:border-slate-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-[#1E293B] focus:border-[#F59E0B]/50 focus:ring-4 focus:ring-[#F59E0B]/20"
            />
          </div>
        </div>

        {/* =================================================
            PASSWORD
        ================================================== */}
        <div className="mt-4">
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Password
          </label>
          <div className="group relative">
            <Lock size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B] duration-300 group-focus-within:text-[#F59E0B]" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[54px] w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/80 pl-12 pr-5 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-[#475569] hover:bg-slate-100 dark:hover:bg-[#1E293B]/80 hover:border-slate-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-[#1E293B] focus:border-[#F59E0B]/50 focus:ring-4 focus:ring-[#F59E0B]/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[#64748B] transition-all duration-200 hover:scale-110 hover:text-slate-900 dark:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* =================================================
            REMEMBER / FORGOT
        ================================================== */}
        <div className="mt-4 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="h-3.5 w-3.5 cursor-pointer rounded border-white/20 bg-white/10 accent-[#F59E0B]" />
            <span className="text-[10px] font-medium text-[#94A3B8]">Remember Me</span>
          </label>
          <Link to="/forgot-password" className="text-[10px] font-semibold text-[#38BDF8] hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* =================================================
            LOGIN BUTTON
        ================================================== */}
        <button
          type="submit"
          disabled={loading}
          className="group relative mt-6 h-12 w-full overflow-hidden rounded-full bg-blue-500 text-sm font-extrabold tracking-wide text-white dark:bg-[#1E3A8A] shadow-[0_10px_30px_rgba(30,58,138,0.3)] dark:shadow-[0_10px_30px_rgba(30,58,138,0.5)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:bg-blue-600 dark:hover:bg-[#1E40AF] hover:shadow-[0_15px_40px_rgba(30,58,138,0.4)] dark:hover:shadow-[0_15px_40px_rgba(30,58,138,0.6)] active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative z-10">{loading ? 'MEMPROSES...' : 'LOGIN'}</span>
        </button>

        {/* =================================================
            REGISTER LINK
        ================================================== */}
        <div className="mt-4 text-center text-[11px] font-medium text-[#94A3B8]">
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-[#F59E0B] hover:underline">
            Daftar Siswa
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
