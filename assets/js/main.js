/* Pola Vida website prototype. No libraries. */
(function () {
  'use strict';
  var html = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- toast ---------- */
  var toastEl = document.querySelector('.toast'), tt;
  function toast(msg) { if (!toastEl) return; toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { toastEl.classList.remove('show'); }, 3400); }
  window.pvToast = toast;

  /* ---------- design switch (A / B) ---------- */
  function skin() { return html.getAttribute('data-skin') === 'b' ? 'b' : 'a'; }
  function tagLinks() {
    var v = skin();
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (!h || /^(https?:|mailto:|tel:|#|javascript:)/.test(h) || !/\.html/.test(h)) return;
      var hash = '', i = h.indexOf('#'); if (i > -1) { hash = h.slice(i); h = h.slice(0, i); }
      h = h.replace(/([?&])v=[ab]&?/, '$1').replace(/[?&]$/, '');
      a.setAttribute('href', h + (h.indexOf('?') > -1 ? '&' : '?') + 'v=' + v + hash);
    });
  }
  function setSkin(v, announce) {
    html.classList.add('switching');
    setTimeout(function () {
      html.setAttribute('data-skin', v); store.set('pv-skin', v); tagLinks();
      document.querySelectorAll('.skin-switch button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.skin === v)); });
      try { var u = new URL(location.href); u.searchParams.set('v', v); history.replaceState(null, '', u); } catch (e) {}
      window.dispatchEvent(new Event('resize'));
      html.classList.remove('switching');
      if (announce) toast(v === 'b' ? 'Design B · Immersive' : 'Design A · Faithful');
    }, 160);
  }
  document.querySelectorAll('.skin-switch button').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.skin === skin()));
    b.addEventListener('click', function () { if (b.dataset.skin !== skin()) setSkin(b.dataset.skin, true); });
  });
  tagLinks();

  /* ---------- header ---------- */
  var header = document.querySelector('.site-header');
  function setHdr() { html.style.setProperty('--hdr-h', header.getBoundingClientRect().bottom + 'px'); html.style.setProperty('--hh', header.offsetHeight + 'px'); }
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 10); if (document.body.classList.contains('menu-open')) setHdr(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setHdr); setHdr(); onScroll();

  var dds = document.querySelectorAll('.dd, .lang');
  function closeAll(except) { dds.forEach(function (d) { if (d !== except) { d.classList.remove('open'); var b = d.querySelector('button'); if (b) b.setAttribute('aria-expanded', 'false'); } }); }
  dds.forEach(function (dd) {
    var btn = dd.querySelector('button');
    btn.addEventListener('click', function (e) { e.stopPropagation(); var o = !dd.classList.contains('open'); closeAll(dd); dd.classList.toggle('open', o); btn.setAttribute('aria-expanded', String(o)); });
    dd.addEventListener('focusout', function (e) { if (!dd.contains(e.relatedTarget)) { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  });
  document.addEventListener('click', function () { closeAll(); });
  document.querySelectorAll('[data-lang]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); if (a.dataset.lang !== 'en') toast(a.dataset.name + ' version: added with WPML at build. Prototype shows English.'); closeAll(); });
  });

  var menuBtn = document.querySelector('.menu-btn'), panel = document.getElementById('mobile-menu');
  function toggleMenu(o, refocus) {
    setHdr(); panel.classList.toggle('open', o); document.body.classList.toggle('menu-open', o);
    menuBtn.setAttribute('aria-expanded', String(o)); var l = menuBtn.querySelector('.lbl'); if (l) l.textContent = o ? 'CLOSE' : 'MENU';
    if (!o && refocus) menuBtn.focus();
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () { toggleMenu(!panel.classList.contains('open')); });
    panel.addEventListener('click', function (e) { if (e.target.closest('a')) toggleMenu(false); });
    window.matchMedia('(min-width: 1181px)').addEventListener('change', function (m) { if (m.matches) toggleMenu(false); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); if (document.body.classList.contains('menu-open')) toggleMenu(false, true); } });

  /* ---------- marquee ---------- */
  document.querySelectorAll('.marquee-track').forEach(function (t) {
    Array.prototype.slice.call(t.children).forEach(function (img) { var c = img.cloneNode(true); c.alt = ''; c.setAttribute('aria-hidden', 'true'); t.appendChild(c); });
  });
  document.querySelectorAll('.pause-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = b.closest('.photos'), on = p.classList.toggle('paused');
      b.setAttribute('aria-pressed', String(on)); b.querySelector('span').textContent = on ? 'Play photos' : 'Pause photos';
    });
  });

  /* ---------- lightbox (photo strip + galleries) ---------- */
  (function () {
    var groups = document.querySelectorAll('.photos, .gallery');
    if (!groups.length) return;
    var HD = /\/(s\d\d)\.webp$/;
    function full(src) { return HD.test(src) ? src.replace(HD, '/$1-lg.webp') : src; }
    function items(g) {
      var seen = {}, out = [];
      g.querySelectorAll('img').forEach(function (im) {
        if (im.closest('.video-ph') || im.getAttribute('aria-hidden') === 'true') return;
        var s = im.getAttribute('src'); if (seen[s]) return; seen[s] = 1;
        var fc = im.closest('figure') && im.closest('figure').querySelector('figcaption');
        out.push({ src: full(s), alt: im.alt || '', cap: fc ? fc.textContent : im.alt || '' });
      });
      return out;
    }
    var lb = document.createElement('div');
    lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Photo viewer'); lb.hidden = true;
    lb.innerHTML = '<button class="lb-x" type="button" aria-label="Close">&times;</button>' +
      '<button class="lb-nav lb-prev" type="button" aria-label="Previous photo">&#8249;</button>' +
      '<figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>' +
      '<button class="lb-nav lb-next" type="button" aria-label="Next photo">&#8250;</button><div class="lb-count" aria-live="polite"></div>';
    document.body.appendChild(lb);
    var im = lb.querySelector('.lb-img'), cap = lb.querySelector('.lb-cap'), cnt = lb.querySelector('.lb-count');
    var list = [], i = 0, last = null, grp = null;
    function show(k) {
      i = (k + list.length) % list.length; var it = list[i];
      lb.classList.add('loading'); im.classList.remove('on');
      var pre = new Image(); pre.onload = pre.onerror = function () { if (list[i] !== it) return; im.src = it.src; im.alt = it.alt; lb.classList.remove('loading'); requestAnimationFrame(function () { im.classList.add('on'); }); };
      pre.src = it.src;
      cap.textContent = it.cap; cnt.textContent = (i + 1) + ' / ' + list.length;
      [list[(i + 1) % list.length], list[(i - 1 + list.length) % list.length]].forEach(function (n) { if (n) (new Image()).src = n.src; });
    }
    function open(g, src) {
      list = items(g); if (!list.length) return;
      var k = 0; list.forEach(function (it, n) { if (it.src === full(src)) k = n; });
      grp = g; last = document.activeElement; if (g.classList.contains('photos')) g.classList.add('lb-hold');
      lb.hidden = false; document.documentElement.classList.add('lb-lock');
      requestAnimationFrame(function () { lb.classList.add('open'); });
      lb.querySelector('.lb-prev').hidden = lb.querySelector('.lb-next').hidden = list.length < 2;
      show(k); lb.querySelector('.lb-x').focus();
    }
    function close() {
      if (lb.hidden) return;
      lb.classList.remove('open'); document.documentElement.classList.remove('lb-lock');
      if (grp) grp.classList.remove('lb-hold');
      setTimeout(function () { lb.hidden = true; im.removeAttribute('src'); }, 250);
      if (last && last.focus) last.focus();
    }
    groups.forEach(function (g) {
      g.querySelectorAll('img').forEach(function (img) {
        if (img.closest('.video-ph')) return;
        img.classList.add('zoomable');
        if (img.getAttribute('aria-hidden') !== 'true') { img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', 'Open photo: ' + (img.alt || 'photo')); }
      });
      g.addEventListener('click', function (e) { var f = e.target.closest('figure'), t = e.target.closest('img.zoomable') || (f && f.querySelector('img.zoomable')); if (t) open(g, t.getAttribute('src')); });
      g.addEventListener('keydown', function (e) { var t = e.target; if (t.classList && t.classList.contains('zoomable') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(g, t.getAttribute('src')); } });
    });
    lb.addEventListener('click', function (e) {
      if (e.target.closest('.lb-prev')) show(i - 1);
      else if (e.target.closest('.lb-next')) show(i + 1);
      else if (e.target.closest('.lb-x') || !e.target.closest('.lb-img')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(i + 1);
      else if (e.key === 'ArrowLeft') show(i - 1);
      else if (e.key === 'Tab') { var f = Array.prototype.filter.call(lb.querySelectorAll('button'), function (b) { return !b.hidden; }); var a = f.indexOf(document.activeElement); e.preventDefault(); f[(a + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    });
    var sx = null, sy = 0;
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (sx === null) return; var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(i + (dx < 0 ? 1 : -1)); else if (dy > 90) close();
    });
  })();

  /* ---------- sliders ---------- */
  document.querySelectorAll('[data-slider]').forEach(function (sl) {
    var sec = sl.closest('[data-slider-scope]') || sl.closest('section');
    var track = sl.querySelector('.slider-track'), slides = Array.prototype.slice.call(track.children);
    var counters = sec.querySelectorAll('.counter'), n = slides.length, i = 0, timer = null, hover = false;
    function vis() { return parseInt(getComputedStyle(sl).getPropertyValue('--vis'), 10) || 1; }
    function max() { return Math.max(0, n - vis()); }
    function go(k) {
      var m = max(); i = k > m ? 0 : (k < 0 ? m : k);
      var gap = parseFloat(getComputedStyle(sl).getPropertyValue('--gap')) || 24;
      track.style.transform = 'translateX(' + (-i * (slides[0].getBoundingClientRect().width + gap)) + 'px)';
      slides.forEach(function (s, j) { var shown = j >= i && j < i + vis(); s.setAttribute('aria-hidden', String(!shown)); s.querySelectorAll('a,button').forEach(function (el) { el.tabIndex = shown ? 0 : -1; }); });
      counters.forEach(function (c) { c.textContent = (i + 1) + ' / ' + n; });
    }
    sec.querySelectorAll('[data-prev]').forEach(function (b) { b.addEventListener('click', function () { go(i - 1); restart(); }); });
    sec.querySelectorAll('[data-next]').forEach(function (b) { b.addEventListener('click', function () { go(i + 1); restart(); }); });
    var x0 = null;
    sl.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    sl.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); restart(); } x0 = null; });
    var ms = parseInt(sl.getAttribute('data-interval'), 10) || 6000;
    function start() { if (reduce || timer) return; timer = setInterval(function () { if (!hover && !document.hidden) go(i + 1); }, ms); }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }
    sec.addEventListener('mouseenter', function () { hover = true; }); sec.addEventListener('mouseleave', function () { hover = false; });
    sec.addEventListener('focusin', function () { hover = true; }); sec.addEventListener('focusout', function () { hover = false; });
    window.addEventListener('resize', function () { go(Math.min(i, max())); });
    go(0); start();
  });

  /* ---------- scroll reveal + parallax ---------- */
  var rv = document.querySelectorAll('[data-r]');
  if (!reduce && 'IntersectionObserver' in window && rv.length) {
    var vh = window.innerHeight;
    rv.forEach(function (el) { if (el.getBoundingClientRect().top < vh) el.classList.add('in'); });
    html.classList.add('anim');
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { var row = en.target.closest('.cards'); (row ? row.querySelectorAll('[data-r]') : [en.target]).forEach(function (el) { el.classList.add('in'); io.unobserve(el); }); en.target.classList.add('in'); io.unobserve(en.target); } }); }, { threshold: 0.01 });
    var revealAll = function () { rv.forEach(function (el) { el.classList.add('in'); }); };
    window.addEventListener('scroll', function () { if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 120) revealAll(); }, { passive: true });
    setTimeout(function () { if (!document.querySelector('[data-r].in')) revealAll(); }, 2500);
    rv.forEach(function (el) { if (!el.classList.contains('in')) io.observe(el); });
    window.addEventListener('beforeprint', function () { rv.forEach(function (el) { el.classList.add('in'); }); });
  }
  var heroImg = document.querySelector('.hero-media');
  if (heroImg && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () { var y = window.scrollY; if (y < 900) heroImg.style.transform = 'translateY(' + (y * 0.18) + 'px)'; ticking = false; });
    }, { passive: true });
  }

  /* ---------- prototype links and forms ---------- */
  document.querySelectorAll('[data-todo]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); toast(a.getAttribute('data-todo')); }); });
  document.querySelectorAll('[data-signup]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = f.querySelector('input[type=email]'), c = f.querySelector('input[name=consent]'), m = f.querySelector('.form-msg');
      if (!em.value || !em.checkValidity()) { m.textContent = 'Please enter a valid email address.'; em.focus(); return; }
      if (c && !c.checked) { m.textContent = 'Please tick the box to agree to receive emails.'; c.focus(); return; }
      m.textContent = 'Thank you. (Prototype: sign-up is connected at launch.)'; f.reset();
    });
  });
  document.querySelectorAll('form[data-proto]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = Array.prototype.find.call(f.querySelectorAll('[required]'), function (el) { return el.type === 'checkbox' ? !el.checked : !el.value || (el.checkValidity && !el.checkValidity()); });
      var m = f.querySelector('.form-msg');
      if (bad) { if (m) m.textContent = 'Please fill in the highlighted fields.'; bad.focus(); return; }
      var next = f.getAttribute('data-next');
      if (next) { location.href = next + (next.indexOf('?') > -1 ? '&' : '?') + 'v=' + skin(); return; }
      if (m) m.textContent = f.getAttribute('data-proto') || 'Thank you. (Prototype: nothing was sent.)';
      toast(f.getAttribute('data-proto') || 'Prototype: nothing was sent.');
    });
  });

  /* ---------- tabs (product, account, login) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (g) {
    var btns = g.querySelectorAll('[data-tab]');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); var p = document.getElementById(x.dataset.tab); if (p) p.hidden = x !== b; });
      });
    });
  });
  document.querySelectorAll('[data-show]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault(); var t = a.dataset.show;
      document.querySelectorAll('[data-tab]').forEach(function (x) { if (x.dataset.tab === t) x.click(); });
    });
  });

  /* ---------- event filters ---------- */
  var chips = document.querySelectorAll('.chips [data-filter]');
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var f = c.dataset.filter;
      chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
      document.querySelectorAll('[data-cats]').forEach(function (ev) { ev.classList.toggle('hidden', f !== 'all' && (' ' + ev.dataset.cats + ' ').indexOf(' ' + f + ' ') < 0); });
      document.querySelectorAll('[data-month]').forEach(function (mo) {
        var any = mo.querySelectorAll('[data-cats]:not(.hidden)').length; mo.style.display = any ? '' : 'none';
      });
      var none = document.querySelector('.no-events'); if (none) none.hidden = !!document.querySelector('[data-cats]:not(.hidden)');
    });
  });

  /* ---------- cart (prototype, stored in this browser) ---------- */
  function cart() { try { return JSON.parse(store.get('pv-cart') || '[]'); } catch (e) { return []; } }
  function saveCart(c) { store.set('pv-cart', JSON.stringify(c)); badge(); }
  function badge() { var n = cart().reduce(function (s, x) { return s + x.q; }, 0); document.querySelectorAll('.cart-count').forEach(function (b) { b.textContent = n; b.style.display = n ? '' : 'none'; }); }
  function add(item, q) { var c = cart(), f = c.filter(function (x) { return x.id === item.id; })[0]; if (f) f.q += q; else { item.q = q; c.push(item); } saveCart(c); toast(item.name + ' added to your cart'); }
  document.querySelectorAll('[data-add]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var item = JSON.parse(b.getAttribute('data-add')); var qi = document.querySelector('.qty input');
      add(item, b.hasAttribute('data-useqty') && qi ? Math.max(1, parseInt(qi.value, 10) || 1) : 1);
    });
  });
  document.querySelectorAll('.qty').forEach(function (q) {
    var inp = q.querySelector('input');
    q.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { inp.value = Math.max(1, (parseInt(inp.value, 10) || 1) + (b.dataset.d === '+' ? 1 : -1)); inp.dispatchEvent(new Event('change')); }); });
  });
  var cartBox = document.querySelector('[data-cart]');
  function renderCart() {
    if (!cartBox) return;
    var c = cart(), list = cartBox.querySelector('.cart-items'); list.innerHTML = '';
    cartBox.classList.toggle('is-empty', !c.length);
    c.forEach(function (x, idx) {
      var el = document.createElement('div'); el.className = 'ci';
      el.innerHTML = '<img src="' + x.img + '" alt=""><div><h3>' + x.name + '</h3><p class="muted">' + x.cat + '</p><button class="remove" type="button">Remove</button></div>' +
        '<div class="qty"><button type="button" data-d="-" aria-label="Less">−</button><input value="' + x.q + '" aria-label="Quantity"><button type="button" data-d="+" aria-label="More">+</button></div><span class="price"><span class="todo">€ XX</span></span>';
      el.querySelector('.remove').addEventListener('click', function () { var cc = cart(); cc.splice(idx, 1); saveCart(cc); renderCart(); });
      el.querySelectorAll('.qty button').forEach(function (b) { b.addEventListener('click', function () { var cc = cart(); cc[idx].q = Math.max(1, cc[idx].q + (b.dataset.d === '+' ? 1 : -1)); saveCart(cc); renderCart(); }); });
      list.appendChild(el);
    });
    var n = c.reduce(function (s, x) { return s + x.q; }, 0);
    cartBox.querySelectorAll('.items-n').forEach(function (e) { e.textContent = n + (n === 1 ? ' item' : ' items'); });
  }
  renderCart(); badge();
  var sumList = document.querySelector('[data-summary]');
  if (sumList) {
    var c2 = cart(); if (!c2.length) c2 = [{ name: 'Example product', q: 1 }];
    sumList.innerHTML = c2.map(function (x) { return '<div class="row"><span>' + x.q + ' × ' + x.name + '</span><span class="todo">€ XX</span></div>'; }).join('');
  }
  if (document.body.classList.contains('order-done')) store.set('pv-cart', '[]'), badge();

  /* ---------- product gallery ---------- */
  document.querySelectorAll('.pd-thumbs button').forEach(function (b) {
    b.addEventListener('click', function () {
      var main = document.querySelector('.pd-main img'); main.style.opacity = 0;
      setTimeout(function () { main.src = b.querySelector('img').src; main.style.opacity = 1; }, 180);
      document.querySelectorAll('.pd-thumbs button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
    });
  });

  /* ---------- lesson player (prototype) ---------- */
  document.querySelectorAll('[data-video]').forEach(function (b) { b.addEventListener('click', function () { toast('Video plays here for logged-in members (hosting: SproutVideo or Vimeo, to be confirmed).'); }); });
})();
