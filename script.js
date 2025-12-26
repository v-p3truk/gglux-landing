document.addEventListener('DOMContentLoaded', () => {

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve to allow re-trigger if needed, 
                // but for simple fade-in-up usually we do. 
                // However, user asked for "unstacking when scrolling up",
                // so we might need a separate observer for that or handle it here.
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });

    // --- Card Stacking Logic ---
    const cards = document.querySelectorAll('.feedback-card');

    // Assign random rotation and z-index
    cards.forEach((card, index) => {
        // Random rotation between -3 and 3 degrees for "messy" look
        const rotation = (Math.random() * 6 - 3).toFixed(1);
        card.style.setProperty('--rotation', `${rotation}deg`);
        card.style.setProperty('--z-index', index + 1);

        // Setup initial directions for "fly in"
        if (index % 2 === 0) {
            card.classList.add('from-left');
        } else {
            card.classList.add('from-right');
        }
    });

    const cardObserverOptions = {
        threshold: 0.15, // Slightly lower threshold
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('stacked');
            } else {
                // Fix jitter: Only unstack if we are scrolling UP and the element is leaving towards bottom
                // Checking boundingClientRect.top to see if it's below viewport
                // OR if it's simply below the fold.

                // Simple logic: If we are scrolling past the end (scrolling down), keep them stacked.
                // We only want to remove 'stacked' if they go off-screen to the bottom (i.e. we are scrolling UP looking at previous content)
                // However, IntersectionObserver fires when it exits viewport.
                // If it exits at the TOP (scrolling down), it should stay stacked.
                // If it exits at the BOTTOM (scrolling up), it should unstack.

                if (entry.boundingClientRect.top > 0) {
                    // It is exiting downwards (scrolling up), so unstack it
                    entry.target.classList.remove('stacked');
                }
                // If entry.boundingClientRect.top <= 0, it means it exited upwards (we scrolled past it), so keep it stacked.
            }
        });
    }, cardObserverOptions);

    cards.forEach(card => {
        cardObserver.observe(card);

        // Lightbox Click Event
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img) {
                openLightbox(img.src);
            }
        });
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightboxModal() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    closeBtn.addEventListener('click', closeLightboxModal);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxModal();
        }
    });

    // Header Scroll Effect

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Carousel Logic
    const carouselTrack = document.getElementById('productCarousel');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');

    if (carouselTrack && prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({
                left: 310, // Card width + gap
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            carouselTrack.scrollBy({
                left: -310,
                behavior: 'smooth'
            });
        });
    }

    // Feedback Marquee Clone for infinite loop
    const feedbackTrack = document.querySelector('.feedback-track');
    if (feedbackTrack) {
        const clone = feedbackTrack.cloneNode(true);
        document.querySelector('.feedback-scroller').appendChild(clone);
    }

    console.log('GGLUX Landing Initialized 🚀');
});
