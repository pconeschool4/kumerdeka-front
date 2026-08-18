import { Bell } from "lucide-react";

const defaultMenus = [
  { label: "Dashboard" },
  { label: "Belajar" },
  { label: "Quiz" },
  { label: "Progress" },
  { label: "Rekomendasi" },
  { label: "Profile" },
];

export default function Navbar({ menus = defaultMenus, user = "Naya", avatar = "N" }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E8EEF7] bg-white">
      <div className="mx-auto flex h-18 max-w-300 items-center px-5 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDEEFF]">
            <span className="text-lg">🎓</span>
          </div>

          <div className="hidden sm:block">
            <h1 className="text-[15px] font-bold tracking-tight text-[#172B4D]">
              KURMERDEKA
            </h1>

            <p className="text-[11px] font-medium text-[#8B9AB0]">
              TRACE
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="ml-8 hidden items-center gap-1 md:flex">
          {menus.map((menu, index) => {
            const active = index === 0;

            return (
              <button
                key={menu.label}
                className={`rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition ${active
                    ? "bg-[#EAF4FF] text-[#4285D4]"
                    : "text-[#718096] hover:bg-[#F5F8FC] hover:text-[#4285D4]"
                  }`}
              >
                {menu.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="ml-auto flex items-center gap-3">

          {/* Notification */}
          <button className="relative rounded-xl p-2 text-[#718096] transition hover:bg-[#F5F8FC]">
            <Bell size={19} strokeWidth={1.8} />

            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F87171]" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDEEFF] text-sm font-semibold text-[#4285D4]">
              {avatar}
            </div>

            <span className="hidden text-sm font-medium text-[#52637A] sm:block">
              {user}
            </span>
          </div>

        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t border-[#F0F3F8] px-4 py-2 md:hidden">
        <div className="flex gap-1 overflow-x-auto">
          {menus.map((menu, index) => {
            const active = index === 0;

            return (
              <button
                key={menu.label}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium ${active
                    ? "bg-[#EAF4FF] text-[#4285D4]"
                    : "text-[#718096]"
                  }`}
              >
                {menu.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}