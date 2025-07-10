// Hashnode Blog Integration
class HashnodeBlog {
  constructor(hostname) {
    this.hostname = hostname;
    this.apiUrl = 'https://gql.hashnode.com/';
  }

  async fetchPosts() {
    const query = `
      query GetUserArticles($page: Int!) {
        user(username: "vaibhavkatiyar") {
          publications {
            posts(page: $page) {
              title
              brief
              slug
              coverImage
              dateAdded
              contentMarkdown
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: { page: 0 }
        })
      });

      const data = await response.json();
      
      if (data.errors) {
        console.error('GraphQL errors:', data.errors);
        return [];
      }

      return data.data?.user?.publication?.posts || [];
    } catch (error) {
      console.error('Error fetching Hashnode posts:', error);
      return [];
    }
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

  createPostElement(post) {
    const postUrl = `https://${this.hostname}/${post.slug}`;
    const coverImage = post.coverImage || './assets/images/blog-1.jpg'; // fallback image
    const brief = post.brief || 'Click to read more...';
    
    return `
      <li class="blog-post-item">
        <a href="${postUrl}" target="_blank" rel="noopener noreferrer">
          <figure class="blog-banner-box">
            <img src="${coverImage}" alt="${post.title}" loading="lazy" onerror="this.src='./assets/images/blog-1.jpg'">
          </figure>
          <div class="blog-content">
            <div class="blog-meta">
              <p class="blog-category">Blog</p>
              <span class="dot"></span>
              <time datetime="${post.dateAdded}">${this.formatDate(post.dateAdded)}</time>
            </div>
            <h3 class="h3 blog-item-title">${post.title}</h3>
            <p class="blog-text">${brief}</p>
          </div>
        </a>
      </li>
    `;
  }

  async renderPosts() {
    const blogPostsList = document.querySelector('.blog-posts-list');
    
    if (!blogPostsList) {
      console.error('Blog posts container not found');
      return;
    }

    // Show loading state
    blogPostsList.innerHTML = `
      <li class="blog-post-item">
        <div style="text-align: center; padding: 40px; color: var(--light-gray);">
          <p>Loading blog posts...</p>
        </div>
      </li>
    `;

    try {
      const posts = await this.fetchPosts();
      
      if (posts.length === 0) {
        blogPostsList.innerHTML = `
          <li class="blog-post-item">
            <div style="text-align: center; padding: 40px; color: var(--light-gray);">
              <p>No blog posts found. Check back later!</p>
            </div>
          </li>
        `;
        return;
      }

      // Render the posts
      const postsHtml = posts.map(post => this.createPostElement(post)).join('');
      blogPostsList.innerHTML = postsHtml;
      
    } catch (error) {
      console.error('Error rendering posts:', error);
      blogPostsList.innerHTML = `
        <li class="blog-post-item">
          <div style="text-align: center; padding: 40px; color: var(--light-gray);">
            <p>Error loading blog posts. Please try again later.</p>
          </div>
        </li>
      `;
    }
  }
}

// Initialize and load blog posts when the page loads
document.addEventListener('DOMContentLoaded', function() {
  const hashnodeBlog = new HashnodeBlog('blogs.vaibhav.cloud');
  
  // Load posts immediately
  hashnodeBlog.renderPosts();
  
  // Also reload when the blog section becomes active
  const blogNavLink = document.querySelector('[data-nav-link]');
  const navLinks = document.querySelectorAll('[data-nav-link]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (this.textContent.toLowerCase() === 'blog') {
        // Small delay to ensure the section is visible
        setTimeout(() => {
          hashnodeBlog.renderPosts();
        }, 100);
      }
    });
  });
});