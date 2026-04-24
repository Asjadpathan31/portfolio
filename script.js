document.addEventListener("DOMContentLoaded", function() {

  // ==============================
  // LOADER
  // ==============================
  let percent = 0;
  const loaderPercent = document.getElementById("loaderPercent");
  const loaderInterval = setInterval(() => {
    percent += Math.floor(Math.random() * 12) + 3;
    if (percent >= 100) {
      percent = 100;
      clearInterval(loaderInterval);
      loaderPercent.textContent = "100%";
      setTimeout(() => {
        const loader = document.getElementById("loader");
        loader.classList.add("hidden");
        setTimeout(() => loader.remove(), 700);
        initReveal();
      }, 400);
    }
    loaderPercent.textContent = percent + "%";
  }, 80);

  // ==============================
  // CUSTOM CURSOR
  // ==============================
  const cursor = document.getElementById("cursor");
  const trail = document.getElementById("cursorTrail");
  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + "px";
    cursor.style.top = my + "px";
  });

  function animTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + "px";
    trail.style.top = ty + "px";
    requestAnimationFrame(animTrail);
  }
  animTrail();

  document.querySelectorAll("a, button, .glass-card, input, textarea").forEach(el => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%,-50%) scale(2)";
      trail.style.transform = "translate(-50%,-50%) scale(1.5)";
      trail.style.opacity = "0.6";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%,-50%) scale(1)";
      trail.style.transform = "translate(-50%,-50%) scale(1)";
      trail.style.opacity = "0.4";
    });
  });

  // ==============================
  // CANVAS STAR FIELD
  // ==============================
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  let W, H, stars = [];

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5,
        alpha: Math.random() * 0.6 + 0.1,
        speed: Math.random() * 0.3 + 0.05,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  let frame = 0;
  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    frame += 0.01;
    stars.forEach(s => {
      s.pulse += 0.015;
      const a = s.alpha * (0.7 + 0.3 * Math.sin(s.pulse));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 210, 255, ${a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  resizeCanvas();
  initStars();
  drawStars();
  window.addEventListener("resize", () => { resizeCanvas(); initStars(); });

  // ==============================
  // SHOOTING STARS
  // ==============================
  function createShootingStar() {
    const star = document.createElement("div");
    star.className = "shooting-star";
    const top = Math.random() * 60;
    const left = 40 + Math.random() * 60;
    const dur = 0.8 + Math.random() * 1.2;
    star.style.cssText = `top:${top}%;left:${left}%;animation-duration:${dur}s;`;
    document.getElementById("shootingStars").appendChild(star);
    setTimeout(() => star.remove(), dur * 1000 + 200);
  }
  setInterval(createShootingStar, 3000);

  // ==============================
  // PARALLAX PLANETS
  // ==============================
  document.addEventListener("mousemove", e => {
    const px = (e.clientX / window.innerWidth - 0.5) * 30;
    const py = (e.clientY / window.innerHeight - 0.5) * 30;
    const earth = document.getElementById("earthPlanet");
    const mars = document.getElementById("marsPlanet");
    if (earth) earth.style.transform = `translate(${px * 0.3}px, ${py * 0.3}px)`;
    if (mars) mars.style.transform = `translate(${-px * 0.2}px, ${-py * 0.2}px)`;
  });

  // ==============================
  // TYPING EFFECT
  // ==============================
  const nameEl = document.getElementById("typingName");
  const text = "ASJAD PATHAN";
  let i = 0;
  function type() {
    if (i < text.length) {
      nameEl.textContent += text[i];
      i++;
      setTimeout(type, 80);
    }
  }
  setTimeout(type, 1800);

  // ==============================
  // HEADER SCROLL
  // ==============================
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });

  // ==============================
  // SCROLL REVEAL
  // ==============================
  function initReveal() {
    const revealEls = document.querySelectorAll(".reveal-fade,.reveal-up,.reveal-left,.reveal-right");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = parseFloat(e.target.style.getPropertyValue("--delay") || "0");
          setTimeout(() => {
            e.target.classList.add("revealed");
          }, delay * 1000);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(el => io.observe(el));

    // Skill bars
    const barObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bar = e.target;
          setTimeout(() => {
            bar.style.width = bar.getAttribute("data-width");
          }, 200);
          barObs.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".skill-fill").forEach(b => barObs.observe(b));

    // Counter animation
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.getAttribute("data-target"));
          let current = 0;
          const step = Math.ceil(target / 30);
          const interval = setInterval(() => {
            current += step;
            if (current >= target) { el.textContent = target; clearInterval(interval); }
            else el.textContent = current;
          }, 40);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".stat-num").forEach(el => counterObs.observe(el));
  }

  // ==============================
  // THEME TOGGLE
  // ==============================
  const themeBtn = document.getElementById("themeToggle");
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeBtn.textContent = document.body.classList.contains("light-mode") ? "🌑" : "🌙";
  });

  // ==============================
  // MUSIC TOGGLE
  // ==============================
  const music = document.getElementById("spaceMusic");
  const musicBtn = document.getElementById("musicToggle");
  musicBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play().catch(() => {});
      musicBtn.textContent = "🔇";
      musicBtn.title = "Mute";
    } else {
      music.pause();
      musicBtn.textContent = "🔊";
      musicBtn.title = "Sound";
    }
  });

  // ==============================
  // FEEDBACK FORM
  // ==============================
  const form = document.getElementById("feedbackForm");
  const popup = document.getElementById("successPopup");
  const feedbackList = document.getElementById("feedbackList");
  const feedbackCount = document.getElementById("feedbackCount");

  loadFeedback();

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const message = document.getElementById("message");

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("msgError").textContent = "";
    name.classList.remove("error");
    email.classList.remove("error");
    message.classList.remove("error");

    if (!name.value.trim()) {
      document.getElementById("nameError").textContent = "// NAME REQUIRED";
      name.classList.add("error"); valid = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      document.getElementById("emailError").textContent = "// VALID EMAIL REQUIRED";
      email.classList.add("error"); valid = false;
    }
    if (!message.value.trim()) {
      document.getElementById("msgError").textContent = "// MESSAGE REQUIRED";
      message.classList.add("error"); valid = false;
    }

    if (!valid) return;

    const fb = { name: name.value.trim(), message: message.value.trim(), time: new Date().toLocaleDateString() };
    let fbs = JSON.parse(localStorage.getItem("asjad_feedbacks")) || [];
    fbs.unshift(fb);
    localStorage.setItem("asjad_feedbacks", JSON.stringify(fbs));

    popup.textContent = "🚀 MESSAGE LAUNCHED INTO THE GALAXY!";
    setTimeout(() => popup.textContent = "", 3500);
    form.reset();
    loadFeedback();
  });

  function loadFeedback() {
    const fbs = JSON.parse(localStorage.getItem("asjad_feedbacks")) || [];
    feedbackCount.textContent = fbs.length;
    if (fbs.length === 0) {
      feedbackList.innerHTML = '<p class="no-feedback">// NO MESSAGES YET. BE THE FIRST.</p>';
      return;
    }
    feedbackList.innerHTML = fbs.map(f => `
      <div class="feedback-item">
        <h4>👤 ${escHtml(f.name)} <span style="font-size:9px;color:var(--text-muted);font-weight:400;">${f.time || ""}</span></h4>
        <p>${escHtml(f.message)}</p>
      </div>
    `).join("");
  }

  function escHtml(str) {
    return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  // ==============================
  // SMOOTH ACTIVE NAV
  // ==============================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(a => a.style.color = "");
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.style.color = "var(--accent)";
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(s => sectionObs.observe(s));

});
