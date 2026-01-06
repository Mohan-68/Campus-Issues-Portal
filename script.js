
// GLOBAL VARIABLES & CONSTANTS

// Default admin credentials
const DEFAULT_ADMIN = {
    id: 'admin_001',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'System Administrator'
};

// Current logged-in user
let currentUser = null;

// Data arrays
let users = [];
let issues = [];


// INITIALIZATION

// Load data from localStorage when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    showView('login');
});

// UTILITY FUNCTIONS

// Generate unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// Show specific view
function showView(viewName) {
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    
    const targetView = document.getElementById(viewName + 'View');
    if (targetView) {
        targetView.classList.add('active');
    }
}

// LOCAL STORAGE FUNCTIONS

// Load data from localStorage
function loadDataFromStorage() {
    const storedUsers = localStorage.getItem('campusUsers');
    const storedIssues = localStorage.getItem('campusIssues');
    
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    
    if (storedIssues) {
        issues = JSON.parse(storedIssues);
    }
}

// Save users to localStorage
function saveUsers() {
    localStorage.setItem('campusUsers', JSON.stringify(users));
}

// Save issues to localStorage
function saveIssues() {
    localStorage.setItem('campusIssues', JSON.stringify(issues));
}

// AUTHENTICATION FUNCTIONS


// Handle Login
function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    if (!username || !password) {
        showNotification('Please enter username and password!', 'error');
        return;
    }
    
    // Check admin login
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
        currentUser = DEFAULT_ADMIN;
        showDashboard();
        showNotification('Welcome Admin!');
        return;
    }
    
    // Check regular user login
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        currentUser = user;
        showDashboard();
        showNotification(`Welcome ${user.name}!`);
    } else {
        showNotification('Invalid credentials!', 'error');
    }
    
    // Clear form
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

// Handle Registration
function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const role = document.getElementById('registerRole').value;
    
    if (!name || !username || !password) {
        showNotification('Please fill all fields!', 'error');
        return;
    }
    
    // Check if username exists
    if (users.find(u => u.username === username) || username === DEFAULT_ADMIN.username) {
        showNotification('Username already exists!', 'error');
        return;
    }
    
    const newUser = {
        id: generateId(),
        username,
        password,
        name,
        role
    };
    
    users.push(newUser);
    saveUsers();
    showNotification('Registration successful! Please login.');
    showLogin();
    
    // Clear form
    document.getElementById('registerName').value = '';
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerPassword').value = '';
}

// Handle Logout
function handleLogout() {
    currentUser = null;
    showLogin();
    showNotification('Logged out successfully!');
}

// Show login view
function showLogin() {
    showView('login');
}

// Show register view
function showRegister() {
    showView('register');
}


// DASHBOARD FUNCTIONS
// ============================================

// Show Dashboard
function showDashboard() {
    showView('dashboard');
    
    // Update dashboard header
    const dashboardTitle = document.getElementById('dashboardTitle');
    const welcomeText = document.getElementById('welcomeText');
    
    if (currentUser.role === 'admin') {
        dashboardTitle.textContent = 'Admin Dashboard';
    } else {
        dashboardTitle.textContent = 'User Dashboard';
    }
    welcomeText.textContent = `Welcome, ${currentUser.name}!`;
    
    // Show/hide issue form based on role
    const issueFormCard = document.getElementById('issueFormCard');
    const dashboardGrid = document.getElementById('dashboardGrid');
    const issuesListTitle = document.getElementById('issuesListTitle');
    
    if (currentUser.role === 'admin') {
        issueFormCard.style.display = 'none';
        dashboardGrid.classList.add('admin-layout');
        issuesListTitle.textContent = 'All Submitted Issues';
    } else {
        issueFormCard.style.display = 'block';
        dashboardGrid.classList.remove('admin-layout');
        issuesListTitle.textContent = 'My Submitted Issues';
    }
    
    // Load issues
    loadIssues();
}

// ============================================
// ISSUE MANAGEMENT FUNCTIONS
// ============================================

// Handle Submit Issue
function handleSubmitIssue() {
    const title = document.getElementById('issueTitle').value.trim();
    const category = document.getElementById('issueCategory').value;
    const location = document.getElementById('issueLocation').value.trim();
    const description = document.getElementById('issueDescription').value.trim();
    const photoInput = document.getElementById('issuePhoto');
    
    if (!title || !category || !location || !description) {
        showNotification('Please fill all required fields!', 'error');
        return;
    }
    
    const newIssue = {
        id: generateId(),
        title,
        category,
        location,
        description,
        photo: photoInput.files.length > 0 ? document.getElementById('previewImage').src : '',
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        status: 'Pending',
        adminFeedback: '',
        submittedAt: new Date().toISOString()
    };
    
    issues.push(newIssue);
    saveIssues();
    showNotification('Issue submitted successfully!');
    
    // Clear form
    document.getElementById('issueTitle').value = '';
    document.getElementById('issueCategory').value = '';
    document.getElementById('issueLocation').value = '';
    document.getElementById('issueDescription').value = '';
    document.getElementById('issuePhoto').value = '';
    document.getElementById('photoPreview').classList.add('hidden');
    
    // Reload issues
    loadIssues();
}

