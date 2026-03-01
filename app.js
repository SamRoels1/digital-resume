// Grab the button and the body of the website
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Listen for a click on the button
themeToggleBtn.addEventListener('click', () => {
    
    // Check if we are currently in light mode
    if (body.getAttribute('data-theme') === 'light') {
        // Switch back to Dark Mode (default)
        body.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = '☀️ Light Mode';
    } else {
        // Switch to Light Mode
        body.setAttribute('data-theme', 'light');
        themeToggleBtn.innerHTML = '🌙 Dark Mode';
    }
});

// --- GSAP SCROLL ANIMATIONS ---

// 1. Tell GSAP we want to use the ScrollTrigger tool
gsap.registerPlugin(ScrollTrigger);

// 2. Grab all the timeline cards
const timelineItems = document.querySelectorAll('.timeline-item');

// 3. Loop through each card and give it an animation
timelineItems.forEach((item) => {
    gsap.to(item, {
        scrollTrigger: {
            trigger: item,
            start: "top 85%", // Animation starts when the top of the card hits 85% down your screen
            toggleActions: "play none none reverse" // Plays on the way down, reverses on the way up!
        },
        opacity: 1, // Fade it in
        y: 0,       // Slide it up to its normal position
        duration: 0.8,
        ease: "power2.out"
    });
});


// --- 3D TILT ANIMATION ---

// Grab all dashboard cards and apply the tilt effect
VanillaTilt.init(document.querySelectorAll(".dash-card"), {
    max: 15,           // Maximum tilt rotation (degrees)
    speed: 400,        // Speed of the enter/exit transition
    glare: true,       // Adds a shiny light reflection
    "max-glare": 0.2,  // Opacity of the glare
});


// --- HIGHLIGHT ACTIVE NAV LINK ---

// 1. Get the current page filename (e.g., 'industrial.html')
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll('.nav-link');

// 2. Loop through the links and find the match
navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    
    // If the href matches the current page, OR if we are on the root domain (which means index.html)
    if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
        link.classList.add('active');
    }
});