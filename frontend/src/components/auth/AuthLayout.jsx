import { useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Lock,
  User,
  GraduationCap,
  Sparkles,
  Brain,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";

export default function AuthLayout({ children, title, subtitle, showGoogle = true }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#d9ecff]">

      {/* =========================================================
          GLOBAL BACKGROUND
      ========================================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#aee8ff] via-[#cbdcff] to-[#ebc9f5]" />

      {/* Blue Glow */}
      <div className="pointer-events-none absolute -left-32 top-20 h-[500px] w-[500px] rounded-full bg-[#24a8ed]/25 blur-[120px]" />

      {/* Purple Glow */}
      <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-[550px] w-[550px] rounded-full bg-[#8d4cff]/25 blur-[120px]" />

      {/* Pink Glow */}
      <div className="pointer-events-none absolute bottom-[-100px] right-[10%] h-[400px] w-[400px] rounded-full bg-[#f45da9]/20 blur-[110px]" />

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
            rounded-[30px]
            border
            border-white/60
            bg-gradient-to-br
            from-[#aee7ff]
            via-[#c9d9ff]
            to-[#e8caf5]
            shadow-[0_35px_100px_rgba(30,65,110,0.25)]
          "
        >

          {/* =====================================================
              GLOBAL CURVES
              Menyatu di seluruh background
          ====================================================== */}

          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">

            {/* White curves kiri */}
            <div
              className="
                absolute
                -left-[280px]
                -top-[120px]
                h-[900px]
                w-[730px]
                rounded-[50%]
                border-[18px]
                border-white/30
              "
            />

            <div
              className="
                absolute
                -left-[200px]
                -top-[70px]
                h-[790px]
                w-[640px]
                rounded-[50%]
                border-[8px]
                border-white/25
              "
            />

            {/* Purple curve */}
            <div
              className="
                absolute
                -right-[480px]
                -top-[210px]
                h-[1100px]
                w-[760px]
                rotate-[7deg]
                rounded-[50%]
                border-[25px]
                border-[#7146dc]/55
              "
            />

            {/* Pink curve */}
            <div
              className="
                absolute
                -right-[520px]
                -top-[200px]
                h-[1100px]
                w-[780px]
                rotate-[7deg]
                rounded-[50%]
                border-[20px]
                border-[#ef65aa]/60
              "
            />

            {/* Orange curve */}
            <div
              className="
                absolute
                -right-[560px]
                bottom-[-390px]
                h-[780px]
                w-[920px]
                rotate-[8deg]
                rounded-[50%]
                border-[18px]
                border-[#ff7958]/80
              "
            />

            {/* Cyan curve */}
            <div
              className="
                absolute
                -right-[580px]
                bottom-[-410px]
                h-[800px]
                w-[930px]
                rotate-[8deg]
                rounded-[50%]
                border-[11px]
                border-[#29c8e9]/80
              "
            />

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
              h-11
              items-center
              border-b
              border-white/30
              bg-white/20
              px-5
              backdrop-blur-xl
            "
          >

            {/* Mac buttons */}
            <div className="flex items-center gap-2">

              <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-sm" />

              <span className="h-3 w-3 rounded-full bg-[#febc2e] shadow-sm" />

              <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-sm" />

            </div>

            {/* Window title */}
            <div className="absolute left-1/2 -translate-x-1/2">

              <span className="text-[10px] font-semibold tracking-wide text-[#41617c]/70">
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
              pt-11
              lg:block
            "
          >

            <div className="relative flex h-full flex-col px-8 pb-10 pt-10 sm:px-12">

              {/* =================================================
                  LOGO
              ================================================== */}

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
                    border-white/50
                    bg-white/60
                    text-[#1765a8]
                    shadow-[0_8px_25px_rgba(20,100,170,0.15)]
                    backdrop-blur-md
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:rotate-2
                  "
                >
                  <GraduationCap size={23} />
                </div>

                <div>

                  <h1 className="text-[15px] font-extrabold tracking-tight text-[#12639b]">
                    KURMERDEKA
                  </h1>

                  <p className="text-[11px] font-semibold tracking-wide text-[#193b58]">
                    TRACE
                  </p>

                </div>

              </div>

              {/* =================================================
                  MAIN WELCOME
              ================================================== */}

              <div className="my-auto max-w-[460px]">

                {/* Small Badge */}
                <div className="mb-5 flex items-center gap-2">

                  <span
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/50
                      bg-white/50
                      text-[#7850d7]
                      shadow-sm
                      backdrop-blur-md
                      animate-pulse
                    "
                  >
                    <Sparkles size={14} />
                  </span>

                  <span className="text-xs font-semibold text-[#37617e]">
                    Adaptive Learning Platform
                  </span>

                </div>

                {/* Heading */}
                <h2
                  className="
                    text-[48px]
                    font-extrabold
                    leading-[0.98]
                    tracking-[-2px]
                    text-[#124b78]
                    drop-shadow-[0_4px_12px_rgba(20,70,110,0.08)]
                    xl:text-[60px]
                  "
                >
                  Selamat Datang
                  <br />

                  <span
                    className="
                      bg-gradient-to-r
                      from-[#124b78]
                      via-[#2458a0]
                      to-[#713fc4]
                      bg-clip-text
                      text-transparent
                    "
                  >
                    Kembali...
                  </span>

                </h2>

                {/* Description */}
                <p className="mt-6 max-w-[380px] text-sm leading-6 text-[#3d6580]">
                  Belajar sesuai kemampuanmu.
                  <br />
                  Berkembang sesuai potensimu.
                </p>

                {/* Features */}
                <div className="mt-7 flex flex-wrap gap-2">

                  <span
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-white/50
                      bg-white/40
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      text-[#386481]
                      shadow-sm
                      backdrop-blur-md
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:bg-white/60
                    "
                  >
                    <Check size={12} />
                    Kurikulum Merdeka
                  </span>

                  <span
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-white/50
                      bg-white/40
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      text-[#386481]
                      shadow-sm
                      backdrop-blur-md
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:bg-white/60
                    "
                  >
                    <Brain size={12} />
                    AI Adaptive
                  </span>

                </div>

              </div>

              {/* =================================================
                  BOTTOM
              ================================================== */}

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-[10px] font-semibold text-[#52718a]">
                    Smart learning for everyone
                  </p>

                  <p className="mt-1 text-[9px] text-[#6e8799]">
                    © 2026 KURMERDEKA-TRACE
                  </p>

                </div>
              </div>

            </div>


            {/* Floating Target */}
            <div
              className="
                absolute
                left-[58%]
                top-[30%]
                z-30
                flex
                h-12
                w-12
                rotate-[-8deg]
                items-center
                justify-center
                rounded-2xl
                border
                border-white/50
                bg-white/30
                text-white
                shadow-xl
                backdrop-blur-md
                transition-all
                duration-300
                hover:scale-110
                hover:rotate-0
              "
            >
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
            <div
              className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-80
                w-80
                rounded-full
                bg-[#ff70b8]/20
                blur-[100px]
              "
            />

            <div className="relative z-30 w-full max-w-[390px]">

              {/* =================================================
                  LOGIN HEADER
              ================================================== */}

              <div className="mb-7">

                <div className="mb-5 flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-white/30
                      bg-white/20
                      text-white
                      shadow-lg
                      backdrop-blur-xl
                      transition
                      duration-300
                      hover:scale-105
                    "
                  >
                    <Lock size={19} />
                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                      px-3
                      py-1.5
                      text-[9px]
                      font-semibold
                      text-white/70
                      backdrop-blur-md
                    "
                  >
                    SECURE LOGIN
                  </span>

                </div>

                <h2 className="text-3xl font-bold tracking-tight text-white">
                  {title}
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/60">
                  {subtitle}
                </p>

              </div>

              {/* =================================================
                  GLASS LOGIN CARD
              ================================================== */}

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-white/30
                  bg-white/[0.14]
                  p-5
                  shadow-[0_25px_70px_rgba(45,35,100,0.22)]
                  backdrop-blur-[25px]
                  sm:p-7
                "
              >

                {/* Glass highlights */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-white/10
                    blur-3xl
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-20
                    -left-20
                    h-40
                    w-40
                    rounded-full
                    bg-[#b86cff]/10
                    blur-3xl
                  "
                />
                {children}

                {/* =================================================
                    GOOGLE OAUTH BUTTON
                ================================================== */}
                {showGoogle && (
                  <>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="w-1/5 border-b border-white/20 lg:w-1/4"></span>
                      <p className="text-center text-[10px] font-semibold uppercase text-white/70">
                        Atau masuk dengan
                      </p>
                      <span className="w-1/5 border-b border-white/20 lg:w-1/4"></span>
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
                        mt-4
                        flex
                        h-12
                        w-full
                        items-center
                        justify-center
                        gap-3
                        rounded-full
                        border
                        border-white/40
                        bg-white/20
                        text-sm
                        font-bold
                        text-white
                        shadow-sm
                        backdrop-blur-md
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:bg-white/30
                        hover:shadow-md
                      "
                    >
                      <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google Logo"
                        className="h-5 w-5"
                      />
                      Google
                    </button>
                  </>
                )}
              </div>

              {/* Removed temporary dev mode switcher */}

              {/* =================================================
                  FOOTER
              ================================================== */}

              <div className="mt-6 text-center">

                <p className="text-[12px] font-semibold text-white">
                  Aman • Sederhana • Fokus pada perkembangan
                </p>

                <div className="mt-3 flex items-center justify-center gap-2">

                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-[#a6f03d]
                      shadow-[0_0_10px_rgba(166,240,61,0.8)]
                      animate-pulse
                    "
                  />

                  <span className="text-[12px] font-medium text-white">
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