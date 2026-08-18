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

export default function Login() {
  const [role, setRole] = useState("Siswa");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // ==============================
  // LOGIN FUNCTION
  // ==============================
  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Login attempt:", {
      role,
      username,
      password,
    });

    if (role === "Guru") {
      navigate("/teacher");
    } else {
      navigate("/student");
    }
  };

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
            min-h-[680px]
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
                  Sign in to continue
                </h2>

                <p className="mt-2 text-xs leading-5 text-white/60">
                  Masuk untuk melanjutkan perjalanan
                  belajarmu.
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

                <form
                  onSubmit={handleLogin}
                  className="relative z-10 flex flex-col gap-4"
                >

                

                  {/* =================================================
                      USERNAME
                  ================================================== */}

                  

                   <div>
                      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-white">
                        Username
                      </label>

                      <div className="group relative">
                        <User
                          size={17}
                          className="
                            absolute
                            left-5
                            top-1/2
                            -translate-y-1/2
                            text-slite-600
                            duration-300
                            group-focus-within:text-slite
                          "
                        />

                        <input
                          type="text"
                          placeholder="Masukkan username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          className="
                          h-[54px]
                          w-full
                          rounded-full
                          border
                          border-white/40
                          bg-[#A9E3F5]/65
                          pl-12
                          pr-5
                          text-sm
                          font-medium
                          text-[#31566D]
                          outline-none
                          shadow-[inset_0_2px_8px_rgba(255,255,255,0.45),0_8px_25px_rgba(48,120,150,0.12)]
                          backdrop-blur-md
                          transition-all
                          duration-300
                          placeholder:text-[#63879A]
                          hover:bg-[#B6EAF7]/75
                          hover:border-white/60
                          focus:bg-[#C0EDF8]/85
                          focus:border-white
                          focus:ring-4
                          focus:ring-[#7DD3EC]/25
                          "
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

                      <Lock
                        size={16}
                        className="
                          absolute
                          left-4
                          top-1/2
                          -translate-y-1/2
                          text-slate-600
                          group-focus-within:text-blue-600
                        "
                      />

                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        required
                        className="
                          h-[54px]
                          w-full
                          rounded-full
                          border
                          border-white/40
                          bg-[#A9E3F5]/65
                          pl-12
                          pr-5
                          text-sm
                          font-medium
                          text-[#31566D]
                          outline-none
                          shadow-[inset_0_2px_8px_rgba(255,255,255,0.45),0_8px_25px_rgba(48,120,150,0.12)]
                          backdrop-blur-md
                          transition-all
                          duration-300
                          placeholder:text-[#63879A]
                          hover:bg-[#B6EAF7]/75
                          hover:border-white/60
                          focus:bg-[#C0EDF8]/85
                          focus:border-white
                          focus:ring-4
                          focus:ring-[#7DD3EC]/25
                          "
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-white/45
                          transition-all
                          duration-200
                          hover:scale-110
                          hover:text-white
                        "
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>

                    </div>

                  </div>

                  {/* =================================================
                      REMEMBER / FORGOT
                  ================================================== */}

                  <div className="flex items-center justify-between">

                    <label className="flex cursor-pointer items-center gap-2">

                      <input
                        type="checkbox"
                        className="
                          h-3.5
                          w-3.5
                          cursor-pointer
                          rounded
                          border-white/20
                          bg-white/10
                          accent-[#a6f03d]
                        "
                      />

                      <span className="text-[10px] font-medium text-white">
                        Remember Me
                      </span>

                    </label>

                    <a
                      href="#"
                      className="
                        text-[10px]
                        font-semibold
                        text-white
                        hover:text-white
                        hover:underline
                      "
                    >
                      Forgot password?
                    </a>

                  </div>

                  {/* =================================================
                      LOGIN BUTTON
                  ================================================== */}

                  <button
                    type="submit"
                    className="
                      group
                      relative
                      mt-1
                      h-12
                      w-full
                      overflow-hidden
                      rounded-full
                      bg-gradient-to-r
                      from-[#743ce5]
                      via-[#9848dc]
                      to-[#e95ea9]
                      text-sm
                      font-extrabold
                      tracking-wide
                      text-white
                      shadow-[0_12px_35px_rgba(135,66,220,0.4)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:scale-[1.01]
                      hover:shadow-[0_18px_45px_rgba(220,82,190,0.45)]
                      active:translate-y-0
                      active:scale-[0.99]
                    "
                  >

                    {/* Shine Effect */}
                    <span
                      className="
                        absolute
                        inset-0
                        -translate-x-full
                        bg-gradient-to-r
                        from-transparent
                        via-white/30
                        to-transparent
                        transition-transform
                        duration-700
                        group-hover:translate-x-full
                      "
                    />

                    <span className="relative z-10">
                      LOGIN
                    </span>

                  </button>

                </form>

              </div>

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