// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

// Active nav highlight
const linkEls = Array.from(document.querySelectorAll(".nav-links a"));
const sectionIds = ["about","projects","certs","skills","contact"];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

function setActiveLink(){
  let current = null;
  for (const s of sections){
    const r = s.getBoundingClientRect();
    if (r.top <= 130 && r.bottom >= 130) current = s.id;
  }
  linkEls.forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

// Close menu after clicking a link (mobile)
linkEls.forEach(a => a.addEventListener("click", () => {
  if (navLinks.classList.contains("open")) {
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
}));
