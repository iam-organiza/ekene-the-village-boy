/* ==========================================================
   Katy Party Layer — balloons, confetti, tap bursts,
   scroll reveals and RSVP celebration. No dependencies.
   ========================================================== */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var COLORS = ['#f9b8c8', '#8ed3f2', '#f5a24b', '#ffd166', '#a68ee0', '#7cd4a8'];

  function rand(min, max) { return min + Math.random() * (max - min); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  /* ---------- overlay ---------- */
  var layer = document.createElement('div');
  layer.className = 'party-layer';
  layer.setAttribute('aria-hidden', 'true');

  /* ---------- friendly floating ghosts (Nearly-Headless-Nick style) ---------- */
  var GHOST_COLORS = ['#d9c9f5', '#c3e6f5', '#c7f0da', '#f5cfe8'];

  function ghostSVG(color, size) {
    var w = size, h = size * 1.25;
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M20 3 C10 3 4 11 4 21 L4 44 C7 41 9 47 12 44 C15 41 17 47 20 44 C23 47 25 41 28 44 C31 47 33 41 36 44 L36 21 C36 11 30 3 20 3 Z" fill="' + color + '" stroke="#8e7fc4" stroke-width="1.4" stroke-opacity="0.45" opacity="0.88"/>' +
      '<ellipse cx="14.5" cy="19" rx="2.6" ry="3.4" fill="#3a3a4a" opacity="0.8"/>' +
      '<ellipse cx="25.5" cy="19" rx="2.6" ry="3.4" fill="#3a3a4a" opacity="0.8"/>' +
      '<ellipse cx="20" cy="27" rx="2.8" ry="3.2" fill="#3a3a4a" opacity="0.6"/>' +
      '</svg>';
  }

  function spawnBalloon() {
    var b = document.createElement('div');
    b.className = 'party-balloon';
    var size = rand(30, 58);
    var duration = rand(13, 22);
    b.style.left = rand(-2, 98) + 'vw';
    b.style.animationDuration = duration + 's';
    b.innerHTML = ghostSVG(pick(GHOST_COLORS), size);
    b.firstChild.style.animationDuration = rand(2.6, 4) + 's';
    layer.appendChild(b);
    setTimeout(function () { b.remove(); }, duration * 1000 + 500);
  }

  /* ---------- golden snitch: darts and flutters around the hero ---------- */
  function snitchSVG() {
    return '<svg width="34" height="24" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="party-snitch-wing" style="transform-origin:24px 20px">' +
        '<ellipse cx="10" cy="16" rx="14" ry="7" fill="#fff8e6" opacity="0.85"/>' +
      '</g>' +
      '<g class="party-snitch-wing" style="transform-origin:36px 20px">' +
        '<ellipse cx="50" cy="16" rx="14" ry="7" fill="#fff8e6" opacity="0.85"/>' +
      '</g>' +
      '<circle cx="30" cy="20" r="9" fill="#e8b93f"/>' +
      '<circle cx="27" cy="17" r="3" fill="#ffe27a" opacity="0.85"/>' +
      '<path d="M22 20 Q30 14 38 20" stroke="#c99a2e" stroke-width="1" fill="none" opacity="0.6"/>' +
      '<path d="M22 20 Q30 26 38 20" stroke="#c99a2e" stroke-width="1" fill="none" opacity="0.6"/>' +
      '</svg>';
  }

  function spawnSnitchSpark(xVw, yVh) {
    var s = document.createElement('div');
    s.className = 'party-snitch-spark';
    s.style.left = xVw + 'vw';
    s.style.top = yVh + 'vh';
    layer.appendChild(s);
    setTimeout(function () { s.remove(); }, 650);
  }

  function initSnitch() {
    var el = document.createElement('div');
    el.className = 'party-snitch';
    el.innerHTML = snitchSVG();
    layer.appendChild(el);

    var x = rand(30, 70), y = rand(15, 45);
    var vx = 0, vy = 0;
    var targetX = x, targetY = y;
    var lastTargetChange = 0;
    var lastSpark = 0;

    function pickTarget() {
      targetX = rand(4, 96);
      targetY = rand(6, 62);
    }
    pickTarget();

    /* setInterval, not requestAnimationFrame: rAF is paused by the browser
       whenever the tab is backgrounded/hidden, which would freeze the
       snitch mid-flight; a plain timer keeps it going regardless */
    function tick() {
      var now = Date.now();
      if (now - lastTargetChange > rand(700, 1800)) {
        pickTarget();
        lastTargetChange = now;
      }
      var dx = targetX - x, dy = targetY - y;
      vx += dx * 0.006 + rand(-0.18, 0.18);
      vy += dy * 0.006 + rand(-0.18, 0.18);
      vx *= 0.9;
      vy *= 0.9;
      var speed = Math.sqrt(vx * vx + vy * vy);
      var maxSpeed = 0.6;
      if (speed > maxSpeed) { vx = (vx / speed) * maxSpeed; vy = (vy / speed) * maxSpeed; }
      x = Math.max(2, Math.min(98, x + vx));
      y = Math.max(3, Math.min(68, y + vy));
      el.style.left = x + 'vw';
      el.style.top = y + 'vh';
      var angle = Math.atan2(vy, vx * 1.8) * (180 / Math.PI);
      el.style.transform = 'translate(-50%, -50%) rotate(' + (angle * 0.2) + 'deg)';

      if (now - lastSpark > 110) {
        spawnSnitchSpark(x, y);
        lastSpark = now;
      }
    }
    setInterval(tick, 16);
  }

  /* ---------- owl post: flies in once, drops the invite letter ---------- */
  function owlSVG() {
    return '<svg width="70" height="60" viewBox="0 0 70 60" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="party-owl-wing" style="transform-origin:24px 30px">' +
        '<ellipse cx="10" cy="34" rx="13" ry="20" fill="#6b5847"/>' +
      '</g>' +
      '<g class="party-owl-wing" style="transform-origin:46px 30px">' +
        '<ellipse cx="60" cy="34" rx="13" ry="20" fill="#6b5847"/>' +
      '</g>' +
      '<ellipse cx="35" cy="38" rx="19" ry="22" fill="#8a6a4f"/>' +
      '<ellipse cx="35" cy="44" rx="11" ry="14" fill="#d9c39c"/>' +
      '<circle cx="35" cy="18" r="15" fill="#8a6a4f"/>' +
      '<path d="M23 7 L27 14 L20 13 Z" fill="#8a6a4f"/>' +
      '<path d="M47 7 L43 14 L50 13 Z" fill="#8a6a4f"/>' +
      '<circle cx="29" cy="18" r="6.4" fill="#fff8ea"/>' +
      '<circle cx="41" cy="18" r="6.4" fill="#fff8ea"/>' +
      '<circle cx="29" cy="18" r="3" fill="#2a2018"/>' +
      '<circle cx="41" cy="18" r="3" fill="#2a2018"/>' +
      '<path d="M33 23 L37 23 L35 28 Z" fill="#e8a33d"/>' +
      '</svg>';
  }

  function miniEnvelopeSVG() {
    return '<svg width="30" height="22" viewBox="0 0 64 46" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="4" y="10" width="56" height="32" rx="3" fill="#f3e6c9"/>' +
      '<path d="M4 10 L32 30 L60 10 Z" fill="#e9d6ac"/>' +
      '<circle cx="32" cy="22" r="6" fill="#a3111c"/>' +
      '<circle cx="32" cy="22" r="2.4" fill="#d4af37"/>' +
      '</svg>';
  }

  function spawnLetterDrop(xVw, yVh) {
    var wrap = document.createElement('div');
    wrap.className = 'party-letter-drop';
    wrap.style.left = xVw + 'vw';
    wrap.style.top = yVh + 'vh';
    wrap.innerHTML =
      '<svg width="64" height="46" viewBox="0 0 64 46" xmlns="http://www.w3.org/2000/svg" overflow="visible">' +
        '<rect class="party-envelope-paper" x="12" y="16" width="40" height="22" rx="1" fill="#fff8ea"/>' +
        '<line x1="18" y1="23" x2="42" y2="23" stroke="#d8c39a" stroke-width="1.4"/>' +
        '<line x1="18" y1="28" x2="36" y2="28" stroke="#d8c39a" stroke-width="1.4"/>' +
        '<rect x="4" y="10" width="56" height="32" rx="3" fill="#f3e6c9"/>' +
        '<g class="party-envelope-flap" style="transform-origin:32px 10px">' +
          '<path d="M4 10 L32 30 L60 10 Z" fill="#e9d6ac"/>' +
        '</g>' +
        '<circle cx="32" cy="22" r="6" fill="#a3111c"/>' +
        '<circle cx="32" cy="22" r="2.4" fill="#d4af37"/>' +
      '</svg>';
    layer.appendChild(wrap);
    setTimeout(function () { wrap.classList.add('party-letter-drop--open'); }, 550);
    setTimeout(function () { wrap.classList.add('party-letter-drop--fade'); }, 2600);
    setTimeout(function () { wrap.remove(); }, 3500);
  }

  function initOwlDelivery() {
    var owl = document.createElement('div');
    owl.className = 'party-owl';
    owl.innerHTML = owlSVG() + '<div class="party-owl-envelope">' + miniEnvelopeSVG() + '</div>';
    layer.appendChild(owl);

    var startX = -15, endX = 115;
    var flyYBase = 14;
    var dropAtX = 48;
    var startTime = Date.now();
    var duration = 4600;
    var dropped = false;

    var timer = setInterval(function () {
      var now = Date.now();
      var t = (now - startTime) / duration;
      if (t >= 1) {
        clearInterval(timer);
        owl.remove();
        return;
      }
      var x = startX + (endX - startX) * t;
      var arc = Math.sin(t * Math.PI) * 6;
      var bob = Math.sin(now / 220) * 1.4;
      var y = flyYBase - arc + bob;
      owl.style.left = x + 'vw';
      owl.style.top = y + 'vh';
      var tilt = Math.cos(t * Math.PI) * 8 - 4;
      owl.style.transform = 'translate(-50%, -50%) rotate(' + tilt + 'deg)';

      if (!dropped && x >= dropAtX) {
        dropped = true;
        var env = owl.querySelector('.party-owl-envelope');
        if (env) env.style.opacity = '0';
        spawnLetterDrop(x, y + 4);
      }
    }, 16);
  }

  /* ---------- gentle falling confetti ---------- */
  function spawnConfetti() {
    var c = document.createElement('div');
    var kind = Math.random();
    c.className = 'party-confetti' +
      (kind < 0.33 ? ' party-confetti--round' : kind < 0.66 ? ' party-confetti--ribbon' : '');
    var w = rand(6, 11);
    c.style.width = w + 'px';
    c.style.height = (kind < 0.33 ? w : w * rand(1.4, 2.2)) + 'px';
    c.style.left = rand(0, 100) + 'vw';
    c.style.background = pick(COLORS);
    var duration = rand(6, 12);
    c.style.animationDuration = duration + 's';
    layer.appendChild(c);
    setTimeout(function () { c.remove(); }, duration * 1000 + 500);
  }

  /* ---------- tap / click bursts ---------- */
  var EMOJI = ['🎉', '⭐', '🎈', '🎂', '✨', '🎁'];

  function burst(x, y, big) {
    var count = big ? 34 : 14;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('div');
      var isEmoji = Math.random() < (big ? 0.35 : 0.2);
      p.className = 'party-burst' + (isEmoji ? ' party-burst--emoji' : '');
      if (isEmoji) {
        p.textContent = pick(EMOJI);
      } else {
        var s = rand(6, 12);
        p.style.width = s + 'px';
        p.style.height = s + 'px';
        p.style.borderRadius = Math.random() < 0.5 ? '50%' : '2px';
        p.style.background = pick(COLORS);
      }
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      layer.appendChild(p);
      var angle = rand(0, Math.PI * 2);
      var dist = rand(50, big ? 260 : 130);
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - rand(20, 60); /* bias upward, like a pop */
      (function (el, dx, dy) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rand(-360, 360) + 'deg)';
            el.style.opacity = '0';
          });
        });
      })(p, dx, dy);
      setTimeout(function () { p.remove(); }, 1000);
    }
  }

  /* ---------- wand tap: magician's smoke-bomb vanish ---------- */
  function smokePuff(x, y) {
    var flash = document.createElement('div');
    flash.className = 'party-smoke-flash';
    flash.style.left = x + 'px';
    flash.style.top = y + 'px';
    layer.appendChild(flash);
    setTimeout(function () { flash.remove(); }, 350);

    var puffCount = Math.round(rand(7, 10));
    for (var i = 0; i < puffCount; i++) {
      var p = document.createElement('div');
      p.className = 'party-smoke-puff';
      var size = rand(18, 36);
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = (x + rand(-8, 8)) + 'px';
      p.style.top = (y + rand(-8, 8)) + 'px';
      p.style.setProperty('--sx', rand(-45, 45) + 'px');
      p.style.setProperty('--sy', rand(-85, -25) + 'px');
      p.style.setProperty('--sscale', rand(2.2, 3.8).toFixed(2));
      p.style.setProperty('--srot', rand(-45, 45) + 'deg');
      var delay = rand(0, 90);
      p.style.animationDelay = delay + 'ms';
      layer.appendChild(p);
      (function (el, life) { setTimeout(function () { el.remove(); }, life); })(p, 950 + delay);
    }
  }

  document.addEventListener('pointerdown', function (e) {
    if (e.isPrimary === false) return;
    smokePuff(e.clientX, e.clientY);
  }, { passive: true });

  /* ---------- wand-flick sparkle trail ---------- */
  var wandLast = null;

  function spawnWandSpark(x, y) {
    var s = document.createElement('div');
    var isStar = Math.random() < 0.3;
    var size = rand(5, 11);
    s.className = 'party-wand-spark' + (isStar ? ' party-wand-spark--star' : '');
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.setProperty('--wx', rand(-14, 14) + 'px');
    s.style.setProperty('--wy', rand(-24, -6) + 'px');
    if (isStar) {
      s.textContent = '✨';
      s.style.fontSize = (size + 6) + 'px';
    } else {
      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.background = pick(['#ffe27a', '#fff3c4', '#ffd166', '#ffffff']);
    }
    layer.appendChild(s);
    setTimeout(function () { s.remove(); }, 600);
  }

  document.addEventListener('pointerdown', function (e) {
    if (e.isPrimary === false) return;
    wandLast = { x: e.clientX, y: e.clientY };
  }, { passive: true });

  document.addEventListener('pointermove', function (e) {
    if (e.isPrimary === false) return;
    if (!wandLast) { wandLast = { x: e.clientX, y: e.clientY }; return; }
    var dx = e.clientX - wandLast.x, dy = e.clientY - wandLast.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 9) return;
    var steps = Math.min(4, Math.floor(dist / 9));
    for (var i = 1; i <= steps; i++) {
      spawnWandSpark(wandLast.x + dx * (i / steps), wandLast.y + dy * (i / steps));
    }
    wandLast = { x: e.clientX, y: e.clientY };
  }, { passive: true });

  /* ---------- wax-seal RSVP/submit button ---------- */
  /* MetForm/Elementor render these buttons via async JS hydration, so the
     element may not exist yet when start() runs — decorate is idempotent
     and gets retried on a few delays to catch it whenever it shows up */
  function decorateSeal(btn) {
    if (btn.classList.contains('party-seal-ready')) return;
    btn.classList.add('party-seal-ready');

    var wrapper = btn.querySelector('.elementor-button-content-wrapper') || btn;
    var emblem = document.createElement('span');
    emblem.className = 'party-seal-emblem';
    emblem.innerHTML = '<svg width="16" height="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="10" cy="10" r="9" fill="none" stroke="#f4dfa0" stroke-width="1.2" opacity="0.8"/>' +
      '<path d="M10 2 L11.6 7.6 L17.5 7.6 L12.8 11 L14.5 16.6 L10 13.2 L5.5 16.6 L7.2 11 L2.5 7.6 L8.4 7.6 Z" fill="#f4dfa0"/>' +
      '</svg>';
    wrapper.insertBefore(emblem, wrapper.firstChild);

    var crack = document.createElement('span');
    crack.className = 'party-seal-crack-overlay';
    crack.innerHTML = '<svg viewBox="0 0 100 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M50 0 L44 14 L58 20 L40 26 L50 40" stroke="#fff8ea" stroke-width="1.6" fill="none" opacity="0.9"/>' +
      '<path d="M50 0 L56 10 L46 18 L60 30 L52 40" stroke="#d4af37" stroke-width="1.4" fill="none" opacity="0.8"/>' +
      '</svg>';
    btn.appendChild(crack);
  }

  function initWaxSeals() {
    document.querySelectorAll('form .elementor-button').forEach(decorateSeal);
  }

  /* ---------- parchment + candle-lit cards ---------- */
  /* Finds the theme's existing colored "card" boxes (the RSVP form card,
     the parent-quote card, etc.) generically, by looking for solid,
     rounded, non-cream/white backgrounds, rather than hardcoding each
     page's auto-generated Elementor element ID. */
  function initParchmentCards() {
    var candidates = document.querySelectorAll(
      '.elementor-widget-wrap, .elementor-column, .elementor-section, .elementor-inner-section'
    );
    candidates.forEach(function (el) {
      if (el.classList.contains('party-parchment')) return;
      var cs = getComputedStyle(el);
      var m = cs.backgroundColor.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      if (!m) return;
      var r = +m[1], g = +m[2], b = +m[3];
      var a = m[4] !== undefined ? +m[4] : 1;
      if (a < 0.98) return;
      var isCreamish = Math.abs(r - 252) < 6 && Math.abs(g - 249) < 6 && Math.abs(b - 243) < 6;
      var isWhite = r > 250 && g > 250 && b > 250;
      if (isCreamish || isWhite) return;
      var radius = parseFloat(cs.borderRadius);
      if (!(radius > 8)) return;
      var rect = el.getBoundingClientRect();
      if (rect.width < 120 || rect.height < 60) return;
      el.classList.add('party-parchment');
    });
  }

  /* event delegation: the crack/pop still fires even on a button that
     hasn't been decorated with the emblem/overlay yet */
  document.addEventListener('pointerdown', function (e) {
    var btn = e.target.closest && e.target.closest('form .elementor-button');
    if (!btn) return;
    btn.classList.remove('party-seal-cracking');
    void btn.offsetWidth; /* restart the animation if clicked again quickly */
    btn.classList.add('party-seal-cracking');
  }, { passive: true });

  /* ---------- RSVP celebration ---------- */
  function celebrate() {
    var cheer = document.createElement('div');
    cheer.className = 'party-cheer';
    cheer.textContent = '🎉 Yay! See you there! 🎂';
    document.body.appendChild(cheer);
    setTimeout(function () { cheer.remove(); }, 2700);
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    burst(cx, cy, true);
    setTimeout(function () { burst(cx * 0.5, cy * 0.7, true); }, 250);
    setTimeout(function () { burst(cx * 1.5, cy * 0.7, true); }, 500);
    for (var i = 0; i < 10; i++) setTimeout(spawnBalloon, i * 120);
  }
  /* Contact Form 7 fires this when the RSVP is sent successfully */
  document.addEventListener('wpcf7mailsent', celebrate);
  /* Static export fallback: the forms can't reach a server, so cheer on
     any submit attempt (debounced so double-clicks don't double-cheer) */
  var lastCheer = 0;
  document.addEventListener('submit', function () {
    var now = Date.now();
    if (now - lastCheer < 4000) return;
    lastCheer = now;
    celebrate();
  }, true);

  /* ---------- hero title: bouncing letters ---------- */
  function splitLetters(el) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
    }
    /* <b>/<i> instead of <span>: the theme styles spans inside this
       heading, and words are kept whole so lines never break mid-word */
    var index = 0;
    nodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (token) {
        if (!token) return;
        if (/^\s+$/.test(token)) {
          frag.appendChild(document.createTextNode(token));
          return;
        }
        var word = document.createElement('b');
        word.className = 'party-word';
        token.split('').forEach(function (ch) {
          var letter = document.createElement('i');
          letter.className = 'party-letter';
          letter.style.setProperty('--pl-i', index++);
          letter.textContent = ch;
          word.appendChild(letter);
        });
        frag.appendChild(word);
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ---------- scroll reveal ---------- */
  function setupReveal() {
    if (!('IntersectionObserver' in window)) return;
    var widgets = document.querySelectorAll(
      '.elementor-top-section .elementor-widget, .entry-content > *'
    );
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('party-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    widgets.forEach(function (w) {
      var rect = w.getBoundingClientRect();
      if (rect.top > window.innerHeight) { /* only animate below the fold */
        w.classList.add('party-reveal');
        observer.observe(w);
      }
    });
  }

  /* ---------- scrollspy: highlight the nav link for the section in view ---------- */
  function setupNavScrollspy() {
    var navLinks = Array.prototype.slice.call(
      document.querySelectorAll('#menu-menu-1 > li > a[href^="#"]')
    );
    if (!navLinks.length) return;

    var sections = navLinks.map(function (a) {
      var id = a.getAttribute('href').slice(1);
      return id ? document.getElementById(id) : null;
    });

    function setActive(link) {
      navLinks.forEach(function (a) { a.classList.remove('party-nav-active'); });
      if (link) link.classList.add('party-nav-active');
    }

    setActive(navLinks[0]);

    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var idx = sections.indexOf(entry.target);
        if (idx > -1) setActive(navLinks[idx]);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (el) { if (el) observer.observe(el); });

    window.addEventListener('scroll', function () {
      if (window.scrollY < 200) setActive(navLinks[0]);
    }, { passive: true });
  }

  /* ---------- boot ---------- */
  function start() {
    document.body.appendChild(layer);

    var heroTitle = document.querySelector('.ekit-heading--title') ||
      document.querySelector('.elementor-top-section .elementor-heading-title');
    if (heroTitle && heroTitle.textContent.trim().length <= 40) splitLetters(heroTitle);

    setupReveal();
    setupNavScrollspy();

    initSnitch();
    setTimeout(initOwlDelivery, 700);
    initWaxSeals();
    [500, 1200, 2500, 4500].forEach(function (delay) { setTimeout(initWaxSeals, delay); });
    initParchmentCards();

    for (var i = 0; i < 4; i++) setTimeout(spawnBalloon, i * 1800);
    setInterval(spawnBalloon, 4500);
    for (var j = 0; j < 8; j++) setTimeout(spawnConfetti, j * 700);
    setInterval(spawnConfetti, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
