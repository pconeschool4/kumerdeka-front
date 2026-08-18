import { ArrowRight } from "lucide-react";

const data = [
  {
    chapter: "BAB 1 · Aljabar",
    topic: "SubBAB 1.1 · Operasi",
    cp: "CP 3.1",
    tp: "TP 3.1.1",
    progress: 90,
    status: "Sudah dikuasai",
    type: "green",
  },
  {
    chapter: "BAB 1 · Aljabar",
    topic: "SubBAB 1.2 · Persamaan",
    cp: "CP 3.2",
    tp: "TP 3.2.1",
    progress: 75,
    status: "Perlu latihan",
    type: "yellow",
  },
  {
    chapter: "BAB 2 · Fungsi",
    topic: "SubBAB 2.1 · Konsep",
    cp: "CP 3.4",
    tp: "TP 3.4.1",
    progress: 30,
    status: "Perlu penguatan",
    type: "red",
  },
];

const styles = {
  green: {
    bar: "bg-[#73C68A]",
    badge: "bg-[#ECF9F0] text-[#4D9A63]",
  },
  yellow: {
    bar: "bg-[#E8BE4B]",
    badge: "bg-[#FFF7DE] text-[#B58719]",
  },
  red: {
    bar: "bg-[#E98282]",
    badge: "bg-[#FFF0F0] text-[#C95D5D]",
  },
};

export default function MasteryMap() {
  return (
    <div className="rounded-2xl border border-[#E8EEF7] bg-white p-5 shadow-[0_4px_18px_rgba(36,74,120,0.04)] sm:p-6">

      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-[#172B4D]">
          Peta mastery
        </h2>

        <p className="text-sm text-[#8291A5]">
          Area belajar berdasarkan penguasaanmu.
        </p>
      </div>

      <div className="mt-5 space-y-3">

        {data.map((item) => {
          const style = styles[item.type];

          return (
            <div
              key={item.tp}
              className="rounded-xl border border-[#EEF2F7] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                  <p className="text-[11px] font-medium text-[#8B9AB0]">
                    {item.chapter}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#172B4D]">
                    {item.topic}
                  </p>

                  <p className="mt-1 text-xs text-[#8291A5]">
                    {item.cp} · {item.tp}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-28">
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#EEF2F7]">
                      <div
                        className={`h-full rounded-full ${style.bar}`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-sm font-bold text-[#52637A]">
                    {item.progress}%
                  </span>
                </div>

              </div>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${style.badge}`}
                >
                  {item.status}
                </span>

                <button className="flex items-center gap-1 text-xs font-semibold text-[#4285D4]">
                  Lihat TP
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}

      </div>

      <div className="mt-5 rounded-xl bg-[#F5F9FE] p-4">
        <p className="text-xs leading-5 text-[#718096]">
          💡 Kamu tidak perlu menyelesaikan semua topik secara berurutan.
          TRACE memprioritaskan materi berdasarkan bukti penguasaanmu.
        </p>
      </div>

    </div>
  );
}