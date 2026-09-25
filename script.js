/* ============================================================
   DARSHAN K. PAKHALE — PORTFOLIO
   script.js — All Interactivity
   ============================================================ */

'use strict';

// ============================================================
// 0. BOOT SEQUENCE LOADER
// ============================================================
(function initLoader() {
  const loader = document.getElementById('loader');
  const loaderBody = document.getElementById('loader-body');
  const clock = document.getElementById('loader-clock');
  const skipBtn = document.getElementById('loader-skip');
  
  if (!loader || !loaderBody) return;

  // Update clock
  setInterval(() => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }, 1000);

  const bootLines = [
    { html: '<span class="ll-prompt">root@darshan:~$</span> <span class="ll-cmd">./init_portfolio.sh</span>', delay: 400 },
    { html: '<span class="ll-info">[INFO]</span> Booting Portfolio OS v1.0.0...', delay: 300 },
    { html: '<span class="ll-ok">[ OK ]</span> Loaded core modules (MERN, Python, ML)', delay: 250 },
    { html: '<span class="ll-ok">[ OK ]</span> Neural networks initialized. Loss: 0.001', delay: 350 },
    { html: '<span class="ll-info">[INFO]</span> Fetching user profile: <span class="ll-name">Darshan K. Pakhale</span>', delay: 200 },
    { html: '<span class="ll-warn">[WARN]</span> Caffeine levels critically low. Proceeding anyway.', delay: 400 },
    { html: '<span class="ll-info">[INFO]</span> Building user interface...', delay: 300 },
    { html: '<div class="loader-progress-wrap" id="loader-progress-wrap"><div class="loader-bar-label"><span>Compiling assets</span><span id="loader-pct">0%</span></div><div class="loader-bar-track"><div class="loader-bar-fill" id="loader-bar-fill"></div></div></div>', delay: 50 }
  ];

  let currentLine = 0;
  let isSkipped = false;

  function endLoader() {
    if (isSkipped) return;
    isSkipped = true;
    loader.classList.add('exit');
    document.body.classList.remove('loading');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 700);
  }

  function typeNextLine() {
    if (isSkipped || currentLine >= bootLines.length) return;
    
    const lineObj = bootLines[currentLine];
    const el = document.createElement('div');
    el.className = 'loader-line';
    el.innerHTML = lineObj.html;
    loaderBody.appendChild(el);
    
    // Trigger reflow for transition
    void el.offsetWidth;
    el.classList.add('show');
    
    currentLine++;
    
    if (currentLine < bootLines.length) {
      setTimeout(typeNextLine, lineObj.delay);
    } else {
      // Progress bar logic
      setTimeout(() => {
        if (isSkipped) return;
        const progressWrap = document.getElementById('loader-progress-wrap');
        const barFill = document.getElementById('loader-bar-fill');
        const pctText = document.getElementById('loader-pct');
        if (progressWrap) progressWrap.classList.add('show');
        
        if (barFill) {
          // Trigger transition
          setTimeout(() => {
            barFill.style.width = '100%';
            // Fake percentage counter
            let p = 0;
            const intv = setInterval(() => {
              p += Math.floor(Math.random() * 15) + 5;
              if (p >= 100) {
                p = 100;
                clearInterval(intv);
                setTimeout(endLoader, 400); // Wait a bit after 100% then exit
              }
              if (pctText) pctText.textContent = p + '%';
            }, 100);
          }, 50);
        } else {
          setTimeout(endLoader, 500);
        }
      }, lineObj.delay);
    }
  }

  // Start sequence
  setTimeout(typeNextLine, 300);

  // Skip functionality
  if (skipBtn) {
    skipBtn.addEventListener('click', endLoader);
  }
})();

// ============================================================
// 1. LIVE DATE BADGE
// ============================================================
(function initDateBadge() {
  const dateEl = document.getElementById('date-text');
  if (!dateEl) return;

  function updateDate() {
    const now = new Date();
    const opts = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-US', opts);
  }

  updateDate();
  setInterval(updateDate, 60_000);
})();

