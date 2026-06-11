/* ============================================
   BIRTHDAY WEBSITE - JAVASCRIPT
   ============================================ */

// ============================================
// LOADING SCREEN
// ============================================

window.addEventListener('DOMContentLoaded', initializeWebsite);

function initializeWebsite() {
    // Initialize everything after DOM is ready
    setTimeout(() => {
        hideLoadingScreen();
    }, 3000); // Show loading screen for 3 seconds

    initConfettiCanvas();
    initScrollAnimations();
    initSmoothScroll();
    initObservers();
    initPhotoCardParallax();
    setupParticleEffects();
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.animation = 'fadeOutDown 1s ease-out forwards';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            loadingScreen.classList.add('hidden');
        }, 1000);
    }
}

// ============================================
// CONFETTI ANIMATION
// ============================================

class ConfettiParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = Math.random() * 5 + 2;
        this.gravity = 0.15;
        this.decay = Math.random() * 0.015 + 0.015;
        this.alpha = 1;
        this.size = Math.random() * 4 + 2;
        this.colors = ['#ec4899', '#a855f7', '#f43f5e', '#fbbf24', '#06b6d4', '#8b5cf6'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationVelocity = (Math.random() - 0.5) * 0.2;
    }

    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.rotation += this.rotationVelocity;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

let confetti = [];

function initConfettiCanvas() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = confetti.length - 1; i >= 0; i--) {
            confetti[i].update();
            confetti[i].draw(ctx);
            
            if (confetti[i].alpha <= 0) {
                confetti.splice(i, 1);
            }
        }
        
        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        }
    }
    
    window.celebrateNow = function() {
        const canvas = document.getElementById('confetti-canvas');
        // Multiple bursts for more dramatic effect
        createConfetti(canvas.width / 2, canvas.height / 2);
        createConfetti(canvas.width * 0.25, canvas.height * 0.3);
        createConfetti(canvas.width * 0.75, canvas.height * 0.3);
        createConfetti(canvas.width * 0.25, canvas.height * 0.7);
        createConfetti(canvas.width * 0.75, canvas.height * 0.7);
        animate();
        playSound();
    };
}

function createConfetti(x, y) {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        confetti.push(new ConfettiParticle(x + (Math.random() - 0.5) * 100, y + (Math.random() - 0.5) * 100));
    }
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function initObservers() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    // Observe all elements with reveal class
    document.querySelectorAll('.fade-in-up, .reveal, .animate-slide-in-down, .animate-fade-in-text').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
    const scrollThrottle = throttle(() => {
        const blobs = document.querySelectorAll('.animate-blob');
        const scrollY = window.scrollY;
        
        // Parallax effect for background blobs
        blobs.forEach((blob, index) => {
            const speed = 0.5 + index * 0.1;
            blob.style.transform = `translateY(${scrollY * speed}px)`;
        });
        
        // Scroll-triggered animations
        const reveals = document.querySelectorAll('.fade-in-up, .reveal, .animate-slide-in-down, .animate-fade-in-text');
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 50;
            
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });

        // Create particle effects on scroll
        const canvas = document.getElementById('confetti-canvas');
        if (canvas && Math.random() > 0.95) {
            createConfetti(Math.random() * canvas.width, 0);
        }
    }, 50);

    window.addEventListener('scroll', scrollThrottle, { passive: true });
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ============================================
// PHOTO CARD PARALLAX EFFECT
// ============================================

function initPhotoCardParallax() {
    const photoCard = document.querySelector('.photo-card');
    if (!photoCard) return;

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 768) return; // Disable on mobile
        
        const rect = photoCard.getBoundingClientRect();
        const isInView = rect.bottom > 0 && rect.top < window.innerHeight;
        
        if (!isInView) return;

        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = (y / rect.height) * 10;
        const rotateY = (x / rect.width) * -10;
        
        photoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    }, { passive: true });
    
    document.addEventListener('mouseleave', () => {
        photoCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
}

// ============================================
// PARTICLE EFFECTS ON SCROLL
// ============================================

function setupParticleEffects() {
    let lastScrollTime = 0;

    window.addEventListener('scroll', () => {
        const now = Date.now();
        if (now - lastScrollTime > 800) {
            const canvas = document.getElementById('confetti-canvas');
            if (canvas && Math.random() > 0.8) {
                createConfetti(Math.random() * canvas.width, 0);
            }
            lastScrollTime = now;
        }
    }, { passive: true });
}

// ============================================
// CELEBRATE BUTTON
// ============================================

function setupCelebrationButton() {
    const celebrateBtn = document.querySelector('.celebrate-btn');
    if (!celebrateBtn) return;
    
    celebrateBtn.addEventListener('click', () => {
        celebrateNow();
        
        // Add haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([10, 20, 10, 20, 10]);
        }
    });
}

