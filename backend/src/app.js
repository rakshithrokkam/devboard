const express = require('express');
const cors = require('cors');
const jobsRoutes = require('./routes/jobsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jobs', jobsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

module.exports = app;
