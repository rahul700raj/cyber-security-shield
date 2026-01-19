const cron = require('node-cron');
const SecurityLog = require('../models/SecurityLog');
const { createAlert } = require('./alertService');

class SecurityMonitor {
  constructor() {
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;
    
    console.log('🔍 Starting Security Monitor...');
    this.isRunning = true;

    // Check for suspicious activity every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.checkSuspiciousActivity();
    });

    // Check for DDoS patterns every minute
    cron.schedule('* * * * *', async () => {
      await this.checkDDoSPatterns();
    });

    // Daily security report at midnight
    cron.schedule('0 0 * * *', async () => {
      await this.generateDailyReport();
    });
  }

  async checkSuspiciousActivity() {
    try {
      const last5Minutes = new Date(Date.now() - 5 * 60 * 1000);

      // Check for multiple failed login attempts
      const failedLogins = await SecurityLog.aggregate([
        {
          $match: {
            type: 'failed_login',
            timestamp: { $gte: last5Minutes }
          }
        },
        {
          $group: {
            _id: '$ipAddress',
            count: { $sum: 1 }
          }
        },
        {
          $match: {
            count: { $gte: 3 }
          }
        }
      ]);

      for (const item of failedLogins) {
        await createAlert({
          title: '⚠️ Multiple Failed Login Attempts',
          message: `IP ${item._id} has ${item.count} failed login attempts in the last 5 minutes`,
          type: 'security',
          severity: 'warning',
          metadata: {
            ipAddress: item._id,
            attempts: item.count.toString()
          }
        });

        // Log as firewall block
        await SecurityLog.create({
          type: 'firewall_block',
          severity: 'high',
          ipAddress: item._id,
          description: `Blocked due to ${item.count} failed login attempts`
        });
      }
    } catch (error) {
      console.error('Error checking suspicious activity:', error);
    }
  }

  async checkDDoSPatterns() {
    try {
      const lastMinute = new Date(Date.now() - 60 * 1000);

      // Check for high request rate from single IP
      const highRateIPs = await SecurityLog.aggregate([
        {
          $match: {
            timestamp: { $gte: lastMinute }
          }
        },
        {
          $group: {
            _id: '$ipAddress',
            count: { $sum: 1 }
          }
        },
        {
          $match: {
            count: { $gte: 50 } // More than 50 requests per minute
          }
        }
      ]);

      for (const item of highRateIPs) {
        await createAlert({
          title: '🚨 Possible DDoS Attack',
          message: `IP ${item._id} made ${item.count} requests in the last minute`,
          type: 'security',
          severity: 'critical',
          metadata: {
            ipAddress: item._id,
            requestCount: item.count.toString()
          }
        });

        await SecurityLog.create({
          type: 'ddos_attempt',
          severity: 'critical',
          ipAddress: item._id,
          description: `Potential DDoS: ${item.count} requests per minute`
        });
      }
    } catch (error) {
      console.error('Error checking DDoS patterns:', error);
    }
  }

  async generateDailyReport() {
    try {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const stats = await SecurityLog.aggregate([
        {
          $match: {
            timestamp: { $gte: yesterday }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        }
      ]);

      const totalIncidents = stats.reduce((sum, item) => sum + item.count, 0);

      await createAlert({
        title: '📊 Daily Security Report',
        message: `Total security incidents in last 24 hours: ${totalIncidents}`,
        type: 'system',
        severity: 'info',
        metadata: {
          totalIncidents: totalIncidents.toString(),
          reportDate: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error generating daily report:', error);
    }
  }
}

module.exports = new SecurityMonitor();