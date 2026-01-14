/* =========================================================
   ✅ MAIN.JS (FINAL FIXED - NO BREAKS)
   - Loader never stuck
   - Case studies clickable (with full data)
   - Process timeline works
   - Review slider loops
   - Trusted strip loops
   - Robot replies to ANY question
========================================================= */

// ✅ global safe (never redeclared)
window.isFinePointer =
  window.matchMedia && window.matchMedia("(pointer: fine)").matches;


/* =========================================================
   YEAR
========================================================= */
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* =========================================================
   LOADER (UNIVERSAL SAFE)
========================================================= */
(() => {
  const loader = document.getElementById("loader");
  const loaderBar = document.getElementById("loaderBar");
  if (!loader) return;

  function hideLoader() {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => (loader.style.display = "none"), 450);
  }

  // animate bar
  if (loaderBar) {
    requestAnimationFrame(() => {
      loaderBar.style.transition = "width 1.2s ease";
      loaderBar.style.width = "100%";
    });
  }

  window.addEventListener("load", () => setTimeout(hideLoader, 350));

  // fallback safety
  setTimeout(hideLoader, 2500);
})();

/* =========================================================
   REVEAL (IN VIEW)
========================================================= */
(() => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) el.classList.add("is-in");
      });
    },
    { threshold: 0.14 }
  );

  items.forEach((el) => io.observe(el));
})();

/* =========================================================
   HERO STATS COUNT-UP
========================================================= */
(() => {
  const stats = document.querySelectorAll(".stat[data-count]");
  if (!stats.length) return;

  let started = false;

  function animateStats() {
    if (started) return;
    started = true;

    stats.forEach((stat) => {
      const target = parseInt(stat.dataset.count || "0", 10);
      const countEl = stat.querySelector(".statCount");
      if (!countEl) return;

      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const val = Math.round(target * (1 - Math.pow(1 - t, 3)));
        countEl.textContent = val;
        if (t < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateStats();
        io.disconnect();
      });
    },
    { threshold: 0.35 }
  );

  io.observe(stats[0]);
})();

/* =========================================================
   ✅ CUSTOM CURSOR
========================================================= */
(() => {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  if (window.isFinePointer) document.body.classList.add("desktop-cursor");

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;
  let shown = false;

  function showCursor() {
    if (shown) return;
    shown = true;
    dot.style.opacity = "1";
    ring.style.opacity = "1";
  }

  function setPos(x, y) {
    mx = x;
    my = y;
    showCursor();
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  }

  window.addEventListener("mousemove", (e) => setPos(e.clientX, e.clientY));
  window.addEventListener(
    "touchmove",
    (e) => {
      if (!e.touches || !e.touches[0]) return;
      setPos(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );

  (function animate() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  })();
})();

/* =========================================================
   ✅ TRUSTED STRIP LOOP FIX (INFINITE)
========================================================= */
(() => {
  const track = document.getElementById("trustedMarquee");
  if (!track) return;
  if (track.dataset.looped) return;
  track.dataset.looped = "true";
  track.innerHTML += track.innerHTML;
})();

/* =========================================================
   ✅ REVIEW SLIDER AUTO LOOP FIX
========================================================= */
(() => {
  const slider = document.getElementById("testSlider");
  const prev = document.getElementById("testPrev");
  const next = document.getElementById("testNext");
  if (!slider) return;

  if (!slider.dataset.looped) {
    const items = [...slider.children];
    items.forEach((item) => slider.appendChild(item.cloneNode(true)));
    slider.dataset.looped = "true";
  }

  let speed = 0.7;
  let paused = false;

  slider.addEventListener("mouseenter", () => (paused = true));
  slider.addEventListener("mouseleave", () => (paused = false));
  slider.addEventListener("touchstart", () => (paused = true), { passive: true });
  slider.addEventListener("touchend", () => (paused = false), { passive: true });

  function loop() {
    if (!paused) {
      slider.scrollLeft += speed;
      if (slider.scrollLeft >= slider.scrollWidth / 2) slider.scrollLeft = 0;
    }
    requestAnimationFrame(loop);
  }
  loop();

  if (prev && next) {
    const step = 420;
    prev.addEventListener("click", () =>
      slider.scrollBy({ left: -step, behavior: "smooth" })
    );
    next.addEventListener("click", () =>
      slider.scrollBy({ left: step, behavior: "smooth" })
    );
  }
})();

/* =========================================================
   ✅ CASE STUDY MODAL (FULL DATA)
========================================================= */
(() => {
  const modal = document.getElementById("caseModal");
  if (!modal) return;

  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalSub = document.getElementById("modalSub");
  const modalProblem = document.getElementById("modalProblem");
  const modalSolution = document.getElementById("modalSolution");
  const modalResult = document.getElementById("modalResult");

  const overlay = document.getElementById("caseModalOverlay");
  const closeBtn = document.getElementById("caseModalClose");

  function openCase(card) {
    const data = card.dataset;

    if (modalImg) modalImg.src = data.img || "";
    if (modalTitle) modalTitle.textContent = data.title || "Client Transformation";
    if (modalSub) modalSub.textContent = data.sub || "A premium automation system built for real outcomes.";

    if (modalProblem) modalProblem.textContent = data.problem || "No problem data provided.";
    if (modalSolution) modalSolution.textContent = data.solution || "No solution data provided.";
    if (modalResult) modalResult.textContent = data.result || "No result data provided.";

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeCase() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".caseCard").forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      openCase(card);
    });
  });

  overlay?.addEventListener("click", closeCase);
  closeBtn?.addEventListener("click", closeCase);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCase();
  });
})();

