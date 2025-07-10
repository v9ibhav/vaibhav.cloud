// Admin Integration for Main Website
// This file handles loading data from admin panel to the main website

class AdminDataLoader {
    constructor() {
        this.loadBlogPosts();
        this.loadPersonalData();
        this.loadPortfolioData();
        this.loadSkillsData();
        this.loadServicesData();
    }

    loadBlogPosts() {
        const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const blogPostsList = document.querySelector('.blog-posts-list');
        
        if (!blogPostsList || blogPosts.length === 0) {
            return;
        }

        blogPostsList.innerHTML = blogPosts.map(post => `
            <li class="blog-post-item">
                <a href="#" onclick="openBlogPost('${post.id}')">
                    <figure class="blog-banner-box">
                        <img src="${post.image}" alt="${post.title}" loading="lazy" onerror="this.src='./assets/images/blog-1.jpg'">
                    </figure>
                    <div class="blog-content">
                        <div class="blog-meta">
                            <p class="blog-category">${post.category}</p>
                            <span class="dot"></span>
                            <time datetime="${post.dateAdded}">${this.formatDate(post.dateAdded)}</time>
                        </div>
                        <h3 class="h3 blog-item-title">${post.title}</h3>
                        <p class="blog-text">${post.description}</p>
                    </div>
                </a>
            </li>
        `).join('');
    }

    loadPersonalData() {
        const personalData = JSON.parse(localStorage.getItem('personalData') || '{}');
        
        // Update name
        if (personalData.fullName) {
            const nameElement = document.querySelector('.name');
            if (nameElement) nameElement.textContent = personalData.fullName;
        }

        // Update title
        if (personalData.title) {
            const titleElement = document.querySelector('.title');
            if (titleElement) titleElement.textContent = personalData.title;
        }

        // Update contact info
        if (personalData.email) {
            const emailLink = document.querySelector('a[href^="mailto:"]');
            if (emailLink) {
                emailLink.href = `mailto:${personalData.email}`;
                emailLink.textContent = personalData.email;
            }
        }

        if (personalData.phone) {
            const phoneLink = document.querySelector('a[href^="tel:"]');
            if (phoneLink) {
                phoneLink.href = `tel:${personalData.phone}`;
                phoneLink.textContent = personalData.phone;
            }
        }

        if (personalData.birthday) {
            const birthdayElement = document.querySelector('time[datetime]');
            if (birthdayElement) {
                birthdayElement.setAttribute('datetime', personalData.birthday);
                birthdayElement.textContent = this.formatDate(personalData.birthday);
            }
        }

        if (personalData.location) {
            const locationElement = document.querySelector('address');
            if (locationElement) locationElement.textContent = personalData.location;
        }

        // Update about text
        if (personalData.aboutText) {
            const aboutTextElements = document.querySelectorAll('.about-text p');
            if (aboutTextElements.length > 0) {
                aboutTextElements[0].textContent = personalData.aboutText;
            }
        }

        // Update social links
        if (personalData.linkedin) {
            const linkedinLink = document.querySelector('a[href*="linkedin"]');
            if (linkedinLink) linkedinLink.href = personalData.linkedin;
        }

        if (personalData.twitter) {
            const twitterLink = document.querySelector('a[href*="twitter"], a[href*="x.com"]');
            if (twitterLink) twitterLink.href = personalData.twitter;
        }

        if (personalData.instagram) {
            const instagramLink = document.querySelector('a[href*="instagram"]');
            if (instagramLink) instagramLink.href = personalData.instagram;
        }
    }

    loadPortfolioData() {
        const portfolioData = JSON.parse(localStorage.getItem('portfolioData') || '{}');
        const projectList = document.querySelector('.project-list');
        
        if (!projectList || !portfolioData.projects) {
            return;
        }

        projectList.innerHTML = portfolioData.projects.map((project, index) => `
            <li class="project-item active" data-filter-item data-category="${project.category.toLowerCase()}">
                <a href="#">
                    <figure class="project-img">
                        <div class="project-item-icon-box">
                            <ion-icon name="eye-outline"></ion-icon>
                        </div>
                        <img src="${project.image}" alt="${project.title}" loading="lazy">
                    </figure>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-category">${project.category}</p>
                </a>
            </li>
        `).join('');
    }

