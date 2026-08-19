import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useStudentData(user) {
  const [loading, setLoading] = useState(true);
  const [siswaId, setSiswaId] = useState(null);
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [stats, setStats] = useState({
    mastery: 0,
    totalQuizzes: 0,
    recentHistory: [],
    weakestSubject: null
  });

  useEffect(() => {
    if (user) {
      fetchStudentData();
      fetchQuizzes();
    }
  }, [user]);

  const fetchStudentData = async () => {
    try {
      const { data: siswaData } = await supabase
        .from('data_siswa')
        .select('id')
        .eq('user_id', user.id)
        .single();
        
      if (siswaData) {
        setSiswaId(siswaData.id);
        fetchStats(siswaData.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async (id) => {
    try {
      const { data, error } = await supabase
        .from('hasil_kuis')
        .select('id, nilai, finished_at, kuis(deskripsi, subjects(nama))')
        .eq('siswa_id', id)
        .order('finished_at', { ascending: false });

      if (!error && data) {
        const total = data.length;
        const avg = total > 0 ? Math.round(data.reduce((a, b) => a + (b.nilai || 0), 0) / total) : 0;
        
        // Hitung area yang perlu diperkuat
        const subjectScores = {};
        data.forEach(item => {
          const subject = item.kuis?.subjects?.nama;
          if (subject) {
            if (!subjectScores[subject]) subjectScores[subject] = { total: 0, count: 0 };
            subjectScores[subject].total += item.nilai || 0;
            subjectScores[subject].count += 1;
          }
        });
        
        let weakestSubject = null;
        let lowestScore = 101;
        Object.keys(subjectScores).forEach(sub => {
          const subAvg = subjectScores[sub].total / subjectScores[sub].count;
          if (subAvg < lowestScore) {
            lowestScore = subAvg;
            weakestSubject = sub;
          }
        });

        setStats({
          mastery: avg,
          totalQuizzes: total,
          recentHistory: data.slice(0, 5), // Ambil 5 kuis terakhir
          weakestSubject: weakestSubject
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('kuis')
        .select(`
          id,
          deskripsi,
          created_at,
          tipe_soal,
          tingkat_kesulitan,
          subjects (nama),
          cp (judul),
          tp (judul)
        `)
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (!error && data) {
        setAvailableQuizzes(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  return { loading, siswaId, stats, availableQuizzes, refetch: fetchStudentData };
}
