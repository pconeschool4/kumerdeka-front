const { GoogleGenAI } = require('@google/genai');
const pdf = require('pdf-parse');
const xlsx = require('xlsx');
const supabase = require('../config/supabaseClient');

// Inisialisasi Google Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Fungsi untuk memotong teks panjang menjadi chunk-chunk (sekitar 1000 karakter)
 */
function chunkText(text, chunkSize = 1000, overlap = 200) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const chunks = [];
  let currentChunk = [];
  let currentLength = 0;

  for (const word of words) {
    currentChunk.push(word);
    currentLength += word.length + 1; // +1 untuk spasi

    if (currentLength >= chunkSize) {
      chunks.push(currentChunk.join(' '));
      // Mulai chunk baru dengan overlap kata dari ujung chunk sebelumnya
      // Overlap roughly 200 characters worth of words (~30 words)
      const overlapWords = currentChunk.slice(-30); 
      currentChunk = [...overlapWords];
      currentLength = overlapWords.join(' ').length + 1;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}

const uploadMaterial = async (req, res) => {
  try {
    const user = req.user; // Dari middleware verifyToken
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di server.' });
    }

    // Buat client Supabase dengan token JWT user untuk melewati RLS
    const { createClient } = require('@supabase/supabase-js');
    const userSupabase = createClient(
      process.env.SUPABASE_URL, 
      process.env.SUPABASE_ANON_KEY, 
      { 
        global: { headers: { Authorization: req.headers.authorization } },
        db: { schema: 'kumerdeka_base' } 
      }
    );

    // 1. Ekstraksi teks berdasarkan tipe file (non-blocking)
    let extractedText = '';
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    try {
      if (fileExtension === 'pdf') {
        const pdfData = await pdf(file.buffer);
        extractedText = pdfData.text || '';
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls' || fileExtension === 'csv') {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        extractedText = xlsx.utils.sheet_to_txt(worksheet) || '';
      } else if (fileExtension === 'txt' || fileExtension === 'docx' || fileExtension === 'doc') {
        extractedText = file.buffer.toString('utf8');
      }
    } catch (extractErr) {
      console.warn('Gagal mengekstrak teks (mungkin PDF scan):', extractErr.message);
      extractedText = '';
    }

    const canVectorize = extractedText && extractedText.trim().length > 50;

    // 2. Chunking & Vectorization (hanya jika teks berhasil diekstrak)
    let successCount = 0;
    const chunks = canVectorize ? chunkText(extractedText) : [];
    
    if (canVectorize) {
      console.log(`Mengekstrak ${chunks.length} chunk dari file ${file.originalname}`);

      for (const chunk of chunks) {
        if (chunk.trim().length < 50) continue;
        try {
          const response = await ai.models.embedContent({
            model: 'gemini-embedding-2',
            contents: chunk,
            config: { outputDimensionality: 768 }
          });
          const embedding = response.embeddings[0].values;
          const { error: dbError } = await userSupabase
            .from('bank_soal_vektor')
            .insert([{
              guru_id: user.id,
              topik: req.body.judul || req.body.topik || file.originalname,
              content: chunk,
              metadata: { source_file: file.originalname },
              embedding: embedding
            }]);
          if (dbError) console.error("Gagal menyimpan chunk:", dbError.message);
          else successCount++;
        } catch (embError) {
          console.error("Gagal meng-embed chunk:", embError.message);
        }
      }
    } else {
      console.warn(`File ${file.originalname} tidak memiliki teks yang bisa diekstrak. Tetap menyimpan ke DB tanpa vektorisasi.`);
    }

    // 3. Upload file ke Supabase Storage (bucket 'materials')
    const safeFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${Date.now()}_${safeFileName}`;
    let filePath = null;
    const { data: storageData, error: storageError } = await userSupabase.storage
      .from('materials')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (storageError) {
      console.warn("Gagal upload ke Storage (mungkin bucket belum dibuat):", storageError.message);
    } else {
      const { data: publicUrlData } = userSupabase.storage
        .from('materials')
        .getPublicUrl(fileName);
      filePath = publicUrlData?.publicUrl || null;
    }

    // 4. Simpan ke tabel materials
    const { judul, subject_id, cp_id, tp_id } = req.body;
    
    if (!subject_id || !cp_id || !tp_id) {
      console.warn('Relasi kurikulum tidak lengkap. Materi tetap diproses tapi tidak masuk ke tabel materials.');
      return res.json({ 
        message: canVectorize 
          ? 'Materi berhasil divektorisasi AI! (Catatan: pilih Mata Pelajaran/CP/TP agar materi muncul di daftar)'
          : 'File diterima! (Catatan: Pilih Mata Pelajaran/CP/TP, dan gunakan file PDF berbasis teks, bukan scan/gambar)',
        warning: !subject_id ? 'Mata Pelajaran belum dipilih' : null,
        chunksProcessed: chunks.length,
        chunksSaved: successCount
      });
    }

    const materialRecord = {
      judul: judul || file.originalname,
      subject_id,
      cp_id,
      tp_id,
      pembuat: user.id,
    };

    const { error: matError } = await userSupabase
      .from('materials')
      .insert([materialRecord]);
    
    if (matError) {
      console.error("Gagal menyimpan ke tabel materials:", matError.message);
      return res.status(500).json({ error: 'Gagal menyimpan data materi: ' + matError.message });
    }

    res.json({ 
      message: canVectorize 
        ? `Materi berhasil diunggah dan dianalisis AI! (${successCount} chunk terproses)`
        : 'Materi berhasil disimpan! (File berbasis gambar/scan, AI tidak dapat mengekstrak teks)',
      chunksProcessed: chunks.length,
      chunksSaved: successCount
    });

  } catch (error) {
    console.error("Upload Material Error:", error);
    res.status(500).json({ error: 'Terjadi kesalahan saat memproses materi: ' + error.message });
  }
};


const generateQuiz = async (req, res) => {
  try {
    const { topik } = req.body;
    const user = req.user;

    const { createClient } = require('@supabase/supabase-js');
    const userSupabase = createClient(
      process.env.SUPABASE_URL, 
      process.env.SUPABASE_ANON_KEY, 
      { 
        global: { headers: { Authorization: req.headers.authorization } },
        db: { schema: 'kumerdeka_base' } 
      }
    );

    // 1. Dapatkan riwayat kuis siswa untuk topik ini
    const { data: history } = await userSupabase
      .from('riwayat_kuis')
      .select('*')
      .eq('siswa_id', user.id)
      .eq('topik', topik || '')
      .order('tanggal', { ascending: false })
      .limit(3);

    let contextText = '';
    
    // 2. RAG: Cari materi terkait topik
    if (topik) {
      try {
        // Embed kata kunci pencarian
        const queryEmbeddingResponse = await ai.models.embedContent({
          model: 'text-embedding-004',
          contents: topik,
        });
        const queryEmbedding = queryEmbeddingResponse.embeddings[0].values;
        
        // Cari dokumen yang paling mirip di database
        const { data: matchedDocs } = await userSupabase.rpc('match_documents', {
          query_embedding: queryEmbedding,
          match_threshold: 0.5,
          match_count: 3
        });

        if (matchedDocs && matchedDocs.length > 0) {
          contextText = matchedDocs.map(doc => doc.content).join('\n\n');
        }
      } catch (e) {
        console.warn('Gagal melakukan pencarian vektor (Mungkin RPC belum di-run), melanjutkan tanpa context', e.message);
      }
    }

    // 3. Bangun Prompt untuk Gemini
    let prompt = `Tugas Anda adalah membuat 5 soal pilihan ganda tentang '${topik || 'Materi Umum'}'.`;
    
    if (history && history.length > 0) {
      const kelemahan = history.map(h => h.kelemahan_terdeteksi).filter(Boolean).join(', ');
      if (kelemahan) {
         prompt += `\nSiswa ini sebelumnya memiliki kesulitan pada: ${kelemahan}. Buatlah soal yang berfokus melatih area kelemahan tersebut untuk membantu mereka mengatasinya.`;
      }
    }

    if (contextText) {
      prompt += `\nGunakan materi referensi berikut sebagai dasar konteks pembuatan soal:\n${contextText}`;
    }

    prompt += `
Balas MURNI dengan JSON array saja. Jangan gunakan format markdown backticks (\`\`\`). Format objeknya harus persis seperti ini:
[
  {
    "question": "pertanyaan",
    "options": ["opsi A", "opsi B", "opsi C", "opsi D"],
    "correct_index": 0,
    "explanation": "penjelasan detail mengapa opsi tersebut benar dan mengatasi kelemahan siswa"
  }
]`;

    // 4. Generate JSON via Gemini
    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        temperature: 0.2, // Rendah agar konsisten JSON-nya
      }
    });

    // Bersihkan output dari kemungkinan markdown backticks
    let jsonString = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const quizData = JSON.parse(jsonString);

    res.json({ quiz: quizData });
  } catch (error) {
    console.error('Generate Quiz Error:', error);
    res.status(500).json({ error: 'Gagal membuat kuis pintar' });
  }
};

