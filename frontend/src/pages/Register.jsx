import { useState } from "react";
import { User, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { supabase } from "../lib/supabaseClient";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Password dan Konfirmasi Password tidak cocok!");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            username: username.trim()
          }
        }
      });

      if (error) throw error;
      
      // Jika email sudah pernah terdaftar
      if (data?.user && data?.user?.identities?.length === 0) {
        setErrorMsg("Email sudah terdaftar. Silakan login.");
      } else if (data?.session) {
        // Confirm Email dimatikan di Supabase, jadi langsung login otomatis!
        setSuccessMsg("Pendaftaran berhasil! Mengarahkan...");
        setTimeout(() => {
          navigate("/login"); // arahkan ke login agar role sinkron
        }, 1500);
      } else {
        // Jika Confirm Email menyala, arahkan ke OTP
        setSuccessMsg("Pendaftaran berhasil! Mengarahkan ke halaman verifikasi...");
        setTimeout(() => {
          navigate("/verify-email", { state: { email } });
        }, 1500);
      }
    } catch (error) {
      console.error("Register error:", error.message);
      setErrorMsg(error.message || "Gagal mendaftar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create an account" 
      subtitle="Mulai perjalanan belajarmu dengan mendaftar sebagai Siswa."
      showGoogle={false} // Biasanya di form register panjang kita sembunyikan atau biarkan
    >
      <form onSubmit={handleRegister} className="relative z-10 flex flex-col gap-3">
        {errorMsg && (
          <div className="rounded-xl bg-red-500/10 p-3 text-center text-xs font-semibold text-red-400 border border-red-500/20">
            {errorMsg}
          </div>
        )}
        
        {successMsg && (
          <div className="rounded-xl bg-green-500/10 p-3 text-center text-xs font-semibold text-green-400 border border-green-500/20">
            {successMsg}
          </div>
        )}

        {/* NAMA LENGKAP */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Nama Lengkap</label>
          <div className="group relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] duration-300 group-focus-within:text-[#F59E0B]" />
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-[48px] w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/80 pl-11 pr-4 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-[#475569] hover:bg-slate-100 dark:hover:bg-[#1E293B]/80 hover:border-slate-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-[#1E293B] focus:border-[#F59E0B]/50 focus:ring-4 focus:ring-[#F59E0B]/20"
            />
          </div>
        </div>

        {/* USERNAME */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Username</label>
          <div className="group relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] duration-300 group-focus-within:text-[#F59E0B]" />
            <input
              type="text"
              placeholder="Masukkan username unik"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-[48px] w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/80 pl-11 pr-4 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-[#475569] hover:bg-slate-100 dark:hover:bg-[#1E293B]/80 hover:border-slate-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-[#1E293B] focus:border-[#F59E0B]/50 focus:ring-4 focus:ring-[#F59E0B]/20"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Email</label>
          <div className="group relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] duration-300 group-focus-within:text-[#F59E0B]" />
            <input
              type="email"
              placeholder="Masukkan alamat email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[48px] w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/80 pl-11 pr-4 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-[#475569] hover:bg-slate-100 dark:hover:bg-[#1E293B]/80 hover:border-slate-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-[#1E293B] focus:border-[#F59E0B]/50 focus:ring-4 focus:ring-[#F59E0B]/20"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Password</label>
            <div className="group relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] duration-300 group-focus-within:text-[#F59E0B]" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-[48px] w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/80 pl-11 pr-9 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-[#475569] hover:bg-slate-100 dark:hover:bg-[#1E293B]/80 hover:border-slate-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-[#1E293B] focus:border-[#F59E0B]/50 focus:ring-4 focus:ring-[#F59E0B]/20"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] transition-all hover:text-slate-900 dark:text-white">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Konfirmasi</label>
            <div className="group relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B] duration-300 group-focus-within:text-[#F59E0B]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-[48px] w-full rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0F172A]/80 pl-11 pr-9 text-sm font-medium text-slate-900 dark:text-white outline-none shadow-inner backdrop-blur-md transition-all duration-300 placeholder:text-[#475569] hover:bg-slate-100 dark:hover:bg-[#1E293B]/80 hover:border-slate-300 dark:hover:border-white/20 focus:bg-white dark:focus:bg-[#1E293B] focus:border-[#F59E0B]/50 focus:ring-4 focus:ring-[#F59E0B]/20"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] transition-all hover:text-slate-900 dark:text-white">
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="group relative mt-3 h-12 w-full overflow-hidden rounded-full bg-[#1E3A8A] text-sm font-extrabold tracking-wide text-slate-900 dark:text-white shadow-[0_10px_30px_rgba(30,58,138,0.5)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:bg-[#1E40AF] hover:shadow-[0_15px_40px_rgba(30,58,138,0.6)] active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative z-10">{loading ? 'MENDAFTAR...' : 'DAFTAR SEKARANG'}</span>
        </button>
        
        {/* LOGIN LINK */}
        <div className="mt-4 text-center text-[11px] font-medium text-[#94A3B8]">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-bold text-[#F59E0B] hover:underline">
            Masuk di sini
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
