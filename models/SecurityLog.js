const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['login_attempt', 'failed_login', 'suspicious_activity', 'firewall_block', 'malware_detected', 'ddos_attempt', 'unauthorized_access'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  description: String,
  metadata: {
    type: Map,
    of: String
  },
  resolved: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
securityLogSchema.index({ timestamp: -1 });
securityLogSchema.index({ type: 1, severity: 1 });

module.exports = mongoose.model('SecurityLog', securityLogSchema);