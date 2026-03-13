require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const scriptRoutes = require('./routes/scriptRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://pitchperfectbackend.vercel.app",
    "https://your-actual-frontend-url.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/script', scriptRoutes);
app.use('/api/report', reportRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});