// ========== Mobile Navigation Toggle ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ========== Theme Toggle with Animation ==========
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

// Theme toggle with ripple effect from floating card
themeToggle.addEventListener('click', (e) => {
    const card = document.querySelector('.floating-card');
    const rect = card.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Create expanding circle animation
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.body.appendChild(ripple);
    
    // Toggle dark mode after brief delay
    setTimeout(() => {
        body.classList.toggle('dark-mode');
        
        // Toggle icon
        if (body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    }, 300);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 1000);
});

// Add ripple animation styles
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .theme-ripple {
        position: fixed;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-gradient);
        pointer-events: none;
        transform: translate(-50%, -50%) scale(0);
        animation: rippleExpand 1s ease-out forwards;
        z-index: 9998;
        mix-blend-mode: multiply;
    }
    
    body.dark-mode .theme-ripple {
        background: radial-gradient(circle, #000000 0%, #1a0000 100%);
        mix-blend-mode: normal;
    }
    
    @keyframes rippleExpand {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(100);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ========== Typing Animation ==========
const typingText = document.querySelector('.typing-text');
const phrases = [
    'IT Undergraduate Student',
    'Web Developer',
    'Problem Solver',
    'Creative Thinker',
    'Tech Enthusiast'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at the end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect after page loads
window.addEventListener('load', () => {
    setTimeout(typeEffect, 1000);
});

// ========== Scroll Animations ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Animate skill bars when they come into view
            if (entry.target.classList.contains('skill-card')) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const progress = progressBar.getAttribute('data-progress');
                progressBar.style.width = progress + '%';
            }
            
            // Animate stat cards
            if (entry.target.classList.contains('stat-card')) {
                const countElement = entry.target.querySelector('h4');
                const targetCount = parseInt(countElement.textContent);
                animateCount(countElement, targetCount);
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-card, .project-card, .stat-card, .about-text, .contact-card, .cert-card').forEach(el => {
    observer.observe(el);
});

// ========== Counter Animation ==========
function animateCount(element, target) {
    let count = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        count += increment;
        if (count >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.ceil(count) + '+';
        }
    }, 30);
}

// ========== Smooth Scroll for Navigation Links ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== Scroll Indicator Click ==========
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
    });
}

// ========== Navbar Background on Scroll ==========
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// ========== Form Submission ==========
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && message) {
            // Show success message (you can integrate with a backend here)
            showNotification('Thank you! Your message has been sent. 🎉', 'success');
            contactForm.reset();
        } else {
            showNotification('Please fill in all fields! 📝', 'error');
        }
    });
}

// ========== Notification System ==========
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== Cursor Trail Effect (Optional - Adorable Feature) ==========
let cursorTrail = [];
const trailLength = 5;

document.addEventListener('mousemove', (e) => {
    // Create trail element
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    
    // Set gradient based on theme
    const isDarkMode = document.body.classList.contains('dark-mode');
    const gradient = isDarkMode 
        ? 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)' 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    trail.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: ${gradient};
        border-radius: 50%;
        pointer-events: none;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        transform: translate(-50%, -50%);
        opacity: 0.6;
        z-index: 9999;
        animation: fadeOutTrail 0.5s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    cursorTrail.push(trail);
    
    // Remove old trails
    if (cursorTrail.length > trailLength) {
        const oldTrail = cursorTrail.shift();
        oldTrail.remove();
    }
});

// Add trail animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes fadeOutTrail {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
        }
    }
`;
document.head.appendChild(trailStyle);

// ========== Project Card Click Effects ==========
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Prevent if clicking on a link
        if (e.target.tagName !== 'A' && e.target.tagName !== 'I') {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        }
    });
});

// ========== Skill Card Hover Sound Effect (Optional) ==========
// You can add sound effects here if you want to make it more interactive

// ========== Initialize Animations on Load ==========
window.addEventListener('load', () => {
    // Add entrance animations to hero section
    document.querySelector('.hero-text').classList.add('fade-in');
    document.querySelector('.hero-image').classList.add('fade-in-delay');
    
    // Parallax effect for floating cards
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const floatingCard = document.querySelector('.floating-card');
        if (floatingCard) {
            floatingCard.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
});

// ========== Easter Egg: Konami Code ==========
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    showNotification('🎮 Konami Code Activated! You found the Easter Egg! 🎉', 'success');
    document.body.style.animation = 'rainbow 2s linear infinite';
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// Rainbow animation for easter egg
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// ========== Console Message ==========
console.log('%c🎨 Welcome to My Portfolio! ', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ and lots of ☕', 'color: #764ba2; font-size: 14px;');
console.log('%cTip: Try the Konami Code! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA', 'color: #f093fb; font-size: 12px;');
