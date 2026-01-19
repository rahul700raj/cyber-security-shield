const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['security', 'firewall', 'malware', 'intrusion', 'system'],
    required: true
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'danger', 'critical'],
    default: 'warning'
  },
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved'],
    default: 'active'
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  emergencyContact: {
    type: String,
    default: '7004398297'
  },
  metadata: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: Date
});

alertSchema.index({ createdAt: -1 });
alertSchema.index({ status: 1, severity: 1 });

module.exports = mongoose.model('Alert', alertSchema);