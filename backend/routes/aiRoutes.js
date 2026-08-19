const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadMaterial, generateQuiz, getStudentInsights, getTeacherInsights, generateQuestions } = require('../controllers/aiController');
const { verifyToken } = require('../middleware/authMiddleware');

// Gunakan memori storage agar file tidak tersimpan permanen di backend,
// langsung diolah dan disimpan ke Supabase
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint untuk upload materi (hanya untuk guru)
router.post('/upload', verifyToken, upload.single('file'), uploadMaterial);

// Endpoint untuk Micro-Targeting Kuis
router.post('/generate-quiz', verifyToken, generateQuiz);

// Endpoint untuk Analitik AI
router.get('/insights/student', verifyToken, getStudentInsights);
router.get('/insights/teacher', verifyToken, getTeacherInsights);

// Endpoint untuk Guru: Membuat Soal dari Materi
router.post('/generate-questions', verifyToken, generateQuestions);

module.exports = router;
