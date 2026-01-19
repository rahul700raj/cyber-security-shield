const Alert = require('../models/Alert');

const EMERGENCY_CONTACT = '7004398297';

async function createAlert(alertData) {
  try {
    const alert = new Alert({
      ...alertData,
      emergencyContact: EMERGENCY_CONTACT
    });

    await alert.save();

    // Send emergency notification for critical alerts
    if (alert.severity === 'critical') {
      await sendEmergencyNotification(alert);
    }

    return alert;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
}

async function sendEmergencyNotification(alert) {
  try {
    console.log(`🚨 EMERGENCY ALERT - Sending to ${EMERGENCY_CONTACT}`);
    console.log(`Title: ${alert.title}`);
    console.log(`Message: ${alert.message}`);
    console.log(`Severity: ${alert.severity}`);
    
    // In production, integrate with Twilio or SMS service
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `🚨 CYBER SECURITY ALERT\n${alert.title}\n${alert.message}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: `+91${EMERGENCY_CONTACT}`
    // });

    alert.notificationSent = true;
    await alert.save();

    return true;
  } catch (error) {
    console.error('Error sending emergency notification:', error);
    return false;
  }
}

module.exports = {
  createAlert,
  sendEmergencyNotification,
  EMERGENCY_CONTACT
};