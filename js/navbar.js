// js/navbar.js — Shared navbar component for PawDee
// Usage: import '/js/navbar.js'; (auto-executes)
// Requires auth.js → call initNavAuth() separately on each page

const NAV_CSS = `
.nav-glass{background:rgba(255,255,255,.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}
@keyframes menuSlideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.menu-slide-in{animation:menuSlideDown .2s ease forwards}
`;

const NAV_HTML = `
<nav class="nav-glass fixed top-0 left-0 right-0 z-50 border-b border-orange-100">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">

      <!-- Logo -->
      <a href="/index.html" class="flex items-center gap-2 flex-shrink-0">
        <img src="/Pawdee Logo.png" alt="PawDee" class="h-8 w-auto"/>
        <span class="text-xl font-bold text-gray-900">Paw<span class="text-brand-orange">Dee</span></span>
      </a>

      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-6 lg:gap-8">
        <a href="/places.html"            class="nav-link text-gray-600 hover:text-brand-orange transition-colors font-medium text-sm" data-i18n="nav.places">🗺️ สถานที่</a>
        <a href="/sitters.html"           class="nav-link text-gray-600 hover:text-brand-orange transition-colors font-medium text-sm" data-i18n="nav.sitters">🧑 พี่เลี้ยง</a>
        <a href="/emergency.html"         class="nav-link text-gray-600 hover:text-red-500   transition-colors font-medium text-sm" data-i18n="nav.emergency">🚨 คลินิกฉุกเฉิน</a>
        <a href="/register-business.html" class="nav-link text-gray-600 hover:text-brand-orange transition-colors font-medium text-sm" data-i18n="nav.business">สำหรับธุรกิจ</a>
        <a href="/about.html"             class="nav-link text-gray-600 hover:text-brand-orange transition-colors font-medium text-sm" data-i18n="nav.about">เกี่ยวกับเรา</a>
        <a href="/contact.html"           class="nav-link text-gray-600 hover:text-brand-orange transition-colors font-medium text-sm" data-i18n="nav.contact">ติดต่อเรา</a>
      </div>

      <!-- Auth + Language -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Auth slot (populated by auth.js initNavAuth) -->
        <div id="navAuth">
          <a href="/login.html" class="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-orange transition-colors" data-i18n="nav.login">เข้าสู่ระบบ</a>
          <a href="/login.html?tab=signup" class="hidden sm:inline-flex items-center bg-brand-orange text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-brand-orange-deep transition-all shadow-md" data-i18n="nav.join">สมัครสมาชิกฟรี ✨</a>
        </div>

        <!-- Language Switcher -->
        <div class="flex items-center gap-0.5 bg-gray-100 rounded-xl p-1">
          <button class="lang-btn px-2 py-1 rounded-lg bg-brand-orange" data-lang="th" title="ภาษาไทย">
            <img src="https://flagcdn.com/20x15/th.png" width="20" height="15" alt="TH" class="rounded-sm"/>
          </button>
          <button class="lang-btn px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors" data-lang="en" title="English">
            <img src="https://flagcdn.com/20x15/gb.png" width="20" height="15" alt="EN" class="rounded-sm"/>
          </button>
          <button class="lang-btn px-2 py-1 rounded-lg hover:bg-orange-50 transition-colors" data-lang="zh" title="中文">
            <img src="https://flagcdn.com/20x15/cn.png" width="20" height="15" alt="CN" class="rounded-sm"/>
          </button>
        </div>

        <!-- Hamburger -->
        <button id="mobileMenuBtn" class="md:hidden p-2.5 rounded-lg hover:bg-orange-50 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  <div id="mobileMenu" class="hidden md:hidden border-t border-orange-100 bg-white px-4 py-4 space-y-1">
    <a href="/places.html"            class="block text-gray-700 hover:text-brand-orange font-medium py-2 px-2 rounded-lg hover:bg-orange-50 transition-colors" data-i18n="nav.places_mobile">🗺️ สถานที่ Pet-Friendly</a>
    <a href="/sitters.html"           class="block text-gray-700 hover:text-brand-orange font-medium py-2 px-2 rounded-lg hover:bg-orange-50 transition-colors" data-i18n="nav.sitters_mobile">🧑 พี่เลี้ยงสัตว์</a>
    <a href="/emergency.html"         class="block text-gray-700 hover:text-red-500   font-medium py-2 px-2 rounded-lg hover:bg-red-50  transition-colors" data-i18n="nav.emergency">🚨 คลินิกฉุกเฉิน</a>
    <a href="/register-business.html" class="block text-gray-700 hover:text-brand-orange font-medium py-2 px-2 rounded-lg hover:bg-orange-50 transition-colors" data-i18n="nav.business_mobile">🏪 สำหรับธุรกิจ</a>
    <a href="/about.html"             class="block text-gray-700 hover:text-brand-orange font-medium py-2 px-2 rounded-lg hover:bg-orange-50 transition-colors" data-i18n="nav.about">ℹ️ เกี่ยวกับเรา</a>
    <a href="/contact.html"           class="block text-gray-700 hover:text-brand-orange font-medium py-2 px-2 rounded-lg hover:bg-orange-50 transition-colors" data-i18n="nav.contact">📬 ติดต่อเรา</a>
    <hr class="border-orange-100 my-1"/>
    <a href="/login.html?tab=signup"  class="block bg-brand-orange text-white text-center py-3 rounded-xl font-semibold hover:bg-brand-orange-deep transition-all" data-i18n="nav.join">สมัครสมาชิกฟรี ✨</a>
  </div>
</nav>
`;

function initNavbar() {
  // 1. Inject CSS
  if (!document.getElementById('pawdee-nav-css')) {
    const style = document.createElement('style');
    style.id = 'pawdee-nav-css';
    style.textContent = NAV_CSS;
    document.head.appendChild(style);
  }

  // 2. Replace #nav-root placeholder OR remove existing hardcoded nav and prepend
  const root = document.getElementById('nav-root');
  if (root) {
    root.outerHTML = NAV_HTML;
  } else {
    // Remove existing hardcoded nav if present (prevents duplicates)
    document.querySelector('nav.nav-glass')?.remove();
    document.body.insertAdjacentHTML('afterbegin', NAV_HTML);
  }

  // 3. Mobile menu toggle
  const mb = document.getElementById('mobileMenuBtn');
  const mm = document.getElementById('mobileMenu');
  if (mb && mm) {
    mb.addEventListener('click', () => {
      const isHidden = mm.classList.contains('hidden');
      mm.classList.toggle('hidden', !isHidden);
      if (isHidden) mm.classList.add('menu-slide-in');
    });
    document.addEventListener('click', e => {
      if (!mm.classList.contains('hidden') && !mm.contains(e.target) && !mb.contains(e.target))
        mm.classList.add('hidden');
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') mm.classList.add('hidden');
    });
    mm.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => mm.classList.add('hidden'))
    );
  }

  // 4. Highlight active nav link based on current page
  const currentPage = '/' + (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('nav .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || (currentPage === '/index.html' && href === '/index.html'))) {
      link.classList.add('text-brand-orange', 'font-semibold');
      link.classList.remove('text-gray-600');
    }
  });
}

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}

export { initNavbar };
