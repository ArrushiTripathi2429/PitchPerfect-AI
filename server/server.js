require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { clerkMiddleware } = require('@clerk/express');

const connectDB = require('./config/db');
const scriptRoutes = require('./routes/scriptRoutes');
const reportRoutes = require('./routes/reportRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


app.use(
  clerkMiddleware({
    
  })
);

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

