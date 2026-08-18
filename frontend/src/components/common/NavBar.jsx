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
      <header className="sticky top-0 z-50 border-b border-[#E8EEF7] bg-white">
        <div className="mx-auto flex h-18 w-full items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
          
          <div className="flex items-center">
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
              {menus.map((menu) => (
                <NavLink
                  key={menu.label}
                  to={menu.path}
                  className={({ isActive }) =>
                    `rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition ${
                      isActive
                        ? "bg-[#EAF4FF] text-[#4285D4]"
                        : "text-[#718096] hover:bg-[#F5F8FC] hover:text-[#4285D4]"
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
            <button className="relative rounded-xl p-2 text-[#718096] transition hover:bg-[#F5F8FC]">
              <Bell size={19} strokeWidth={1.8} />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#F87171]" />
            </button>

            {/* Desktop Profile Dropdown */}
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-[#F5F8FC]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DDEEFF] text-sm font-semibold text-[#4285D4]">
                  {avatar}
                </div>
                <span className="text-sm font-medium text-[#52637A]">{user}</span>
                <ChevronDown size={14} className="text-[#A0AEC0]" />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-[#F0F3F8] bg-white py-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-2 border-b border-[#F0F3F8]">
                    <p className="text-sm font-bold text-[#172B4D]">{user}</p>
                    <p className="text-xs text-[#718096]">Profil Aktif</p>
                  </div>
                  <div className="py-1">
                    <Link to="/settings/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-[#52637A] hover:bg-[#F5F8FC] hover:text-[#172B4D]">
                      <User size={16} /> Profil
                    </Link>
                    <Link to="/settings/appearance" className="flex items-center gap-3 px-4 py-2 text-sm text-[#52637A] hover:bg-[#F5F8FC] hover:text-[#172B4D]">
                      <Settings size={16} /> Pengaturan
                    </Link>
                    <Link to="/settings/contact" className="flex items-center gap-3 px-4 py-2 text-sm text-[#52637A] hover:bg-[#F5F8FC] hover:text-[#172B4D]">
                      <Phone size={16} /> Bantuan & Laporan
                    </Link>
                  </div>
                  <div className="border-t border-[#F0F3F8] py-1">
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-[#E53E3E] hover:bg-[#FFF5F5]"
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
              className="rounded-xl p-2 text-[#718096] transition hover:bg-[#F5F8FC] md:hidden"
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