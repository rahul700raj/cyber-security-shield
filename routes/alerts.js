const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { authenticate } = require('../middleware/auth');
const { sendEmergencyNotification } = require('../services/alertService');

// Get all alerts
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, severity, limit = 50 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
});

// Create manual alert
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, message, type, severity } = req.body;

    const alert = new Alert({
      title,
      message,
      type,
      severity,
      emergencyContact: '7004398297'
    });

    await alert.save();

    // Send emergency notification for critical alerts
    if (severity === 'critical') {
      await sendEmergencyNotification(alert);
    }

    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error: error.message });
  }
});

// Acknowledge alert
router.patch('/:id/acknowledge', authenticate, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'acknowledged' },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error acknowledging alert', error: error.message });
  }
});

// Resolve alert
router.patch('/:id/resolve', authenticate, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'resolved',
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error resolving alert', error: error.message });
  }
});

// Get alert statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stats = await Alert.aggregate([
      {
        $match: {
          createdAt: { $gte: last24Hours }
        }
      },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    const activeAlerts = await Alert.countDocuments({ status: 'active' });
    const criticalAlerts = await Alert.countDocuments({ 
      status: 'active',
      severity: 'critical'
    });

    res.json({
      activeAlerts,
      criticalAlerts,
      last24Hours: stats,
      emergencyContact: '7004398297'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alert stats', error: error.message });
  }
});

module.exports = router;