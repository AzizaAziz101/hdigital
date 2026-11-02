/* hoeft.digital – gemeinsame Skripte für Unterseiten */
(function () {
  var root = document.documentElement;
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('loaded'); }); });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  var nav = document.getElementById('nav'), ticking = false;
  function update() { ticking = false; nav.classList.toggle('solid', scrollY > 40); }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  var btn = document.getElementById('menu-btn'), menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
    nav.classList.toggle('solid', open || scrollY > 40);
  }
  btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  // Tally erst beim Klick laden (vorher keine Verbindung zu tally.so)
  var tallyPromise;
  function loadTally() {
    if (!tallyPromise) tallyPromise = new Promise(function (resolve, reject) {
      if (window.Tally) return resolve();
      var sc = document.createElement('script');
      sc.src = 'https://tally.so/widgets/embed.js';
      sc.onload = resolve; sc.onerror = reject;
      document.head.appendChild(sc);
    });
    return tallyPromise;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-tally-form]');
    if (!t) return;
    e.preventDefault();
    loadTally().then(function () {
      window.Tally.openPopup(t.getAttribute('data-tally-form'), { emoji: { text: '\uD83D\uDC4B', animation: 'wave' } });
    }).catch(function () { window.open(t.href, '_blank', 'noopener'); });
  });
})();
