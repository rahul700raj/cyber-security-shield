const API_URL = window.location.origin + '/api';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        showDashboard();
        loadDashboardData();
    } else {
        showAuthModal();
    }
});

// Auth Functions
function showAuthModal() {
    document.getElementById('authModal').classList.add('active');
    document.getElementById('dashboard').classList.remove('active');
}

function showDashboard() {
    document.getElementById('authModal').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
    document.getElementById('userName').textContent = currentUser.username || 'User';
}

function switchToSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

function switchToLogin() {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDashboard();
            loadDashboardData();
            showNotification('Login successful!', 'success');
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('Connection error. Please try again.', 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showDashboard();
            loadDashboardData();
            showNotification('Account created successfully!', 'success');
        } else {
            showNotification(data.message || 'Signup failed', 'error');
        }
    } catch (error) {
        showNotification('Connection error. Please try again.', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    authToken = null;
    currentUser = {};
    showAuthModal();
    showNotification('Logged out successfully', 'info');
}

// Navigation
function showSection(section) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Update sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });

    // Update title and show section
    const titles = {
        overview: 'Security Overview',
        firewall: 'Firewall Management',
        alerts: 'Security Alerts',
        logs: 'Security Logs',
        databases: 'Cyber Security Databases'
    };

    document.getElementById('sectionTitle').textContent = titles[section];
    document.getElementById(`${section}Section`).classList.add('active');

    // Load section data
    if (section === 'firewall') loadFirewallData();
    if (section === 'alerts') loadAlerts();
    if (section === 'logs') loadLogs();
}

// Dashboard Data
async function loadDashboardData() {
    try {
        const response = await fetch(`${API_URL}/security/dashboard`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            updateDashboardStats(data);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateDashboardStats(data) {
    document.getElementById('totalThreats').textContent = data.totalThreats || 0;
    document.getElementById('criticalThreats').textContent = data.criticalThreats || 0;
    document.getElementById('blockedIPs').textContent = data.blockedIPs || 0;
    document.getElementById('firewallStatus').textContent = data.firewallStatus || 'Active';

    // Update threat chart
    const chartDiv = document.getElementById('threatChart');
    chartDiv.innerHTML = '';

    if (data.threatsByType && data.threatsByType.length > 0) {
        const maxCount = Math.max(...data.threatsByType.map(t => t.count));
        
        data.threatsByType.forEach(threat => {
            const percentage = (threat.count / maxCount) * 100;
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.innerHTML = `
                <div class="chart-label">${formatThreatType(threat._id)}</div>
                <div class="chart-progress">
                    <div class="chart-fill" style="width: ${percentage}%">${threat.count}</div>
                </div>
            `;
            chartDiv.appendChild(bar);
        });
    } else {
        chartDiv.innerHTML = '<p style="text-align: center; color: var(--secondary);">No threats detected in the last 24 hours</p>';
    }
}

// Firewall
async function loadFirewallData() {
    try {
        const response = await fetch(`${API_URL}/security/firewall`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            displayFirewallRules(data.rules);
        }
    } catch (error) {
        console.error('Error loading firewall:', error);
    }
}

function displayFirewallRules(rules) {
    const rulesDiv = document.getElementById('firewallRules');
    rulesDiv.innerHTML = '';

    rules.forEach(rule => {
        const card = document.createElement('div');
        card.className = 'rule-card';
        card.innerHTML = `
            <h3>
                ${rule.name}
                <span class="badge success">${rule.status}</span>
            </h3>
            <p>${rule.description}</p>
        `;
        rulesDiv.appendChild(card);
    });
}

// Alerts
async function loadAlerts() {
    try {
        const response = await fetch(`${API_URL}/alerts?limit=20`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const alerts = await response.json();
            displayAlerts(alerts);
        }
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

function displayAlerts(alerts) {
    const alertsDiv = document.getElementById('alertsList');
    alertsDiv.innerHTML = '';

    if (alerts.length === 0) {
        alertsDiv.innerHTML = '<p style="text-align: center; color: var(--secondary);">No alerts found</p>';
        return;
    }

    alerts.forEach(alert => {
        const item = document.createElement('div');
        item.className = `alert-item ${alert.severity}`;
        item.innerHTML = `
            <div class="alert-header">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-time">${formatDate(alert.createdAt)}</div>
            </div>
            <div class="alert-message">${alert.message}</div>
            <div class="alert-actions">
                ${alert.status === 'active' ? `
                    <button class="btn btn-sm btn-primary" onclick="acknowledgeAlert('${alert._id}')">
                        <i class="fas fa-check"></i> Acknowledge
                    </button>
                    <button class="btn btn-sm btn-success" onclick="resolveAlert('${alert._id}')">
                        <i class="fas fa-check-double"></i> Resolve
                    </button>
                ` : `
                    <span class="badge ${alert.status === 'resolved' ? 'success' : 'warning'}">${alert.status}</span>
                `}
            </div>
        `;
        alertsDiv.appendChild(item);
    });
}

async function acknowledgeAlert(id) {
    try {
        const response = await fetch(`${API_URL}/alerts/${id}/acknowledge`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            showNotification('Alert acknowledged', 'success');
            loadAlerts();
        }
    } catch (error) {
        showNotification('Error acknowledging alert', 'error');
    }
}

async function resolveAlert(id) {
    try {
        const response = await fetch(`${API_URL}/alerts/${id}/resolve`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            showNotification('Alert resolved', 'success');
            loadAlerts();
        }
    } catch (error) {
        showNotification('Error resolving alert', 'error');
    }
}

function refreshAlerts() {
    loadAlerts();
    showNotification('Alerts refreshed', 'info');
}

// Logs
async function loadLogs() {
    const severity = document.getElementById('severityFilter').value;
    const url = severity ? `${API_URL}/security/logs?severity=${severity}` : `${API_URL}/security/logs`;

    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const logs = await response.json();
            displayLogs(logs);
        }
    } catch (error) {
        console.error('Error loading logs:', error);
    }
}

function displayLogs(logs) {
    const logsDiv = document.getElementById('logsList');
    logsDiv.innerHTML = '';

    if (logs.length === 0) {
        logsDiv.innerHTML = '<p style="text-align: center; color: var(--secondary);">No logs found</p>';
        return;
    }

    logs.forEach(log => {
        const item = document.createElement('div');
        item.className = `log-item ${log.severity}`;
        item.innerHTML = `
            <div class="log-header">
                <div class="log-title">
                    ${formatThreatType(log.type)} 
                    <span class="badge ${log.severity}">${log.severity}</span>
                </div>
                <div class="log-time">${formatDate(log.timestamp)}</div>
            </div>
            <div class="log-description">
                ${log.description || 'No description'}
                <br><small>IP: ${log.ipAddress}</small>
            </div>
        `;
        logsDiv.appendChild(item);
    });
}

function filterLogs() {
    loadLogs();
}

function refreshLogs() {
    loadLogs();
    showNotification('Logs refreshed', 'info');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

function formatThreatType(type) {
    const types = {
        'login_attempt': 'Login Attempt',
        'failed_login': 'Failed Login',
        'suspicious_activity': 'Suspicious Activity',
        'firewall_block': 'Firewall Block',
        'malware_detected': 'Malware Detected',
        'ddos_attempt': 'DDoS Attempt',
        'unauthorized_access': 'Unauthorized Access'
    };
    return types[type] || type;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);