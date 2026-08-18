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
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username
          }
        }
      });

      if (error) throw error;
      
      // Jika butuh verifikasi email (OTP)
      if (data?.user && data?.user?.identities?.length === 0) {
        setErrorMsg("Email sudah terdaftar. Silakan login.");
      } else {
        // Berhasil daftar, arahkan ke Verify OTP
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
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white">Nama Lengkap</label>
          <div className="group relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Masukkan nama lengkap"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-[48px] w-full rounded-full border border-white/40 bg-[#A9E3F5]/65 pl-11 pr-4 text-sm font-medium text-[#31566D] outline-none backdrop-blur-md transition-all focus:bg-[#C0EDF8]/85 focus:border-white focus:ring-4 focus:ring-[#7DD3EC]/25"
            />
          </div>
        </div>

        {/* USERNAME */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white">Username</label>
          <div className="group relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Masukkan username unik"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-[48px] w-full rounded-full border border-white/40 bg-[#A9E3F5]/65 pl-11 pr-4 text-sm font-medium text-[#31566D] outline-none backdrop-blur-md transition-all focus:bg-[#C0EDF8]/85 focus:border-white focus:ring-4 focus:ring-[#7DD3EC]/25"
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white">Email</label>
          <div className="group relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              placeholder="Masukkan alamat email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[48px] w-full rounded-full border border-white/40 bg-[#A9E3F5]/65 pl-11 pr-4 text-sm font-medium text-[#31566D] outline-none backdrop-blur-md transition-all focus:bg-[#C0EDF8]/85 focus:border-white focus:ring-4 focus:ring-[#7DD3EC]/25"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white">Password</label>
            <div className="group relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-[48px] w-full rounded-full border border-white/40 bg-[#A9E3F5]/65 pl-11 pr-9 text-sm font-medium text-[#31566D] outline-none backdrop-blur-md transition-all focus:bg-[#C0EDF8]/85 focus:border-white focus:ring-4 focus:ring-[#7DD3EC]/25"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-white">Konfirmasi</label>
            <div className="group relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-[48px] w-full rounded-full border border-white/40 bg-[#A9E3F5]/65 pl-11 pr-9 text-sm font-medium text-[#31566D] outline-none backdrop-blur-md transition-all focus:bg-[#C0EDF8]/85 focus:border-white focus:ring-4 focus:ring-[#7DD3EC]/25"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45">
                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* REGISTER BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="group relative mt-3 h-12 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#743ce5] via-[#9848dc] to-[#e95ea9] text-sm font-extrabold tracking-wide text-white shadow-[0_12px_35px_rgba(135,66,220,0.4)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_18px_45px_rgba(220,82,190,0.45)] active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <span className="relative z-10">{loading ? 'MENDAFTAR...' : 'DAFTAR SEKARANG'}</span>
        </button>
        
        {/* LOGIN LINK */}
        <div className="mt-2 text-center text-[11px] font-medium text-white/80">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-bold text-white hover:underline">
            Masuk di sini
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