// ============================================================
// 2. SCROLL REVEAL (IntersectionObserver)
// ============================================================
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  if (!window.IntersectionObserver) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => observer.observe(el));
})();

// ============================================================
// 3. CONTACT MODAL
// ============================================================
(function initContactModal() {
  const modal        = document.getElementById('contact-modal');
  const backdrop     = document.getElementById('modal-backdrop');
  const closeBtn     = document.getElementById('modal-close-btn');
  const openBtns     = [
    document.getElementById('nav-contact-open'),
    document.getElementById('hero-contact-open'),
  ].filter(Boolean);

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtn  && closeBtn.addEventListener('click', closeModal);
  backdrop  && backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();

// ============================================================
// 4. ACCORDION (Extras Section)
// ============================================================
(function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');

  accordions.forEach(acc => {
    const header = acc.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => toggleAccordion(acc));
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion(acc);
      }
    });
  });

  function toggleAccordion(acc) {
    const isOpen = acc.classList.contains('open');
    const header = acc.querySelector('.accordion-header');

    // Close all first
    accordions.forEach(a => {
      a.classList.remove('open');
      const h = a.querySelector('.accordion-header');
      if (h) h.setAttribute('aria-expanded', 'false');
    });

    // Open clicked if it was closed
    if (!isOpen) {
      acc.classList.add('open');
      header && header.setAttribute('aria-expanded', 'true');
    }
  }

  // Open first accordion by default after a short delay
  if (accordions.length > 0) {
    setTimeout(() => toggleAccordion(accordions[0]), 800);
  }
})();

// ============================================================
// 5. DOODLE CANVAS
// ============================================================
(function initDoodleCanvas() {
  const canvas  = document.getElementById('doodle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Responsive canvas sizing
  function resizeCanvas() {
    const rect   = canvas.getBoundingClientRect();
    const dpr    = window.devicePixelRatio || 1;
    const width  = rect.width || 500;
    const height = 260;

    // Save current drawing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    canvas.width  = width  * dpr;
    canvas.height = height * dpr;
    canvas.style.width  = width  + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Restore drawing
    ctx.putImageData(imageData, 0, 0);
  }

  resizeCanvas();

  // State
  let isDrawing    = false;
  let lastX        = 0;
  let lastY        = 0;
  let currentColor = '#f0f0f0';
  let brushSize    = 3;
  let isEraser     = false;

  // Tool buttons
  const tools = {
    'tool-white':  { color: '#f0f0f0',  eraser: false, size: 3 },
    'tool-yellow': { color: '#ffd166',  eraser: false, size: 3 },
    'tool-coral':  { color: '#ff4d6d',  eraser: false, size: 3 },
    'tool-eraser': { color: '#1a1a1a',  eraser: true,  size: 18 },
  };

  Object.keys(tools).forEach(id => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      // Deactivate all
      Object.keys(tools).forEach(tid => {
        const tb = document.getElementById(tid);
        if (tb) { tb.classList.remove('active'); tb.setAttribute('aria-pressed', 'false'); }
      });
      // Activate clicked
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      const t = tools[id];
      currentColor = t.color;
      brushSize    = t.size;
      isEraser     = t.eraser;
    });
  });

  // Clear button
  const clearBtn = document.getElementById('doodle-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  // Drawing helpers
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.touches) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function startDraw(e) {
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
    e.preventDefault();
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);

    ctx.strokeStyle = isEraser ? '#1a1a1a' : currentColor;
    ctx.lineWidth   = brushSize;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';

    // Chalk effect — slight opacity variation
    if (!isEraser) {
      ctx.globalAlpha = 0.85 + Math.random() * 0.15;
    } else {
      ctx.globalAlpha = 1;
    }

    ctx.stroke();
    ctx.globalAlpha = 1;

    lastX = pos.x;
    lastY = pos.y;
  }

  function endDraw() {
    isDrawing = false;
  }

  canvas.addEventListener('mousedown',  startDraw);
  canvas.addEventListener('mousemove',  draw);
  canvas.addEventListener('mouseup',    endDraw);
  canvas.addEventListener('mouseleave', endDraw);
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove',  draw,      { passive: false });
  canvas.addEventListener('touchend',   endDraw);

  // Draw a welcome hint
  setTimeout(() => {
    ctx.save();
    ctx.font       = 'italic 14px JetBrains Mono, monospace';
    ctx.fillStyle  = 'rgba(255,255,255,0.2)';
    ctx.textAlign  = 'center';
    ctx.fillText('[ draw anything here ]', canvas.getBoundingClientRect().width / 2, 130);
    ctx.restore();
  }, 500);
})();

