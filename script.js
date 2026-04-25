document.addEventListener("DOMContentLoaded", () => {

  // ==================== LOADER ====================
  let pct = 0;
  const loaderBar = document.getElementById("loaderBar");
  const loaderPct = document.getElementById("loaderPct");
  const loaderEl = document.getElementById("loader");
  const iv = setInterval(() => {
    pct += Math.floor(Math.random() * 10) + 3;
    if (pct >= 100) { pct = 100; clearInterval(iv); }
    loaderBar.style.width = pct + "%";
    loaderPct.textContent = pct + "%";
    if (pct === 100) setTimeout(() => { loaderEl.classList.add("done"); setTimeout(initAll, 700); }, 300);
  }, 70);

  // ==================== INIT ====================
  function initAll() {
    initCursor();
    initCanvas();
    initShootingStars();
    initParallax();
    initTyping();
    initReveal();
    initSlider();
    initForm();
    initNav();
    loadFeedback();
  }

  // ==================== CURSOR ====================
  function initCursor() {
    const cur = document.getElementById("cursor");
    const trail = document.getElementById("cursorTrail");
    let mx = 0, my = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + "px"; cur.style.top = my + "px";
    });
    function animTrail() {
      tx += (mx - tx) * 0.12; ty += (my - ty) * 0.12;
      trail.style.left = tx + "px"; trail.style.top = ty + "px";
      requestAnimationFrame(animTrail);
    }
    animTrail();
    document.querySelectorAll("a,button,.glass-card,input,textarea").forEach(el => {
      el.addEventListener("mouseenter", () => { cur.style.transform = "translate(-50%,-50%) scale(2.5)"; trail.style.opacity = ".6"; });
      el.addEventListener("mouseleave", () => { cur.style.transform = "translate(-50%,-50%) scale(1)"; trail.style.opacity = ".35"; });
    });
  }

  // ==================== CANVAS ====================
  function initCanvas() {
    const canvas = document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d");
    let W, H, stars = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; genStars(); }
    function genStars() {
      stars = Array.from({ length: 220 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5, alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.pulse += 0.012;
        const a = s.alpha * (0.7 + 0.3 * Math.sin(s.pulse));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,210,255,${a})`; ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); draw();
    window.addEventListener("resize", resize);
  }

  // ==================== SHOOTING STARS ====================
  function initShootingStars() {
    const container = document.getElementById("shootingStars");
    function create() {
      const s = document.createElement("div"); s.className = "shooting-star";
      const dur = 0.8 + Math.random() * 1.2;
      s.style.cssText = `top:${Math.random()*60}%;left:${40+Math.random()*55}%;animation-duration:${dur}s;`;
      container.appendChild(s);
      setTimeout(() => s.remove(), dur * 1000 + 200);
    }
    setInterval(create, 3200);
  }

  // ==================== PARALLAX ====================
  function initParallax() {
    document.addEventListener("mousemove", e => {
      const px = (e.clientX / window.innerWidth - 0.5) * 28;
      const py = (e.clientY / window.innerHeight - 0.5) * 28;
      const ep = document.getElementById("earthPlanet");
      const mp = document.getElementById("marsPlanet");
      if (ep) ep.style.transform = `translateY(0) rotate(0deg) translate(${px*.3}px,${py*.3}px)`;
      if (mp) mp.style.transform = `translateY(0) rotate(0deg) translate(${-px*.2}px,${-py*.2}px)`;
    });
  }

  // ==================== TYPING ====================
  function initTyping() {
    const el = document.getElementById("typingName");
    const txt = "ASJAD PATHAN";
    let i = 0;
    function type() { if (i < txt.length) { el.textContent += txt[i++]; setTimeout(type, 85); } }
    setTimeout(type, 2000);
  }

  // ==================== SCROLL REVEAL ====================
  function initReveal() {
    const revEls = document.querySelectorAll(".rv,.rv-up,.rv-left,.rv-right");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const d = parseFloat(getComputedStyle(e.target).getPropertyValue("--d") || "0");
          setTimeout(() => e.target.classList.add("revealed"), d * 1000);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revEls.forEach(el => io.observe(el));

    // Skill bars + pct counters
    const barIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const bar = e.target;
        const w = parseInt(bar.getAttribute("data-w"));
        const pctEl = bar.closest(".skill-card").querySelector(".skill-pct");
        let cur = 0;
        const step = setInterval(() => {
          cur += 2;
          if (cur >= w) { cur = w; clearInterval(step); }
          bar.style.width = cur + "%";
          if (pctEl) pctEl.textContent = cur + "%";
        }, 18);
        barIO.unobserve(bar);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll(".skill-fill").forEach(b => barIO.observe(b));

    // Stat counters
    const statIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.getAttribute("data-target"));
        let c = 0;
        const iv = setInterval(() => { c++; el.textContent = c; if (c >= target) clearInterval(iv); }, 80);
        statIO.unobserve(el);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll(".stat-n").forEach(el => statIO.observe(el));
  }

  // ==================== PROJECT SLIDER ====================
  function initSlider() {
    const track = document.getElementById("sliderTrack");
    const dots = document.querySelectorAll(".dot");
    const cards = track.querySelectorAll(".proj-card");
    let current = 0;
    const total = cards.length;

    function getCardW() {
      const card = cards[0];
      return card.offsetWidth + 24; // 24 = gap
    }

    function goTo(idx) {
      if (idx < 0) idx = 0;
      if (idx >= total) idx = total - 1;
      current = idx;
      track.style.transform = `translateX(-${current * getCardW()}px)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    document.getElementById("sliderNext").addEventListener("click", () => goTo(current + 1 >= total ? 0 : current + 1));
    document.getElementById("sliderPrev").addEventListener("click", () => goTo(current - 1 < 0 ? total - 1 : current - 1));
    dots.forEach(d => d.addEventListener("click", () => goTo(parseInt(d.getAttribute("data-idx")))));

    // Touch/swipe support
    let startX = 0;
    track.addEventListener("touchstart", e => startX = e.touches[0].clientX, { passive: true });
    track.addEventListener("touchend", e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    // Auto-play
    let autoPlay = setInterval(() => goTo(current + 1 >= total ? 0 : current + 1), 4000);
    track.addEventListener("mouseenter", () => clearInterval(autoPlay));
    track.addEventListener("mouseleave", () => { autoPlay = setInterval(() => goTo(current + 1 >= total ? 0 : current + 1), 4000); });
    window.addEventListener("resize", () => goTo(current));
  }

  // ==================== HEADER SCROLL ====================
  function initNav() {
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 60);
      // Active nav
      document.querySelectorAll("section[id]").forEach(sec => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          document.querySelectorAll(".nl").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + sec.id));
        }
      });
    });
    document.getElementById("themeToggle").addEventListener("click", function() {
      document.body.classList.toggle("light-mode");
      this.textContent = document.body.classList.contains("light-mode") ? "🌑" : "🌙";
    });
    const music = document.getElementById("spaceMusic");
    const musicBtn = document.getElementById("musicToggle");
    musicBtn.addEventListener("click", () => {
      if (music.paused) { music.play().catch(() => {}); musicBtn.textContent = "🔇"; }
      else { music.pause(); musicBtn.textContent = "🔊"; }
    });
  }

  // ==================== FORM ====================
  function initForm() {
    const form = document.getElementById("feedbackForm");
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("cName");
      const email = document.getElementById("cEmail");
      const msg = document.getElementById("cMsg");
      let valid = true;
      ["nameErr","emailErr","msgErr"].forEach(id => document.getElementById(id).textContent = "");
      [name, email, msg].forEach(el => el.classList.remove("err"));
      if (!name.value.trim()) { document.getElementById("nameErr").textContent = "// NAME REQUIRED"; name.classList.add("err"); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { document.getElementById("emailErr").textContent = "// VALID EMAIL REQUIRED"; email.classList.add("err"); valid = false; }
      if (!msg.value.trim()) { document.getElementById("msgErr").textContent = "// MESSAGE REQUIRED"; msg.classList.add("err"); valid = false; }
      if (!valid) return;
      const fb = { name: name.value.trim(), message: msg.value.trim(), time: new Date().toLocaleDateString("en-IN") };
      let fbs = safeGet(); fbs.unshift(fb); localStorage.setItem("ap_feedbacks", JSON.stringify(fbs));
      document.getElementById("successMsg").textContent = "🚀 MESSAGE LAUNCHED INTO THE GALAXY!";
      setTimeout(() => document.getElementById("successMsg").textContent = "", 3500);
      form.reset(); loadFeedback();
    });
  }

  function safeGet() { try { return JSON.parse(localStorage.getItem("ap_feedbacks")) || []; } catch { return []; } }
  function esc(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

  function loadFeedback() {
    const fbs = safeGet();
    const list = document.getElementById("fbList");
    const count = document.getElementById("fbCount");
    count.textContent = fbs.length;
    if (!fbs.length) { list.innerHTML = '<p class="no-fb">// NO MESSAGES YET. BE THE FIRST.</p>'; return; }
    list.innerHTML = fbs.map(f => `<div class="fb-item"><h4>👤 ${esc(f.name)} <span style="font-size:9px;color:var(--muted)">${f.time||""}</span></h4><p>${esc(f.message)}</p></div>`).join("");
  }

});
