# 🛡️ Cyber Security Shield

Advanced Cyber Security Application with Real-time Threat Detection, Firewall Management, and Emergency Alert System.

![Cyber Security Shield](https://img.shields.io/badge/Security-Advanced-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Features

### 🔥 Advanced Firewall
- **Rate Limiting**: Automatic blocking of excessive requests (100 requests per 15 minutes)
- **SQL Injection Protection**: Detects and blocks malicious SQL patterns
- **XSS Protection**: Prevents cross-site scripting attacks
- **DDoS Protection**: Real-time monitoring for DDoS attack patterns
- **IP Blocking**: Automatic blocking of suspicious IP addresses

### 🚨 Real-time Alert System
- **Emergency Contact Integration**: Automatic notifications to **7004398297**
- **Multi-level Severity**: Info, Warning, Danger, Critical alerts
- **SMS Notifications**: Critical alerts sent via SMS (Twilio integration ready)
- **Alert Management**: Acknowledge and resolve alerts from dashboard
- **24/7 Monitoring**: Continuous security monitoring

### 📊 Security Dashboard
- **Real-time Statistics**: Total threats, critical threats, blocked IPs
- **Threat Visualization**: Interactive charts showing threat distribution
- **Security Logs**: Detailed logging of all security events
- **Firewall Status**: Live firewall status and rules monitoring
- **User Activity Tracking**: Monitor login attempts and user behavior

### 🔐 Authentication & Security
- **Secure Login/Signup**: JWT-based authentication
- **Password Hashing**: bcrypt encryption for passwords
- **Account Lockout**: Automatic lockout after 5 failed login attempts
- **Session Management**: Secure token-based sessions
- **Role-based Access**: User and Admin roles

### 🗄️ Cyber Security Database Links
Direct access to major security databases:
- **CVE Database**: Common Vulnerabilities and Exposures
- **Exploit Database**: Known exploits and vulnerable software
- **VirusTotal**: Malware analysis and detection
- **NIST NVD**: National Vulnerability Database
- **Shodan**: Internet-connected devices search
- **Have I Been Pwned**: Data breach notifications

### 🤖 Automated Security Monitoring
- **Suspicious Activity Detection**: Checks every 5 minutes
- **DDoS Pattern Detection**: Real-time monitoring every minute
- **Daily Security Reports**: Automated daily summaries
- **Failed Login Tracking**: Monitors and blocks brute force attempts
- **High Request Rate Detection**: Identifies potential attacks

## 📋 Prerequisites

- Node.js 18 or higher
- MongoDB database
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/rahul700raj/cyber-security-shield.git
cd cyber-security-shield
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/cybersecurity
JWT_SECRET=your_secure_jwt_secret_key
EMERGENCY_CONTACT=7004398297

# Optional: For SMS notifications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

4. **Start the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. **Access the application**
Open your browser and navigate to: `http://localhost:3000`

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables in Vercel dashboard**
- Go to your project settings
- Add all environment variables from `.env`
- Redeploy

### Deploy to Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and deploy**
```bash
railway login
railway init
railway up
```

3. **Add MongoDB**
```bash
railway add mongodb
```

### Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Create and deploy**
```bash
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

## 📱 Usage

### First Time Setup

1. **Create an account**
   - Click "Sign Up" on the login page
   - Enter username, email, and password
   - Click "Sign Up" button

2. **Login**
   - Enter your email and password
   - Click "Login" button

3. **Explore Dashboard**
   - View security statistics
   - Monitor threats in real-time
   - Check firewall status
   - Review security logs

### Managing Alerts

1. **View Alerts**
   - Navigate to "Alerts" section
   - See all active, acknowledged, and resolved alerts

2. **Acknowledge Alert**
   - Click "Acknowledge" button on any active alert
   - Alert status changes to "acknowledged"

3. **Resolve Alert**
   - Click "Resolve" button to mark alert as resolved
   - Alert is archived with resolution timestamp

### Security Monitoring

The system automatically monitors for:
- Multiple failed login attempts (3+ in 5 minutes)
- High request rates (50+ requests per minute)
- Suspicious IP addresses
- DDoS attack patterns
- Unauthorized access attempts

## 🔒 Security Features

### Firewall Rules

1. **Rate Limiting**
   - 100 requests per 15 minutes per IP
   - Automatic blocking of excessive requests

2. **SQL Injection Protection**
   - Pattern detection for malicious SQL
   - Automatic request blocking

3. **XSS Protection**
   - Cross-site scripting prevention
   - Input sanitization

4. **DDoS Protection**
   - Real-time pattern analysis
   - Automatic IP blocking

### Alert Severity Levels

- **Info**: General information, no action required
- **Warning**: Potential issue, monitor closely
- **Danger**: Security concern, action recommended
- **Critical**: Immediate threat, emergency contact notified

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account

### Security
- `GET /api/security/dashboard` - Get dashboard statistics
- `GET /api/security/logs` - Get security logs
- `GET /api/security/firewall` - Get firewall status
- `GET /api/security/health` - System health check

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts` - Create manual alert
- `PATCH /api/alerts/:id/acknowledge` - Acknowledge alert
- `PATCH /api/alerts/:id/resolve` - Resolve alert
- `GET /api/alerts/stats` - Get alert statistics

## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Helmet**: Security headers
- **Express Rate Limit**: Rate limiting
- **Node-cron**: Scheduled tasks
- **Winston**: Logging

### Frontend
- **HTML5**: Structure
- **CSS3**: Styling with modern gradients
- **JavaScript**: Interactivity
- **Font Awesome**: Icons
- **Responsive Design**: Mobile-friendly

## 📞 Emergency Contact

**Emergency Security Contact**: **7004398297**

This number receives automatic notifications for:
- Critical security alerts
- DDoS attack attempts
- Multiple failed login attempts
- Suspicious activity patterns
- System-wide security issues

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rahul Mishra**
- Email: rm2778643@gmail.com
- GitHub: [@rahul700raj](https://github.com/rahul700raj)

## 🙏 Acknowledgments

- MongoDB for database
- Express.js for web framework
- Node.js community
- All open-source contributors

## 📚 Documentation

For detailed documentation, visit:
- [API Documentation](docs/API.md)
- [Security Best Practices](docs/SECURITY.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🐛 Bug Reports

Found a bug? Please open an issue on GitHub with:
- Bug description
- Steps to reproduce
- Expected behavior
- Screenshots (if applicable)

## 💡 Feature Requests

Have an idea? Open an issue with:
- Feature description
- Use case
- Benefits
- Implementation suggestions

---

**⚠️ Security Notice**: This application is designed for educational and professional use. Always follow security best practices and keep your dependencies updated.

**🔐 Remember**: Change all default passwords and secrets before deploying to production!

Made with ❤️ for a more secure internet