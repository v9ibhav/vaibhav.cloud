// Check authentication
if (localStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'index.html';
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab button
    event.target.classList.add('active');
}

// Logout functionality
function logout() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'index.html';
}

// Initialize data storage
function initializeStorage() {
    // Initialize admin password if not set
    if (!localStorage.getItem('adminPassword')) {
        localStorage.setItem('adminPassword', 'Uvuvuv@49');
    }
    
    if (!localStorage.getItem('blogPosts')) {
        localStorage.setItem('blogPosts', JSON.stringify([]));
    }
    if (!localStorage.getItem('portfolioData')) {
        localStorage.setItem('portfolioData', JSON.stringify({
            projects: [
                { title: 'Finance', category: 'Web development', image: './assets/images/project-1.jpg' },
                { title: 'Orizon', category: 'Web development', image: './assets/images/project-2.png' },
                { title: 'Fundo', category: 'Web design', image: './assets/images/project-3.jpg' }
            ]
        }));
    }
    if (!localStorage.getItem('skillsData')) {
        localStorage.setItem('skillsData', JSON.stringify({
            skills: [
                { name: 'Web design', percentage: 80 },
                { name: 'Graphic design', percentage: 70 },
                { name: 'Branding', percentage: 90 },
                { name: 'WordPress', percentage: 50 }
            ],
            education: [
                { institution: 'Harcourt Butler Technical University, Kanpur', period: '2024 - Present', description: '' },
                { institution: 'Central Academy, Kota', period: '2022 - 2024', description: '' },
                { institution: 'Jagran Public School, Kannauj', period: '2012-2022', description: '' }
            ],
            experience: [
                { title: 'Front-End Developer', period: '2020 — Present', description: '' }
            ]
        }));
    }
}

