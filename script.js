// ===== TECH STACK SPIDER WEB =====
(function initTechWeb() {
  const TECHS = [
    { label: 'AWS',      clr: '#ff9900' },
    { label: 'Python',   clr: '#3776ab' },
    { label: 'Docker',   clr: '#2496ed' },
    { label: 'Terraform',clr: '#7b42bb' },
    { label: 'Git',      clr: '#f05032' },
    { label: 'SQL',      clr: '#336791' },
    { label: 'JS',       clr: '#dcca32' },
    { label: 'Node.js',  clr: '#33a033' },
    { label: 'Linux',    clr: '#c8a014' },
    { label: 'React',    clr: '#61dafb' },
    { label: 'HTML/CSS', clr: '#e34c26' },
    { label: 'Go',       clr: '#00acd7' },
  ];

  const container = document.getElementById('techWebContainer');
  const canvas    = document.getElementById('techWebCanvas');
  if (!container || !canvas) return;
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0;
  let hovered = -1;
  const particles = [];
  const nodes     = [];

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }

  function init(width, height) {
    w = width; h = height;
    canvas.width  = w;
    canvas.height = h;

    if (particles.length > 0) return; // already initialised

    const n = TECHS.length;
    TECHS.forEach((tech, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      particles.push({
        x:  w / 2 + w * 0.36 * Math.cos(angle) + (Math.random() - 0.5) * 40,
        y:  h / 2 + h * 0.36 * Math.sin(angle) + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 0.38,
        vy: (Math.random() - 0.5) * 0.38,
      });

      const el = document.createElement('div');
      el.className = 'tech-node';
      el.style.background   = `color-mix(in srgb, ${tech.clr} 14%, rgba(12,26,45,0.75))`;
      el.style.border       = `1px solid color-mix(in srgb, ${tech.clr} 40%, transparent)`;
      el.style.color        = `color-mix(in srgb, ${tech.clr} 80%, #fff)`;
      el.style.boxShadow    = `0 0 16px color-mix(in srgb, ${tech.clr} 20%, transparent), 0 3px 10px rgba(0,0,0,0.3)`;
      el.style.fontWeight   = '800';
      el.style.fontSize     = '0.88rem';
      el.style.letterSpacing= '0.4px';
      el.textContent = tech.label;

      el.addEventListener('mouseenter', () => { hovered = i; applyHover(); });
      el.addEventListener('mouseleave', () => { hovered = -1; applyHover(); });

      container.appendChild(el);
      nodes.push(el);
    });
  }

  function applyHover() {
    nodes.forEach((el, i) => {
      const tech = TECHS[i];
      if (hovered === -1) {
        el.style.transform = 'translate(-50%,-50%) scale(1)';
        el.style.opacity   = '1';
        el.style.border    = `1px solid color-mix(in srgb, ${tech.clr} 40%, transparent)`;
        el.style.boxShadow = `0 0 16px color-mix(in srgb, ${tech.clr} 20%, transparent), 0 3px 10px rgba(0,0,0,0.3)`;
      } else if (i === hovered) {
        el.style.transform = 'translate(-50%,-50%) scale(1.65)';
        el.style.opacity   = '1';
        el.style.border    = `1.5px solid color-mix(in srgb, ${tech.clr} 90%, #fff)`;
        el.style.boxShadow = `0 0 32px color-mix(in srgb, ${tech.clr} 60%, transparent), 0 6px 20px rgba(0,0,0,0.4)`;
      } else {
        el.style.transform = 'translate(-50%,-50%) scale(0.78)';
        el.style.opacity   = '0.38';
        el.style.border    = `1px solid color-mix(in srgb, ${tech.clr} 40%, transparent)`;
        el.style.boxShadow = 'none';
      }
    });
  }

  function draw() {
    if (w === 0 || h === 0) { requestAnimationFrame(draw); return; }
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 80 || p.x > w - 80) p.vx *= -1;
      if (p.y < 40 || p.y > h - 40) p.vy *= -1;
    }

    const MAX = 320;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist > MAX) continue;
        const lit   = hovered !== -1 && (i === hovered || j === hovered);
        const alpha = (1 - dist / MAX) * (lit ? 0.85 : 0.2);
        const clr   = lit ? hexToRgb(TECHS[hovered].clr) : '180,200,255';
        ctx.strokeStyle = `rgba(${clr},${alpha})`;
        ctx.lineWidth   = lit ? 1.4 : 0.7;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const el = nodes[i];
      if (el) {
        el.style.left = particles[i].x + 'px';
        el.style.top  = particles[i].y + 'px';
      }
    }

    requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(entries => {
    const e = entries[0];
    const nw = Math.round(e.contentRect.width);
    const nh = Math.round(e.contentRect.height);
    if (nw > 0 && nh > 0) { init(nw, nh); canvas.width = nw; canvas.height = nh; w = nw; h = nh; }
  });
  ro.observe(container);

  const fw = container.offsetWidth, fh = container.offsetHeight;
  if (fw > 0 && fh > 0) init(fw, fh);

  requestAnimationFrame(draw);
})();

