// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Create animated stars background
    createStarsBackground();
    
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
});