/* =========================================================
   ✅ PROCESS TIMELINE (TOGGLE)
========================================================= */
(() => {
  document.querySelectorAll(".timeStep .timeHead").forEach((head) => {
    head.addEventListener("click", () => {
      const step = head.closest(".timeStep");
      if (!step) return;
      step.classList.toggle("is-open");
    });
  });

  document.querySelectorAll(".timeStep .timeToggle").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const step = btn.closest(".timeStep");
      if (!step) return;
      step.classList.toggle("is-open");
    });
  });
})();

/* =========================================================
   🤖 ROBOT (REPLIES TO ANYTHING)
========================================================= */
(() => {
  const bot = document.getElementById("aiBot");
  const typingEl = document.getElementById("aiTyping");

  const modal = document.getElementById("aiModal");
  const overlay = document.getElementById("aiModalOverlay");
  const closeBtn = document.getElementById("aiModalClose");

  const chatForm = document.getElementById("aiChatForm");
  const chatInput = document.getElementById("aiChatInput");
  const chatWindow = document.getElementById("aiChatWindow");
  const chips = document.querySelectorAll(".aiChip");

  if (!bot || !typingEl || !modal) return;

  const moods = ["happy", "thinking", "surprised", "confident", "sleep", "annoyed"];
  const setMood = (m) => {
    bot.classList.remove(...moods);
    bot.classList.add(m);
  };

  // floating bubble messages
  const orbitMsgs = [
    "👋 Want package recommendations?",
    "🔥 Ask me anything — I respond instantly.",
    "⭐ Tell me your business type + goal.",
    "📈 I can estimate ROI + timeline.",
    "🤖 Click me to open AI assistant."
  ];

  let msgIndex = 0;
  function typeMessage(text) {
    typingEl.textContent = "";
    let i = 0;
    bot.classList.add("is-active");
    setMood("thinking");

    function tick() {
      typingEl.textContent += text.charAt(i);
      i++;
      if (i < text.length) {
        setTimeout(tick, 18 + Math.random() * 22);
      } else {
        setMood("happy");
        setTimeout(() => {
          bot.classList.remove("is-active");
          setMood("sleep");
        }, 1700);
      }
    }
    tick();
  }

  setTimeout(() => typeMessage(orbitMsgs[0]), 900);
  setInterval(() => {
    msgIndex = (msgIndex + 1) % orbitMsgs.length;
    typeMessage(orbitMsgs[msgIndex]);
  }, 5200);

  function openModal() {
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => chatInput?.focus(), 250);
  }

  function closeModal() {
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    setMood("sleep");
  }

  bot.addEventListener("click", openModal);
  overlay?.addEventListener("click", closeModal);
  closeBtn?.addEventListener("click", closeModal);
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  function addMsg(text, type = "bot") {
    const div = document.createElement("div");
    div.className = `aiMsg ${type}`;
    div.textContent = text;
    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // ✅ GENERIC ALWAYS-REPLY BRAIN
  function smartReply(userText) {
    const t = userText.toLowerCase();

    // common questions
    if (t.includes("price") || t.includes("cost") || t.includes("pricing"))
      return "💳 Pricing depends on complexity + integrations. Tell me your business type and I’ll recommend a package instantly.";

    if (t.includes("services") || t.includes("offer") || t.includes("do you"))
      return "✅ I can help with AI replies, lead capture, qualification, booking systems, integrations (Zapier/Make), and full CRM tracking.";

    if (t.includes("time") || t.includes("how long") || t.includes("timeline"))
      return "📅 Most systems take 3–7 days. Advanced AI + integrations can take 7–12 days. Tell me your tools and I’ll estimate accurately.";

    if (t.includes("audit"))
      return "🔍 Free audit means I analyze your setup and show you the fastest ROI automations. Want me to generate your audit checklist?";

    if (t.includes("robot") || t.includes("you"))
      return "🤖 I’m your AI assistant — ask anything and I’ll guide you step-by-step like a premium agency assistant.";

    // fallback for ANY question
    return `✅ Got it. Here’s the best answer:\n\n1) What’s your business type?\n2) What’s your goal (bookings / save time / reduce no-shows)?\n\nTell me those and I’ll generate a complete automation plan for: "${userText}"`;
  }

  chatForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = chatInput.value.trim();
    if (!val) return;

    addMsg(val, "user");
    chatInput.value = "";

    setMood("thinking");
    setTimeout(() => {
      addMsg(smartReply(val), "bot");
      setMood("happy");
    }, 420);
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const msg = chip.dataset.msg;
      if (!msg) return;
      addMsg(msg, "user");
      setTimeout(() => addMsg(smartReply(msg), "bot"), 420);
    });
  });
})();
