import { ArrowRight, Target } from "lucide-react";

export default function FocusCard() {
  return (
    <div className="rounded-2xl border border-[#E8EEF7] bg-white p-5 shadow-[0_4px_18px_rgba(36,74,120,0.04)]">

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#8291A5]">
            Fokus berikutnya
          </p>

          <h3 className="mt-2 text-[17px] font-semibold text-[#172B4D]">
            CP 3.2 · Persamaan Linear
          </h3>
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF8DD]">
          <Target size={17} className="text-[#D3A62D]" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-bold text-[#C49320]">
          75%
        </span>

        <span className="rounded-full bg-[#FFF7DB] px-2.5 py-1 text-[11px] font-medium text-[#B48719]">
          Perlu latihan
        </span>
      </div>

      <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#4285D4] transition hover:text-[#2568B8]">
        Mulai Latihan
        <ArrowRight size={14} />
      </button>

    </div>
  );
}