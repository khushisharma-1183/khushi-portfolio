(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };

  // Gallery items configuration with AI videos and image sets
  var items = [
    { type: 'video', src: 'assets/video/ai-reel-1.mp4', group: 'video', label: 'AI Cinematic Reel 1' },
    { type: 'video', src: 'assets/video/ai-reel-2.mp4', group: 'video', label: 'AI Motion Art 2' },
    { type: 'video', src: 'assets/video/ai-reel-3.mp4', group: 'video', label: 'AI Promo Video 3' },
    { type: 'image', src: 'assets/img/social-01.jpg', group: 'social', label: 'Social Media Post' },
    { type: 'image', src: 'assets/img/social-02.jpg', group: 'social', label: 'Social Media Post' },
    { type: 'image', src: 'assets/img/banner-01.jpg', group: 'banner', label: 'Banner Design' },
    { type: 'image', src: 'assets/img/cover-01.jpg', group: 'cover', label: 'Cover Design' },
    { type: 'image', src: 'assets/img/game-01.jpg', group: 'tender', label: 'Govt. Tender: Games' }
  ];

  var sets = [
    ['social', 24, 'social', 'Social Media Post'],
    ['banner', 6, 'banner', 'Banner Design'],
    ['cover', 16, 'cover', 'Cover Design'],
    ['game', 6, 'tender', 'Govt. Tender: Games'],
    ['flash', 10, 'tender', 'Govt. Tender: Flash Cards'],
    ['book', 3, 'tender', 'Govt. Tender: Workbooks']
  ];
  
  sets.forEach(function (s) {
    for (var i = 1; i <= s[1]; i++) {
      items.push({ 
        type: 'image', 
        src: 'assets/img/' + s[0] + '-' + (i < 10 ? '0' : '') + i + '.jpg', 
        group: s[2], 
        label: s[3] 
      });
    }
  });

  var gal = $('#gallery'), current = 'all', shown = [];

  function render() {
    if (!gal) return;
    gal.innerHTML = '';
    shown = items.filter(function (it) { return current === 'all' || it.group === current; });
    shown.forEach(function (it, i) {
      var d = document.createElement('div');
      d.className = 'item reveal-item';
      d.dataset.l = it.label;
      d.style.animationDelay = Math.min(i * 40, 600) + 'ms';

      if (it.type === 'video') {
        d.classList.add('video-item-vertical');
        var vid = document.createElement('video');
        vid.src = it.src;
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;
        vid.autoplay = true;
        vid.className = 'gal-vid';
        d.appendChild(vid);
        
        var badge = document.createElement('div');
        badge.className = 'vid-badge';
        badge.innerHTML = '✨';
        d.appendChild(badge);
      } else {
        var im = new Image();
        im.src = it.src; 
        im.alt = it.label; 
        im.loading = 'lazy';
        d.appendChild(im);
      }

      d.addEventListener('click', function () { open(i); });
      gal.appendChild(d);
    });
  }

  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    document.querySelectorAll('#filters button').forEach(function (x) { x.classList.remove('on'); });
    b.classList.add('on');
    current = b.dataset.f;
    render();
  });

  // Lightbox for Images and Videos
  var lb = $('#lb'), lbContent = $('#lbContent'), idx = 0;
  
  function open(i) { 
    idx = i; 
    updateLightboxContent();
    lb.classList.add('on'); 
  }

  function updateLightboxContent() {
    lbContent.innerHTML = '';
    var it = shown[idx];
    if (it.type === 'video') {
      var v = document.createElement('video');
      v.src = it.src;
      v.controls = true;
      v.autoplay = true;
      v.className = 'lb-media-vertical';
      lbContent.appendChild(v);
    } else {
      var img = document.createElement('img');
      img.src = it.src;
      img.className = 'lb-media';
      lbContent.appendChild(img);
    }
  }

  function close() { 
    lb.classList.remove('on'); 
    lbContent.innerHTML = ''; 
  }

  function step(n) { 
    idx = (idx + n + shown.length) % shown.length; 
    updateLightboxContent(); 
  }

  $('#lbx').onclick = close;
  $('#lbp').onclick = function () { step(-1); };
  $('#lbn').onclick = function () { step(1); };
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // Typing effect
  var words = ['AI Video Creator', 'Graphic Designer', 'Cinematic Reels Editor', 'Motion Artist'], w = 0, c = 0, del = false, t = $('#typed');
  function type() {
    var word = words[w];
    t.textContent = word.substring(0, c);
    if (!del && c < word.length) c++;
    else if (!del) { del = true; return setTimeout(type, 1400); }
    else if (c > 0) c--;
    else { del = false; w = (w + 1) % words.length; }
    setTimeout(type, del ? 45 : 90);
  }
  type();

  // Scroll reveal + counters
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  
  document.querySelectorAll('.reveal').forEach(function (el, i) {
    el.style.transitionDelay = (i % 4) * 90 + 'ms';
    io.observe(el);
  });

  var co = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, n = +el.dataset.n, plus = el.dataset.plus || '', v = 0;
      var iv = setInterval(function () {
        v += Math.ceil(n / 40);
        if (v >= n) { v = n; clearInterval(iv); }
        el.textContent = v + (v === n ? plus : '');
      }, 35);
      co.unobserve(el);
    });
  }, { threshold: 0.6 });
  
  document.querySelectorAll('[data-n]').forEach(function (el) { co.observe(el); });

  var nav = $('#nav'), bar = $('#progress'), glow = $('#glow');
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    nav.classList.toggle('sc', h.scrollTop > 40);
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  }, { passive: true });

  window.addEventListener('mousemove', function (e) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    var s = $('.stack');
    if (s) s.style.transform = 'translate(' + (e.clientX / innerWidth - 0.5) * -20 + 'px,' + (e.clientY / innerHeight - 0.5) * -20 + 'px)';
  });

  var menu = $('#menu');
  $('#burger').onclick = function () { menu.classList.toggle('open'); };
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') menu.classList.remove('open'); });

  $('#yr').textContent = new Date().getFullYear();
  window.addEventListener('load', function () { setTimeout(function () { $('#loader').classList.add('off'); }, 500); });
  render();
})();