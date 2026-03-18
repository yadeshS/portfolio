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
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });
revealEls.forEach(el => io.observe(el));

// ===== MOBILE MENU =====
const menuBtn  = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

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

// Close menu on link click (mobile)
linkEls.forEach(a => a.addEventListener("click", () => {
  if (navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
}));

// ===== TYPEWRITER =====
const typedEl = document.getElementById("typedText");
const typingStrings = [
  "I design, deploy, and secure cloud platforms with IaC, CI/CD, and observability.",
  "I automate deployments with Terraform, CloudFormation, and GitHub Actions.",
  "I monitor and optimize cloud costs for scalable production workloads."
];
let currentString = 0, currentIndex = 0, isDeleting = false;

function typeLoop() {
  if (!typedEl) return;
  const fullText = typingStrings[currentString];
  typedEl.textContent = fullText.substring(0, currentIndex);

  if (!isDeleting) {
    currentIndex++;
    if (currentIndex > fullText.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    currentIndex--;
    if (currentIndex === 0) {
      isDeleting = false;
      currentString = (currentString + 1) % typingStrings.length;
    }
  }
  setTimeout(typeLoop, isDeleting ? 40 : 68);
}
typeLoop();

// ===== SCROLL INDICATOR (hero) =====
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.innerHTML = '<span></span>';
  heroSection.appendChild(indicator);
}

// ===== ACCORDION =====
document.querySelectorAll('.accordion-header').forEach(header => {
  const toggle = () => {
    const item   = header.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
    });
    // Open clicked if it was closed
    if (!isOpen) {
      item.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
    }
  };

  header.addEventListener('click', toggle);
  header.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});

// ===== THREE.JS TECH STACK =====
function initTechStack() {
  const canvas = document.getElementById('tech-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    const fallback = document.querySelector('.canvas-fallback');
    if (fallback) fallback.style.display = 'block';
    if (canvas) canvas.style.display = 'none';
    return;
  }

  const W = canvas.clientWidth || 600;
  const H = canvas.clientHeight || 420;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const light1 = new THREE.PointLight(0x00ffa0, 3.5, 28);
  light1.position.set(4, 4, 6);
  scene.add(light1);

  const light2 = new THREE.PointLight(0x7888ff, 2.5, 28);
  light2.position.set(-5, -3, 4);
  scene.add(light2);

  // Skills list with brand colors
  const skills = [
    { name: 'AWS',       rgb: [255, 153,   0] },
    { name: 'Python',    rgb: [ 55, 118, 171] },
    { name: 'Docker',    rgb: [ 36, 150, 237] },
    { name: 'Terraform', rgb: [123,  66, 188] },
    { name: 'Git',       rgb: [240,  80,  50] },
    { name: 'SQL',       rgb: [ 51, 103, 145] },
    { name: 'JS',        rgb: [220, 200,  50] },
    { name: 'Node',      rgb: [ 51, 163,  51] },
    { name: 'Linux',     rgb: [200, 160,  20] },
    { name: 'React',     rgb: [ 97, 218, 251] },
  ];

  function makeTexture(name, [r, g, b]) {
    const c   = document.createElement('canvas');
    c.width   = c.height = 256;
    const ctx = c.getContext('2d');

    // Sphere-shading gradient
    const grad = ctx.createRadialGradient(95, 85, 18, 128, 128, 128);
    grad.addColorStop(0, `rgb(${Math.min(r+70,255)},${Math.min(g+70,255)},${Math.min(b+70,255)})`);
    grad.addColorStop(1, `rgb(${Math.max(r-50,0)},${Math.max(g-50,0)},${Math.max(b-50,0)})`);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(128, 128, 124, 0, Math.PI * 2);
    ctx.fill();

    // Text label
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = 'bold 54px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 128, 128);

    return new THREE.CanvasTexture(c);
  }

  const group       = new THREE.Group();
  const sphereMeshes = [];

  skills.forEach((skill, i) => {
    const size = 0.52 + Math.random() * 0.28;
    const geo  = new THREE.SphereGeometry(size, 40, 40);
    const mat  = new THREE.MeshStandardMaterial({
      map:       makeTexture(skill.name, skill.rgb),
      roughness: 0.22 + Math.random() * 0.35,
      metalness: 0.35 + Math.random() * 0.40,
    });

    const mesh = new THREE.Mesh(geo, mat);

    // Cluster positions
    const angle  = (i / skills.length) * Math.PI * 2;
    const radius = 1.6 + Math.random() * 1.5;
    const y      = (Math.random() - 0.5) * 3;
    mesh.position.set(
      Math.cos(angle) * radius,
      y,
      Math.sin(angle) * radius * 0.55 - 0.5
    );

    mesh.userData.origY       = mesh.position.y;
    mesh.userData.floatOffset = Math.random() * Math.PI * 2;
    mesh.userData.rotSpeedX   = (Math.random() - 0.5) * 0.016;
    mesh.userData.rotSpeedY   = (Math.random() - 0.5) * 0.012;

    sphereMeshes.push(mesh);
    group.add(mesh);
  });

  scene.add(group);

  // Mouse influence
  let targetRotX = 0;
  window.addEventListener('mousemove', e => {
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.7;
  });

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    group.rotation.y  += 0.003;
    group.rotation.x  += (targetRotX - group.rotation.x) * 0.04;

    sphereMeshes.forEach(mesh => {
      mesh.rotation.x += mesh.userData.rotSpeedX;
      mesh.rotation.y += mesh.userData.rotSpeedY;
      mesh.position.y  = mesh.userData.origY + Math.sin(t + mesh.userData.floatOffset) * 0.11;
    });

    renderer.render(scene, camera);
  })();

  // Resize
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}

// Init after everything loads
if (typeof THREE !== 'undefined') {
  initTechStack();
} else {
  window.addEventListener('load', initTechStack);
}
