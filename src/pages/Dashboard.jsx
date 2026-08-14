import StudentLayout from "../layouts/StudentLayout";
import StatCard from "../components/dashboard/StateCard";
import ProgressCard from "../components/dashboard/ProgresCard";
import FocusCard from "../components/dashboard/FocusCard";
import MasteryMap from "../components/dashboard/MasteryMap";
import RecommendedQuiz from "../components/dashboard/RecommendQuiz";

export default function Dashboard() {
  return (
    <StudentLayout>

      {/* Welcome */}
      <section className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-[#7B8CA3]">
            Dashboard Belajar
          </p>

          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-[#172B4D]">
            Hai, Naya! 👋
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-[#718096]">
            Yuk lanjutkan progres belajarmu hari ini.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-[#F3E8C8] bg-[#FFF9E8] px-4 py-2.5">
          <span className="text-base">🔥</span>

          <span className="text-sm font-semibold text-[#9A751A]">
            7 hari berturut-turut
          </span>
        </div>
      </section>

      {/* Main Stats */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        <StatCard
          title="Mastery keseluruhan"
          value="78%"
          description="+6% dari minggu lalu"
          type="mastery"
        />

        <StatCard
          title="Aktivitas quiz"
          value="12"
          description="quiz selesai minggu ini"
          extra="Rata-rata 84%"
          type="quiz"
        />

        <FocusCard />

      </section>

      {/* Mastery */}
      <section className="mt-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-[#172B4D]">
            Peta mastery CP / TP
          </h2>

          <p className="mt-1 text-sm text-[#7B8CA3]">
            Tidak harus urut — sistem menampilkan area yang paling membutuhkan
            perhatian.
          </p>
        </div>

        <ProgressCard />
      </section>

      {/* Bottom */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">

        <MasteryMap />

        <RecommendedQuiz />

      </section>

    </StudentLayout>
  );
}