// ============================================
// SOUND EFFECT
// ============================================

function playSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Create oscillator for celebratory sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play a happy chord-like sound
        oscillator.frequency.setValueAtTime(523.25, now);
        oscillator.frequency.setValueAtTime(659.25, now + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        oscillator.start(now);
        oscillator.stop(now + 0.4);
    } catch (e) {
        // Audio not supported
    }
}

// ============================================
// TIMELINE ANIMATIONS
// ============================================

function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// ============================================
// CELEBRATION CARD ANIMATIONS
// ============================================

function initCelebrationCardAnimations() {
    const celebrationCards = document.querySelectorAll('.celebration-card');
    celebrationCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });
}

// ============================================
// THROTTLE FUNCTION
// ============================================

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ============================================
// DEVICE DETECTION FOR MOBILE OPTIMIZATION
// ============================================

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function optimizeForMobile() {
    if (isMobileDevice()) {
        // Reduce animation complexity on mobile
        document.querySelectorAll('.animate-blob').forEach(blob => {
            blob.style.animationDuration = '10s';
        });

        // Disable parallax on mobile
        const floatingHearts = document.querySelectorAll('.floating-heart');
        floatingHearts.forEach(heart => {
            heart.style.animationDuration = '15s';
        });

        // Disable 3D effects on mobile
        const photoCard = document.querySelector('.photo-card');
        if (photoCard) {
            photoCard.style.perspective = 'none';
        }
    }
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

function optimizePerformance() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }
}

// ============================================
// PAGE LOAD INITIALIZATION
// ============================================

window.addEventListener('load', () => {
    // Optimize for device
    optimizeForMobile();
    optimizePerformance();
    initTimelineAnimations();
    initCelebrationCardAnimations();
    setupCelebrationButton();

    // Trigger initial confetti on page load (optional)
    setTimeout(() => {
        const canvas = document.getElementById('confetti-canvas');
        if (canvas) {
            createConfetti(canvas.width * 0.25, canvas.height * 0.2);
            createConfetti(canvas.width * 0.75, canvas.height * 0.2);
        }
    }, 3500);

    console.log('%c🎉 Happy Birthday Website Loaded! 🎉', 'font-size: 20px; color: #ec4899; font-weight: bold;');
    console.log('%c💖 This page is dedicated to Nasrin Jahan Eshita 💖', 'font-size: 14px; color: #a855f7;');
});

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// SHARE FUNCTIONALITY
// ============================================

function shareOnSocial(platform) {
    const url = window.location.href;
    const text = "🎉 Check out this beautiful birthday website for my best friend Nasrin Jahan Eshita!";
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        default:
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// ============================================
// PREVENT DOUBLE TAP ZOOM ON MOBILE
// ============================================

document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// ============================================
// END OF JAVASCRIPT
// ============================================

function initScrollAnimations() {
    // Parallax effect for background blobs
    window.addEventListener('scroll', () => {
        const blobs = document.querySelectorAll('.animate-blob');
        const scrollY = window.scrollY;
        
        blobs.forEach((blob, index) => {
            const speed = 0.5 + index * 0.1;
            blob.style.transform = `translateY(${scrollY * speed}px)`;
        });
        
        // Fade in elements on scroll
        const reveals = document.querySelectorAll('.fade-in-up, .reveal');
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 50;
            
            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    });
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ============================================
// PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Trigger celebrate confetti on page load (optional)
    setTimeout(() => {
        // Create initial confetti burst from multiple points
        const canvas = document.getElementById('confetti-canvas');
        if (canvas) {
            createConfetti(canvas.width * 0.25, canvas.height * 0.2);
            createConfetti(canvas.width * 0.75, canvas.height * 0.2);
        }
    }, 800);
});

