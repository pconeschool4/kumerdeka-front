import { ArrowRight, Sparkles } from "lucide-react";

export default function RecommendedQuiz() {
  return (
    <div className="rounded-2xl border border-[#E8EEF7] bg-white p-5 shadow-[0_4px_18px_rgba(36,74,120,0.04)] sm:p-6">

      <div className="flex items-start justify-between gap-4">

        <div>
          <h2 className="text-xl font-semibold text-[#172B4D]">
            Rekomendasi untukmu
          </h2>

          <p className="mt-1 text-sm text-[#8291A5]">
            Latihan yang disesuaikan dengan kebutuhanmu.
          </p>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEF6FF]">
          <Sparkles size={17} className="text-[#4285D4]" />
        </div>

      </div>

      <div className="mt-5 rounded-2xl bg-[#F5F9FE] p-5">

        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-[#4285D4]">
          AI · Targeted
        </span>

        <h3 className="mt-3 text-[17px] font-semibold text-[#172B4D]">
          Latihan tambahan: Persamaan Linear
        </h3>

        <p className="mt-2 text-sm leading-5 text-[#718096]">
          Latihan difokuskan pada area yang masih membutuhkan penguatan.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] text-[#718096]">
            10 soal
          </span>

          <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] text-[#718096]">
            Sedang
          </span>

          <span className="rounded-lg bg-white px-3 py-1.5 text-[11px] text-[#718096]">
            CP 3.2 / TP 3.2.1
          </span>
        </div>

        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#4285D4] py-3 text-sm font-semibold text-slate-900 dark:text-white transition hover:bg-[#3477C7]">
          Mulai
          <ArrowRight size={15} />
        </button>

      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#EEF2F7] pt-4">
        <div>
          <p className="text-sm font-medium text-[#52637A]">
            Review konsep
          </p>

          <p className="mt-1 text-xs text-[#8B9AB0]">
            5 menit · CP 3.4 / TP 3.4.2
          </p>
        </div>

        <span className="rounded-full bg-[#FFF7DE] px-2.5 py-1 text-[10px] font-medium text-[#B58719]">
          Penguatan
        </span>
      </div>

    </div>
  );
}