// Section par smooth scroll — header ke neeche sahi jagah
function scrollToSection(sectionId) {
  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const target = document.getElementById(sectionId);
  if (!target) return;

  const headerHeight = document.querySelector('header').offsetHeight;
  const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

  window.scrollTo({
    top: top,
    behavior: 'smooth'
  });

  // Scroll ke baad section highlight
  target.classList.add('nav-highlight');
  setTimeout(function () {
    target.classList.remove('nav-highlight');
  }, 1500);
}

// Navbar buttons — har button apni exact jagah par
document.querySelectorAll('.top-navigation a[data-nav]').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    scrollToSection(this.getAttribute('data-nav'));
  });
});

// Baqi # links — logo, cart, login/signup cross links
document.querySelectorAll('a[href^="#"]:not([data-nav]):not(#lang-toggle)').forEach(function (link) {
  link.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const sectionId = href.replace('#', '');
    const target = document.getElementById(sectionId);

    if (target) {
      e.preventDefault();
      scrollToSection(sectionId);
    }
  });
});

// Search form
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const query = document.getElementById('search').value.trim();
  if (query) {
    scrollToSection('flash-sale');
  }
});

// Login form
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Login successful! Welcome to Daraz.');
});

// Sign up form
document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();
  alert('Account created successfully! You can now login.');
});

// Language toggle
document.getElementById('lang-toggle').addEventListener('click', function (e) {
  e.preventDefault();
  const navLinks = document.querySelectorAll('.top-navigation a[data-nav]');
  const isUrdu = document.documentElement.lang === 'ur';

  if (isUrdu) {
    document.documentElement.lang = 'en';
    this.textContent = 'زبان تبدیل کریں';
    navLinks[0].textContent = 'SAVE MORE ON APP';
    navLinks[1].textContent = 'SELL ON DARAZ';
    navLinks[2].textContent = 'HELP & SUPPORT';
    navLinks[3].textContent = 'LOGIN';
    navLinks[4].textContent = 'SIGN UP';
  } else {
    document.documentElement.lang = 'ur';
    this.textContent = 'Change Language';
    navLinks[0].textContent = 'ایپ پر مزید بچت';
    navLinks[1].textContent = 'ڈاراز پر فروخت';
    navLinks[2].textContent = 'مدد اور سپورٹ';
    navLinks[3].textContent = 'لاگ ان';
    navLinks[4].textContent = 'سائن اپ';
  }
});

// Load more products
document.getElementById('load-more').addEventListener('click', function () {
  document.querySelectorAll('.load-more-hidden').forEach(function (product) {
    product.classList.remove('load-more-hidden');
  });
  this.style.display = 'none';
});

// Auto slideshow
(function () {
  const slideIds = ['slide1', 'slide2', 'slide3'];
  let current = 0;

  setInterval(function () {
    current = (current + 1) % slideIds.length;
    document.getElementById(slideIds[current]).checked = true;
  }, 5000);
})();
