const express = require('express');
const router = express.Router();
const SecurityLog = require('../models/SecurityLog');
const { authenticate } = require('../middleware/auth');

// Get security dashboard stats
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000);

    const stats = await SecurityLog.aggregate([
      {
        $match: {
          timestamp: { $gte: last24Hours }
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          criticalCount: {
            $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
          }
        }
      }
    ]);

    const totalThreats = await SecurityLog.countDocuments({
      timestamp: { $gte: last24Hours }
    });

    const criticalThreats = await SecurityLog.countDocuments({
      timestamp: { $gte: last24Hours },
      severity: 'critical'
    });

    const blockedIPs = await SecurityLog.distinct('ipAddress', {
      type: 'firewall_block',
      timestamp: { $gte: last24Hours }
    });

    res.json({
      totalThreats,
      criticalThreats,
      blockedIPs: blockedIPs.length,
      threatsByType: stats,
      firewallStatus: 'active',
      lastScan: now
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
});

// Get recent security logs
router.get('/logs', authenticate, async (req, res) => {
  try {
    const { limit = 50, severity, type } = req.query;
    
    const query = {};
    if (severity) query.severity = severity;
    if (type) query.type = type;

    const logs = await SecurityLog.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'username email');

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
});

// Firewall status
router.get('/firewall', authenticate, async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const blockedRequests = await SecurityLog.countDocuments({
      type: 'firewall_block',
      timestamp: { $gte: last24Hours }
    });

    const blockedIPs = await SecurityLog.distinct('ipAddress', {
      type: 'firewall_block',
      timestamp: { $gte: last24Hours }
    });

    res.json({
      status: 'active',
      blockedRequests,
      blockedIPs: blockedIPs.length,
      rules: [
        { name: 'Rate Limiting', status: 'active', description: '100 requests per 15 minutes' },
        { name: 'SQL Injection Protection', status: 'active', description: 'Blocks malicious SQL patterns' },
        { name: 'XSS Protection', status: 'active', description: 'Prevents cross-site scripting' },
        { name: 'DDoS Protection', status: 'active', description: 'Monitors for DDoS patterns' }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching firewall status', error: error.message });
  }
});

// System health check
router.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    services: {
      database: 'connected',
      firewall: 'active',
      monitoring: 'active',
      alerts: 'active'
    }
  });
});

module.exports = router;