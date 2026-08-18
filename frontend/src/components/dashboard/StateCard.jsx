import { Target, ClipboardCheck } from "lucide-react";

export default function StatCard({
  title,
  value,
  description,
  extra,
  type,
}) {
  const mastery = type === "mastery";

  return (
    <div className="rounded-2xl border border-[#E8EEF7] bg-white p-5 shadow-[0_4px_18px_rgba(36,74,120,0.04)]">
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-[#8291A5]">
            {title}
          </p>

          <p
            className={`mt-3 text-[28px] font-bold leading-none ${
              mastery ? "text-[#4285D4]" : "text-[#5D7FB0]"
            }`}
          >
            {value}
          </p>

          <p className="mt-3 text-xs text-[#91A0B2]">
            {description}
          </p>

          {extra && (
            <p className="mt-1 text-xs font-medium text-[#7B8CA3]">
              {extra}
            </p>
          )}
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            mastery ? "bg-[#EAF4FF]" : "bg-[#EEF8F1]"
          }`}
        >
          {mastery ? (
            <Target size={18} className="text-[#4285D4]" />
          ) : (
            <ClipboardCheck size={18} className="text-[#63A979]" />
          )}
        </div>

      </div>
    </div>
  );
}