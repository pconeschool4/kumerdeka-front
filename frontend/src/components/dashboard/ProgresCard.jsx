const progressData = [
  {
    code: "CP 3.1",
    progress: 90,
    status: "Sudah dikuasai",
    color: "green",
  },
  {
    code: "CP 3.2",
    progress: 75,
    status: "Perlu latihan",
    color: "yellow",
  },
  {
    code: "CP 3.4",
    progress: 30,
    status: "Perlu penguatan",
    color: "red",
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

export default function ProgressCard() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

      {progressData.map((item) => {
        const style = styles[item.color];

        return (
          <div
            key={item.code}
            className="rounded-2xl border border-[#E8EEF7] bg-white p-5 shadow-[0_4px_18px_rgba(36,74,120,0.04)]"
          >
            <div className="flex items-center justify-between gap-3">

              <span className="text-sm font-semibold text-[#172B4D]">
                {item.code}
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${style.badge}`}
              >
                {item.status}
              </span>

            </div>

            <div className="mt-5 flex items-end justify-between">
              <span className="text-[25px] font-bold text-[#172B4D]">
                {item.progress}%
              </span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#EEF2F7]">
              <div
                className={`h-full rounded-full ${style.bar}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>

          </div>
        );
      })}

    </div>
  );
}