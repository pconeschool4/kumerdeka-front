import { Bell, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-blue-50 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

        <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 lg:hidden">
          <Menu size={22} />
        </button>

        <div className="hidden lg:block">
          <p className="text-sm text-slate-400">
            Dashboard Belajar
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="relative rounded-xl p-2 text-slate-500 hover:bg-blue-50">
            <Bell size={20} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-400" />
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
              N
            </div>

            <span className="hidden text-sm font-medium text-slate-600 sm:block">
              Naya
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}