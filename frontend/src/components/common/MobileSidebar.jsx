import { NavLink } from "react-router-dom";
import { X, User, Settings, Phone, LogOut } from "lucide-react";

export default function MobileSidebar({ isOpen, onClose, menus, user, avatar, onLogout }) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-[#172B4D]/40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F0F3F8] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DDEEFF] text-base font-semibold text-[#4285D4]">
                {avatar}
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#172B4D]">{user}</h3>
                <p className="text-xs text-[#718096]">Profil Aktif</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="rounded-lg p-2 text-[#718096] hover:bg-[#F5F8FC]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <div className="px-3 pb-2 text-xs font-semibold text-[#A0AEC0] uppercase tracking-wider">
              Menu Utama
            </div>
            <nav className="flex flex-col gap-1 px-3">
              {menus.map((menu) => (
                <NavLink
                  key={menu.label}
                  to={menu.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive 
                        ? "bg-[#EAF4FF] text-[#4285D4]" 
                        : "text-[#52637A] hover:bg-[#F5F8FC] hover:text-[#172B4D]"
                    }`
                  }
                >
                  {menu.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-6 px-3 pb-2 text-xs font-semibold text-[#A0AEC0] uppercase tracking-wider">
              Akun & Pengaturan
            </div>
            <nav className="flex flex-col gap-1 px-3">
              <NavLink
                to="/settings/profile"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-[#EAF4FF] text-[#4285D4]" : "text-[#52637A] hover:bg-[#F5F8FC]"
                  }`
                }
              >
                <User size={18} />
                Profil
              </NavLink>
              <NavLink
                to="/settings/appearance"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-[#EAF4FF] text-[#4285D4]" : "text-[#52637A] hover:bg-[#F5F8FC]"
                  }`
                }
              >
                <Settings size={18} />
                Pengaturan
              </NavLink>
              <NavLink
                to="/settings/contact"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? "bg-[#EAF4FF] text-[#4285D4]" : "text-[#52637A] hover:bg-[#F5F8FC]"
                  }`
                }
              >
                <Phone size={18} />
                Bantuan & Laporan
              </NavLink>
            </nav>
          </div>

          {/* Footer (Logout) */}
          <div className="border-t border-[#F0F3F8] p-4">
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FFF5F5] py-2.5 text-sm font-semibold text-[#E53E3E] transition hover:bg-[#FED7D7]"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
