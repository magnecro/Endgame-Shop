// ============================================================
//  1. MENU LATERALE
// ============================================================
const menuTrigger = document.getElementById('menuTrigger');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');

function openMenu() {
    sideMenu.classList.add('open');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    sideMenu.classList.remove('open');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuTrigger) {
    menuTrigger.addEventListener('click', openMenu);
}
if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
}
if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
}

// Chiudi menu con tasto ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu && sideMenu.classList.contains('open')) {
        closeMenu();
    }
});

// ============================================================
//  2. COUNTDOWN (esegue SOLO se gli elementi esistono)
// ============================================================
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

if (daysEl && hoursEl && minutesEl && secondsEl) {
    // Imposta la data di lancio (es. 1 gennaio 2027)
    const launchDate = new Date('2026-09-01T00:00:00').getTime();

    function updateCountdown() {
        const now = Date.now();
        const diff = launchDate - now;

        if (diff <= 0) {
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================================
//  3. PARTICELLE (Canvas)
// ============================================================
const canvas = document.getElementById('particlesCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const PARTICLE_COUNT = 80;

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.6 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 163, 115, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const alpha = 0.15 * (1 - dist / 150);
                    ctx.strokeStyle = `rgba(212, 163, 115, ${alpha})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        drawLines();
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// ============================================================
//  4. COOKIE BANNER (GDPR compliant)
// ============================================================
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieReject = document.getElementById('cookieReject');

if (cookieBanner && cookieAccept && cookieReject) {
    const COOKIE_CONSENT_KEY = 'endgame_cookie_consent';

    function getCookieConsent() {
        return localStorage.getItem(COOKIE_CONSENT_KEY);
    }

    function setCookieConsent(value) {
        localStorage.setItem(COOKIE_CONSENT_KEY, value);
        cookieBanner.classList.remove('show');
    }

    // Se non c'è già una scelta, mostra il banner
    if (!getCookieConsent()) {
        // Piccolo ritardo per non apparire subito in modo aggressivo
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 800);
    }

    cookieAccept.addEventListener('click', () => {
        setCookieConsent('accepted');
        console.log('Cookie accettati');
    });

    cookieReject.addEventListener('click', () => {
        setCookieConsent('rejected');
        console.log('Cookie rifiutati');
    });
}