/* ===========================================================
   CAMPBELL'S MECHANICAL / script.js
   =========================================================== */
(function() {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  var nav = document.querySelector('.nav');
  var hamburger = document.querySelector('.hamburger');

  if (hamburger && nav) {
    hamburger.addEventListener('click', function() {
      nav.classList.toggle('is-open');
      hamburger.classList.toggle('is-open');
    });
  }

  /* ---------- Active nav link ---------- */
  var page = document.body.getAttribute('data-page');
  if (page) {
    var links = document.querySelectorAll('.nav-links a[data-link]');
    links.forEach(function(link) {
      if (link.getAttribute('data-link') === page) {
        link.classList.add('is-active');
      }
    });
  }

  /* ---------- Gallery carousel ---------- */
  var carousel = document.querySelector('.gallery-carousel');
  if (carousel) {
    var track = carousel.querySelector('.carousel-track');
    var slides = carousel.querySelectorAll('.carousel-slide');
    var prevBtn = carousel.querySelector('.carousel-btn.prev');
    var nextBtn = carousel.querySelector('.carousel-btn.next');
    var dotsWrap = carousel.querySelector('.carousel-dots');
    var slideCount = slides.length;
    var current = 0;

    function getPerView() {
      if (window.innerWidth <= 560) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, slideCount - getPerView());
    }

    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      var maxIdx = getMaxIndex();
      for (var i = 0; i <= maxIdx; i++) {
        var dot = document.createElement('button');
        dot.className = 'carousel-dot';
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        if (i === current) dot.classList.add('is-active');
        (function(idx) {
          dot.addEventListener('click', function() { goTo(idx); });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsWrap) return;
      var dots = dotsWrap.querySelectorAll('.carousel-dot');
      dots.forEach(function(d, i) {
        d.classList.toggle('is-active', i === current);
      });
    }

    function goTo(idx) {
      var max = getMaxIndex();
      if (idx < 0) idx = max;
      if (idx > max) idx = 0;
      current = idx;
      var slide = slides[0];
      if (!slide) return;
      var slideWidth = slide.getBoundingClientRect().width;
      var gap = parseInt(getComputedStyle(slide).marginRight, 10) || 0;
      var offset = current * (slideWidth + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';
      updateDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });

    var resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (current > getMaxIndex()) current = getMaxIndex();
        buildDots();
        goTo(current);
      }, 150);
    });

    buildDots();

    /* Auto-advance, pause on hover */
    var autoplay = setInterval(function() { goTo(current + 1); }, 5500);
    carousel.addEventListener('mouseenter', function() { clearInterval(autoplay); });
  }

  /* ---------- Smooth-scroll any in-page anchor ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id = a.getAttribute('href');
      if (id.length <= 1) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

})();