// ============================================================
// 6. INTERACTIVE TERMINAL
// ============================================================
(function initTerminal() {
  const output = document.getElementById('terminal-output');
  const input  = document.getElementById('terminal-input');
  if (!output || !input) return;

  const COMMANDS = {
    help: cmdHelp,
    whoami: cmdWhoami,
    skills: cmdSkills,
    projects: cmdProjects,
    contact: cmdContact,
    resume: cmdResume,
    clear: cmdClear,
  };

  const history  = [];
  let historyIdx = -1;

  // Command: help
  function cmdHelp() {
    return [
      line('t-cyan', 'Available commands:'),
      line('t-yellow', '  help      ') + span('t-dim', '— show this help message'),
      line('t-yellow', '  whoami    ') + span('t-dim', '— who is Darshan?'),
      line('t-yellow', '  skills    ') + span('t-dim', '— list technical skills'),
      line('t-yellow', '  projects  ') + span('t-dim', '— list featured projects'),
      line('t-yellow', '  contact   ') + span('t-dim', '— how to reach me'),
      line('t-yellow', '  resume    ') + span('t-dim', '— view resume link'),
      line('t-yellow', '  clear     ') + span('t-dim', '— clear the terminal'),
    ].join('');
  }

  // Command: whoami
  function cmdWhoami() {
    return [
      line('t-green',  'Darshan K. Pakhale'),
      line('t-white',  '  Role    : Full-Stack & ML Engineer'),
      line('t-white',  '  College : PVGCOET, Pune (B.E. CS, 2024–2028)'),
      line('t-white',  '  Stack   : MERN · Python · AI/ML · Data Analytics'),
      line('t-white',  '  Based   : Pune, Maharashtra 🇮🇳'),
      line('t-cyan',   '  [MISSION] - To Build Cool Things'),
    ].join('');
  }

  // Command: skills
  function cmdSkills() {
    return [
      line('t-cyan',   'Technical Stack:'),
      line('t-yellow', '  Languages  ') + span('t-white', ': Python, JavaScript, SQL, HTML, CSS'),
      line('t-yellow', '  MERN Stack ') + span('t-white', ': React, Node, Express, Next.js, FastAPI'),
      line('t-yellow', '  ML / AI    ') + span('t-white', ': Scikit-Learn, GNN, CNNs, Neural Nets'),
      line('t-yellow', '  Data       ') + span('t-white', ': NumPy, Pandas, Matplotlib, Seaborn'),
      line('t-yellow', '  Databases  ') + span('t-white', ': MongoDB, Supabase, MySQL, PostgreSQL'),
      line('t-yellow', '  Learning   ') + span('t-green', ': Agentic AI · LLMs · RAG Pipelines'),
    ].join('');
  }

  // Command: projects
  function cmdProjects() {
    return [
      line('t-cyan',   'Featured Projects:'),
      line('t-green',  '  1. GraphSentinel'),
      line('t-dim',    '     GNN-based financial fraud detection platform'),
      line('t-green',  '  2. Sutra'),
      line('t-dim',    '     Knowledge management app with RAG + Chrome extension'),
      line('t-green',  '  3. ScholarArth'),
      line('t-dim',    '     Scholarship discovery platform for Indian students'),
      line('t-yellow', '  → Scroll to #projects section to explore all →'),
    ].join('');
  }

  // Command: contact
  function cmdContact() {
    return [
      line('t-cyan',  'Contact Info:'),
      line('t-white', '  Email    : darshanpakhale06@gmail.com'),
      line('t-white', '  GitHub   : https://github.com/darshanpakhale250-gif'),
      line('t-white', '  LinkedIn : https://www.linkedin.com/in/darshan-pakhale-a97b12329/'),
      line('t-white', '  Resume   : https://drive.google.com/file/d/16lkWd071LZNb3TXfqXyD3W2gqdjqC1wS/view?usp=sharing'),
      line('t-green', '  → Or click the CONTACT button in the navbar →'),
    ].join('');
  }

  // Command: resume
  function cmdResume() {
    window.open('https://drive.google.com/file/d/16lkWd071LZNb3TXfqXyD3W2gqdjqC1wS/view?usp=sharing', '_blank');
    return [
      line('t-cyan',  'Resume:'),
      line('t-white', '  Link : https://drive.google.com/file/d/16lkWd071LZNb3TXfqXyD3W2gqdjqC1wS/view?usp=sharing'),
      line('t-green', '  Opening resume in new tab...'),
    ].join('');
  }

  // Command: clear
  function cmdClear() {
    output.innerHTML = '';
    return null;
  }

  // HTML helpers
  function line(cls, text) {
    return `<div><span class="${cls}">${escHtml(text)}</span></div>`;
  }
  function span(cls, text) {
    return `<span class="${cls}">${escHtml(text)}</span>`;
  }
  function escHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function appendOutput(html) {
    if (!html) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    output.appendChild(wrapper);
    output.scrollTop = output.scrollHeight;
  }

  function appendBlank() {
    const br = document.createElement('div');
    br.style.height = '4px';
    output.appendChild(br);
    output.scrollTop = output.scrollHeight;
  }

  function echoInput(cmd) {
    const div = document.createElement('div');
    div.innerHTML = `<span class="t-green">darshan@pvgcoet:~$</span> <span class="t-white">${escHtml(cmd)}</span>`;
    output.appendChild(div);
  }

  function run(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    history.unshift(rawCmd);
    historyIdx = -1;

    echoInput(rawCmd);

    if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd]();
      if (result !== null) {
        appendOutput(result);
        appendBlank();
      }
    } else {
      appendOutput(line('t-coral', `bash: ${cmd}: command not found`));
      appendOutput(line('t-dim',   'Type "help" to see available commands.'));
      appendBlank();
    }

    output.scrollTop = output.scrollHeight;
  }

  // Input handling
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value;
      input.value = '';
      run(cmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        input.value = history[historyIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        historyIdx--;
        input.value = history[historyIdx] || '';
      } else {
        historyIdx = -1;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const partial = input.value.trim().toLowerCase();
      const match = Object.keys(COMMANDS).find(c => c.startsWith(partial));
      if (match) input.value = match;
    }
  });

  // Auto-type a greeting command
  setTimeout(() => {
    const greeting = 'whoami';
    let i = 0;
    const interval = setInterval(() => {
      if (i < greeting.length) {
        input.value += greeting[i++];
      } else {
        clearInterval(interval);
        setTimeout(() => {
          run(greeting);
          input.value = '';
        }, 400);
      }
    }, 80);
  }, 1200);

})();

// ============================================================
// 7. SMOOTH SCROLL FOR NAV LINKS
// ============================================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// ============================================================
// 8. NAVBAR ACTIVE STATE ON SCROLL
// ============================================================
(function initNavActiveState() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.style.background = link.getAttribute('href') === `#${id}` ? 'var(--yellow)' : 'var(--white)';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(sec => observer.observe(sec));
})();

// ============================================================
// 9. KEYBOARD ACCESSIBILITY — ACCORDION
// ============================================================
// (Already handled in accordion init above — Enter/Space keys)

// ============================================================
// 10. PAGE LOAD FADE-IN
// ============================================================
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});
