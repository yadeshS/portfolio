// ===== YEAR =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== CURSOR ORB =====
const orb = document.getElementById('cursor-orb');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let orbX = mouseX, orbY = mouseY;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateOrb() {
  orbX += (mouseX - orbX) * 0.12;
  orbY += (mouseY - orbY) * 0.12;
  if (orb) {
    orb.style.left = orbX + 'px';
    orb.style.top  = orbY + 'px';
  }
  requestAnimationFrame(animateOrb);
})();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(".reveal, .reveal-left");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });
revealEls.forEach(el => io.observe(el));

// ===== ACTIVE NAV HIGHLIGHT =====
const linkEls    = Array.from(document.querySelectorAll(".nav-links a"));
const sectionIds = ["about","whatido","experience","projects","techstack","certs","contact"];
const sections   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      linkEls.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0.1 });
sections.forEach(s => navObserver.observe(s));


// ===== HERO NAME TYPEWRITER =====
const heroTyped = document.getElementById('heroTyped');
const heroName  = 'Yadesh Harihar Senthilkumar';
let heroIdx = 0;

function typeHeroName() {
  if (!heroTyped) return;
  heroTyped.textContent = heroName.substring(0, heroIdx);
  if (heroIdx < heroName.length) {
    heroIdx++;
    setTimeout(typeHeroName, 80);
  }
}
// Start after photo animation finishes (0.3s delay + 0.9s duration + 0.1s buffer = 1.3s)
setTimeout(typeHeroName, 1300);

// ===== SCROLL INDICATOR (hero) =====
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.innerHTML = '<span></span>';
  heroSection.appendChild(indicator);
}

// ===== ACCORDION =====
// Ensure all bodies are hidden on load except the first open one
document.querySelectorAll('.accordion-item').forEach(item => {
  const body = item.querySelector('.accordion-body');
  if (!body) return;
  if (!item.classList.contains('open')) {
    body.style.display = 'none';
  } else {
    body.style.display = 'block';
  }
});

document.querySelectorAll('.accordion-header').forEach(header => {
  const toggle = () => {
    const item   = header.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      const b = i.querySelector('.accordion-body');
      if (b) b.style.display = 'none';
    });
    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
      const b = item.querySelector('.accordion-body');
      if (b) b.style.display = 'block';
    }
  };

  header.addEventListener('click', toggle);
  header.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});

