// --- THEME TOGGLE & LOCAL STORAGE ---

const themeToggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement; // We ONLY talk to the <html> tag now!

// 1. Check memory on load so the button text matches the theme
if (localStorage.getItem('portfolio-theme') === 'light') {
    if (themeToggleBtn) themeToggleBtn.innerHTML = '🌙 Dark Mode';
} else {
    if (themeToggleBtn) themeToggleBtn.innerHTML = '☀️ Light Mode';
}

// 2. Listen for the toggle click
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        
        // If it is currently light mode, switch to dark
        if (rootElement.getAttribute('data-theme') === 'light') {
            rootElement.removeAttribute('data-theme');
            themeToggleBtn.innerHTML = '☀️ Light Mode';
            localStorage.setItem('portfolio-theme', 'dark'); 
            
        // If it is currently dark mode, switch to light
        } else {
            rootElement.setAttribute('data-theme', 'light');
            themeToggleBtn.innerHTML = '🌙 Dark Mode';
            localStorage.setItem('portfolio-theme', 'light'); 
        }
    });
}


// --- GSAP SCROLL ANIMATIONS ---

// 1. Tell GSAP we want to use the ScrollTrigger tool
gsap.registerPlugin(ScrollTrigger);

// 2. Grab all the timeline cards
const timelineItems = document.querySelectorAll('.timeline-item');

// 3. Loop through each card and give it an expand animation
timelineItems.forEach((item) => {
    const content = item.querySelector('.timeline-content');
    const dot = item.querySelector('.timeline-dot');
    
    // Animate the center dot popping in first
    gsap.fromTo(dot, 
        { scale: 0 }, 
        { 
            scrollTrigger: { trigger: item, start: "top 80%", toggleActions: "play none none reverse" }, 
            scale: 1, 
            duration: 0.5, 
            ease: "back.out(2)" 
        }
    );

    // Animate the card expanding and fading in slightly after the dot
    gsap.fromTo(content, 
        { opacity: 0, scale: 0.8, y: 30 },
        {
            scrollTrigger: { trigger: item, start: "top 60%", toggleActions: "play none none reverse" },
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.8,
            delay: 0.15, // Waits a split second for the dot to appear
            ease: "power3.out"
        }
    );
});


// --- 3D TILT ANIMATION ---

// Grab all dashboard cards and apply the tilt effect
// Check if VanillaTilt is loaded on this specific page before running it
if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll(".dash-card"), {
        max: 15,           // Maximum tilt rotation (degrees)
        speed: 400,        // Speed of the enter/exit transition
        glare: true,       // Adds a shiny light reflection
        "max-glare": 0.2,  // Opacity of the glare
    });
}


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

// --- MAGNETIC CUSTOM CURSOR ---

const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

// Variables to track coordinates
let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;
let cursorRevealed = false; // Tracks if it's the first move

// 1. Track the mouse movement
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // If it is the very first time the mouse moves on this page:
    if (!cursorRevealed) {
        // Fade them in!
        if (cursorDot) cursorDot.style.opacity = 1;
        if (cursorOutline) cursorOutline.style.opacity = 1;
        
        // Instantly snap the trailing circle to the mouse so it doesn't fly across the screen
        outlineX = mouseX;
        outlineY = mouseY;
        
        cursorRevealed = true;
    }
    
    // The dot follows instantly
    if (cursorDot) {
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
});

// 2. Animate the trailing outline using a physics delay
function animateOutline() {
    // Calculate the distance between the outline and the actual mouse
    let distX = mouseX - outlineX;
    let distY = mouseY - outlineY;
    
    // Add a delay fraction (0.15) to make it trail smoothly
    outlineX += distX * 0.3;
    outlineY += distY * 0.3;
    
    if (cursorOutline) {
        cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
    }
    
    // Loop the animation at the refresh rate of the monitor
    requestAnimationFrame(animateOutline);
}
animateOutline();

