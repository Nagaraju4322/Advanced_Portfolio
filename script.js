/* Toggle Icon Navbar */
const menuIcon = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('active');
        navbar.classList.toggle('active');
    };
}

/* Scroll Sections Active Link & Sticky Navbar */
const header = document.querySelector('header');
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

let isScrolling = false;
let currentActiveId = '';

function updateActiveSection() {
    const scrollY = window.scrollY;

    // Sticky Navbar elevation
    if (header) {
        header.classList.toggle('sticky', scrollY > 50);
    }

    // Close mobile navbar on scroll if open
    if (navbar && navbar.classList.contains('active')) {
        menuIcon.classList.remove('active');
        navbar.classList.remove('active');
    }

    // Determine current active section
    let activeId = '';
    const scrollOffset = scrollY + 180;

    sections.forEach(sec => {
        const secTop = sec.offsetTop;
        const secHeight = sec.offsetHeight;
        if (scrollOffset >= secTop && scrollOffset < secTop + secHeight) {
            activeId = sec.getAttribute('id');
        }
    });

    // If at the very top of the page, highlight the first section (home)
    if (scrollY < 120 && sections.length > 0) {
        activeId = sections[0].getAttribute('id');
    }

    // If near the bottom of the page, highlight the last section (contact)
    if ((window.innerHeight + Math.round(scrollY)) >= document.documentElement.scrollHeight - 60) {
        if (sections.length > 0) {
            activeId = sections[sections.length - 1].getAttribute('id');
        }
    }

    // Only update DOM if the active section changed
    if (activeId && activeId !== currentActiveId) {
        currentActiveId = activeId;
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}` || href.endsWith(`#${activeId}`)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    isScrolling = false;
}

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(updateActiveSection);
        isScrolling = true;
    }
}, { passive: true });

// Initial call to set active section on page load
updateActiveSection();

/* Remove toggle icon and navbar when click navbar link (click) */
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuIcon && navbar) {
            menuIcon.classList.remove('active');
            navbar.classList.remove('active');
        }
    });
});

/* Scroll Reveal */
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        distance: '45px',
        duration: 1000,
        delay: 100,
        reset: false,
        viewFactor: 0.15
    });

    sr.reveal('.home-content h3, .heading', { origin: 'top' });
    sr.reveal('.home-content h1, .about-img, .projects-container', { origin: 'left' });
    sr.reveal('.home-content p, .about-content', { origin: 'right' });
    sr.reveal('.home-img, .social-media, .home-content .btn, .services-container, .skills-container, .tools-container, .contact form', { origin: 'bottom' });
}

/* Typed JS */
if (typeof Typed !== 'undefined' && document.querySelector('.multiple-text')) {
    const typed = new Typed('.multiple-text', {
        strings: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
        typeSpeed: 100,
        backSpeed: 100,
        backDelay: 1000,
        loop: true
    });
}

/* Theme Toggle */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
if (themeToggle) {
    const icon = themeToggle.querySelector('i');
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        if (body.classList.contains('light-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

/* Custom Cursor with smooth rAF interpolation (no memory leak) */
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

if (cursorDot && cursorOutline) {
    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;
    let isCursorActive = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isCursorActive) {
            outlineX = mouseX;
            outlineY = mouseY;
            isCursorActive = true;
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        }

        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    function animateCursor() {
        if (isCursorActive) {
            outlineX += (mouseX - outlineX) * 0.18;
            outlineY += (mouseY - outlineY) * 0.18;
            cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%)`;
        }
        requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
        cursorOutline.style.opacity = '0';
        isCursorActive = false;
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
    });
}

/* Contact Form EmailJS Integration */
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formMsg = document.getElementById('form-msg');

if (contactForm && typeof emailjs !== 'undefined') {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Change button text to indicate sending
        const originalBtnText = submitBtn ? submitBtn.value : 'Send';
        if (submitBtn) submitBtn.value = "Sending...";
        
        // Send form using EmailJS
        emailjs.sendForm('service_qv2o12t', 'template_maamt13', this)
            .then(function() {
                if (formMsg) {
                    formMsg.style.display = 'block';
                    formMsg.style.color = '#00ff00'; // Success color
                    formMsg.innerText = 'Message sent successfully!';
                }
                contactForm.reset();
                if (submitBtn) submitBtn.value = originalBtnText;

                // Hide message after 5 seconds
                setTimeout(() => {
                    if (formMsg) formMsg.style.display = 'none';
                }, 5000);
            }, function(error) {
                console.log('FAILED...', error);
                if (formMsg) {
                    formMsg.style.display = 'block';
                    formMsg.style.color = '#ff0000'; // Error color
                    formMsg.innerText = 'Failed to send message. Please try again.';
                }
                if (submitBtn) submitBtn.value = originalBtnText;

                setTimeout(() => {
                    if (formMsg) formMsg.style.display = 'none';
                }, 5000);
            });
    });
}