const getStudentInsights = async (req, res) => {
  try {
    const user = req.user;
    
    const { createClient } = require('@supabase/supabase-js');
    const userSupabase = createClient(
      process.env.SUPABASE_URL, 
      process.env.SUPABASE_ANON_KEY, 
      { 
        global: { headers: { Authorization: req.headers.authorization } },
        db: { schema: 'kumerdeka_base' } 
      }
    );

    const { data: history } = await userSupabase
      .from('riwayat_kuis')
      .select('*')
      .eq('siswa_id', user.id)
      .order('tanggal', { ascending: false })
      .limit(10);

    if (!history || history.length === 0) {
      return res.json({ insights: 'Belum ada data riwayat yang cukup untuk dianalisis.' });
    }

    const historyText = history.map(h => `Topik: ${h.topik}, Skor: ${h.skor}, Catatan: ${h.kelemahan_terdeteksi || 'Tidak ada'}`).join('\n');

    const prompt = `Anda adalah guru AI personal. Berdasarkan riwayat kuis siswa berikut:\n${historyText}\n\nBerikan rangkuman evaluasi singkat (1 paragraf) yang menyebutkan kekuatan siswa dan area spesifik yang masih perlu dilatih. Gunakan bahasa Indonesia yang bersahabat dan memotivasi.`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ insights: result.text });
  } catch (error) {
    console.error('Student Insights Error:', error);
    res.status(500).json({ error: 'Gagal menganalisis profil' });
  }
};

