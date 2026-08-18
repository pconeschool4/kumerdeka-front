import { useState, useEffect } from "react";
import { Key } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import { supabase } from "../lib/supabaseClient";

export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (error) throw error;
      
      setSuccessMsg("Verifikasi berhasil! Mengarahkan ke dashboard...");
      
      // Setelah ini onAuthStateChange di AuthContext akan ter-trigger
    } catch (error) {
      console.error("Verify error:", error.message);
      setErrorMsg("Kode tidak valid atau sudah kadaluarsa. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setSuccessMsg("Mengirim ulang kode...");
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      setSuccessMsg("Kode verifikasi baru telah dikirim ke email Anda.");
    } catch (error) {
      setErrorMsg("Gagal mengirim ulang kode. Tunggu beberapa saat.");
    }
  };

  return (
    <AuthLayout 
      title="Verifikasi Email" 
      subtitle={`Masukkan 6-digit kode yang dikirim ke ${email}`}
      showGoogle={false}
    >
      <form onSubmit={handleVerify} className="relative z-10 flex flex-col gap-4">
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

        {/* OTP INPUT */}
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white text-center">
            KODE OTP (6 DIGIT)
          </label>
          <div className="group relative">
            <Key size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="0 0 0 0 0 0"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
              className="h-[64px] w-full rounded-full border border-white/40 bg-[#A9E3F5]/65 text-center text-2xl font-bold tracking-[0.5em] text-[#31566D] outline-none backdrop-blur-md transition-all focus:bg-[#C0EDF8]/85 focus:border-white focus:ring-4 focus:ring-[#7DD3EC]/25"
            />
          </div>
        </div>

        {/* VERIFY BUTTON */}
        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="group relative mt-2 h-12 w-full overflow-hidden rounded-full bg-gradient-to-r from-[#4285D4] via-[#5C9CE6] to-[#743ce5] text-sm font-extrabold tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <span className="relative z-10">{loading ? 'MEMVERIFIKASI...' : 'VERIFIKASI'}</span>
        </button>
        
        {/* RESEND LINK */}
        <div className="mt-4 text-center flex flex-col gap-2">
          <button type="button" onClick={handleResend} className="text-[11px] font-bold text-white hover:underline">
            Kirim ulang kode OTP
          </button>
          
          <Link to="/login" className="text-[10px] font-medium text-white/70 hover:text-white">
            Kembali ke Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
