(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smooth = () => (reduced ? 'auto' : 'smooth');
  root.classList.add('js');

  const init = () => {
    /* ---------- Menu mobile ---------- */
    const mm = document.getElementById('mm');
    const burger = document.querySelector('.burger');
    const mmX = document.getElementById('mmX');
    const hdr = document.getElementById('hdr');
    let menuOpen = false;

    const setMenu = open => {
      menuOpen = open;
      mm.dataset.open = String(open);
      mm.setAttribute('aria-hidden', String(!open));
      mm.toggleAttribute('inert', !open);
      burger.setAttribute('aria-expanded', String(open));
      root.style.overflow = open ? 'hidden' : '';
    };
    const openMenu = () => {
      setMenu(true);
      setTimeout(() => mmX && mmX.focus(), 60);
    };
    const closeMenu = () => {
      if (!menuOpen) return;
      setMenu(false);
      burger.focus({ preventScroll: true });
    };
    const closeMenuNav = () => { if (menuOpen) setMenu(false); };

    burger.addEventListener('click', openMenu);
    mmX.addEventListener('click', closeMenu);
    mm.querySelectorAll('[data-close-nav]').forEach(a => a.addEventListener('click', closeMenuNav));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) closeMenu(); });

    /* ---------- Video: autoplay, loop, pausa/play ---------- */
    const labels = {
      heroV: ['Metti in pausa il video', 'Riproduci il video'],
      labV: ['Metti in pausa il video del laboratorio', 'Riproduci il video del laboratorio']
    };
    document.querySelectorAll('[data-video]').forEach(btn => {
      const id = btn.dataset.video;
      const v = document.getElementById(id);
      if (!v) return;
      const ico = n => btn.querySelector('[data-ico="' + n + '"]');
      const render = playing => {
        btn.setAttribute('aria-label', labels[id][playing ? 0 : 1]);
        btn.setAttribute('aria-pressed', String(!playing));
        ico('pause').hidden = !playing;
        ico('play').hidden = playing;
      };
      v.muted = true;
      v.loop = true;
      if (reduced) { v.pause(); render(false); }
      else { const p = v.play(); p && p.catch(() => render(false)); render(true); }
      btn.addEventListener('click', () => {
        if (v.paused) { const p = v.play(); p && p.catch(() => {}); render(true); }
        else { v.pause(); render(false); }
      });
    });

    /* ---------- FAQ ---------- */
    document.querySelectorAll('.fi').forEach(fi => {
      const b = fi.querySelector('.fq');
      b.addEventListener('click', () => {
        const open = fi.dataset.open !== 'true';
        fi.dataset.open = String(open);
        b.setAttribute('aria-expanded', String(open));
      });
    });

    /* ---------- Comparsa di testi e immagini ---------- */
    const noIO = reduced || !('IntersectionObserver' in window);
    const io = noIO ? null : new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    const seen = new WeakSet();
    const scanReveal = () => document.querySelectorAll('.rv:not(.in),.ri:not(.in)').forEach(el => {
      if (noIO) { el.classList.add('in'); return; }
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) { el.classList.add('in'); return; }
      if (seen.has(el)) return;
      seen.add(el);
      io.observe(el);
    });
    let sc = 0;
    addEventListener('scroll', () => { clearTimeout(sc); sc = setTimeout(scanReveal, 150); }, { passive: true });
    scanReveal();

    /* ---------- Header sticky + parallasse di riserva ---------- */
    const sdView = window.CSS && CSS.supports('animation-timeline: view()');
    const pxs = [...document.querySelectorAll('.px')];
    let raf = 0;
    const frame = () => {
      raf = 0;
      if (!menuOpen) hdr.dataset.s = scrollY < 8 ? 'top' : 'solid';
      if (!sdView && !reduced) {
        const wide = innerWidth >= 1440, vh = innerHeight;
        pxs.forEach(el => {
          if (!wide) { el.style.transform = ''; return; }
          const r = el.parentElement.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) return;
          const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
          el.style.transform = 'translateY(' + ((p - 0.5) * 8).toFixed(2) + '%)';
        });
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(frame); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', () => { if (innerWidth >= 1024 && menuOpen) closeMenuNav(); onScroll(); });
    frame();

    if (!('IntersectionObserver' in window)) return;

    /* ---------- Voce di menu attiva ---------- */
    const links = [...document.querySelectorAll('.nl')];
    const io3 = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.getAttribute('href') === '#' + e.target.id
        ? a.setAttribute('aria-current', 'true')
        : a.removeAttribute('aria-current'));
    }), { rootMargin: '-40% 0px -55% 0px' });
    ['top', 'manifesto', 'bisogni', 'progetti', 'metodo', 'laboratorio', 'chi-siamo', 'news', 'showroom', 'faq', 'professionisti']
      .forEach(id => { const el = document.getElementById(id); el && io3.observe(el); });

    /* ---------- Contatore dei passi (Come lavoriamo) ---------- */
    const num = document.getElementById('stepNum'), nm = document.getElementById('stepName');
    if (num) {
      const io2 = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting || num.textContent === e.target.dataset.n) return;
        num.textContent = e.target.dataset.n;
        nm.textContent = e.target.dataset.name;
        if (!reduced && num.parentElement.animate) {
          num.parentElement.animate(
            [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }],
            { duration: 450, easing: 'cubic-bezier(.2,.7,.2,1)' });
        }
      }), { rootMargin: '-50% 0px -50% 0px' });
      document.querySelectorAll('.step').forEach(el => io2.observe(el));
    }

    /* ---------- Caroselli (Realizzazioni, News) ---------- */
    document.querySelectorAll('[data-carousel]').forEach(initCarousel);
  };

  function initCarousel(root) {
    const tr = root.querySelector('[data-track]');
    if (!tr) return;
    const prev = root.querySelector('[data-prev]'), next = root.querySelector('[data-next]');
    const bar = root.querySelector('[data-prog]');
    const stepW = () => { const it = tr.children; return it.length > 1 ? it[1].offsetLeft - it[0].offsetLeft : tr.clientWidth; };
    const upd = () => {
      const max = Math.max(1, tr.scrollWidth - tr.clientWidth);
      const vis = tr.clientWidth / tr.scrollWidth;
      if (bar) bar.style.width = ((vis + (1 - vis) * Math.min(1, tr.scrollLeft / max)) * 100).toFixed(1) + '%';
      if (prev) prev.disabled = tr.scrollLeft <= 2;
      if (next) next.disabled = tr.scrollLeft >= max - 2;
    };
    if (prev) prev.addEventListener('click', () => tr.scrollBy({ left: -stepW(), behavior: smooth() }));
    if (next) next.addEventListener('click', () => tr.scrollBy({ left: stepW(), behavior: smooth() }));
    tr.addEventListener('scroll', upd, { passive: true });
    addEventListener('resize', upd);
    upd();

    // Trascinamento con il mouse
    let down = false, sx = 0, sl = 0, moved = false;
    tr.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; sl = tr.scrollLeft;
    });
    addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 5) { moved = true; tr.classList.add('drag'); }
      if (moved) tr.scrollLeft = sl - dx;
    });
    addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      if (!moved) return;
      const w = stepW();
      tr.scrollTo({ left: Math.round(tr.scrollLeft / w) * w, behavior: smooth() });
      setTimeout(() => tr.classList.remove('drag'), 450);
    });
    tr.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    tr.addEventListener('dragstart', e => e.preventDefault());
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