// 3. Add the Magnetic Hover Effect to all links and buttons
const interactables = document.querySelectorAll('a, button');

interactables.forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (cursorOutline) cursorOutline.classList.add('hovering');
    });
    item.addEventListener('mouseleave', () => {
        if (cursorOutline) cursorOutline.classList.remove('hovering');
    });
});


// --- TYPEWRITER TEXT ---

const typewriterElement = document.querySelector('.typewriter-text');

// The list of titles to type out 
const phrases = [
    "an Industrial Engineer.",
    "a (Product) Developer.",
    "a Creative Problem Solver.",
    "a Lifelong Learner."
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    // If the element doesn't exist (like on the sub-pages), stop the function
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        // Remove a character
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        // Add a character
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    // Set the typing speed: 100ms for typing, 50ms for deleting
    let typeSpeed = isDeleting ? 50 : 100;
    
    // If the word is fully typed out, pause before deleting
    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; // Wait 2 seconds
        isDeleting = true;
    } 
    // If the word is fully deleted, pause before typing the next word
    else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length; // Move to the next word in the list
        typeSpeed = 500; // Pause for half a second before typing starts
    }
    
    // Loop the function based on the current speed
    setTimeout(typeEffect, typeSpeed);
}

// Start the animation
typeEffect();

// --- HIDDEN TERMINAL LOGIC ---

const terminalOverlay = document.getElementById('terminal-overlay');
const triggerBtn = document.getElementById('terminal-trigger');
const closeBtn = document.getElementById('close-terminal');
const terminalInput = document.getElementById('terminal-input');
const terminalBody = document.getElementById('terminal-body');

// 1. Open and Close the Terminal
if (triggerBtn && terminalOverlay) {
    triggerBtn.addEventListener('click', () => {
        terminalOverlay.classList.add('active');
        terminalInput.focus(); // Automatically puts their cursor in the typing box
    });

    closeBtn.addEventListener('click', () => {
        terminalOverlay.classList.remove('active');
    });

    // Close if they click the dark background outside the window
    terminalOverlay.addEventListener('click', (e) => {
        if (e.target === terminalOverlay) terminalOverlay.classList.remove('active');
    });
}

// 2. A helper function to print text to the screen
function printLine(text) {
    const newLine = document.createElement('p');
    newLine.innerHTML = text;
    terminalBody.appendChild(newLine);
    terminalBody.scrollTop = terminalBody.scrollHeight; // Auto-scroll to the bottom
}

// 3. Listen for the 'Enter' key
if (terminalInput) {
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            let command = this.value.trim().toLowerCase();
            
            if (command) {
                // Print what the user typed first
                printLine(`<span style="color:#38bdf8">guest@samroels:~$</span> ${command}`);
                
                // Process the command
                switch(command) {
                    case 'help':
                        printLine('Available commands: <br> - <b>skills</b>: View tech stack<br> - <b>about</b>: View short bio<br> - <b>clear</b>: Clear the terminal<br> - <b>sudo hire sam</b>: Execute admin hiring protocols');
                        break;
                    case 'skills':
                        printLine('Python | JavaScript | HTML/CSS | REST APIs | Git | GSAP');
                        break;
                    case 'about':
                        printLine('Industrial Engineer & Creative Developer based in Antwerp.');
                        break;
                    case 'clear':
                        terminalBody.innerHTML = '';
                        break;
                    case 'sudo hire sam':
                        printLine('<span style="color: #ff5f56">ACCESS GRANTED.</span> Initiating contract draft...');
                        // A fun delayed response!
                        setTimeout(() => printLine('Just kidding. But you should definitely contact me!'), 1500); /* we set the timeout to 1500 milliseconds */
                        break;
                    default:
                        printLine(`Command not found: ${command}. Type 'help' for available commands.`);
                }
            }
            // Clear the input box for the next command
            this.value = '';
        }
    });
}