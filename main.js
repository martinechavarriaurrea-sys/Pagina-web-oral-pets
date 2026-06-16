// Mobile menu toggle
const toggle = document.querySelector('.navbar__toggle');
const links = document.querySelector('.navbar__links');

toggle?.addEventListener('click', () => {
  links.classList.toggle('open');
});

// Close menu on link click
links?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 4px 20px rgba(0,0,0,.15)'
    : '0 2px 12px rgba(0,0,0,.08)';
});
