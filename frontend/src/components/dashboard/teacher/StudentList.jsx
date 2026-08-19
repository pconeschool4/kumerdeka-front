import { Search, Filter, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Fetch students
      const { data: siswaData, error: siswaError } = await supabase
        .from('data_siswa')
        .select('*');
        
      if (siswaError) throw siswaError;

      // Fetch all quiz results with subjects
      const { data: results, error: resultsError } = await supabase
        .from('hasil_kuis')
        .select('siswa_id, nilai, kuis(subjects(nama))');

      if (resultsError) throw resultsError;

      const formatted = (siswaData || []).map(s => {
        const studentResults = (results || []).filter(r => r.siswa_id === s.id);
        
        let masteryStr = "0%";
        let status = "needs_practice";
        let weakCP = "-";

        if (studentResults.length > 0) {
          const totalScore = studentResults.reduce((sum, r) => sum + (r.nilai || 0), 0);
          const avg = Math.round(totalScore / studentResults.length);
          masteryStr = `${avg}%`;

          if (avg >= 80) status = "mastered";
          else if (avg >= 60) status = "needs_practice";
          else status = "needs_attention";

          // Find weak subject
          const subjectScores = {};
          studentResults.forEach(r => {
            const subj = r.kuis?.subjects?.nama || 'Umum';
            if (!subjectScores[subj]) subjectScores[subj] = { total: 0, count: 0 };
            subjectScores[subj].total += (r.nilai || 0);
            subjectScores[subj].count += 1;
          });

          let lowest = 101;
          Object.keys(subjectScores).forEach(subj => {
            const subAvg = subjectScores[subj].total / subjectScores[subj].count;
            if (subAvg < lowest) {
              lowest = subAvg;
              weakCP = subj;
            }
          });
        }

        return {
          id: s.id,
          name: s.nama,
          mastery: masteryStr,
          status: status,
          weakCP: weakCP
        };
      });

      setStudents(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
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
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#0F172A]/60 dark:shadow-[0_4px_18px_rgba(36,74,120,0.04)] backdrop-blur-md">
      <div className="flex flex-col items-start justify-between border-b border-slate-200 dark:border-white/10 p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Daftar Siswa</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-[#94A3B8]">Pantau perkembangan individu (Total: {students.length} siswa)</p>
        </div>

        <div className="mt-4 flex w-full items-center gap-2 sm:mt-0 sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#94A3B8]" size={16} />
            <input
              type="text"
              placeholder="Cari siswa..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 py-2 pl-9 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#94A3B8] focus:border-blue-500 dark:focus:border-[#38BDF8] focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-[#38BDF8]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-white/10">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-white/5 text-xs font-medium uppercase text-slate-500 dark:text-[#94A3B8]">
            <tr>
              <th className="px-5 py-4">Nama Siswa</th>
              <th className="px-5 py-4">Mastery</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">CP/TP Lemah</th>
              <th className="px-5 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/5">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="transition hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{student.name}</td>
                <td className="px-5 py-4 font-semibold text-blue-600 dark:text-[#38BDF8]">{student.mastery}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(student.status)}
                    {getStatusBadge(student.status)}
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-500 dark:text-[#94A3B8]">{student.weakCP}</td>
                <td className="px-5 py-4 text-right">
                  <button className="text-[13px] font-medium text-blue-600 hover:text-blue-700 dark:text-[#38BDF8] dark:hover:underline">
                    Detail
                  </button>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-slate-500 dark:text-[#94A3B8]">
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
