(function () {
  var cart = [];

  function qs(id) {
    return document.getElementById(id);
  }

  function showToast(message) {
    var toast = qs('toast');
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

  function setScrollTop(y) {
    y = Math.max(0, y);
    var root = document.scrollingElement || document.documentElement;
    root.scrollTop = y;
    document.documentElement.scrollTop = y;
    document.body.scrollTop = y;
    try {
      window.scrollTo(0, y);
    } catch (err) {}
  }

  function scrollToSection(sectionId) {
    if (sectionId === 'home') {
      setScrollTop(0);
      return;
    }

    var target = qs(sectionId);
    if (!target) return;

    var header = document.querySelector('.site-header');
    var headerHeight = header ? header.offsetHeight : 0;
    var y = target.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0) - headerHeight - 10;
    setScrollTop(y);

    try {
      target.scrollIntoView({ block: 'start', inline: 'nearest' });
    } catch (err) {
      target.scrollIntoView(true);
    }

    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1');
    }
    try {
      target.focus({ preventScroll: false });
    } catch (err) {
      try { target.focus(); } catch (err2) {}
    }

    target.classList.add('nav-highlight');
    setTimeout(function () {
      target.classList.remove('nav-highlight');
    }, 1500);
  }

  function parsePrice(text) {
    var match = String(text || '').replace(/,/g, '').match(/Rs\.?\s*(\d+)/i);
    return match ? Number(match[1]) : 0;
  }

  function formatPrice(value) {
    return 'Rs.' + Number(value || 0).toLocaleString('en-PK');
  }

  function productCards() {
    return document.querySelectorAll('.product-card, .featured-product');
  }

  function renderCart() {
    var list = qs('cart-items');
    var empty = qs('cart-empty');
    var totalEl = qs('cart-total');
    var badge = qs('cart-count');
    if (!list || !badge) return;

    list.textContent = '';
    var total = 0;
    cart.forEach(function (item) {
      total += item.price * item.qty;
      var li = document.createElement('li');
      var name = document.createElement('span');
      name.textContent = item.qty + ' × ' + item.title;
      var cost = document.createElement('strong');
      cost.textContent = formatPrice(item.price * item.qty);
      li.appendChild(name);
      li.appendChild(cost);
      list.appendChild(li);
    });

    var count = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
    badge.textContent = String(count);
    badge.dataset.count = String(count);
    if (empty) empty.hidden = cart.length > 0;
    if (totalEl) totalEl.textContent = formatPrice(total);
  }

  function closeOverlays() {
    var auth = document.querySelector('.auth-section');
    if (auth) {
      auth.classList.remove('is-modal');
      auth.querySelectorAll('.auth-box').forEach(function (box) {
        box.classList.remove('is-active');
      });
    }
    ['cart-drawer', 'info-dialog', 'dialog-backdrop'].forEach(function (id) {
      var el = qs(id);
      if (el) el.hidden = true;
    });
    document.body.classList.remove('dialog-open');
  }

  function openBackdrop() {
    var backdrop = qs('dialog-backdrop');
    if (backdrop) backdrop.hidden = false;
    document.body.classList.add('dialog-open');
  }

  function openAuth(which) {
    closeOverlays();
    var auth = document.querySelector('.auth-section');
    if (!auth) {
      scrollToSection(which);
      return;
    }
    auth.classList.add('is-modal');
    openBackdrop();
    var login = qs('login');
    var signup = qs('signup');
    if (login) login.classList.toggle('is-active', which !== 'signup');
    if (signup) signup.classList.toggle('is-active', which === 'signup');
    var first = auth.querySelector('.auth-box.is-active input');
    if (first) first.focus();
  }

  function openCart() {
    closeOverlays();
    renderCart();
    var drawer = qs('cart-drawer');
    if (drawer) drawer.hidden = false;
    openBackdrop();
  }

  function openInfo(title, body) {
    closeOverlays();
    var dialog = qs('info-dialog');
    if (!dialog) return;
    qs('info-title').textContent = title;
    qs('info-body').textContent = body;
    dialog.hidden = false;
    openBackdrop();
  }

  function filterProducts(query, heading) {
    var q = String(query || '').trim().toLowerCase();
    var shown = 0;
    productCards().forEach(function (card) {
      var match = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
      if (q && q.indexOf(' ') !== -1) {
        match = q.split(/\s+/).some(function (word) {
          return word.length > 2 && card.textContent.toLowerCase().indexOf(word) !== -1;
        });
      }
      card.classList.toggle('is-filtered-out', Boolean(q) && !match);
      if (!card.classList.contains('is-filtered-out')) shown += 1;
    });
    document.querySelectorAll('.load-more-hidden').forEach(function (card) {
      if (q && !card.classList.contains('is-filtered-out')) {
        card.classList.remove('load-more-hidden');
      }
    });
    var loadMore = qs('load-more');
    if (loadMore && q) loadMore.style.display = 'none';
    showToast(heading || (q ? (shown ? shown + ' results for "' + query + '"' : 'No products match "' + query + '"') : 'Showing all products'));
    scrollToSection(shown ? 'flash-sale' : 'just-for-you');
  }

  var infoCopy = {
    'Help Center': 'Need help with an order? This clone keeps support on the page — use LOGIN for your account or search for a product above.',
    'How to Buy': 'Search or tap a category, open a product, then tap it to add it to My Cart. Open the cart icon to check out.',
    'Corporate & Bulk Purchasing': 'Bulk orders are shown as a demo message in this learning clone.',
    'Returns & Refunds': 'Demo policy: request a return within 7 days from My Cart after checkout.',
    'Daraz Shop': 'You are already in the Daraz clone shop. Scroll to Flash Sale or Just For You.',
    'Contact Us': 'Email Iqra Aslam at iqraaslam2207@gmail.com for this learning project.',
    'Purchase Protection': 'Checkout on this clone is a demo only. No real payment is taken.',
    'Daraz Pick up Points': 'Pick-up points are not live in this clone. Checkout stays on the page.',
    'About Us': 'This is a student Daraz clone by Iqra Aslam. It is not affiliated with Daraz.',
    'Digital Payments': 'Payment logos below are for layout only. No card is charged.',
    'Daraz Donates': 'Donations are not collected on this demo.',
    'Daraz Blog': 'Blog posts are not included in this clone. Browse products instead.',
    'Terms & Conditions': 'Learning project for portfolio use. Not a real store.',
    'Privacy Policy': 'This demo stores your name in this browser tab only. Nothing is sent to a server.',
    'Online Shopping App': 'Use the Download the App panel on the home banner for the store badges.',
    'Daraz Exclusive': 'Mall badges on products mark exclusive demo items.',
    'Daraz University': 'Seller courses are not part of this clone.',
    'Sell on Daraz': 'Seller signup is a demo. Use SIGN UP to create a practice account.',
    'Join the Daraz Affiliate Program': 'Affiliate links are not wired in this clone.',
    'App Store': 'App download is a demo badge. This site stays in the browser.',
    'Google Play': 'App download is a demo badge. This site stays in the browser.',
    'App Gallery': 'App download is a demo badge. This site stays in the browser.'
  };

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (this.id === 'lang-toggle') return;

      var href = this.getAttribute('href') || '';
      var label = (this.getAttribute('aria-label') || this.textContent || '').replace(/\s+/g, ' ').trim();

      if (href === '#') {
        e.preventDefault();
        var title = label || 'Daraz';
        openInfo(title, infoCopy[title] || infoCopy[label] || 'This section is included in the clone. Use Search, Cart, LOGIN, or a product card.');
        return;
      }

      var sectionId = href.replace('#', '');
      e.preventDefault();

      if (sectionId === 'login' || sectionId === 'signup') {
        openAuth(sectionId);
        history.replaceState(null, '', '#' + sectionId);
        return;
      }

      if (sectionId === 'cart') {
        openCart();
        history.replaceState(null, '', '#cart');
        return;
      }

      var filter = this.getAttribute('data-filter');
      if (filter) {
        filterProducts(filter, 'Showing ' + label);
        history.replaceState(null, '', '#' + sectionId);
        return;
      }

      closeOverlays();
      scrollToSection(sectionId);
      history.replaceState(null, '', '#' + sectionId);
    });
  });

  var searchForm = qs('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var query = qs('search').value.trim();
      if (!query) {
        showToast('Type a product name, then search.');
        qs('search').focus();
        return;
      }
      filterProducts(query);
    });
  }

  var loginForm = qs('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (loginForm.querySelector('[name="email"]') || {}).value || 'you';
      var name = email.split('@')[0];
      var account = document.querySelector('.header-action[data-nav="login"] span');
      if (account) {
        account.textContent = name;
        account.parentElement.classList.add('is-logged');
      }
      closeOverlays();
      showToast('Welcome back, ' + name + '. You are logged in.');
    });
  }

  var signupForm = qs('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (signupForm.querySelector('[name="name"]') || {}).value || 'friend';
      var account = document.querySelector('.header-action[data-nav="login"] span');
      if (account) {
        account.textContent = name;
        account.parentElement.classList.add('is-logged');
      }
      closeOverlays();
      showToast('Hi ' + name + ', your account is ready.');
    });
  }

  var langToggle = qs('lang-toggle');
  if (langToggle) {
    langToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var navLinks = document.querySelectorAll('.top-navigation a[data-nav]');
      var isUrdu = document.documentElement.lang === 'ur';
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
  }

  var loadMore = qs('load-more');
  if (loadMore) {
    loadMore.addEventListener('click', function () {
      document.querySelectorAll('.load-more-hidden').forEach(function (product) {
        product.classList.remove('load-more-hidden');
      });
      this.style.display = 'none';
      showToast('More products loaded.');
      scrollToSection('just-for-you');
    });
  }

  document.querySelectorAll('.shop-all-btn').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      productCards().forEach(function (card) {
        card.classList.remove('is-filtered-out');
      });
      document.querySelectorAll('.load-more-hidden').forEach(function (product) {
        product.classList.remove('load-more-hidden');
      });
      if (loadMore) loadMore.style.display = 'none';
      closeOverlays();
      scrollToSection('just-for-you');
      showToast('Showing all products');
    });
  });

  productCards().forEach(function (card) {
    card.addEventListener('click', function () {
      var titleNode = card.querySelector('.product-title, .product-info p, p');
      var title = ((titleNode && titleNode.textContent) || 'Item').replace(/\s+/g, ' ').trim();
      if (title.length > 42) title = title.slice(0, 42) + '…';
      var price = parsePrice(card.textContent);
      var existing = cart.filter(function (item) { return item.title === title; })[0];
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ title: title, price: price, qty: 1 });
      }
      renderCart();
      showToast('Added to cart');
    });
  });

  document.querySelectorAll('.collection').forEach(function (item) {
    item.addEventListener('click', function () {
      document.querySelectorAll('.collection').forEach(function (other) {
        other.classList.remove('is-selected');
      });
      item.classList.add('is-selected');
      var name = (item.querySelector('p') && item.querySelector('p').textContent) || 'Category';
      showToast('Browsing ' + name);
      scrollToSection('categories');
    });
  });

  var checkout = qs('cart-checkout');
  if (checkout) {
    checkout.addEventListener('click', function () {
      if (!cart.length) {
        showToast('Add a product before checkout.');
        return;
      }
      cart = [];
      renderCart();
      closeOverlays();
      showToast('Order placed. This clone does not take real payment.');
    });
  }

  document.addEventListener('click', function (e) {
    var closeBtn = e.target.closest('[data-close]');
    if (closeBtn) {
      closeOverlays();
      return;
    }
    if (e.target.id === 'dialog-backdrop') {
      closeOverlays();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOverlays();
  });

  (function () {
    var timerEl = qs('flash-timer');
    if (!timerEl) return;
    var endTime = Date.now() + (5 * 60 * 60 * 1000) + (42 * 60 * 1000) + (18 * 1000);
    function pad(value) {
      return String(value).padStart(2, '0');
    }
    function tick() {
      var remaining = Math.max(0, endTime - Date.now());
      var hours = Math.floor(remaining / (1000 * 60 * 60));
      var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      timerEl.textContent = pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
    }
    tick();
    setInterval(tick, 1000);
  })();

  (function () {
    var slideIds = ['slide1', 'slide2', 'slide3'];
    var current = 0;
    setInterval(function () {
      current = (current + 1) % slideIds.length;
      var radio = qs(slideIds[current]);
      if (radio) radio.checked = true;
    }, 5000);
  })();

  renderCart();

  var startHash = (location.hash || '').replace('#', '');
  if (startHash === 'login' || startHash === 'signup') {
    openAuth(startHash);
  } else if (startHash === 'cart') {
    openCart();
  } else if (startHash) {
    scrollToSection(startHash);
  }
})();
