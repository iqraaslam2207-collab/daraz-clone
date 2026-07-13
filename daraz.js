// Section par smooth scroll — header ke neeche sahi jagah
function scrollToSection(sectionId) {
  if (sectionId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  const target = document.getElementById(sectionId);
  if (!target) return;

  const header = document.querySelector('.site-header');
  const headerHeight = header ? header.offsetHeight : 0;
  const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

  window.scrollTo({
    top: top,
    behavior: 'smooth'
  });

  target.classList.add('nav-highlight');
  setTimeout(function () {
    target.classList.remove('nav-highlight');
  }, 1500);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.hidden = false;
  toast.classList.add('is-visible');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(function () {
    toast.classList.remove('is-visible');
    toast.hidden = true;
  }, 2800);
}

function updateCartCount(delta) {
  const badge = document.getElementById('cart-count');
  if (!badge) return;

  const current = Number(badge.dataset.count || badge.textContent || 0);
  const next = Math.max(0, current + delta);
  badge.textContent = String(next);
  badge.dataset.count = String(next);
}

// Navbar buttons — har button apni exact jagah par
document.querySelectorAll('.top-navigation a[data-nav], .header-action[data-nav]').forEach(function (link) {
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

// Category strip links
document.querySelectorAll('.category-strip a').forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    scrollToSection('categories');
  });
});

// Search form
document.getElementById('search-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const query = document.getElementById('search').value.trim();
  if (query) {
    showToast('Showing results for "' + query + '"');
    scrollToSection('flash-sale');
  }
});

// Login form
document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  showToast('Welcome back! You are logged in.');
});

// Sign up form
document.getElementById('signup-form').addEventListener('submit', function (e) {
  e.preventDefault();
  showToast('Account created. You can sign in now.');
  scrollToSection('login');
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

// Add to cart on product click
document.querySelectorAll('[data-product]').forEach(function (card) {
  card.addEventListener('click', function () {
    updateCartCount(1);
    showToast('Item added to cart');
  });
});

// Live flash sale countdown
(function () {
  const timerEl = document.getElementById('flash-timer');
  if (!timerEl) return;

  const endTime = Date.now() + (5 * 60 * 60 * 1000) + (42 * 60 * 1000) + (18 * 1000);

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function tick() {
    const remaining = Math.max(0, endTime - Date.now());
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
    timerEl.textContent = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();

// Auto slideshow
(function () {
  const slideIds = ['slide1', 'slide2', 'slide3'];
  let current = 0;

  setInterval(function () {
    current = (current + 1) % slideIds.length;
    document.getElementById(slideIds[current]).checked = true;
  }, 5000);
})();
