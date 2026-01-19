const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate Limiting - Firewall Feature
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: '🚨 Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Routes
const authRoutes = require('./routes/auth');
const securityRoutes = require('./routes/security');
const alertRoutes = require('./routes/alerts');

app.use('/api/auth', authRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/alerts', alertRoutes);

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cybersecurity';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start Security Monitor
const securityMonitor = require('./services/securityMonitor');
securityMonitor.start();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🛡️  Cyber Security Shield running on port ${PORT}`);
});

module.exports = app;