// ============================================
// MOUSE CURSOR EFFECT (Optional)
// ============================================

const canvas = document.getElementById('confetti-canvas');

document.addEventListener('mousemove', (e) => {
    // Add subtle mouse position tracking if needed
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Could be used for cursor effects or hover states
});

// ============================================
// TOUCH AND MOBILE OPTIMIZATIONS
// ============================================

// Prevent double tap zoom
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, { passive: false });

// ============================================
// ACCESSIBILITY FEATURES
// ============================================

// Add focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// PARTICLE GENERATOR ON SCROLL
// ============================================

let lastScrollTime = 0;

window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScrollTime > 500) {
        const canvas = document.getElementById('confetti-canvas');
        if (canvas && Math.random() > 0.7) {
            createConfetti(Math.random() * canvas.width, 0);
        }
        lastScrollTime = now;
    }
});

// ============================================
// CELEBRATE BUTTON INTERACTION
// ============================================

const celebrateBtn = document.querySelector('.celebrate-btn');
if (celebrateBtn) {
    celebrateBtn.addEventListener('click', () => {
        celebrateNow();
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate([10, 20, 10, 20, 10]);
        }
        
        // Play sound effect if desired
        playSound();
    });
    
    // Add hover effect with confetti preview
    celebrateBtn.addEventListener('mouseenter', () => {
        celebrateBtn.style.transform = 'scale(1.05)';
    });
    
    celebrateBtn.addEventListener('mouseleave', () => {
        celebrateBtn.style.transform = 'scale(1)';
    });
}

// ============================================
// SOUND EFFECT
// ============================================

function playSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;
        
        // Create oscillator for celebratory sound
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play a happy chord-like sound
        oscillator.frequency.setValueAtTime(523.25, now); // C5
        oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
        
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        oscillator.start(now);
        oscillator.stop(now + 0.4);
    } catch (e) {
        // Audio context not supported or user hasn't interacted with page
    }
}

// ============================================
// DYNAMIC BACKGROUND COLOR ON SCROLL
// ============================================

window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    // Adjust background slightly based on scroll position
    const hueShift = scrollPercent / 10;
    document.body.style.filter = `hue-rotate(${hueShift}deg)`;
});

// ============================================
// PHOTO CARD PARALLAX
// ============================================

const photoCard = document.querySelector('.photo-card');
if (photoCard) {
    document.addEventListener('mousemove', (e) => {
        const rect = photoCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateX = (y / rect.height) * 10;
        const rotateY = (x / rect.width) * -10;
        
        photoCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    document.addEventListener('mouseleave', () => {
        photoCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
}

// ============================================
// TIMELINE ITEM ANIMATIONS
// ============================================

const timelineItems = document.querySelectorAll('.timeline-item');
timelineItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    item.classList.add('fade-in-up');
});

// ============================================
// CELEBRATION CARD STAGGER ANIMATION
// ============================================

const celebrationCards = document.querySelectorAll('.celebration-card');
celebrationCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.15}s`;
    card.classList.add('fade-in-up');
});

// ============================================
// INTERSECTION OBSERVER FOR LAZY LOADING
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ============================================
// PAGE READY INDICATOR
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🎉 Happy Birthday Website Loaded! 🎉', 'font-size: 20px; color: #ec4899; font-weight: bold;');
    console.log('%c💖 This page is dedicated to Nasrin Jahan Eshita 💖', 'font-size: 14px; color: #a855f7;');
});

// ============================================
// RESPONSIVE TOUCH ANIMATIONS
// ============================================

if (window.matchMedia('(max-width: 768px)').matches) {
    // Disable parallax on mobile for better performance
    document.removeEventListener('scroll', initScrollAnimations);
    
    // Simplify animations for mobile
    document.querySelectorAll('.animate-blob').forEach(blob => {
        blob.style.animationDuration = '10s';
    });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ============================================
// SHARED ON SOCIAL MEDIA
// ============================================

function shareOnSocial(platform) {
    const url = window.location.href;
    const text = "🎉 Check out this beautiful birthday website for my best friend Nasrin Jahan Eshita!";
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
            break;
        default:
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// ============================================
// END OF JAVASCRIPT
// ============================================
