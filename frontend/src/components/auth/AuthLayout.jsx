import { useState } from "react";
import {
  Check,
  GraduationCap,
  Sparkles,
  Brain,
  Target,
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AuthLayout({ children, title, subtitle, showGoogle = true }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#0A1128]">

      {/* =========================================================
          GLOBAL BACKGROUND (Kurikulum Merdeka Navy & Gold Glows)
      ========================================================== */}
      
      {/* Deep Navy Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-[#0A1128] dark:via-[#102A43] dark:to-[#0A1128]" />

      {/* Primary Blue Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-[#1E3A8A]/40 blur-[120px]" />

      {/* Gold/Yellow Glow (Kurikulum Merdeka Accent) */}
      <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[550px] w-[550px] rounded-full bg-[#F59E0B]/15 blur-[120px]" />

      {/* Light Blue Glow */}
      <div className="pointer-events-none absolute bottom-[-100px] right-[10%] h-[400px] w-[400px] rounded-full bg-[#38BDF8]/10 blur-[110px]" />

      {/* =========================================================
          MAIN MACOS WINDOW
      ========================================================== */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-3 sm:p-6 lg:p-10">
        
        <div
          className="
            relative
            flex
            min-h-[550px]
            md:min-h-[680px]
            w-full
            max-w-[1200px]
            overflow-hidden
            rounded-[24px]
            border
            border-slate-200 dark:border-white/10
            bg-white/80 dark:bg-[#102A43]/40
            shadow-[0_35px_100px_rgba(0,0,0,0.5)]
            backdrop-blur-2xl
          "
        >

          {/* =====================================================
              GLOBAL CURVES (Subtle, elegant)
          ====================================================== */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -left-[280px] -top-[120px] h-[900px] w-[730px] rounded-[50%] border-[2px] border-slate-200 dark:border-white/5" />
            <div className="absolute -left-[200px] -top-[70px] h-[790px] w-[640px] rounded-[50%] border-[1px] border-slate-200 dark:border-white/5" />
            <div className="absolute -right-[480px] -top-[210px] h-[1100px] w-[760px] rotate-[7deg] rounded-[50%] border-[4px] border-[#F59E0B]/5" />
            <div className="absolute -right-[580px] bottom-[-410px] h-[800px] w-[930px] rotate-[8deg] rounded-[50%] border-[2px] border-[#38BDF8]/5" />
          </div>

          {/* =====================================================
              MACOS TOP BAR
          ====================================================== */}
          <div
            className="
              absolute
              left-0
              right-0
              top-0
              z-50
              flex
              h-10
              items-center
              border-b
              border-slate-200 dark:border-white/5
              bg-slate-100 dark:bg-white/5
              px-4
              backdrop-blur-md
            "
          >
            {/* Mac buttons */}
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e] shadow-sm" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89f24] shadow-sm" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29] shadow-sm" />
            </div>

            {/* Window title */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <span className="text-[11px] font-medium tracking-wider text-slate-400 dark:text-slate-900 dark:text-white/50">
                KURMERDEKA-TRACE
              </span>
            </div>
          </div>

          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}
          <div
            className="
              relative
              z-10
              hidden
              w-[52%]
              overflow-hidden
              pt-10
              lg:block
              border-r
              border-slate-200 dark:border-white/5
            "
          >
            <div className="relative flex h-full flex-col px-8 pb-10 pt-10 sm:px-12">
              
              {/* LOGO */}
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-slate-200 dark:border-white/10
                    bg-white/10
                    text-[#F59E0B]
                    shadow-lg
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:scale-110
                  "
                >
                  <GraduationCap size={23} />
                </div>
                <div>
                  <h1 className="text-[16px] font-extrabold tracking-widest text-slate-900 dark:text-white">
                    KURMERDEKA
                  </h1>
                  <p className="text-[11px] font-semibold tracking-[0.2em] text-[#38BDF8]">
                    TRACE
                  </p>
                </div>
              </div>

              {/* MAIN WELCOME */}
              <div className="my-auto max-w-[460px]">
                {/* Small Badge */}
                <div className="mb-5 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#F59E0B] shadow-sm backdrop-blur-md animate-pulse">
                    <Sparkles size={14} />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Adaptive Learning Platform
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-[48px] font-extrabold leading-[1.05] tracking-tight text-slate-900 dark:text-white xl:text-[56px] drop-shadow-md">
                  Selamat Datang
                  <br />
                  <span className="text-[#F59E0B]">
                    Kembali...
                  </span>
                </h2>

                {/* Description */}
                <p className="mt-6 max-w-[380px] text-sm leading-relaxed text-[#94A3B8]">
                  Belajar sesuai kemampuanmu.
                  <br />
                  Berkembang sesuai potensimu. Platform cerdas adaptif khusus Kurikulum Merdeka.
                </p>

                {/* Features */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-wide text-slate-900 dark:text-white shadow-sm backdrop-blur-md transition hover:bg-white/10">
                    <Check size={14} className="text-[#F59E0B]" />
                    Kurikulum Merdeka
                  </span>
                  <span className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-wide text-slate-900 dark:text-white shadow-sm backdrop-blur-md transition hover:bg-white/10">
                    <Brain size={14} className="text-[#F59E0B]" />
                    AI Adaptive
                  </span>
                </div>
              </div>

              {/* BOTTOM */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-medium tracking-wider text-[#64748B] uppercase">
                    Smart learning for everyone
                  </p>
                  <p className="mt-1 text-[9px] text-[#475569]">
                    © 2026 KURMERDEKA-TRACE
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Target */}
            <div className="absolute left-[58%] top-[30%] z-30 flex h-12 w-12 rotate-[-8deg] items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-[#38BDF8] shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:rotate-0">
              <Target size={22} />
            </div>
          </div>

          {/* =====================================================
              RIGHT LOGIN AREA
          ====================================================== */}
          <div
            className="
              relative
              z-20
              flex
              w-full
              items-center
              justify-center
              px-6
              pb-10
              pt-16
              sm:px-12
              lg:w-[48%]
              lg:px-16
            "
          >
            {/* Login-side glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#1E3A8A]/30 blur-[100px]" />

            <div className="relative z-30 w-full max-w-[390px]">
              
              {/* LOGIN HEADER */}
              <div className="mb-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white shadow-xl backdrop-blur-xl transition hover:scale-105">
                    <Lock size={20} />
                  </div>
                  <span className="rounded-full border border-[#22C55E]/20 bg-[#22C55E]/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#22C55E] backdrop-blur-md">
                    SECURE LOGIN
                  </span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-[#94A3B8]">
                  {subtitle}
                </p>
              </div>

              {/* GLASS LOGIN CARD */}
              <div className="relative overflow-hidden rounded-[24px] border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#0F172A]/60 p-6 shadow-2xl backdrop-blur-[30px] sm:p-8">
                {children}

                {/* GOOGLE OAUTH BUTTON */}
                {showGoogle && (
                  <>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="w-1/4 border-b border-slate-200 dark:border-white/10"></span>
                      <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                        Atau masuk dengan
                      </p>
                      <span className="w-1/4 border-b border-slate-200 dark:border-white/10"></span>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const { error } = await supabase.auth.signInWithOAuth({
                            provider: 'google',
                            options: {
                              redirectTo: `${window.location.origin}/login`
                            }
                          });
                          if (error) throw error;
                        } catch (err) {
                          console.error("Google Login Error:", err.message);
                          alert("Gagal login dengan Google. Silakan coba lagi.");
                        }
                      }}
                      className="
                        mt-5
                        flex
                        h-12
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-xl
                        border
                        border-slate-200 dark:border-white/10
                        bg-slate-100 dark:bg-white/5
                        text-sm
                        font-bold
                        text-slate-900 dark:text-white
                        shadow-sm
                        backdrop-blur-md
                        transition-all
                        hover:-translate-y-0.5
                        hover:bg-white/10
                        hover:border-white/20
                      "
                    >
                      <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google Logo"
                        className="h-5 w-5"
                      />
                      Lanjutkan dengan Google
                    </button>
                  </>
                )}
              </div>

              {/* FOOTER */}
              <div className="mt-8 text-center">
                <p className="text-[11px] font-medium tracking-wide text-[#94A3B8]">
                  Aman • Sederhana • Berbasis Kurikulum
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
                  <span className="text-[11px] font-medium text-[#94A3B8]">
                    Secure Learning Environment
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}