    loadSkillsData() {
        const skillsData = JSON.parse(localStorage.getItem('skillsData') || '{}');
        
        // Load skills
        if (skillsData.skills) {
            const skillsList = document.querySelector('.skills-list');
            if (skillsList) {
                skillsList.innerHTML = skillsData.skills.map(skill => `
                    <li class="skills-item">
                        <div class="title-wrapper">
                            <h5 class="h5">${skill.name}</h5>
                            <data value="${skill.percentage}">${skill.percentage}%</data>
                        </div>
                        <div class="skill-progress-bg">
                            <div class="skill-progress-fill" style="width: ${skill.percentage}%;"></div>
                        </div>
                    </li>
                `).join('');
            }
        }

        // Load education
        if (skillsData.education) {
            const educationList = document.querySelector('.timeline-list');
            if (educationList) {
                educationList.innerHTML = skillsData.education.map(edu => `
                    <li class="timeline-item">
                        <h4 class="h4 timeline-item-title">${edu.institution}</h4>
                        <span>${edu.period}</span>
                        <p class="timeline-text">${edu.description}</p>
                    </li>
                `).join('');
            }
        }

        // Load experience
        if (skillsData.experience) {
            const experienceList = document.querySelectorAll('.timeline-list')[1];
            if (experienceList) {
                experienceList.innerHTML = skillsData.experience.map(exp => `
                    <li class="timeline-item">
                        <h4 class="h4 timeline-item-title">${exp.title}</h4>
                        <span>${exp.period}</span>
                        <p class="timeline-text">${exp.description}</p>
                    </li>
                `).join('');
            }
        }
    }

    loadServicesData() {
        const servicesData = JSON.parse(localStorage.getItem('servicesData') || '{}');
        const servicesList = document.querySelector('.service-list');
        
        if (!servicesList || !servicesData.services) {
            return;
        }

        servicesList.innerHTML = servicesData.services.map(service => `
            <li class="service-item">
                <div class="service-icon-box">
                    <img src="${service.icon}" alt="${service.title} icon" width="40">
                </div>
                <div class="service-content-box">
                    <h4 class="h4 service-item-title">${service.title}</h4>
                    <p class="service-item-text">${service.description}</p>
                </div>
            </li>
        `).join('');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-US', options);
    }
}

// Blog post modal functionality
function openBlogPost(postId) {
    const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = blogPosts.find(p => p.id == postId);
    
    if (!post) return;

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'blog-modal';
    modal.innerHTML = `
        <div class="blog-modal-overlay" onclick="closeBlogModal()"></div>
        <div class="blog-modal-content">
            <button class="blog-modal-close" onclick="closeBlogModal()">&times;</button>
            <img src="${post.image}" alt="${post.title}" class="blog-modal-image">
            <div class="blog-modal-body">
                <h2>${post.title}</h2>
                <div class="blog-modal-meta">
                    <span class="blog-modal-category">${post.category}</span>
                    <span class="blog-modal-date">${new Date(post.dateAdded).toLocaleDateString()}</span>
                </div>
                <div class="blog-modal-content-text">
                    ${post.content.replace(/\n/g, '<br>')}
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .blog-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .blog-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
        }
        .blog-modal-content {
            position: relative;
            background: var(--eerie-black-2);
            border-radius: 20px;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            margin: 20px;
            border: 1px solid var(--jet);
        }
        .blog-modal-close {
            position: absolute;
            top: 15px;
            right: 15px;
            background: var(--onyx);
            border: none;
            color: var(--white-2);
            font-size: 24px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 1001;
        }
        .blog-modal-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 20px 20px 0 0;
        }
        .blog-modal-body {
            padding: 30px;
        }
        .blog-modal-body h2 {
            color: var(--white-2);
            margin-bottom: 15px;
            font-size: 28px;
        }
        .blog-modal-meta {
            display: flex;
            gap: 15px;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--jet);
        }
        .blog-modal-category {
            background: var(--orange-yellow-crayola);
            color: var(--smoky-black);
            padding: 5px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 500;
        }
        .blog-modal-date {
            color: var(--light-gray-70);
            font-size: 14px;
        }
        .blog-modal-content-text {
            color: var(--light-gray);
            line-height: 1.6;
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

function closeBlogModal() {
    const modal = document.querySelector('.blog-modal');
    if (modal) {
        modal.remove();
    }
}

// Initialize admin data loader when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new AdminDataLoader();
});