/* ================================================================
   js/main.js
   Mlotshwa Trading Corporations — Shared scripts
   Safe for all pages. No conflicts with Formspree.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============ 1. MOBILE MENU ============ */
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');

  if (toggle && nav && !toggle.dataset.bound) {
    toggle.dataset.bound = '1';
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ============ 2. AUTO-ACTIVE NAV LINK ============ */
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });

  /* ============ 3. NEWS FILTER (legacy — harmless if unused) ============ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const newsItems = document.querySelectorAll('.news-item');

  if (filterBtns.length && newsItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        newsItems.forEach((item) => {
          const category = item.dataset.category;
          if (filter === 'all' || filter === category) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ============ 4. CONTACT FORM ============ */
  // ⚠️ We do NOT attach a submit handler here.
  // The inline script in contact.html handles it.
  // This block is intentionally empty to prevent conflicts.

  /* ============ 5. FORM SUCCESS MESSAGE (fallback if not handled inline) ============ */
  if (window.location.search.indexOf('sent=1') !== -1) {
    const success = document.getElementById('formSuccess');
    const form = document.getElementById('contactForm');

    // Clear the form completely
    if (form) {
      form.reset();
      form.querySelectorAll('input, textarea, select').forEach((field) => {
        if (field.type === 'hidden') return;
        if (field.type === 'checkbox' || field.type === 'radio') {
          field.checked = false;
        } else if (field.tagName === 'SELECT') {
          field.selectedIndex = 0;
        } else {
          field.value = '';
        }
      });
    }

    // Show success message
    if (success) {
      success.classList.add('visible');
      setTimeout(() => success.classList.remove('visible'), 8000);
    }

    // Clean URL
    if (window.history.replaceState) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

});