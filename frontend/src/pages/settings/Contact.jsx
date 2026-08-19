import { useAuth } from "../../context/AuthContext";
import StudentLayout from "../../Layouts/StudentLayout";
import TeacherLayout from "../../Layouts/TeacherLayout";
import { Mail, Phone, MessageSquare, Send } from "lucide-react";

export default function Contact() {
  const { user } = useAuth();
  const Layout = user?.role === 'teacher' ? TeacherLayout : StudentLayout;

  return (
    <Layout>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Bantuan & Laporan</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Kami siap membantu Anda kapan saja.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Kontak Info */}
          <div className="rounded-[24px] border border-white/10 bg-[#0F172A]/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-bold text-white mb-6">Hubungi Helpdesk</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[#38BDF8]">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Email Laporan</p>
                  <p className="font-bold text-white">support@kurmerdeka.trace</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[#22C55E]">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">Telepon (Jam Kerja)</p>
                  <p className="font-bold text-white">0800-1-MERDEKA</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-[#F59E0B]">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-sm text-[#94A3B8]">WhatsApp Admin</p>
                  <p className="font-bold text-white">+62 812-3456-7890</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Laporan */}
          <div className="rounded-[24px] border border-white/10 bg-[#0F172A]/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h2 className="text-lg font-bold text-white mb-6">Kirim Pesan Langsung</h2>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Subjek</label>
                <input 
                  type="text" 
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#38BDF8] focus:bg-white/10 focus:ring-1 focus:ring-[#38BDF8]"
                  placeholder="Masalah Teknis / Pertanyaan"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Pesan</label>
                <textarea 
                  rows="4"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#38BDF8] focus:bg-white/10 focus:ring-1 focus:ring-[#38BDF8]"
                  placeholder="Ceritakan detail masalah yang Anda alami..."
                />
              </div>

              <button 
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#38BDF8] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0284C7]"
              >
                <Send size={18} />
                Kirim Pesan
              </button>
            </form>
          </div>

        </div>
      </div>
    </Layout>
  );
}
