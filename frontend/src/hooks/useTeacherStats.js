import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useTeacherStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    classAverage: 0,
    studentsNeedingHelp: 0,
    totalQuizzes: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Fetch stats related to the teacher's students and quizzes
      // Assuming a simplistic approach similar to TeacherDashboard.jsx

      // Fetch students count
      const { data: students, error: studErr } = await supabase
        .from('data_siswa')
        .select('id, user_id');
      
      const totalStudents = students ? students.length : 0;

      // Fetch quiz count
      const { data: quizzes, error: quizErr } = await supabase
        .from('kuis')
        .select('id');
        
      const totalQuizzes = quizzes ? quizzes.length : 0;

      // Fetch all quiz results for calculating average
      const { data: results, error: resErr } = await supabase
        .from('hasil_kuis')
        .select('siswa_id, nilai');

      let classAverage = 0;
      let studentsNeedingHelp = 0;

      if (results && results.length > 0) {
        classAverage = Math.round(results.reduce((acc, curr) => acc + (curr.nilai || 0), 0) / results.length);

        // Calculate students needing help (< 60 avg)
        const studentAverages = {};
        results.forEach(res => {
          if (!studentAverages[res.siswa_id]) studentAverages[res.siswa_id] = { total: 0, count: 0 };
          studentAverages[res.siswa_id].total += (res.nilai || 0);
          studentAverages[res.siswa_id].count += 1;
        });

        Object.values(studentAverages).forEach(stud => {
          const avg = stud.total / stud.count;
          if (avg < 60) {
            studentsNeedingHelp++;
          }
        });
      }

      setStats({
        totalStudents,
        classAverage,
        studentsNeedingHelp,
        totalQuizzes
      });

    } catch (err) {
      console.error("Error fetching teacher stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  return { stats, loading, refetch: fetchDashboardStats };
}
