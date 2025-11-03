// Advanced Portfolio JavaScript with Professional Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initializeTheme();
    // initializeCustomCursor(); // Disabled
    initializeScrollProgress();
    createStarsBackground();
    initializeProjectFiltering();
    initializeMainContactForm();
    initializePerformanceMetrics();
    initializeSkillsProgress();
    initializeAchievementsAnimation();
    // initializeStableTypingAnimation(); // Disabled - using simple name display
    initializeAboutAnimations();
    initializeCircularSkills();
    initializeInteractiveFeatures();
    
    function createStarsBackground() {
        const starsContainer = document.getElementById('stars-container');
        const numberOfStars = 150;
        
        for (let i = 0; i < numberOfStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random size
            const sizes = ['small', 'medium', 'large'];
            const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
            star.classList.add(randomSize);
            
            // Random position
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            star.style.animationDelay = Math.random() * 3 + 's';
            
            // Some stars move up and down
            if (Math.random() > 0.7) {
                star.classList.add('moving');
                star.style.animationDelay = Math.random() * 15 + 's';
            }
            
            starsContainer.appendChild(star);
        }
        
        // Create shooting stars occasionally
        setInterval(createShootingStar, 3000);
    }
    
    function createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.cssText = `
            position: fixed;
            width: 2px;
            height: 2px;
            background: linear-gradient(45deg, #ffffff, #6366f1);
            border-radius: 50%;
            top: ${Math.random() * 50}%;
            left: -10px;
            z-index: -1;
            animation: shoot 2s linear forwards;
        `;
        
        document.body.appendChild(shootingStar);
        
        setTimeout(() => {
            shootingStar.remove();
        }, 2000);
    }
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // Typing animation for hero title
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = "Hi, I'm Bharathsimha Reddy";
        let index = 0;
        
        function typeWriter() {
            if (index < text.length) {
                typingText.textContent = text.slice(0, index + 1);
                index++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    index = 0;
                    typingText.textContent = '';
                    typeWriter();
                }, 2000);
            }
        }
        
        typeWriter();
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.about-card, .project-card, .timeline-item, .contact-card, .skill-category').forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = counter.textContent;
            const numericTarget = parseInt(target.replace(/\D/g, ''));
            const suffix = target.replace(/\d/g, '');
            let current = 0;
            const increment = numericTarget / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= numericTarget) {
                    counter.textContent = numericTarget + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, 50);
        });
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        if (parallax) {
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Dynamic neural network animation
    function createParticles() {
        const neuralNetwork = document.querySelector('.neural-network');
        if (!neuralNetwork) return;

        // Create additional animated particles
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: linear-gradient(135deg, #6366f1, #06b6d4);
                border-radius: 50%;
                animation: float-particle ${3 + Math.random() * 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
            `;
            neuralNetwork.appendChild(particle);
        }
    }

    createParticles();

    // Add CSS for particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-particle {
            0%, 100% { 
                transform: translateY(0px) translateX(0px); 
                opacity: 0.3;
            }
            25% { 
                transform: translateY(-20px) translateX(10px); 
                opacity: 0.8;
            }
            50% { 
                transform: translateY(-10px) translateX(-15px); 
                opacity: 1;
            }
            75% { 
                transform: translateY(-30px) translateX(5px); 
                opacity: 0.6;
            }
        }

        .animate-in {
            animation: slideInUp 0.8s ease-out forwards;
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .nav-link.active {
            color: var(--primary-color);
        }

        .nav-link.active::after {
            width: 100%;
        }

        /* Enhanced hover effects */
        .project-card {
            transform-style: preserve-3d;
        }

        .project-card:hover {
            transform: translateY(-10px) rotateX(5deg);
        }

        .skill-tag {
            transition: all 0.3s ease;
        }

        .skill-tag:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        /* Loading animation */
        .loading {
            opacity: 0;
            animation: fadeIn 1s ease-in-out forwards;
        }

        @keyframes fadeIn {
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Add loading animation to all sections
    document.querySelectorAll('section').forEach((section, index) => {
        section.classList.add('loading');
        section.style.animationDelay = `${index * 0.2}s`;
    });

    // Enhanced project card interactions
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Dynamic background gradient
    function updateGradient() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const hue1 = 240 + (scrollPercent * 60); // Blue to purple
        const hue2 = 200 + (scrollPercent * 40); // Cyan to blue
        
        document.documentElement.style.setProperty('--gradient-primary', 
            `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 60%))`);
    }

    window.addEventListener('scroll', updateGradient);

    // Contact form enhancement (if you add a form later)
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => {
        card.addEventListener('click', function() {
            const contactType = this.querySelector('h3').textContent.toLowerCase();
            
            if (contactType === 'email') {
                window.location.href = 'mailto:bharathreddyget@gmail.com';
            } else if (contactType === 'phone') {
                window.location.href = 'tel:+919347294579';
            }
        });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn, .social-link').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function updateOnScroll() {
        highlightNavLink();
        updateGradient();
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });

    console.log('🚀 Portfolio loaded successfully! Built with AI precision by Bharathsimha Reddy');
    
    // Theme Management
    function initializeTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const currentTheme = localStorage.getItem('theme') || 'dark';
        
        // Set initial theme
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Add transition effect
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }
    
    // Custom Cursor - Disabled
    function initializeCustomCursor() {
        // Custom cursor functionality disabled for better UX
        return;
    }
    
    // Scroll Progress Indicator
    function initializeScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(progressBar);
        
        const progressBarFill = progressBar.querySelector('.scroll-progress-bar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            progressBarFill.style.width = scrollPercent + '%';
        });
    }
    
    // Project Filtering System
    function initializeProjectFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        const searchInput = document.getElementById('project-search');
        
        // Filter functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active filter
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                filterProjects(filter, searchInput.value);
            });
        });
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
            filterProjects(activeFilter, e.target.value);
        });
        
        function filterProjects(category, searchTerm) {
            projectCards.forEach(card => {
                const cardCategories = card.getAttribute('data-category') || '';
                const cardTitle = card.querySelector('.project-title').textContent.toLowerCase();
                const cardDescription = card.querySelector('.project-description').textContent.toLowerCase();
                
                const matchesCategory = category === 'all' || cardCategories.includes(category);
                const matchesSearch = searchTerm === '' || 
                    cardTitle.includes(searchTerm.toLowerCase()) || 
                    cardDescription.includes(searchTerm.toLowerCase());
                
                if (matchesCategory && matchesSearch) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                    card.classList.add('visible');
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('visible');
                    setTimeout(() => {
                        if (card.classList.contains('hidden')) {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        }
    }
    
    // Main Contact Form Handler
    function initializeMainContactForm() {
        const mainForm = document.getElementById('main-contact-form');
        if (mainForm) {
            mainForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');
                
                // Get submit button
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.classList.add('form-loading');
                submitBtn.disabled = true;
                
                // Create mailto link with form data
                const subject = encodeURIComponent(`Portfolio Contact: Message from ${name}`);
                const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                const mailtoLink = `mailto:bharathreddyget@gmail.com?subject=${subject}&body=${body}`;
                
                // Simulate processing time
                setTimeout(() => {
                    // Open email client
                    window.location.href = mailtoLink;
                    
                    // Show success state
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Email Client Opened!';
                    submitBtn.classList.remove('form-loading');
                    submitBtn.classList.add('form-success');
                    
                    // Reset form after delay
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.classList.remove('form-success');
                        submitBtn.disabled = false;
                        this.reset();
                    }, 3000);
                }, 1500);
            });
        }
    }
    
    
    
    // Performance Metrics Dashboard
    function initializePerformanceMetrics() {
        // Add GitHub stats and performance metrics
        const aboutSection = document.querySelector('#about .about-content');
        if (aboutSection && !document.querySelector('.performance-metrics')) {
            const metricsHTML = `
                <div class="performance-metrics">
                    <h3><i class="fas fa-chart-bar"></i> Performance Metrics</h3>
                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-icon"><i class="fab fa-github"></i></div>
                            <div class="metric-value" data-target="25">0</div>
                            <div class="metric-label">GitHub Repos</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon"><i class="fas fa-code-branch"></i></div>
                            <div class="metric-value" data-target="150">0</div>
                            <div class="metric-label">Commits</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon"><i class="fas fa-star"></i></div>
                            <div class="metric-value" data-target="12">0</div>
                            <div class="metric-label">Stars Earned</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-icon"><i class="fas fa-users"></i></div>
                            <div class="metric-value" data-target="8">0</div>
                            <div class="metric-label">Collaborations</div>
                        </div>
                    </div>
                </div>
            `;
            
            aboutSection.insertAdjacentHTML('beforeend', metricsHTML);
            
            // Add metrics styles
            const metricsStyles = `
                .performance-metrics {
                    background: var(--bg-card);
                    padding: 2rem;
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--shadow-md);
                    border: 1px solid var(--border-color);
                    margin-top: 2rem;
                }
                
                .performance-metrics h3 {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                    color: var(--primary-color);
                    font-size: 1.2rem;
                }
                
                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                }
                
                .metric-card {
                    text-align: center;
                    padding: 1rem;
                    background: var(--bg-secondary);
                    border-radius: var(--border-radius-sm);
                    border: 1px solid var(--border-color);
                    transition: var(--transition-smooth);
                }
                
                .metric-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-md);
                }
                
                .metric-icon {
                    font-size: 1.5rem;
                    color: var(--primary-color);
                    margin-bottom: 0.5rem;
                }
                
                .metric-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }
                
                .metric-label {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = metricsStyles;
            document.head.appendChild(styleSheet);
            
            // Animate metrics when visible
            const metricsObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateMetrics();
                        metricsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            const metricsSection = document.querySelector('.performance-metrics');
            if (metricsSection) {
                metricsObserver.observe(metricsSection);
            }
        }
    }
    
    function animateMetrics() {
        const metricValues = document.querySelectorAll('.metric-value');
        metricValues.forEach(metric => {
            const target = parseInt(metric.getAttribute('data-target'));
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    metric.textContent = target;
                    clearInterval(timer);
                } else {
                    metric.textContent = Math.floor(current);
                }
            }, 50);
        });
    }
    
    // Skills Progress Animation
    function initializeSkillsProgress() {
        const progressItems = document.querySelectorAll('.progress-item');
        
        const progressObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressFill = entry.target.querySelector('.progress-fill');
                    const targetProgress = progressFill.getAttribute('data-progress');
                    
                    // Set CSS custom property for animation
                    progressFill.style.setProperty('--target-width', targetProgress + '%');
                    
                    // Animate the progress bar
                    setTimeout(() => {
                        progressFill.style.width = targetProgress + '%';
                    }, 100);
                    
                    // Add animation class
                    entry.target.classList.add('animate');
                    
                    // Unobserve after animation
                    progressObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        progressItems.forEach(item => {
            progressObserver.observe(item);
        });
    }
    
    // Achievements Animation
    function initializeAchievementsAnimation() {
        const achievementCards = document.querySelectorAll('.achievement-card');
        
        const achievementsObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                    
                    achievementsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Set initial state
        achievementCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            achievementsObserver.observe(card);
        });
    }
    
    // Typing Animation for Hero Title - Fixed Version
    function initializeTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;
        
        // Set fixed width to prevent page shaking
        typingElement.style.minWidth = '600px';
        typingElement.style.display = 'inline-block';
        typingElement.style.textAlign = 'left';
        
        const texts = [
            'Hi, I\'m Bharathsimha Reddy',
            'AI/ML Engineer',
            'Generative AI Specialist', 
            'Multi-Agent Systems Expert',
            'LangChain Developer'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        
        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (isPaused) {
                setTimeout(typeWriter, 2000); // Longer pause to read
                isPaused = false;
                return;
            }
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 30 : 80; // Slightly faster
            
            if (!isDeleting && charIndex === currentText.length) {
                isPaused = true;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
            
            setTimeout(typeWriter, typeSpeed);
        }
        
        // Start with the name immediately visible
        typingElement.textContent = 'Hi, I\'m Bharathsimha Reddy';
        
        // Start typing animation after showing name for 3 seconds
        setTimeout(() => {
            typeWriter();
        }, 3000);
    }
    
    // About Section Animations
    function initializeAboutAnimations() {
        const aboutCards = document.querySelectorAll('.about-card');
        const skillCategories = document.querySelectorAll('.skill-category');
        
        const aboutObserver = new IntersectionObserver(function(entries) {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                    
                    aboutObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        // Set initial state and observe
        [...aboutCards, ...skillCategories].forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            aboutObserver.observe(element);
        });
    }
    
    // Stable Typing Animation - No Page Shaking
    function initializeStableTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) {
            console.log('Typing element not found');
            return;
        }
        
        // Ensure name is visible immediately
        typingElement.textContent = 'Hi, I\'m Bharathsimha Reddy';
        typingElement.style.visibility = 'visible';
        typingElement.style.opacity = '1';
        
        console.log('Name set to:', typingElement.textContent);
        
        const texts = [
            'Hi, I\'m Bharathsimha Reddy',
            'AI/ML Engineer',
            'Generative AI Specialist',
            'Multi-Agent Systems Expert',
            'LangChain Developer'
        ];
        
        let textIndex = 0;
        let charIndex = texts[0].length; // Start with full name
        let isDeleting = false;
        let isPaused = false;
        
        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (isPaused) {
                setTimeout(typeWriter, 2000);
                isPaused = false;
                return;
            }
            
            if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                isPaused = true;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
            
            setTimeout(typeWriter, typeSpeed);
        }
        
        // Start animation after 4 seconds to ensure name is visible
        setTimeout(() => {
            console.log('Starting typing animation');
            typeWriter();
        }, 4000);
    }
    
    // Circular Skills Animation
    function initializeCircularSkills() {
        const skillCircles = document.querySelectorAll('.skill-circle');
        
        const skillsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const percentage = parseInt(circle.getAttribute('data-percentage'));
                    const progressCircle = circle.querySelector('.skill-circle-progress');
                    const percentageText = circle.querySelector('.skill-percentage');
                    
                    // Calculate stroke-dashoffset based on percentage
                    const circumference = 2 * Math.PI * 45; // radius = 45
                    const offset = circumference - (percentage / 100) * circumference;
                    
                    // Animate the circle
                    setTimeout(() => {
                        progressCircle.style.strokeDashoffset = offset;
                    }, 200);
                    
                    // Animate the percentage number
                    let currentPercentage = 0;
                    const increment = percentage / 60; // 60 frames for smooth animation
                    
                    const percentageTimer = setInterval(() => {
                        currentPercentage += increment;
                        if (currentPercentage >= percentage) {
                            percentageText.textContent = percentage + '%';
                            clearInterval(percentageTimer);
                        } else {
                            percentageText.textContent = Math.floor(currentPercentage) + '%';
                        }
                    }, 30);
                    
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        skillCircles.forEach(circle => {
            skillsObserver.observe(circle);
        });
    }
    
    // Interactive Features
    function initializeInteractiveFeatures() {
        // Add floating particles on hover
        const skillCards = document.querySelectorAll('.skill-circle-card');
        
        skillCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                createFloatingParticles(this);
            });
        });
        
        // Add smooth scroll with offset for navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Add parallax effect to hero section
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero');
            if (heroSection) {
                const rate = scrolled * -0.5;
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });
        
        // Add typing sound effect (visual feedback)
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
    
    function createFloatingParticles(element) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                opacity: 0.8;
            `;
            
            const rect = element.getBoundingClientRect();
            particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            particle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(particle);
            
            // Animate particle
            const animation = particle.animate([
                { transform: 'translateY(0px)', opacity: 0.8 },
                { transform: 'translateY(-50px)', opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                particle.remove();
            };
        }
    }
    
    console.log('🚀 Portfolio loaded successfully! Built with AI precision by Bharathsimha Reddy');
});
