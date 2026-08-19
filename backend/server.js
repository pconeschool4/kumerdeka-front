require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const compression = require('compression');
const helmet = require('helmet');

// Middleware
// Optimize performance by compressing response bodies
app.use(compression());
// Secure app by setting HTTP response headers
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Basic Route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Kumerdeka-Trace API!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