// Handle photo upload
document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('issuePhoto');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const preview = document.getElementById('photoPreview');
                    const img = document.getElementById('previewImage');
                    img.src = event.target.result;
                    preview.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Load Issues
function loadIssues() {
    const issuesList = document.getElementById('issuesList');
    
    // Filter issues based on user role
    let userIssues;
    if (currentUser.role === 'admin') {
        userIssues = issues;
    } else {
        userIssues = issues.filter(issue => issue.userId === currentUser.id);
    }
    
    if (userIssues.length === 0) {
        issuesList.innerHTML = `
            <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>No issues found</p>
            </div>
        `;
        return;
    }
    
    issuesList.innerHTML = userIssues.map(issue => createIssueCard(issue)).join('');
}

// Create Issue Card HTML
function createIssueCard(issue) {
    const statusClass = issue.status.toLowerCase().replace(' ', '-');
    const statusIcon = getStatusIcon(issue.status);
    const canDelete = currentUser.role !== 'admin';
    
    return `
        <div class="issue-card">
            <div class="issue-header">
                <div style="flex: 1;">
                    <div class="issue-title-row">
                        <h3>${issue.title}</h3>
                        <span class="status-badge ${statusClass}">
                            ${statusIcon}
                            ${issue.status}
                        </span>
                    </div>
                    <div class="issue-details">
                        <p><strong>Issue ID:</strong> ${issue.id}</p>
                        <p><strong>Category:</strong> ${issue.category}</p>
                        <p><strong>Location:</strong> ${issue.location}</p>
                        ${currentUser.role === 'admin' ? `<p><strong>Submitted by:</strong> ${issue.userName} (${issue.userRole})</p>` : ''}
                        <p><strong>Date:</strong> ${new Date(issue.submittedAt).toLocaleString()}</p>
                    </div>
                </div>
                ${canDelete ? `
                    <button class="btn-delete" onclick="deleteIssue('${issue.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                    </button>
                ` : ''}
            </div>
            
            <div class="issue-description">
                <strong>Description:</strong>
                <p>${issue.description}</p>
            </div>
            
            ${issue.photo ? `
                <div class="issue-photo">
                    <strong>Photo:</strong>
                    <img src="${issue.photo}" alt="Issue photo">
                </div>
            ` : ''}
            
            ${issue.adminFeedback ? `
                <div class="admin-feedback-box">
                    <strong>Admin Feedback:</strong>
                    <p>${issue.adminFeedback}</p>
                </div>
            ` : ''}
            
            ${currentUser.role === 'admin' ? `
                <div class="admin-controls">
                    <button class="btn-update" onclick="showFeedbackForm('${issue.id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Update Status & Add Feedback
                    </button>
                    <div id="feedback-form-${issue.id}" style="display: none;" class="feedback-form">
                        <div class="form-group">
                            <label>Status</label>
                            <select id="status-${issue.id}">
                                <option value="Pending" ${issue.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In Progress" ${issue.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                                <option value="Resolved" ${issue.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Feedback</label>
                            <textarea id="feedback-${issue.id}" rows="2" placeholder="Enter your feedback...">${issue.adminFeedback || ''}</textarea>
                        </div>
                        <div class="feedback-buttons">
                            <button class="btn-update-submit" onclick="updateIssue('${issue.id}')">Update</button>
                            <button class="btn-cancel" onclick="hideFeedbackForm('${issue.id}')">Cancel</button>
                        </div>
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

// Get status icon SVG
function getStatusIcon(status) {
    switch(status) {
        case 'Pending':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
            </svg>`;
        case 'In Progress':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>`;
        case 'Resolved':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>`;
        default:
            return '';
    }
}

// Show feedback form
function showFeedbackForm(issueId) {
    const form = document.getElementById(`feedback-form-${issueId}`);
    if (form) {
        form.style.display = 'block';
    }
}

// Hide feedback form
function hideFeedbackForm(issueId) {
    const form = document.getElementById(`feedback-form-${issueId}`);
    if (form) {
        form.style.display = 'none';
    }
}

// Update Issue (Admin)
function updateIssue(issueId) {
    const status = document.getElementById(`status-${issueId}`).value;
    const feedback = document.getElementById(`feedback-${issueId}`).value.trim();
    
    const issueIndex = issues.findIndex(issue => issue.id === issueId);
    if (issueIndex !== -1) {
        issues[issueIndex].status = status;
        issues[issueIndex].adminFeedback = feedback;
        saveIssues();
        showNotification('Issue updated successfully!');
        loadIssues();
    }
}

// Delete Issue
function deleteIssue(issueId) {
    if (confirm('Are you sure you want to delete this issue?')) {
        issues = issues.filter(issue => issue.id !== issueId);
        saveIssues();
        showNotification('Issue deleted successfully!');
        loadIssues();
    }
}

// ============================================
// KEYBOARD EVENT HANDLERS
// ============================================

// Add Enter key support for login
document.addEventListener('DOMContentLoaded', function() {
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    
    if (loginUsername) {
        loginUsername.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
    
    if (loginPassword) {
        loginPassword.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
});