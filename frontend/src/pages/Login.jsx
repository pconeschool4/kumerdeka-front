import { useState } from "react";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [role, setRole] = useState("Siswa");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Connect to backend database here
    console.log("Login attempt:", { role, username, password });

    // Menyimpan sesi login (sebelum ada integrasi Supabase)
    login({ role, username });

    // Redirect sesuai dengan role
    if (role === "Guru") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Hero / Illustration */}
      <div className="hidden w-1/2 flex-col bg-[#EDF6FF] px-12 py-12 lg:flex xl:px-24">
        <div className="mb-16">
          <h1 className="text-xl font-bold tracking-tight text-[#172B4D]">
            KURMERDEKA-TRACE
          </h1>
        </div>

        <div className="mb-12 max-w-lg">
          <h2 className="mb-6 text-[40px] font-bold leading-tight tracking-tight text-[#172B4D]">
            Belajar sesuai kemampuanmu.<br />
            Berkembang sesuai potensimu.
          </h2>
          <p className="text-lg text-[#52637A]">
            Platform latihan adaptif berbasis Kurikulum Merdeka.
          </p>
        </div>

        <div className="relative mt-8 max-w-sm rounded-3xl bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#86D3A5]">
            <Check className="text-white" size={24} strokeWidth={3} />
          </div>

          <h3 className="mb-3 text-xl font-bold text-[#172B4D]">
            Belajar adaptif
          </h3>
          <p className="mb-8 text-sm leading-relaxed text-[#718096]">
            Sistem menemukan bagian yang perlu kamu kuasai.
          </p>

          <div className="flex justify-center gap-3">
            <span className="rounded-full bg-[#EAF4FF] px-4 py-1.5 text-xs font-semibold text-[#4285D4]">CP</span>
            <span className="rounded-full bg-[#EEF8F1] px-4 py-1.5 text-xs font-semibold text-[#4B8B60]">TP</span>
            <span className="rounded-full bg-[#F3E8FF] px-4 py-1.5 text-xs font-semibold text-[#8B5CF6]">AI</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center px-6 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-[#F0F3F8] bg-white p-8 sm:p-12 sm:shadow-[0_8px_40px_rgb(0,0,0,0.04)] lg:border-none lg:shadow-none">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-[#172B4D]">
              Selamat datang 👋
            </h2>
            <p className="mt-3 text-[#718096]">
              Masuk untuk melanjutkan belajar.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">


            {/* Email / Username */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#52637A]">
                Email / Username
              </label>
              <input
                type="text"
                placeholder="Masukkan email atau username"
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-[15px] text-[#172B4D] placeholder:text-[#A0AEC0] focus:border-[#4285D4] focus:outline-none focus:ring-1 focus:ring-[#4285D4]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#52637A]">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-[15px] text-[#172B4D] placeholder:text-[#A0AEC0] focus:border-[#4285D4] focus:outline-none focus:ring-1 focus:ring-[#4285D4]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-start">
              <a href="#" className="text-sm font-semibold text-[#4285D4] hover:underline">
                Lupa password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[#4285D4] py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#3171BC]"
            >
              Masuk
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-[#8B9AB0]">
            Aman - Sederhana - Fokus pada perkembangan
          </p>
        </div>
      </div>
    </div>
  );
}