const getTeacherInsights = async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const userSupabase = createClient(
      process.env.SUPABASE_URL, 
      process.env.SUPABASE_ANON_KEY, 
      { 
        global: { headers: { Authorization: req.headers.authorization } },
        db: { schema: 'kumerdeka_base' } 
      }
    );

    // Sebagai guru, tarik data dari 50 riwayat terakhir di kelas
    const { data: history } = await userSupabase
      .from('riwayat_kuis')
      .select('siswa_id, topik, skor, kelemahan_terdeteksi')
      .order('tanggal', { ascending: false })
      .limit(50);

    if (!history || history.length === 0) {
      return res.json({ insights: 'Belum ada data kelas yang cukup.' });
    }

    const prompt = `Anda adalah asisten analitik guru. Ini adalah log performa kuis terakhir dari para siswa:\n${JSON.stringify(history)}\n\nBuatkan ringkasan analitik kelas: adakah pola kelemahan umum pada topik tertentu? Berapa rata-rata kesulitan mereka? Berikan saran tindakan strategis untuk guru dalam 3 poin singkat.`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ insights: result.text });
  } catch (error) {
    res.status(500).json({ error: 'Gagal menganalisis kelas' });
  }
};

const generateQuestions = async (req, res) => {
  try {
    const { topik, jumlah_soal, material_id } = req.body;
    const user = req.user;

    const { createClient } = require('@supabase/supabase-js');
    const userSupabase = createClient(
      process.env.SUPABASE_URL, 
      process.env.SUPABASE_ANON_KEY, 
      { 
        global: { headers: { Authorization: req.headers.authorization } },
        db: { schema: 'kumerdeka_base' } 
      }
    );

    // 1. Ambil data material jika material_id tersedia (untuk mendapatkan subject_id)
    let materialData = null;
    if (material_id) {
      const { data: mat } = await userSupabase
        .from('materials')
        .select('id, judul, subject_id, cp_id, tp_id')
        .eq('id', material_id)
        .single();
      materialData = mat;
    }

    // 2. RAG: Cari dokumen relevan dari bank_soal_vektor
    let contextText = '';
    const queryStr = topik || (materialData?.judul) || 'Materi umum';
    
    try {
      const queryEmbeddingResponse = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: queryStr,
        config: { outputDimensionality: 768 }
      });
      const queryEmbedding = queryEmbeddingResponse.embeddings[0].values;
      
      const { data: matchedDocs } = await userSupabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: 5
      });

      if (matchedDocs && matchedDocs.length > 0) {
        contextText = matchedDocs.map(doc => doc.content).join('\n\n');
      }
    } catch (e) {
      console.warn('Gagal melakukan pencarian vektor:', e.message);
    }

    // 3. Generate soal dengan AI
    const prompt = `Anda adalah pembuat soal profesional. Buatkan ${jumlah_soal || 10} soal pilihan ganda (A, B, C, D) tentang topik "${queryStr}".
    ${contextText ? 'Gunakan referensi materi berikut jika relevan:\n' + contextText : ''}
    
    Keluarkan HASIL SAJA dalam format JSON murni TANPA markdown, TANPA backtick, dengan struktur array of object:
    [{"pertanyaan": "Pertanyaan soal", "pilihan": {"a": "Opsi A", "b": "Opsi B", "c": "Opsi C", "d": "Opsi D"}, "jawaban": "a", "kesulitan": "Mudah"}]
    Nilai kesulitan: Mudah, Sedang, atau Sulit. Nilai jawaban: a, b, c, atau d (huruf kecil).`;

    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { temperature: 0.2 }
    });

    let jsonString = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(jsonString);

    // 4. Cek kolom wajib bank_soal dengan menyisipkan dummy — kita perlu cari tahu kolom "subject_id"
    // Berdasarkan error sebelumnya: bank_soal punya kolom subject_id (NOT NULL)
    // Ambil subject_id dari material jika ada, atau dari request body
    const subject_id = materialData?.subject_id || req.body.subject_id || null;

    if (!subject_id) {
      return res.status(400).json({ error: 'subject_id diperlukan. Pilih materi yang memiliki relasi kurikulum lengkap.' });
    }

    const questionsToInsert = questions.map(q => ({
      subject_id: subject_id,
      cp_id: materialData?.cp_id || req.body.cp_id || subject_id,
      tp_id: materialData?.tp_id || req.body.tp_id || subject_id,
      pertanyaan: q.pertanyaan,
      tipe_pertanyaan: 'PG',
      pilihan: q.pilihan || { a: q.opsi_a, b: q.opsi_b, c: q.opsi_c, d: q.opsi_d },
      jawaban: (q.jawaban || q.jawaban_benar || 'a').toLowerCase(),
      kesulitan: q.kesulitan || q.tingkat_kesulitan || 'Sedang',
      pembuat: user.id,
    }));

    const { data: insertedData, error: insertError } = await userSupabase
      .from('bank_soal')
      .insert(questionsToInsert)
      .select();
    
    if (insertError) {
      console.error('Insert bank_soal error:', insertError);
      throw insertError;
    }

    res.json({ 
      message: 'Berhasil membuat soal', 
      count: questionsToInsert.length,
      questions: insertedData 
    });
  } catch (error) {
    console.error('Generate Questions Error:', error);
    res.status(500).json({ error: 'Gagal membuat soal dari materi: ' + error.message });
  }
};

module.exports = {
  uploadMaterial,
  generateQuiz,
  getStudentInsights,
  getTeacherInsights,
  generateQuestions
};