// ===== HERO → ABOUT PHOTO TRANSITION =====
(function initHeroTransition() {
  const heroLeft    = document.querySelector('.hero-left');
  const heroRight   = document.querySelector('.hero-right');
  const heroCenter  = document.querySelector('.hero-center');
  const heroPic     = document.querySelector('.hero-photo');
  const aboutSection = document.getElementById('about');
  const aboutPhoto  = document.querySelector('.about-photo');
  if (!heroLeft || !heroRight || !heroPic || !aboutSection || !aboutPhoto) return;

  // Start about-photo invisible until animation fires
  aboutPhoto.style.opacity = '0';

  let triggered = false;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;

        // Real pixel positions at this scroll moment
        const heroRect  = heroPic.getBoundingClientRect();
        const aboutRect = aboutPhoto.getBoundingClientRect();

        // Delta: how far the hero photo centre is from the about photo centre
        const dx = (heroRect.left + heroRect.width  / 2) - (aboutRect.left + aboutRect.width  / 2);
        const dy = (heroRect.top  + heroRect.height / 2) - (aboutRect.top  + aboutRect.height / 2);
        const sc = heroRect.width / Math.max(aboutRect.width, 1);

        // Instantly place about-photo at the hero photo's current position
        aboutPhoto.style.transition = 'none';
        aboutPhoto.style.transform  = `translate(${dx}px, ${dy}px) scale(${sc})`;
        aboutPhoto.style.opacity    = '1';

        // Force reflow so the browser registers the starting state
        void aboutPhoto.offsetWidth;

        // Animate to natural position
        aboutPhoto.style.transition = 'transform 0.95s cubic-bezier(0.22,1,0.36,1), opacity 0.6s ease';
        aboutPhoto.style.transform  = 'translate(0,0) scale(1)';

        // Slide hero text away in opposite corners
        heroLeft.style.transition  = 'transform 0.65s cubic-bezier(0.4,0,1,1), opacity 0.55s ease';
        heroLeft.style.transform   = 'translateX(-160px)';
        heroLeft.style.opacity     = '0';

        heroRight.style.transition = 'transform 0.65s cubic-bezier(0.4,0,1,1), opacity 0.55s ease';
        heroRight.style.transform  = 'translateX(160px)';
        heroRight.style.opacity    = '0';

        heroCenter.style.transition = 'opacity 0.45s ease';
        heroCenter.style.opacity    = '0';

        obs.disconnect();
      } else if (!entry.isIntersecting && triggered) {
        // Scrolling back up: restore hero, hide about-photo again
        triggered = false;

        heroLeft.style.transition  = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease';
        heroLeft.style.transform   = 'translateX(0)';
        heroLeft.style.opacity     = '1';

        heroRight.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease';
        heroRight.style.transform  = 'translateX(0)';
        heroRight.style.opacity    = '1';

        heroCenter.style.transition = 'opacity 0.5s ease';
        heroCenter.style.opacity    = '1';

        aboutPhoto.style.transition = 'opacity 0.3s ease';
        aboutPhoto.style.opacity    = '0';
      }
    });
  }, { threshold: 0.2 });

  obs.observe(aboutSection);
})();

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

