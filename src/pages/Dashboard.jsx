import {
  Sparkles,
  Flame,
  TrendingUp,
  Target,
  Brain,
  BookOpen,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import StudentLayout from "../layouts/StudentLayout";

export default function Dashboard() {
  return (
    <StudentLayout>
      {/* =========================================================
          DASHBOARD BACKGROUND
      ========================================================== */}

      <div className="relative min-h-screen overflow-hidden bg-[#EDF9FC]">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-[#DDF5FA] via-[#F5FBFD] to-[#F1EEFA]" />

          {/* Blue glow */}
          <div
            className="
              absolute
              -left-40
              -top-40
              h-[520px]
              w-[520px]
              rounded-full
              bg-[#82D9EB]/25
              blur-[130px]
            "
          />

          {/* Purple glow */}
          <div
            className="
              absolute
              -right-40
              -top-32
              h-[520px]
              w-[520px]
              rounded-full
              bg-[#B3A0E8]/15
              blur-[130px]
            "
          />

          {/* Bottom glow */}
          <div
            className="
              absolute
              bottom-[-250px]
              left-[35%]
              h-[500px]
              w-[500px]
              rounded-full
              bg-white/70
              blur-[130px]
            "
          />

        </div>

        {/* =========================================================
            MAIN CONTENT
        ========================================================== */}

        <main className="relative z-10 mx-auto w-full max-w-[1450px] px-5 py-6 sm:px-7 lg:px-10">

          {/* =====================================================
              HEADER
          ====================================================== */}

          <header className="mb-8">

            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

              {/* Greeting */}

              <div>

                <div
                  className="
                    mb-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/80
                    bg-white/55
                    px-3.5
                    py-2
                    shadow-[0_8px_25px_rgba(67,145,170,0.08)]
                    backdrop-blur-xl
                  "
                >
                  <Sparkles
                    size={14}
                    strokeWidth={2.5}
                    className="text-[#4AAFC8]"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#527F90]">
                    Dashboard Belajar
                  </span>
                </div>

                <h1
                  className="
                    text-[30px]
                    font-extrabold
                    leading-tight
                    tracking-[-1.2px]
                    text-[#174A66]
                    sm:text-[36px]
                  "
                >
                  Hai, Naya! 👋
                </h1>

                <p className="mt-2 text-sm text-[#728C9B]">
                  Yuk lanjutkan progres belajarmu hari ini.
                </p>

              </div>

              {/* Streak */}

              <div
                className="
                  group
                  flex
                  w-fit
                  items-center
                  gap-3
                  rounded-[20px]
                  border
                  border-white/80
                  bg-white/55
                  px-4
                  py-3
                  shadow-[0_10px_30px_rgba(65,130,150,0.09)]
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-white/75
                  hover:shadow-[0_15px_35px_rgba(65,130,150,0.13)]
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-[#FFF1C7]
                    shadow-sm
                  "
                >
                  <Flame
                    size={19}
                    className="text-[#E2A51D]"
                    fill="currentColor"
                  />
                </div>

                <div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#A3883B]">
                    Learning Streak
                  </p>

                  <p className="mt-0.5 text-sm font-bold text-[#80691F]">
                    7 hari berturut-turut
                  </p>

                </div>

              </div>

            </div>

          </header>

          {/* =====================================================
              STAT CARDS
          ====================================================== */}

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {/* =================================================
                MASTERY CARD
            ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-white/80
                bg-white/55
                p-6
                shadow-[0_12px_35px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white/70
                hover:shadow-[0_18px_45px_rgba(63,130,155,0.13)]
              "
            >

              {/* Glow */}

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-36
                  w-36
                  rounded-full
                  bg-[#82D8EA]/20
                  blur-3xl
                  transition-transform
                  duration-500
                  group-hover:scale-125
                "
              />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[14px]
                      border
                      border-[#C7EDF4]
                      bg-[#E8F9FC]
                      text-[#45A9C1]
                    "
                  >
                    <TrendingUp size={20} />
                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-[#C9ECD9]
                      bg-[#ECF9F1]
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-[#4C9769]
                    "
                  >
                    +6%
                  </span>

                </div>

                <p className="mt-6 text-xs font-semibold text-[#78919F]">
                  Mastery keseluruhan
                </p>

                <div className="mt-1 flex items-end gap-2">

                  <h2 className="text-[38px] font-extrabold tracking-[-1px] text-[#174A66]">
                    78%
                  </h2>

                  <span className="mb-1 text-xs text-[#8398A3]">
                    minggu ini
                  </span>

                </div>

                {/* Progress */}

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#DFF2F6]">

                  <div
                    className="
                      h-full
                      w-[78%]
                      rounded-full
                      bg-gradient-to-r
                      from-[#78D5E8]
                      to-[#52B8D2]
                      transition-all
                      duration-700
                      group-hover:w-[82%]
                    "
                  />

                </div>

                <p className="mt-3 text-xs text-[#7B929E]">
                  Naik 6% dari minggu lalu
                </p>

              </div>

            </div>

            {/* =================================================
                QUIZ CARD
            ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-white/80
                bg-white/55
                p-6
                shadow-[0_12px_35px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white/70
                hover:shadow-[0_18px_45px_rgba(63,130,155,0.13)]
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-36
                  w-36
                  rounded-full
                  bg-[#A998E5]/15
                  blur-3xl
                  transition-transform
                  duration-500
                  group-hover:scale-125
                "
              />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[14px]
                      border
                      border-[#DDD5F6]
                      bg-[#F1EDFF]
                      text-[#7E68C6]
                    "
                  >
                    <BookOpen size={20} />
                  </div>

                  <span className="text-[10px] font-semibold text-[#8599A5]">
                    Minggu ini
                  </span>

                </div>

                <p className="mt-6 text-xs font-semibold text-[#78919F]">
                  Aktivitas quiz
                </p>

                <div className="mt-1 flex items-end gap-2">

                  <h2 className="text-[38px] font-extrabold tracking-[-1px] text-[#174A66]">
                    12
                  </h2>

                  <span className="mb-1 text-xs text-[#8398A3]">
                    quiz selesai
                  </span>

                </div>

                <div className="mt-5 flex items-center gap-2">

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#EEEAF9]">

                    <div
                      className="
                        h-full
                        w-[84%]
                        rounded-full
                        bg-gradient-to-r
                        from-[#A596E4]
                        to-[#806ACD]
                      "
                    />

                  </div>

                  <span className="text-[11px] font-bold text-[#7660BC]">
                    84%
                  </span>

                </div>

                <p className="mt-3 text-xs text-[#7B929E]">
                  Rata-rata nilai quiz
                </p>

              </div>

            </div>

            {/* =================================================
                FOCUS CARD
            ================================================== */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[26px]
                border
                border-white/80
                bg-white/55
                p-6
                shadow-[0_12px_35px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white/70
                hover:shadow-[0_18px_45px_rgba(63,130,155,0.13)]
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-12
                  -top-12
                  h-36
                  w-36
                  rounded-full
                  bg-[#74D7EA]/20
                  blur-3xl
                  transition-transform
                  duration-500
                  group-hover:scale-125
                "
              />

              <div className="relative">

                <div className="flex items-center justify-between">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-[14px]
                      border
                      border-[#C7EDF4]
                      bg-[#E8F9FC]
                      text-[#43AFC8]
                    "
                  >
                    <Target size={20} />
                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-[#C6EAF2]
                      bg-[#E8F9FC]
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-[#478CA1]
                    "
                  >
                    Fokus
                  </span>

                </div>

                <p className="mt-6 text-xs font-semibold text-[#78919F]">
                  Area yang perlu diperkuat
                </p>

                <h2 className="mt-2 text-[19px] font-extrabold text-[#174A66]">
                  Pemahaman Konsep
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#7B929E]">
                  Sistem menemukan materi yang masih perlu
                  kamu latih.
                </p>

                <button
                  type="button"
                  className="
                    group/btn
                    mt-5
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-xl
                    border
                    border-[#BDE5EE]
                    bg-[#ECFAFC]
                    px-3
                    py-2
                    text-[11px]
                    font-bold
                    text-[#4394AA]
                    transition-all
                    duration-300
                    hover:border-[#8BD2E1]
                    hover:bg-[#DFF6FA]
                  "
                >
                  Mulai latihan

                  <ArrowUpRight
                    size={13}
                    className="transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  />
                </button>

              </div>

            </div>

          </section>

          {/* =====================================================
              MASTERY HEADER
          ====================================================== */}

          <section className="mt-9">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-[14px]
                    border
                    border-white/80
                    bg-white/55
                    text-[#43A9C3]
                    shadow-sm
                    backdrop-blur-xl
                  "
                >
                  <Brain size={19} />
                </div>

                <div>

                  <h2 className="text-[19px] font-extrabold tracking-tight text-[#174A66]">
                    Peta mastery CP / TP
                  </h2>

                  <p className="mt-0.5 text-xs text-[#7C929F]">
                    Pantau perkembangan kemampuanmu
                  </p>

                </div>

              </div>

              <button
                type="button"
                className="
                  hidden
                  items-center
                  gap-1
                  rounded-xl
                  border
                  border-white/80
                  bg-white/50
                  px-3
                  py-2
                  text-[11px]
                  font-bold
                  text-[#518498]
                  shadow-sm
                  backdrop-blur-xl
                  transition-all
                  hover:bg-white/75
                  sm:flex
                "
              >
                Lihat detail
                <ChevronRight size={13} />
              </button>

            </div>

            {/* =================================================
                MASTERY PANEL
            ================================================== */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-white/80
                bg-white/50
                p-5
                shadow-[0_15px_40px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                sm:p-6
              "
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-16
                  -top-16
                  h-44
                  w-44
                  rounded-full
                  bg-[#80D8EA]/15
                  blur-3xl
                "
              />

              <div className="relative">

                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <h3 className="text-sm font-bold text-[#285E76]">
                      Perkembangan kompetensi
                    </h3>

                    <p className="mt-1 text-xs text-[#7E939F]">
                      Area belajar berdasarkan tingkat penguasaan.
                    </p>

                  </div>

                  <div
                    className="
                      flex
                      w-fit
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-[#C6EAF2]
                      bg-[#EAF9FC]
                      px-3
                      py-1.5
                      text-[10px]
                      font-bold
                      text-[#478DA2]
                    "
                  >
                    <Sparkles size={12} />
                    Adaptive Learning
                  </div>

                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                  {/* CP 3.1 */}

                  <div
                    className="
                      group/item
                      rounded-[18px]
                      border
                      border-white/80
                      bg-white/45
                      p-4
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-white/70
                    "
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-bold text-[#557D8D]">
                        CP 3.1
                      </span>

                      <span className="text-xs font-extrabold text-[#4C9A6A]">
                        90%
                      </span>

                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E6F3EC]">

                      <div className="h-full w-[90%] rounded-full bg-[#73CFA0]" />

                    </div>

                    <div className="mt-2 flex items-center gap-1.5">

                      <CheckCircle2
                        size={12}
                        className="text-[#55A574]"
                      />

                      <p className="text-[10px] font-semibold text-[#57946E]">
                        Mastered
                      </p>

                    </div>

                  </div>

                  {/* CP 3.2 */}

                  <div
                    className="
                      group/item
                      rounded-[18px]
                      border
                      border-white/80
                      bg-white/45
                      p-4
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-white/70
                    "
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-bold text-[#557D8D]">
                        CP 3.2
                      </span>

                      <span className="text-xs font-extrabold text-[#C49634]">
                        72%
                      </span>

                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F8F0D9]">

                      <div className="h-full w-[72%] rounded-full bg-[#EAC363]" />

                    </div>

                    <p className="mt-2 text-[10px] font-semibold text-[#AA8838]">
                      Perlu latihan
                    </p>

                  </div>

                  {/* CP 3.3 */}

                  <div
                    className="
                      group/item
                      rounded-[18px]
                      border
                      border-white/80
                      bg-white/45
                      p-4
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-white/70
                    "
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-bold text-[#557D8D]">
                        CP 3.3
                      </span>

                      <span className="text-xs font-extrabold text-[#CC7180]">
                        54%
                      </span>

                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F9E8EC]">

                      <div className="h-full w-[54%] rounded-full bg-[#E58A99]" />

                    </div>

                    <p className="mt-2 text-[10px] font-semibold text-[#C36D7C]">
                      Prioritas belajar
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =====================================================
              BOTTOM CARDS
          ====================================================== */}

          <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* MASTERY MAP */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-white/80
                bg-white/50
                p-5
                shadow-[0_15px_40px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white/65
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-[14px]
                    bg-[#E8F9FC]
                    text-[#45A9C2]
                  "
                >
                  <TrendingUp size={18} />
                </div>

                <div>

                  <h3 className="text-sm font-extrabold text-[#174A66]">
                    Mastery Map
                  </h3>

                  <p className="text-[10px] text-[#8195A1]">
                    Visualisasi perkembangan belajar
                  </p>

                </div>

              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">

                <div
                  className="
                    rounded-[17px]
                    border
                    border-[#D3EEE2]
                    bg-[#F0FAF5]
                    p-4
                    text-center
                    transition-all
                    hover:-translate-y-0.5
                  "
                >
                  <p className="text-2xl font-extrabold text-[#4B9B70]">
                    8
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#729383]">
                    Mastered
                  </p>
                </div>

                <div
                  className="
                    rounded-[17px]
                    border
                    border-[#F0E5BF]
                    bg-[#FFFAEA]
                    p-4
                    text-center
                    transition-all
                    hover:-translate-y-0.5
                  "
                >
                  <p className="text-2xl font-extrabold text-[#C39A3A]">
                    4
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#9C8956]">
                    Progress
                  </p>
                </div>

                <div
                  className="
                    rounded-[17px]
                    border
                    border-[#F1DCE1]
                    bg-[#FFF3F5]
                    p-4
                    text-center
                    transition-all
                    hover:-translate-y-0.5
                  "
                >
                  <p className="text-2xl font-extrabold text-[#C96F7E]">
                    2
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#A18188]">
                    Fokus
                  </p>
                </div>

              </div>

            </div>

            {/* RECOMMENDED QUIZ */}

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[28px]
                border
                border-white/80
                bg-white/50
                p-5
                shadow-[0_15px_40px_rgba(63,130,155,0.08)]
                backdrop-blur-2xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white/65
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-[14px]
                      bg-[#F0ECFF]
                      text-[#8066CC]
                    "
                  >
                    <Sparkles size={18} />
                  </div>

                  <div>

                    <h3 className="text-sm font-extrabold text-[#174A66]">
                      Rekomendasi Quiz
                    </h3>

                    <p className="text-[10px] text-[#8195A1]">
                      Latihan yang sesuai denganmu
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  className="
                    rounded-xl
                    p-2
                    text-[#78929F]
                    transition
                    hover:bg-white/70
                    hover:text-[#4B8195]
                  "
                >
                  <ArrowUpRight size={16} />
                </button>

              </div>

              <div
                className="
                  mt-5
                  rounded-[19px]
                  border
                  border-white/80
                  bg-white/45
                  p-4
                  transition-all
                  duration-300
                  hover:bg-white/65
                "
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#8A9BA5]">
                      Prioritas
                    </p>

                    <h4 className="mt-1 text-sm font-bold text-[#285E76]">
                      Pemahaman Konsep
                    </h4>

                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-[#F1D8DE]
                      bg-[#FFF0F3]
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-[#C36D7C]
                    "
                  >
                    54%
                  </span>

                </div>

                <p className="mt-2 text-xs leading-5 text-[#7C929E]">
                  Latihan dipilih berdasarkan area yang masih
                  perlu kamu kuasai.
                </p>

                <button
                  type="button"
                  className="
                    mt-4
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[13px]
                    bg-[#72CFE4]
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    shadow-[0_8px_20px_rgba(77,177,203,0.20)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#5DC4DB]
                    hover:shadow-[0_12px_25px_rgba(77,177,203,0.28)]
                  "
                >
                  Mulai Quiz
                  <ArrowUpRight size={14} />
                </button>

              </div>

            </div>

          </section>

          <div className="h-10" />

        </main>

      </div>
    </StudentLayout>
  );
}