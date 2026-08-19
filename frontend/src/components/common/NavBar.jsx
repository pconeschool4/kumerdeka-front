import { useState, useRef, useEffect } from "react";
import { Bell, Menu, User, Settings, Phone, LogOut, ChevronDown } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import MobileSidebar from "./MobileSidebar";
import { useAuth } from "../../context/AuthContext";

const defaultMenus = [
  { label: "Dashboard", path: "/student" },
  { label: "Belajar", path: "/student/materials" },
  { label: "Quiz", path: "/student/quiz" },
  { label: "Progress", path: "/student/progress" },
  { label: "Rekomendasi", path: "/student/recommendations" },
];

export default function Navbar({ menus = defaultMenus, user = "Naya", avatar = "N" }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0A1128]/80 backdrop-blur-md">
        <div className="mx-auto flex h-18 w-full items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
          
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 shadow-sm">
                <span className="text-lg">🎓</span>
              </div>

              <div className="hidden sm:block">
                <h1 className="text-[15px] font-bold tracking-widest text-slate-900 dark:text-white">
                  KURMERDEKA
                </h1>
                <p className="text-[11px] font-medium tracking-[0.2em] text-blue-600 dark:text-[#38BDF8]">
                  TRACE
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="ml-8 hidden items-center gap-1 md:flex">
              {menus.map((menu) => (
                <NavLink
                  key={menu.label}
                  to={menu.path}
                  className={({ isActive }) =>
                    `rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition ${
                      isActive
                        ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:bg-white/5 dark:hover:text-white"
                    }`
                  }
                >
                  {menu.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User & Actions */}
          <div className="flex items-center gap-3">
            {/* Notification */}
            <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-[#94A3B8] transition dark:hover:bg-white/5 dark:hover:text-white">
              <Bell size={19} strokeWidth={1.8} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F87171] shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
            </button>

            {/* Desktop Profile Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-600 dark:border-[#38BDF8]/30 dark:bg-[#38BDF8]/10 dark:text-[#38BDF8]">
                  {avatar}
                </div>
                <span className="text-sm font-medium text-slate-900 dark:text-white">{user}</span>
                <ChevronDown size={14} className="text-slate-500 dark:text-[#94A3B8]" />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#0F172A] py-2 shadow-xl ring-1 ring-black/5 backdrop-blur-xl focus:outline-none">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{user}</p>
                    <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Profil Aktif</p>
                  </div>
                  <div className="py-1">
                    <Link to="/settings/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:bg-white/5 dark:hover:text-white transition">
                      <User size={16} /> Profil
                    </Link>
                    <Link to="/settings/appearance" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:bg-white/5 dark:hover:text-white transition">
                      <Settings size={16} /> Pengaturan
                    </Link>
                    <Link to="/settings/contact" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:bg-white/5 dark:hover:text-white transition">
                      <Phone size={16} /> Bantuan & Laporan
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 dark:border-white/5 py-1">
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-[#F87171] dark:hover:bg-white/5 dark:hover:text-red-400 transition"
                    >
                      <LogOut size={16} /> Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="rounded-xl p-2 text-[#94A3B8] transition hover:bg-white/5 md:hidden"
            >
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Component */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        menus={menus}
        user={user}
        avatar={avatar}
        onLogout={logout}
      />
    </>
  );
}