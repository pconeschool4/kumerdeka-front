import { Lightbulb, ArrowRight, BookOpen } from "lucide-react";

export default function InterventionCard() {
  const recommendations = [
    {
      id: 1,
      student: "Budi Santoso",
      issue: "Kesulitan di Aljabar Linear (Sub-bab 2.1)",
      action: "Berikan latihan tambahan level dasar",
    },
    {
      id: 2,
      student: "Eko Prasetyo",
      issue: "Gagal 3x di kuis Trigonometri Dasar",
      action: "Tugaskan AI-generated quiz khusus Trigonometri",
    },
  ];

  return (
    <div className="rounded-2xl border border-[#E8EEF7] bg-white p-5 shadow-[0_4px_18px_rgba(36,74,120,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF4E5]">
            <Lightbulb size={20} className="text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#172B4D]">
              Rekomendasi Intervensi
            </h2>
            <p className="text-xs text-[#7B8CA3]">Siswa yang butuh bantuan ekstra</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="group cursor-pointer rounded-xl border border-[#F0F3F8] bg-[#FAFCFF] p-4 transition hover:border-[#DDEEFF] hover:bg-[#F5F8FC]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-semibold text-[#172B4D]">{rec.student}</p>
                <p className="mt-1 text-[13px] text-[#718096]">{rec.issue}</p>
              </div>
              <ArrowRight size={16} className="text-[#A0AEC0] transition group-hover:text-[#4285D4]" />
            </div>
            
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#EAF4FF] px-3 py-2">
              <BookOpen size={14} className="text-[#4285D4]" />
              <span className="text-xs font-medium text-[#4285D4]">{rec.action}</span>
            </div>
          </div>
        ))}
        
        {recommendations.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#E2E8F0] p-6 text-center">
            <p className="text-sm text-[#718096]">Semua siswa dalam performa yang baik!</p>
          </div>
        )}
      </div>

      <button className="mt-4 w-full rounded-xl bg-white border border-[#E2E8F0] py-2.5 text-[13px] font-medium text-[#4A5568] transition hover:bg-[#F7FAFF]">
        Lihat Semua Rekomendasi
      </button>
    </div>
  );
}