// Blog Management
function loadBlogPosts() {
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const blogPostsContainer = document.getElementById('blogPosts');
    
    if (blogPosts.length === 0) {
        blogPostsContainer.innerHTML = '<p>No blog posts yet. Create your first post above!</p>';
        return;
    }
    
    blogPostsContainer.innerHTML = blogPosts.map((post, index) => `
        <div class="blog-item">
            <div class="blog-item-content">
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <small>Created: ${new Date(post.dateAdded).toLocaleDateString()}</small>
            </div>
            <div class="blog-item-actions">
                <button class="btn btn-small" onclick="editBlogPost(${index})">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteBlogPost(${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function saveBlogPost(formData) {
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const newPost = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        content: formData.content,
        image: formData.image || './assets/images/blog-1.jpg',
        dateAdded: new Date().toISOString(),
        category: 'Blog'
    };
    
    blogPosts.unshift(newPost);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    
    // Update the main website
    updateMainWebsiteBlog();
    
    showSuccessMessage('blogSuccess');
    loadBlogPosts();
}

function deleteBlogPost(index) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        blogPosts.splice(index, 1);
        localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
        updateMainWebsiteBlog();
        loadBlogPosts();
    }
}

// Portfolio Management
function loadPortfolioData() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    const projectsList = document.getElementById('projectsList');
    
    const projects = portfolioData.projects || [];
    
    projectsList.innerHTML = projects.map((project, index) => `
        <div class="project-item-container">
            <h4>Project ${index + 1}</h4>
            <div class="grid">
                <div class="form-group">
                    <label>Project Title</label>
                    <input type="text" name="projectTitle_${index}" value="${project.title}" required>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select name="projectCategory_${index}" required>
                        <option value="Web development" ${project.category === 'Web development' ? 'selected' : ''}>Web development</option>
                        <option value="Web design" ${project.category === 'Web design' ? 'selected' : ''}>Web design</option>
                        <option value="Applications" ${project.category === 'Applications' ? 'selected' : ''}>Applications</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>Project Image URL</label>
                <input type="text" name="projectImage_${index}" value="${project.image}" required>
            </div>
            <button type="button" class="btn btn-danger btn-small" onclick="removeProject(${index})">Remove Project</button>
        </div>
    `).join('');
}

function addProject() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    if (!portfolioData.projects) portfolioData.projects = [];
    
    portfolioData.projects.push({
        title: 'New Project',
        category: 'Web development',
        image: './assets/images/project-1.jpg'
    });
    
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    loadPortfolioData();
}

function removeProject(index) {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
    portfolioData.projects.splice(index, 1);
    localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
    loadPortfolioData();
}

// Skills Management
function loadSkillsData() {
    const skillsData = JSON.parse(localStorage.getItem('skillsData') || '{}');
    
    // Load skills
    const skillsList = document.getElementById('skillsList');
    const skills = skillsData.skills || [];
    skillsList.innerHTML = skills.map((skill, index) => `
        <div class="skill-item-container">
            <div class="grid">
                <div class="form-group">
                    <label>Skill Name</label>
                    <input type="text" name="skillName_${index}" value="${skill.name}" required>
                </div>
                <div class="form-group">
                    <label>Percentage</label>
                    <input type="number" name="skillPercentage_${index}" value="${skill.percentage}" min="0" max="100" required>
                </div>
            </div>
            <button type="button" class="btn btn-danger btn-small" onclick="removeSkill(${index})">Remove</button>
        </div>
    `).join('');
    
    // Load education
    const educationList = document.getElementById('educationList');
    const education = skillsData.education || [];
    educationList.innerHTML = education.map((edu, index) => `
        <div class="education-item-container">
            <div class="form-group">
                <label>Institution</label>
                <input type="text" name="eduInstitution_${index}" value="${edu.institution}" required>
            </div>
            <div class="form-group">
                <label>Period</label>
                <input type="text" name="eduPeriod_${index}" value="${edu.period}" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="eduDescription_${index}">${edu.description}</textarea>
            </div>
            <button type="button" class="btn btn-danger btn-small" onclick="removeEducation(${index})">Remove</button>
        </div>
    `).join('');
    
    // Load experience
    const experienceList = document.getElementById('experienceList');
    const experience = skillsData.experience || [];
    experienceList.innerHTML = experience.map((exp, index) => `
        <div class="experience-item-container">
            <div class="form-group">
                <label>Job Title</label>
                <input type="text" name="expTitle_${index}" value="${exp.title}" required>
            </div>
            <div class="form-group">
                <label>Period</label>
                <input type="text" name="expPeriod_${index}" value="${exp.period}" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="expDescription_${index}">${exp.description}</textarea>
            </div>
            <button type="button" class="btn btn-danger btn-small" onclick="removeExperience(${index})">Remove</button>
        </div>
    `).join('');
}

function addSkill() {
    const skillsData = JSON.parse(localStorage.getItem('skillsData') || '{}');
    if (!skillsData.skills) skillsData.skills = [];
    
    skillsData.skills.push({ name: 'New Skill', percentage: 50 });
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    loadSkillsData();
}

function addEducation() {
    const skillsData = JSON.parse(localStorage.getItem('skillsData') || '{}');
    if (!skillsData.education) skillsData.education = [];
    
    skillsData.education.push({ institution: 'New Institution', period: '2020-2024', description: '' });
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    loadSkillsData();
}

function addExperience() {
    const skillsData = JSON.parse(localStorage.getItem('skillsData') || '{}');
    if (!skillsData.experience) skillsData.experience = [];
    
    skillsData.experience.push({ title: 'New Position', period: '2020-Present', description: '' });
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    loadSkillsData();
}

function removeSkill(index) {
    const skillsData = JSON.parse(localStorage.getItem('skillsData') || '{}');
    skillsData.skills.splice(index, 1);
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    loadSkillsData();
}

function removeEducation(index) {
    const skillsData = JSON.parse(localStorage.getItem('skillsData') || '{}');
    skillsData.education.splice(index, 1);
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    loadSkillsData();
}

function removeExperience(index) {
    const skillsData = JSON.parse(localStorage.getItem('skillsData') || '{}');
    skillsData.experience.splice(index, 1);
    localStorage.setItem('skillsData', JSON.stringify(skillsData));
    loadSkillsData();
}

// Utility functions
function showSuccessMessage(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function showErrorMessage(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function changePassword(currentPassword, newPassword, confirmPassword) {
    const storedPassword = localStorage.getItem('adminPassword');
    
    // Validate current password
    if (currentPassword !== storedPassword) {
        showErrorMessage('passwordError', 'Current password is incorrect.');
        return false;
    }
    
    // Validate new password
    if (newPassword.length < 6) {
        showErrorMessage('passwordError', 'New password must be at least 6 characters long.');
        return false;
    }
    
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
        showErrorMessage('passwordError', 'New password and confirmation do not match.');
        return false;
    }
    
    // Save new password
    localStorage.setItem('adminPassword', newPassword);
    showSuccessMessage('securitySuccess');
    return true;
}

function updateMainWebsiteBlog() {
    // This function would update the main website's blog section
    // For now, we'll just store the data in localStorage
    // In a real implementation, this would make an API call
    console.log('Blog updated on main website');
}

// Form event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeStorage();
    loadBlogPosts();
    loadPortfolioData();
    loadSkillsData();
    loadResumeData();
    
    // Blog form submission
    document.getElementById('blogForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const blogData = {
            title: formData.get('title'),
            description: formData.get('description'),
            content: formData.get('content'),
            image: formData.get('image') ? URL.createObjectURL(formData.get('image')) : null
        };
        saveBlogPost(blogData);
        this.reset();
    });
    
    // Portfolio form submission
    document.getElementById('portfolioForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const portfolioData = { projects: [] };
        
        // Collect project data
        let projectIndex = 0;
        while (formData.get(`projectTitle_${projectIndex}`) !== null) {
            portfolioData.projects.push({
                title: formData.get(`projectTitle_${projectIndex}`),
                category: formData.get(`projectCategory_${projectIndex}`),
                image: formData.get(`projectImage_${projectIndex}`)
            });
            projectIndex++;
        }
        
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        showSuccessMessage('portfolioSuccess');
    });
    
    // Personal form submission
    document.getElementById('personalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const personalData = {};
        
        for (let [key, value] of formData.entries()) {
            personalData[key] = value;
        }
        
        localStorage.setItem('personalData', JSON.stringify(personalData));
        showSuccessMessage('personalSuccess');
    });
    
    // Skills form submission
    document.getElementById('skillsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const skillsData = { skills: [], education: [], experience: [] };
        
        // Collect skills data
        let skillIndex = 0;
        while (formData.get(`skillName_${skillIndex}`) !== null) {
            skillsData.skills.push({
                name: formData.get(`skillName_${skillIndex}`),
                percentage: parseInt(formData.get(`skillPercentage_${skillIndex}`))
            });
            skillIndex++;
        }
        
        // Collect education data
        let eduIndex = 0;
        while (formData.get(`eduInstitution_${eduIndex}`) !== null) {
            skillsData.education.push({
                institution: formData.get(`eduInstitution_${eduIndex}`),
                period: formData.get(`eduPeriod_${eduIndex}`),
                description: formData.get(`eduDescription_${eduIndex}`)
            });
            eduIndex++;
        }
        
        // Collect experience data
        let expIndex = 0;
        while (formData.get(`expTitle_${expIndex}`) !== null) {
            skillsData.experience.push({
                title: formData.get(`expTitle_${expIndex}`),
                period: formData.get(`expPeriod_${expIndex}`),
                description: formData.get(`expDescription_${expIndex}`)
            });
            expIndex++;
        }
        
        localStorage.setItem('skillsData', JSON.stringify(skillsData));
        showSuccessMessage('skillsSuccess');
    });
    
    // Password form submission
    document.getElementById('passwordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');
        
        if (changePassword(currentPassword, newPassword, confirmPassword)) {
            this.reset();
        }
    });
});
    // Resume form submission
    document.getElementById('resumeForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('resumeFile');
        const file = fileInput.files[0];
        
        if (file) {
            if (saveResume(file)) {
                this.reset();
            }
        }
    });
    