export default function WelcomeCard() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-blue-50 p-6 sm:p-8">

      <div className="relative z-10 max-w-2xl">
        <div className="mb-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">
          🔥 7 hari berturut-turut
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-[#172B4D] sm:text-3xl">
          Hai, Naya! 👋
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
          Yuk lanjutkan progres belajarmu hari ini.
          TRACE akan membantu menemukan materi yang paling membutuhkan
          perhatianmu.
        </p>

        <button className="mt-5 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white shadow-sm transition hover:bg-blue-600">
          Mulai Latihan →
        </button>
      </div>

      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-slate-50 dark:bg-white/50" />
      <div className="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-blue-100/60" />

    </section>
  );
}