import { useState } from "react";
import { User, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { supabase } from "../lib/supabaseClient";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      
      // AuthContext will handle role checking and redirection
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMsg("Kredensial tidak valid atau Anda bukan admin/guru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Admin & Teacher Portal" 
      subtitle="Login khusus untuk pendidik dan staf administrator Kurmerdeka TRACE."
      showGoogle={false} // Biasanya admin portal tidak pakai login sosial
    >
      <form onSubmit={handleLogin} className="relative z-10 flex flex-col gap-4">
        
        {/* Banner Khusus Admin */}
        <div className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-amber-400">
          <ShieldCheck size={18} />
          <span className="text-xs font-bold uppercase tracking-wider">Restricted Access</span>
        </div>

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
            Admin Email
          </label>
          <div className="group relative">
            <User size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B] duration-300 group-focus-within:text-amber-500" />
            <input
              type="email"
              placeholder="Masukkan email guru/admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[54px] w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/80 pl-12 pr-5 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-[#475569] hover:bg-slate-100 dark:hover:bg-[#1E293B]/80 hover:border-slate-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-[#1E293B] focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/20"
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
            <Lock size={17} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#64748B] duration-300 group-focus-within:text-amber-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-[54px] w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/80 pl-12 pr-5 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-[#475569] hover:bg-slate-100 dark:hover:bg-[#1E293B]/80 hover:border-slate-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-[#1E293B] focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/20"
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
            LOGIN BUTTON
        ================================================== */}
        <button
          type="submit"
          disabled={loading}
          className="group relative mt-6 h-12 w-full overflow-hidden rounded-full bg-amber-600 text-sm font-extrabold tracking-wide text-slate-900 dark:text-white shadow-[0_10px_30px_rgba(217,119,6,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:bg-amber-500 hover:shadow-[0_15px_40px_rgba(217,119,6,0.6)] active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative z-10">{loading ? 'MEMPROSES...' : 'OTORISASI AKSES'}</span>
        </button>
        
      </form>
    </AuthLayout>
  );
}
