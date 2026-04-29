(function() {
  // HERO CANVAS — animated flowing blobs
  (function() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H;
    var blobs = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create blobs
    var inkColor = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#111009';
    for (var i = 0; i < 6; i++) {
      blobs.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 120 + Math.random() * 220,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.004,
        wobble: 0.4 + Math.random() * 0.6
      });
    }

    var t = 0;
    var mx = W / 2, my = H / 2;
    document.addEventListener('mousemove', function(e) {
      var rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    });

    function draw() {
      t += 1;
      ctx.clearRect(0, 0, W, H);

      blobs.forEach(function(b, idx) {
        // Mouse repulsion
        var dx = b.x - mx;
        var dy = b.y - my;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          b.vx += (dx / dist) * 0.12;
          b.vy += (dy / dist) * 0.12;
        }
        b.vx *= 0.98;
        b.vy *= 0.98;
        b.x += b.vx;
        b.y += b.vy;
        // Bounce
        if (b.x < -b.r) b.x = W + b.r;
        if (b.x > W + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = H + b.r;
        if (b.y > H + b.r) b.y = -b.r;

        // Pulsing radius
        var pulse = b.r + Math.sin(t * b.speed + b.phase) * b.r * 0.12 * b.wobble;

        // Draw with radial gradient
        var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, pulse);
        var alpha = idx < 3 ? 0.07 : 0.04;
        grad.addColorStop(0, 'rgba(17,16,9,' + alpha + ')');
        grad.addColorStop(1, 'rgba(17,16,9,0)');
        ctx.beginPath();
        ctx.arc(b.x, b.y, pulse, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Draw flowing bezier lines
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = 'rgba(17,16,9,1)';
      ctx.lineWidth = 0.8;
      for (var l = 0; l < 4; l++) {
        ctx.beginPath();
        var phase = t * 0.004 + l * 1.4;
        ctx.moveTo(0, H * 0.3 + Math.sin(phase) * H * 0.15 + l * (H * 0.12));
        ctx.bezierCurveTo(
          W * 0.25, H * 0.4 + Math.cos(phase + 0.8) * H * 0.2,
          W * 0.75, H * 0.3 + Math.sin(phase + 1.6) * H * 0.2,
          W, H * 0.35 + Math.cos(phase + 2.4) * H * 0.15 + l * (H * 0.08)
        );
        ctx.stroke();
      }
      ctx.restore();

      requestAnimationFrame(draw);
    }
    draw();
  })();

  // PHOTO UPLOAD
  var photoInput = document.getElementById('photo-file-input');
  if (photoInput) {
    photoInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        var wrap = document.querySelector('.about-photo-wrap');
        var existing = wrap.querySelector('.about-photo-img');
        if (!existing) {
          existing = document.createElement('img');
          existing.className = 'about-photo-img';
          existing.alt = 'Navya Bhardwaj';
          wrap.insertBefore(existing, wrap.querySelector('.about-photo-upload'));
        }
        existing.src = ev.target.result;
        existing.classList.add('loaded');
        var label = wrap.querySelector('.about-photo-label');
        var btn = wrap.querySelector('.about-photo-upload');
        if (label) label.style.opacity = '0';
        if (btn) btn.style.opacity = '0';
      };
      reader.readAsDataURL(file);
    });
  }

  // PAGE LOADER
  window.addEventListener('load', function() {
    setTimeout(function() {
      const loader = document.getElementById('page-loader');
      loader.classList.add('loaded');
      setTimeout(function() { loader.style.display = 'none'; }, 900);
      // Trigger hero animations
      setTimeout(initHero, 300);
    }, 800);
  });

  function initHero() {
    document.getElementById('hero-eyebrow').classList.add('visible');
    const words = document.querySelectorAll('.hero-name-word span');
    words.forEach(function(w, i) {
      setTimeout(function() { w.classList.add('visible'); }, i * 120);
    });
    setTimeout(function() { document.getElementById('hero-tagline').classList.add('visible'); }, 500);
    setTimeout(function() { document.getElementById('hero-scroll').classList.add('visible'); }, 800);
  }

  // CUSTOM CURSOR
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  var ringX = 0, ringY = 0;
  var mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.querySelectorAll('a, button, .project-row, .leadership-card, .resume-btn').forEach(function(el) {
    el.addEventListener('mouseenter', function() { document.body.classList.add('cursor-link'); });
    el.addEventListener('mouseleave', function() { document.body.classList.remove('cursor-link'); });
  });

  // HOVER PREVIEW for projects
  var preview = document.getElementById('hover-preview');
  document.querySelectorAll('.project-row').forEach(function(row) {
    row.addEventListener('mouseenter', function(e) {
      preview.classList.add('active');
    });
    row.addEventListener('mouseleave', function() {
      preview.classList.remove('active');
    });
    row.addEventListener('mousemove', function(e) {
      preview.style.left = (e.clientX + 32) + 'px';
      preview.style.top = e.clientY + 'px';
    });
  });

  // HERO CURSOR PARALLAX
  var heroEl = document.getElementById('hero');
  var heroNameEl = document.getElementById('hero-name');
  document.addEventListener('mousemove', function(e) {
    if (!heroEl) return;
    var rect = heroEl.getBoundingClientRect();
    var cx = rect.width / 2;
    var cy = rect.height / 2;
    var dx = (e.clientX - rect.left - cx) / cx;
    var dy = (e.clientY - rect.top - cy) / cy;
    heroNameEl.style.transform = 'translate(' + (dx * 12) + 'px, ' + (dy * 6) + 'px)';
  });

  // SCROLL REVEAL
  var revealEls = document.querySelectorAll('.reveal');
  var timelineEls = document.querySelectorAll('.timeline-item');
  var skillBars = document.querySelectorAll('.skill-bar-fill');
  var skillsAnimated = false;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(function(el) { observer.observe(el); });
  timelineEls.forEach(function(el) { observer.observe(el); });

  var skillsObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        skillBars.forEach(function(bar) {
          var pct = bar.getAttribute('data-pct') || 70;
          bar.style.width = pct + '%';
        });
      }
    });
  }, { threshold: 0.3 });

  var skillsSection = document.getElementById('skills');
  if (skillsSection) skillsObserver.observe(skillsSection);

  // PARALLAX BG on scroll
  var lastScrollY = 0;
  window.addEventListener('scroll', function() {
    lastScrollY = window.scrollY;
  }, { passive: true });

  // NAV color blend on scroll
  var nav = document.querySelector('nav');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 80) {
      var bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      nav.style.background = bg.replace(')', ', 0.92)').replace('rgb(', 'rgba(') || 'rgba(253,232,240,0.92)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.mixBlendMode = 'normal';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.mixBlendMode = 'multiply';
    }
  }, { passive: true });
})();