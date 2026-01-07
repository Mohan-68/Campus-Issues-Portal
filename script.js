// ============================================
        // GLOBAL VARIABLES & CONSTANTS
        // ============================================

        // Default admin credentials
        const DEFAULT_ADMIN = {
            id: 'admin_001',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'System Administrator'
        };

        // Role emojis mapping
        // const userRole = {
        //     'student',
        //     'staff',
        //     'faculty',
        //     'admin',
        // };

        // Role labels mapping
        const ROLE_LABELS = {
            'student': 'Student',
            'staff': 'Staff',
            'faculty': 'Faculty',
            'admin': 'Administrator'
        };

        // Status emojis mapping
        // const STATUS_EMOJIS = {
        //     'Pending': '⏳',
        //     'In Progress': '🔄',
        //     'Resolved': '✅'
        // };

        // Category emojis mapping
        const CATEGORY_EMOJIS = {
            'Electrical': '⚡',
            'Plumbing': '🚰',
            'IT and Technical': '💻',
            'Cleaning': '🧹',
            'Security & Safety': '🔒',
            'Transport & Parking': '🚗',
            'Hostel': '🏠',
            'Other': '📌'
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
            
            // Add Enter key support for login
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
            const role = document.getElementById('loginRole').value;
            
            if (!username || !password) {
                showNotification('Please enter username and password!', 'error');
                return;
            }
            
            // Check admin login (admin doesn't need role selection)
            if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
                currentUser = DEFAULT_ADMIN;
                showDashboard();
                showNotification('Welcome Admin!');
                return;
            }
            
            // Check regular user login
            const user = users.find(u => u.username === username && u.password === password && u.role === role);
            if (user) {
                currentUser = user;
                showDashboard();
                showNotification(`Welcome ${user.name}!`);
            } else {
                showNotification('Invalid credentials or role mismatch!', 'error');
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
            
            users.push
        }

        // Clear form
        document.getElementById('registerName').value = '';
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
    

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
   

    // Show Dashboard
    function showDashboard() {
        showView('dashboard');
        
        // Update dashboard header
        const dashboardTitle = document.getElementById('dashboardTitle');
        const welcomeText = document.getElementById('welcomeText');
        const userRoleText = document.getElementById('userRoleText');
        const userRoleIcon = document.getElementById('userRoleIcon');
        
        const roleEmoji = ROLE_EMOJIS[currentUser.role] || '👤';
        const roleLabel = ROLE_LABELS[currentUser.role] || currentUser.role;
        
        if (currentUser.role === 'admin') {
            dashboardTitle.textContent = 'Admin Dashboard';
        } else {
            dashboardTitle.textContent = 'User Dashboard';
        }
        
        welcomeText.textContent = `Welcome, ${currentUser.name}!`;
        userRoleText.textContent = `${roleEmoji} ${roleLabel}`;
        userRoleIcon.textContent = roleEmoji;
        
        // Show/hide issue form based on role
        const issueFormCard = document.getElementById('issueFormCard');
        const dashboardGrid = document.getElementById('dashboardGrid');
        const issuesListTitle = document.getElementById('issuesListTitle');
        
        if (currentUser.role === 'admin') {
            issueFormCard.style.display = 'none';
            dashboardGrid.classList.add('admin-layout');
            issuesListTitle.textContent = '📋 All Submitted Issues';
        } else {
            issueFormCard.style.display = 'block';
            dashboardGrid.classList.remove('admin-layout');
            issuesListTitle.textContent = '📋 My Submitted Issues';
        }
        
        // Load issues
        loadIssues();
    }

    
    // ISSUE MANAGEMENT FUNCTIONS
    

    // Handle Submit Issue
    function handleSubmitIssue() {
        const title = document.getElementById('issueTitle').value.trim();
        const category = document.getElementById('issueCategory').value;
        const location = document.getElementById('issueLocation').value.trim();
        const description = document.getElementById('issueDescription').value.trim();
        
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
        
        // Reload issues
        loadIssues();
    }

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
                    <div class="emoji">📭</div>
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
        const statusEmoji = STATUS_EMOJIS[issue.status] || '📌';
        const categoryEmoji = CATEGORY_EMOJIS[issue.category] || '📌';
        const roleEmoji = ROLE_EMOJIS[issue.userRole] || '👤';
        const canDelete = currentUser.role !== 'admin';
        
        return `
            <div class="issue-card">
                <div class="issue-header">
                    <div style="flex: 1;">
                        <div class="issue-title-row">
                            <h3>${issue.title}</h3>
                            <span class="status-badge ${statusClass}">
                                ${statusEmoji} ${issue.status}
                            </span>
                        </div>
                        <div class="issue-details">
                            <p><strong>Issue ID:</strong> ${issue.id}</p>
                            <p><strong>Submitted by:</strong> ${issue.userName} ${roleEmoji}</p>
                            <p><strong>Category:</strong> ${categoryEmoji} ${issue.category}</p>
                            <p><strong>Location:</strong> 📍 ${issue.location}</p>
                            <p><strong>Date:</strong> 📅 ${new Date(issue.submittedAt).toLocaleString()}</p>
                        </div>
                    </div>
                    ${canDelete ? `
                        <button class="btn-delete" onclick="deleteIssue('${issue.id}')" title="Delete Issue">
                            🗑️
                        </button>
                    ` : ''}
                </div>
                
                <div class="issue-description">
                    <strong>📝 Description:</strong>
                    <p>${issue.description}</p>
                </div>
                
                ${issue.adminFeedback ? `
                    <div class="admin-feedback-box">
                        <strong>💬 Admin Feedback:</strong>
                        <p>${issue.adminFeedback}</p>
                    </div>
                ` : ''}
                
                ${currentUser.role === 'admin' ? `
                    <div class="admin-controls">
                        <button class="btn-update" onclick="showFeedbackForm('${issue.id}')">
                            ✏️ Update Status & Add Feedback
                        </button>
                        <div id="feedback-form-${issue.id}" style="display: none;" class="feedback-form">
                            <div class="form-group">
                                <label>Status</label>
                                <select id="status-${issue.id}">
                                    <option value="Pending" ${issue.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
                                    <option value="In Progress" ${issue.status === 'In Progress' ? 'selected' : ''}>🔄 In Progress</option>
                                    <option value="Resolved" ${issue.status === 'Resolved' ? 'selected' : ''}>✅ Resolved</option>
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
