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
        email,
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
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white">
            Email
          </label>
          <div className="group relative">
            <User size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 duration-300 group-focus-within:text-blue-500" />
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[54px] w-full rounded-full border border-white/40 bg-[#A9E3F5]/65 pl-12 pr-5 text-sm font-medium text-[#31566D] outline-none shadow-[inset_0_2px_8px_rgba(255,255,255,0.45),0_8px_25px_rgba(48,120,150,0.12)] backdrop-blur-md transition-all duration-300 placeholder:text-[#63879A] hover:bg-[#B6EAF7]/75 hover:border-white/60 focus:bg-[#C0EDF8]/85 focus:border-white focus:ring-4 focus:ring-[#7DD3EC]/25"
            />
          </div>
        </div>

        {/* =================================================
            PASSWORD
        ================================================== */}
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white">
            Password
          </label>
          <div className="group relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[54px] w-full rounded-full border border-white/40 bg-[#A9E3F5]/65 pl-12 pr-5 text-sm font-medium text-[#31566D] outline-none shadow-[inset_0_2px_8px_rgba(255,255,255,0.45),0_8px_25px_rgba(48,120,150,0.12)] backdrop-blur-md transition-all duration-300 placeholder:text-[#63879A] hover:bg-[#B6EAF7]/75 hover:border-white/60 focus:bg-[#C0EDF8]/85 focus:border-white focus:ring-4 focus:ring-[#7DD3EC]/25"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition-all duration-200 hover:scale-110 hover:text-white"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* =================================================
            REMEMBER / FORGOT
        ================================================== */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="h-3.5 w-3.5 cursor-pointer rounded border-white/20 bg-white/10 accent-[#a6f03d]" />
            <span className="text-[10px] font-medium text-white">Remember Me</span>
          </label>
          <Link to="/forgot-password" className="text-[10px] font-semibold text-white hover:underline">
            Forgot password?
          </Link>
        </div>

        {/* =================================================
            LOGIN BUTTON
        ================================================== */}
        <button
          type="submit"
          disabled={loading}
          className="group relative mt-1 h-12 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#743ce5] via-[#9848dc] to-[#e95ea9] text-sm font-extrabold tracking-wide text-white shadow-[0_12px_35px_rgba(135,66,220,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_18px_45px_rgba(220,82,190,0.45)] active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative z-10">{loading ? 'MEMPROSES...' : 'LOGIN'}</span>
        </button>
        
        {/* =================================================
            REGISTER LINK
        ================================================== */}
        <div className="mt-2 text-center text-[11px] font-medium text-white/80">
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-white hover:underline">
            Daftar Siswa
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
