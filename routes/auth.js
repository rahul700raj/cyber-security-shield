const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SecurityLog = require('../models/SecurityLog');
const { createAlert } = require('../services/alertService');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Log security event
    await SecurityLog.create({
      type: 'login_attempt',
      severity: 'low',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      userId: user._id,
      description: 'New user registration'
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      await SecurityLog.create({
        type: 'failed_login',
        severity: 'medium',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        description: 'Login attempt with non-existent email'
      });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked()) {
      await createAlert({
        title: '🚨 Account Lockout Attempt',
        message: `Locked account login attempt for ${email}`,
        type: 'security',
        severity: 'warning'
      });
      return res.status(423).json({ message: 'Account is locked. Please try again later.' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + 30 * 60 * 1000; // Lock for 30 minutes
        await createAlert({
          title: '🔒 Account Locked',
          message: `Account ${email} locked due to multiple failed login attempts`,
          type: 'security',
          severity: 'danger'
        });
      }
      
      await user.save();
      
      await SecurityLog.create({
        type: 'failed_login',
        severity: 'high',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        userId: user._id,
        description: `Failed login attempt ${user.loginAttempts}/5`
      });
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    await SecurityLog.create({
      type: 'login_attempt',
      severity: 'low',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      userId: user._id,
      description: 'Successful login'
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;