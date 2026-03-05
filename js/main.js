// scripts for The Kandyan Villa

document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Sticky Navbar Style Change on Scroll
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (!navbar) return;
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md', 'bg-white/95');
            navbar.classList.remove('glass-effect', 'py-2');
        } else {
            navbar.classList.remove('shadow-md', 'bg-white/95');
            navbar.classList.add('glass-effect', 'py-2');
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // init

    // Simple Scroll Animation functionality
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animClass = entry.target.dataset.animation;
                if (animClass) {
                    entry.target.classList.add(`animate-${animClass}`);
                    entry.target.classList.remove('opacity-0', 'animate-on-scroll');
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Image Sync Logic
    const syncImages = () => {
        try {
            const raw = localStorage.getItem('kv_images');
            if (!raw) return;
            const images = JSON.parse(raw);
            document.querySelectorAll('[data-kv-img]').forEach(el => {
                const key = el.dataset.kvImg;
                if (images[key]) {
                    if (el.tagName === 'IMG') {
                        el.src = images[key];
                    } else {
                        el.style.backgroundImage = `url('${images[key]}')`;
                    }
                }
            });
        } catch (e) { }
    };
    syncImages();
});
