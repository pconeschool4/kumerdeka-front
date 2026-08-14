import { Search, Filter, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";

const mockStudents = [
  { id: 1, name: "Ahmad Fauzi", mastery: "85%", status: "mastered", weakCP: "-" },
  { id: 2, name: "Budi Santoso", mastery: "45%", status: "needs_attention", weakCP: "Aljabar Linear" },
  { id: 3, name: "Citra Kirana", mastery: "92%", status: "mastered", weakCP: "-" },
  { id: 4, name: "Dewi Lestari", mastery: "65%", status: "needs_practice", weakCP: "Geometri" },
  { id: 5, name: "Eko Prasetyo", mastery: "50%", status: "needs_attention", weakCP: "Trigonometri Dasar" },
  { id: 6, name: "Fina Amanda", mastery: "78%", status: "needs_practice", weakCP: "Pecahan" },
];

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "mastered": return <CheckCircle2 size={18} className="text-[#63A979]" />;
      case "needs_practice": return <Clock size={18} className="text-[#F59E0B]" />;
      case "needs_attention": return <AlertCircle size={18} className="text-[#EF4444]" />;
      default: return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "mastered": return <span className="rounded-full bg-[#EEF8F1] px-2.5 py-1 text-xs font-medium text-[#4B8B60]">Mastered</span>;
      case "needs_practice": return <span className="rounded-full bg-[#FEF3C7] px-2.5 py-1 text-xs font-medium text-[#B45309]">Needs Practice</span>;
      case "needs_attention": return <span className="rounded-full bg-[#FEE2E2] px-2.5 py-1 text-xs font-medium text-[#B91C1C]">Needs Attention</span>;
      default: return null;
    }
  };

  return (
    <div className="rounded-2xl border border-[#E8EEF7] bg-white shadow-[0_4px_18px_rgba(36,74,120,0.04)]">
      <div className="flex flex-col items-start justify-between border-b border-[#E8EEF7] p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-[#172B4D]">Daftar Siswa</h2>
          <p className="mt-1 text-sm text-[#7B8CA3]">Pantau perkembangan individu (Total: 40 siswa)</p>
        </div>

        <div className="mt-4 flex w-full items-center gap-2 sm:mt-0 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" size={16} />
            <input
              type="text"
              placeholder="Cari siswa..."
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#F7FAFF] py-2 pl-9 pr-4 text-sm text-[#4A5568] placeholder:text-[#A0AEC0] focus:border-[#4285D4] focus:outline-none focus:ring-1 focus:ring-[#4285D4]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-medium text-[#4A5568] hover:bg-[#F7FAFF]">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAFCFF] text-xs font-medium uppercase text-[#8291A5]">
            <tr>
              <th className="px-5 py-4">Nama Siswa</th>
              <th className="px-5 py-4">Mastery</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">CP/TP Lemah</th>
              <th className="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8EEF7]">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="transition hover:bg-[#FAFCFF]">
                <td className="px-5 py-4 font-medium text-[#172B4D]">{student.name}</td>
                <td className="px-5 py-4 font-semibold text-[#4285D4]">{student.mastery}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(student.status)}
                    {getStatusBadge(student.status)}
                  </div>
                </td>
                <td className="px-5 py-4 text-[#718096]">{student.weakCP}</td>
                <td className="px-5 py-4 text-right">
                  <button className="text-[13px] font-medium text-[#4285D4] hover:underline">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-[#7B8CA3]">
                  Tidak ada siswa yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
