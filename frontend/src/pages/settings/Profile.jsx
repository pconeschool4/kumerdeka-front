import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import { Camera, Save, User, Mail, Shield, Loader2, CheckCircle2 } from "lucide-react";
import StudentLayout from "../../Layouts/StudentLayout";
import TeacherLayout from "../../Layouts/TeacherLayout";

export default function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  // Ambil metadata dari user Supabase Auth (bukan dari public.users untuk amannya)
  const [formData, setFormData] = useState({
    username: user?.user_metadata?.username || user?.email?.split('@')[0] || "",
    fullName: user?.user_metadata?.full_name || "",
  });

  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || null
  );

  const Layout = user?.role === 'teacher' ? TeacherLayout : StudentLayout;

  const handleAvatarUpload = async (e) => {
    try {
      setErrorMsg("");
      setSuccessMsg("");
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg("Ukuran gambar maksimal 2MB.");
        return;
      }

      setLoading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload ke bucket "avatars"
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Ambil Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update metadata user
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSuccessMsg("Foto profil berhasil diperbarui!");
    } catch (error) {
      console.error(error);
      setErrorMsg("Gagal mengunggah foto. Pastikan bucket 'avatars' sudah ada dan public.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      const { error } = await supabase.auth.updateUser({
        data: { 
          username: formData.username,
          full_name: formData.fullName
        }
      });

      if (error) throw error;

      // Update tabel 'users'
      await supabase
        .from('users')
        .update({ username: formData.username })
        .eq('id', user.id);

      // Update tabel sesuai role
      if (user?.role === 'teacher') {
        await supabase
          .from('data_guru')
          .update({ nama: formData.fullName })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('data_siswa')
          .update({ nama: formData.fullName })
          .eq('user_id', user.id);
      }

      setSuccessMsg("Profil berhasil disimpan!");
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Profil Pengguna</h1>
        <p className="mt-1 text-sm text-[#94A3B8]">Kelola informasi pribadi dan pengaturan identitas Anda.</p>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start">
          
          {/* KIRI: Avatar (GitHub Style) */}
          <div className="flex w-full flex-col items-center gap-4 md:w-1/3 md:items-start">
            <div className="relative group">
              <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 border-white/10 bg-[#0F172A] shadow-xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-6xl font-bold text-[#38BDF8]">
                    {formData.username?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-6 rounded-full border border-white/20 bg-[#1E293B] p-3 text-white shadow-lg transition hover:bg-[#334155] hover:scale-110"
                title="Ganti Foto"
              >
                <Camera size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden" 
              />
            </div>
            
            <div className="mt-2 text-center md:text-left w-full">
              <h2 className="text-xl font-bold text-white">{formData.fullName || 'Nama Belum Diatur'}</h2>
              <p className="text-sm text-[#94A3B8]">@{formData.username}</p>
            </div>
          </div>

          {/* KANAN: Form Profil */}
          <div className="w-full flex-1">
            <div className="rounded-[24px] border border-white/10 bg-[#0F172A]/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              
              {/* Notifikasi */}
              {errorMsg && (
                <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mb-6 rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-sm text-green-400 flex items-center gap-2">
                  <CheckCircle2 size={18} /> {successMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* Form Group */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <User size={16} className="text-[#38BDF8]" /> Nama Lengkap
                  </label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#38BDF8] focus:bg-white/10 focus:ring-1 focus:ring-[#38BDF8]"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                {/* Form Group */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                    <Shield size={16} className="text-[#38BDF8]" /> Username
                  </label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-[#38BDF8] focus:bg-white/10 focus:ring-1 focus:ring-[#38BDF8]"
                    placeholder="username"
                  />
                </div>

                {/* Form Group (Read Only) */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#94A3B8]">
                    <Mail size={16} /> Email Aktif
                  </label>
                  <input 
                    type="email" 
                    value={user?.email || ''}
                    readOnly
                    disabled
                    className="w-full rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-[#94A3B8] cursor-not-allowed outline-none"
                  />
                  <p className="mt-2 text-xs text-[#64748B]">Email terikat dengan otentikasi utama dan tidak dapat diubah di sini.</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#38BDF8] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#0284C7] disabled:opacity-50 sm:w-auto"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Simpan Perubahan
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
