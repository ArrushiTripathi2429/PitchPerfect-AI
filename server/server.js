if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

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
    "https://pitchperfectfrontend.vercel.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'PitchPerfect Backend is running!' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/script', scriptRoutes);
app.use('/api/report', reportRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;