/**
 * GitHub Projects Integration
 * Dynamically loads and displays projects from GitHub
 */

class GitHubProjects {
  constructor() {
    this.username = 'carsoncarpenter7';
    this.projectsContainer = document.getElementById('projects-grid');
    this.loadingElement = document.getElementById('projects-loading');
    this.errorElement = document.getElementById('projects-error');
    
    // Curated project data with enhanced descriptions
    this.featuredProjects = [
      {
        name: 'CryptoPals-1-5',
        title: 'Cryptopals Cryptography Challenges',
        description: 'Solved cryptographic challenges based on real-world security vulnerabilities. Implemented AES encryption, XOR operations, and various cipher-breaking techniques.',
        tech: ['Python', 'Cryptography', 'AES', 'XOR'],
        featured: true,
        category: 'Security & Cryptography'
      },
      {
        name: 'Python',
        title: 'Python Programming Collection',
        description: 'Comprehensive collection of Python projects including data visualization, algorithm implementations, and web development frameworks.',
        tech: ['Python', 'MatPlotLib', 'SQLite', 'Flask', 'Pandas'],
        category: 'Data Science & Web Development'
      },
      {
        name: 'Algorithm-Engineering',
        title: 'Advanced Algorithm Engineering',
        description: 'C++ implementations of complex algorithms including minimum spanning trees, statistical calculations, and optimization techniques.',
        tech: ['C++', 'Algorithms', 'Data Structures', 'Optimization'],
        category: 'Computer Science Fundamentals'
      },
      {
        name: 'Cosmos',
        title: 'Calendar & Productivity Web App',
        description: 'Full-stack productivity application with calendar scheduling, habit tracking, and reminder systems. Built with modern web technologies.',
        tech: ['PHP', 'MySQL', 'PostgreSQL', 'HTML5', 'CSS3'],
        category: 'Full-Stack Development',
        repo: 'CS362-Calender-App/Cosmos'
      },
      {
        name: 'Python-Game-Development',
        title: 'Interactive Python Games',
        description: 'Collection of engaging games built with Python and Pygame, featuring BlackJack, Pig dice game, and physics-based mechanics.',
        tech: ['Python', 'Pygame', 'Game Development', 'Physics'],
        category: 'Game Development'
      },
      {
        name: 'CECS-Mobile-App-Dev',
        title: 'Android Mobile Applications',
        description: 'Native Android applications showcasing mobile UI design, user interactions, and Android SDK integration using Kotlin and Java.',
        tech: ['Kotlin', 'Java', 'Android SDK', 'Mobile UI'],
        category: 'Mobile Development'
      }
    ];
    
    this.languageColors = {
      'Python': '#3776ab',
      'C++': '#f34b7d',
      'JavaScript': '#f1e05a',
      'TypeScript': '#2b7489',
      'Java': '#b07219',
      'Kotlin': '#F18E33',
      'PHP': '#4F5D95',
      'HTML': '#e34c26',
      'CSS': '#1572B6',
      'SQL': '#336791'
    };
    
    this.init();
  }

  async init() {
    try {
      await this.loadProjects();
    } catch (error) {
      console.error('Error loading projects:', error);
      this.showError();
    }
  }

  async loadProjects() {
    this.showLoading();
    
    try {
      // Try to fetch from GitHub API
      const repos = await this.fetchGitHubRepos();
      const enhancedProjects = this.enhanceProjectData(repos);
      this.renderProjects(enhancedProjects);
    } catch (error) {
      // Fallback to curated data if API fails
      console.warn('GitHub API unavailable, using curated data:', error);
      this.renderProjects(this.featuredProjects);
    }
    
    this.hideLoading();
  }

  async fetchGitHubRepos() {
    const response = await fetch(`https://api.github.com/users/${this.username}/repos?sort=updated&per_page=20`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
  }

  enhanceProjectData(repos) {
    return this.featuredProjects.map(featured => {
      const repoName = featured.repo || featured.name;
      const repo = repos.find(r => r.name === featured.name || r.full_name === repoName);
      
      return {
        ...featured,
        url: repo?.html_url || `https://github.com/${this.username}/${featured.name}`,
        stars: repo?.stargazers_count || 0,
        forks: repo?.forks_count || 0,
        language: repo?.language || featured.tech[0],
        updated: repo?.updated_at ? new Date(repo.updated_at) : null,
        topics: repo?.topics || []
      };
    });
  }

  renderProjects(projects) {
    this.projectsContainer.innerHTML = '';
    
    projects.forEach((project, index) => {
      const projectCard = this.createProjectCard(project, index);
      this.projectsContainer.appendChild(projectCard);
    });
    
    // Add animation delays
    this.animateProjectCards();
  }

  createProjectCard(project, index) {
    const card = document.createElement('div');
    card.className = `project-card ${project.featured ? 'project-card--featured' : ''}`;
    card.style.animationDelay = `${index * 0.1}s`;
    
    const languageColor = this.languageColors[project.language] || '#64748b';
    const updatedText = project.updated ? 
      `Updated ${this.formatDate(project.updated)}` : 
      'Recently updated';
    
    card.innerHTML = `
      <div class="project-card__header">
        <h3 class="project-card__title">${project.title}</h3>
        <p class="project-card__description">${project.description}</p>
        
        <div class="project-card__meta">
          ${project.language ? `
            <div class="project-card__language">
              <span class="language-dot" style="background-color: ${languageColor}"></span>
              <span>${project.language}</span>
            </div>
          ` : ''}
          
          <div class="project-card__stats">
            ${project.stars > 0 ? `
              <div class="stat-item">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                </svg>
                <span>${project.stars}</span>
              </div>
            ` : ''}
            
            ${project.forks > 0 ? `
              <div class="stat-item">
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
                </svg>
                <span>${project.forks}</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
      
      <div class="project-card__content">
        <div class="project-card__tech">
          ${project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        
        <div class="project-card__links">
          <a href="${project.url}" class="project-link project-link--primary" target="_blank" rel="noopener">
            <svg viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View Code
          </a>
          
          ${project.demo ? `
            <a href="${project.demo}" class="project-link project-link--secondary" target="_blank" rel="noopener">
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              Live Demo
            </a>
          ` : ''}
        </div>
      </div>
    `;
    
    return card;
  }

  formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  }

  showLoading() {
    this.loadingElement.style.display = 'block';
    this.projectsContainer.style.display = 'none';
    this.errorElement.style.display = 'none';
  }

  hideLoading() {
    this.loadingElement.style.display = 'none';
    this.projectsContainer.style.display = 'grid';
  }

  showError() {
    this.loadingElement.style.display = 'none';
    this.projectsContainer.style.display = 'none';
    this.errorElement.style.display = 'block';
  }

  animateProjectCards() {
    const cards = document.querySelectorAll('.project-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'all 0.6s ease';
      observer.observe(card);
    });
  }

  // Method to add new projects easily
  addProject(projectData) {
    this.featuredProjects.push(projectData);
    this.loadProjects(); // Refresh display
  }

  // Method to update project descriptions
  updateProject(name, updates) {
    const project = this.featuredProjects.find(p => p.name === name);
    if (project) {
      Object.assign(project, updates);
      this.loadProjects(); // Refresh display
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GitHubProjects();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GitHubProjects;
}