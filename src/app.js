// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const verificationRoutes = require('./routes/verification');
const authRoutes = require('./routes/auth'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) =>
    console.error('❌ MongoDB connection error:', err.message)
  );

// Routes
app.use('/verify', verificationRoutes);
app.use('/auth', authRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ status: 'API running 🚀' });
});

// Start Server (bind to all interfaces)
const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server listening at http://${HOST}:${PORT}`);
});

// Handle server binding errors
server.on('error', (err) => {
  console.error('❌ Server failed to start:', err.message);
  process.exit(1);
});

module.exports = app;
