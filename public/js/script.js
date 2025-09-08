// Islamic Invitation Interactive Script
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initCoverPage();
    initCountdown();
    initMusicControl();
    initScrollAnimations();
    initFormEnhancements();
    addIslamicOrnaments();
    initParallaxEffects();
    
    // Cover Page Management
    function initCoverPage() {
        const coverPage = document.getElementById('cover-page');
        const mainContent = document.getElementById('main-content');
        const openBtn = document.getElementById('open-invitation');
        
        if (openBtn && coverPage && mainContent) {
            openBtn.addEventListener('click', function() {
                // Add opening animation
                coverPage.classList.add('hidden');
                
                // Show main content with delay
                setTimeout(() => {
                    mainContent.classList.add('visible');
                    initOnScrollAnimations();
                }, 800);
                
                // Start background music
                setTimeout(() => {
                    const audio = document.getElementById('background-music');
                    if (audio) {
                        audio.play().catch(e => console.log('Audio autoplay prevented'));
                    }
                }, 1000);
            });
        }
    }
    
    // Countdown Timer
    function initCountdown() {
        const targetDate = new Date('September 14, 2025 19:50:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Add animation when numbers change
            updateCountdownElement('days', days);
            updateCountdownElement('hours', hours);
            updateCountdownElement('minutes', minutes);
            updateCountdownElement('seconds', seconds);
        }
        
        function updateCountdownElement(id, value) {
            const element = document.getElementById(id);
            if (element) {
                const newValue = value.toString().padStart(2, '0');
                if (element.textContent !== newValue) {
                    element.style.transform = 'scale(1.2)';
                    element.style.color = '#d4af37';
                    setTimeout(() => {
                        element.textContent = newValue;
                        element.style.transform = 'scale(1)';
                        element.style.color = '';
                    }, 150);
                }
            }
        }
        
        // Update countdown every second
        setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }
    
    // Music Control
    function initMusicControl() {
        const musicControl = document.getElementById('music-control');
        const musicIcon = document.getElementById('music-icon');
        const audio = document.getElementById('background-music');
        let isPlaying = false;
        
        if (musicControl && musicIcon && audio) {
            musicControl.addEventListener('click', function() {
                if (isPlaying) {
                    audio.pause();
                    musicIcon.src = 'https://img.icons8.com/material-rounded/24/ffffff/play-button-circled--v1.png';
                    musicControl.style.animationPlayState = 'paused';
                } else {
                    audio.play().then(() => {
                        musicIcon.src = 'https://img.icons8.com/material-rounded/24/ffffff/pause-button.png';
                        musicControl.style.animationPlayState = 'running';
                    }).catch(e => console.log('Audio play failed:', e));
                }
                isPlaying = !isPlaying;
                
                // Add click animation
                musicControl.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    musicControl.style.transform = '';
                }, 100);
            });
            
            // Auto-update icon when audio ends
            audio.addEventListener('ended', function() {
                isPlaying = false;
                musicIcon.src = 'https://img.icons8.com/material-rounded/24/ffffff/play-button-circled--v1.png';
                musicControl.style.animationPlayState = 'paused';
            });
        }
    }
    
    // Scroll Animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0s';
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.animationPlayState = 'paused';
            observer.observe(section);
        });
    }
    
    // On-scroll animations after cover page is hidden
    function initOnScrollAnimations() {
        const elements = document.querySelectorAll('.countdown-item, .event-card, .ucapan-item');
        
        const staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            staggerObserver.observe(el);
        });
    }
    
    // Form Enhancements
    function initFormEnhancements() {
        const form = document.querySelector('.rsvp-form');
        const inputs = document.querySelectorAll('.rsvp-form input, .rsvp-form textarea');
        
        // Add floating label effect
        inputs.forEach(input => {
            const label = input.previousElementSibling;
            if (label && label.tagName === 'LABEL') {
                input.addEventListener('focus', () => {
                    label.style.color = '#d4af37';
                    label.style.transform = 'translateY(-2px)';
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.style.color = '';
                        label.style.transform = '';
                    }
                });
                
                // Check if input has value on load
                if (input.value) {
                    label.style.color = '#d4af37';
                    label.style.transform = 'translateY(-2px)';
                }
            }
        });
        
        // Form submission enhancement
        if (form) {
            form.addEventListener('submit', function(e) {
                const submitBtn = form.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.textContent = 'Mengirim...';
                    submitBtn.disabled = true;
                    submitBtn.style.opacity = '0.7';
                    
                    // Add loading animation
                    submitBtn.innerHTML = `
                        <span style="display: inline-flex; align-items: center; gap: 10px;">
                            <span style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></span>
                            Mengirim...
                        </span>
                    `;
                }
            });
        }
        
        // Add CSS for loading animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add Islamic Ornaments
    function addIslamicOrnaments() {
        const sections = document.querySelectorAll('section');
        const ornamentSVGs = [
            `<svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10 L60 30 L80 30 L65 45 L70 65 L50 55 L30 65 L35 45 L20 30 L40 30 Z" fill="#86826d" opacity="0.1"/>
            </svg>`,
            `<svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="20" fill="none" stroke="#86826d" stroke-width="2" opacity="0.15"/>
                <path d="M50 30 L55 45 L70 45 L60 55 L65 70 L50 65 L35 70 L40 55 L30 45 L45 45 Z" fill="#86826d" opacity="0.1"/>
            </svg>`,
            `<svg width="35" height="35" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 20 C60 30, 80 30, 80 50 C80 70, 60 70, 50 80 C40 70, 20 70, 20 50 C20 30, 40 30, 50 20 Z" fill="#86826d" opacity="0.08"/>
            </svg>`
        ];
        
        sections.forEach((section, index) => {
            if (index % 2 === 0) { // Only add to even sections
                const ornament = document.createElement('div');
                ornament.className = 'islamic-ornament';
                ornament.style.cssText = `
                    position: absolute;
                    top: ${Math.random() * 20 + 10}px;
                    right: ${Math.random() * 30 + 20}px;
                    opacity: 0;
                    animation: fadeInFloat 2s ease-in-out ${index * 0.5}s forwards;
                    pointer-events: none;
                `;
                ornament.innerHTML = ornamentSVGs[index % ornamentSVGs.length];
                section.appendChild(ornament);
                
                // Add another ornament on the left
                const leftOrnament = document.createElement('div');
                leftOrnament.className = 'islamic-ornament';
                leftOrnament.style.cssText = `
                    position: absolute;
                    bottom: ${Math.random() * 20 + 10}px;
                    left: ${Math.random() * 30 + 20}px;
                    opacity: 0;
                    animation: fadeInFloat 2s ease-in-out ${index * 0.5 + 1}s forwards;
                    pointer-events: none;
                    transform: rotate(45deg);
                `;
                leftOrnament.innerHTML = ornamentSVGs[(index + 1) % ornamentSVGs.length];
                section.appendChild(leftOrnament);
            }
        });
        
        // Add ornament animation CSS
        const ornamentStyle = document.createElement('style');
        ornamentStyle.textContent = `
            @keyframes fadeInFloat {
                0% {
                    opacity: 0;
                    transform: translateY(20px) scale(0.8);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(ornamentStyle);
    }
    
    // Parallax Effects
    function initParallaxEffects() {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.main-header, .poem-section');
            
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
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
    }
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Add progressive enhancement for CSS animations
    if (window.CSS && CSS.supports('animation', 'fadeIn 1s')) {
        document.body.classList.add('animations-supported');
    }
    
    // Handle visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', function() {
        const audio = document.getElementById('background-music');
        if (audio) {
            if (document.hidden) {
                audio.pause();
            } else if (audio.currentTime > 0) {
                audio.play().catch(e => console.log('Audio resume failed'));
            }
        }
    });
    
    // Add touch support for mobile devices
    function addTouchSupport() {
        const touchElements = document.querySelectorAll('.event-card, .ucapan-item, .countdown-item');
        
        touchElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                this.style.transform = '';
            }, { passive: true });
        });
    }
    
    // Initialize touch support
    addTouchSupport();
    
    // Add loading screen fade out
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Add subtle entrance animation to cover page
        const coverContent = document.querySelector('.cover-content');
        if (coverContent) {
            coverContent.style.opacity = '0';
            coverContent.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                coverContent.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                coverContent.style.opacity = '1';
                coverContent.style.transform = 'scale(1)';
            }, 100);
        }
    });
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimized scroll handler
    const optimizedScrollHandler = debounce(() => {
        // Additional scroll-based effects can be added here
        const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
    }, 16);
    
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    
    console.log('Islamic Invitation Script Loaded Successfully! 🕌✨');
});