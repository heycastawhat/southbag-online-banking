// ===== PERFORMANCE KILLERS (But Still Usable) =====

// Block the main thread briefly at startup to tank TBT/FCP
(() => {
    const end = performance.now() + 2500; // ~2.5s blocking
    let junk = 0;
    while (performance.now() < end) {
        junk += Math.sqrt(junk + Math.random());
    }
    // keep a reference so engines don't optimize away
    window.__perfWaste = junk;
})();

// Cause a measurable layout shift (CLS)
setTimeout(() => {
    const banner = document.createElement('div');
    banner.textContent = 'Promo banner';
    banner.style.background = '#ffd54f';
    banner.style.height = '40px';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.justifyContent = 'center';
    banner.style.fontWeight = 'bold';
    document.body.prepend(banner);
    // expand height suddenly to trigger CLS
    setTimeout(() => {
        banner.style.height = '140px';
    }, 1200);
}, 800);

// Heavy animations running continuously - NOT blocking
setInterval(() => {
    // Light CPU work (noticeable but not freezing)
    for (let i = 0; i < 10000; i++) {
        Math.sin(Math.random()) * Math.cos(Math.random());
    }
}, 100);

// Multiple render-blocking font loads
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=' + 
    'Lobster+2&family=Pacifico&family=VT323&family=Fredoka+One&family=Fredoka&family=Fredoka:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Unused CSS that still loads
const unusedStyles = document.createElement('link');
unusedStyles.rel = 'stylesheet';
unusedStyles.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/bootstrap.css';
unusedStyles.media = 'print'; 
document.head.appendChild(unusedStyles);

// Large unoptimized images loaded without lazy loading
function addUnoptimizedImages() {
    const placeholders = [
        'https://via.placeholder.com/1920x1080.jpg?text=Banner1',
        'https://via.placeholder.com/1920x1080.jpg?text=Banner2',
        'https://via.placeholder.com/1920x1080.jpg?text=Banner3'
    ];
    
    placeholders.forEach((src, idx) => {
        setTimeout(() => {
            const img = new Image();
            img.src = src;
            img.style.width = '100%';
            img.style.marginTop = '20px';
            // No lazy loading, no sizes, no srcset
        }, idx * 100);
    });
}

// Inline large SVG data URI
document.body.innerHTML += `
<svg style="display: none; width: 0; height: 0;" xmlns="http://www.w3.org/2000/svg">
${Array(500).fill('<path d="M 10 10 L 20 20 L 30 10" stroke="red" fill="none"/>').join('')}
</svg>
`;

// Load multiple tracking scripts (non-blocking but slow)
const trackers = [
    'https://cdn.jsdelivr.net/npm/chart.js@3.0.0/dist/chart.min.js',
    'https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js'
];

trackers.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
});

// Inefficient DOM queries (not blocking, just slow)
document.addEventListener('DOMContentLoaded', () => {
    // Query the same elements multiple times
    setInterval(() => {
        const all = document.querySelectorAll('*'); // Re-query every 500ms
        console.log('Total elements: ' + all.length);
    }, 500);
});

// Large but not-crashing data in memory
let cache = {};
for (let i = 0; i < 1000; i++) {
    cache['item_' + i] = {
        data: new Array(100).fill(Math.random()),
        timestamp: Date.now()
    };
}

// Unused code (bloats bundle)
function calculateComplexMath(n) {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(Math.random());
    }
    return result;
}

function anotherUnusedFunction() {
    return calculateComplexMath(100);
}

// CSS-in-JS rendering (slow)
const styles = document.createElement('style');
let cssRules = '';
for (let i = 0; i < 500; i++) {
    cssRules += `.generated-class-${i} { color: hsl(${i % 360}, 100%, 50%); }\n`;
}
styles.textContent = cssRules;
document.head.appendChild(styles);

// No service worker means no caching
if ('serviceWorker' in navigator) {
    // Intentionally don't register
    console.log('Service worker not implemented');
}

// Third-party scripts that slow everything down
const thirdPartyScripts = [
    'https://connect.facebook.net/en_US/sdk.js',
    'https://platform.twitter.com/widgets.js',
    'https://apis.google.com/js/platform.js'
];

thirdPartyScripts.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    // script.defer = true; // Intentionally missing defer
    document.head.appendChild(script);
});

// Lazy load images the WRONG way (downloads immediately anyway)
setTimeout(() => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
        img.src = img.getAttribute('data-src');
    });
}, 1000);

for (let i = 0; i < 5; i++) {
    document.addEventListener('scroll', () => {
        // Heavy calculation on scroll
        const expensive = Math.sqrt(Math.random() * 1000000);
    });
}

document.head.innerHTML += `
<meta http-equiv="Content-Encoding" content="gzip">
<!-- But actually not using gzip -->
`;

// Global scope pollution
window.unusedGlobal1 = new Array(100).fill(Math.random());
window.unusedGlobal2 = { data: new Array(100).fill('x'.repeat(50)) };
window.unusedGlobal3 = () => console.log('unused');
