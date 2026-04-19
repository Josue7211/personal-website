/* ============================================
   App: intro, cursor, clock, reveals,
   3D scene hookup, face-labels, hero-exit effect,
   project drawer, tweaks
   ============================================ */

(() => {
  // ============ Projects data (real repos, github.com/Josue7211) ============
  const PROJECTS = [
    { id: 'memd', num: '001 / 2026', title: 'memd',
      tags: ['RUST','AGENTS','MEMORY'],
      desc: 'Open-source memory manager and retrieval control plane for LLM agents. Persistent context, handoffs, recall across sessions.',
      meta: [['Stack','Rust'], ['Role','Creator / maintainer'], ['Repo','github.com/Josue7211/memd']],
      url: 'https://github.com/Josue7211/memd' },
    { id: 'security-sweep', num: '002 / 2026', title: 'security-sweep',
      tags: ['SECURITY','AGENTS','RED-TEAM'],
      desc: 'Pentagon-grade red-team security scanning for Claude Code. Nineteen agents, two tiers, zero gaps.',
      meta: [['Agents','19'], ['Role','Creator'], ['Repo','github.com/Josue7211/security-sweep']],
      url: 'https://github.com/Josue7211/security-sweep' },
    { id: 'claude-autoresearch', num: '003 / 2026', title: 'claude-autoresearch',
      tags: ['SHELL','AGENTS','LOOP'],
      desc: 'Autonomous overnight improvement loop for Claude Code. Inspired by Karpathy\u2019s autoresearch.',
      meta: [['Stack','Shell'], ['Role','Creator'], ['Repo','github.com/Josue7211/claude-autoresearch']],
      url: 'https://github.com/Josue7211/claude-autoresearch' },
    { id: 'bjorn', num: '004 / 2025', title: 'Bjorn',
      tags: ['HARDWARE','3D-PRINT','FIRMWARE'],
      desc: 'Heavily modified Ender 3 V2 NEO. Firmware, slicer profiles, and mechanical mods to print most materials at high speeds.',
      meta: [['Base','Ender 3 V2 NEO'], ['Role','All of it'], ['Repo','github.com/Josue7211/Bjorn']],
      url: 'https://github.com/Josue7211/Bjorn' },
    { id: 'homelab-cli', num: '005 / 2025', title: 'homelab-cli',
      tags: ['SHELL','INFRA','SELF-HOSTED'],
      desc: 'Sixteen bash CLIs for running a self-hosted homelab \u2014 Sonarr, Radarr, Plex, AdGuard, qBittorrent, Portainer.',
      meta: [['CLIs','16'], ['Stack','Shell'], ['Repo','github.com/Josue7211/homelab-cli']],
      url: 'https://github.com/Josue7211/homelab-cli' },
    { id: 'agentsecrets', num: '006 / 2026', title: 'AgentSecrets',
      tags: ['RUST','SECURITY','SECRETS'],
      desc: 'Self-hosted secret broker for agent workflows. Masked responses, human approvals, full audit trails.',
      meta: [['Stack','Rust'], ['Role','Creator'], ['Repo','github.com/Josue7211/AgentSecrets']],
      url: 'https://github.com/Josue7211/AgentSecrets' },
    { id: 'claude-dream', num: '007 / 2026', title: 'claude-dream',
      tags: ['SHELL','AGENTS','MEMORY'],
      desc: 'Memory consolidation skills for Claude Code. Replicates Anthropic\u2019s unreleased /dream and /autodream flows.',
      meta: [['Stack','Shell'], ['Role','Creator'], ['Repo','github.com/Josue7211/claude-dream']],
      url: 'https://github.com/Josue7211/claude-dream' },
    { id: 'mac-bridge', num: '008 / 2025', title: 'mac-bridge',
      tags: ['JAVASCRIPT','MACOS','INFRA'],
      desc: 'REST bridge for macOS services \u2014 Reminders, Notes, Contacts, Find My, Messages. Runs on a Mac, reachable over Tailscale.',
      meta: [['Stack','JavaScript'], ['Transport','Tailscale'], ['Repo','github.com/Josue7211/mac-bridge']],
      url: 'https://github.com/Josue7211/mac-bridge' },
  ];

  // ============ Intro loader ============
  document.body.classList.add('intro-active');
  const intro = document.getElementById('intro');
  const typer = document.getElementById('intro-typer');
  const barFill = document.getElementById('intro-bar-fill');
  const countEl = document.getElementById('intro-count');
  const statusEl = document.getElementById('intro-status');

  function runIntro() {
    if (!intro) { document.body.classList.remove('intro-active'); return; }
    const line = 'boot --user josue --role computer_engineer';
    let i = 0;
    const typeInterval = setInterval(() => {
      if (typer) typer.textContent = line.slice(0, i);
      i++;
      if (i > line.length) clearInterval(typeInterval);
    }, 30);
    const statuses = [
      'booting threejs runtime…',
      'compiling shaders…',
      'rigging nameplate…',
      'calibrating cursor…',
      'ready.',
    ];
    let pct = 0;
    const dur = 1600;
    const start = performance.now();
    function step(t) {
      const el = t - start;
      pct = Math.min(100, (el / dur) * 100);
      if (barFill) barFill.style.width = pct + '%';
      if (countEl) countEl.textContent = String(Math.round(pct * 0.99)).padStart(2, '0');
      if (statusEl) {
        const idx = Math.min(statuses.length - 1, Math.floor((pct / 100) * statuses.length));
        statusEl.textContent = statuses[idx];
      }
      if (pct < 100) requestAnimationFrame(step);
      else finish();
    }
    function finish() {
      setTimeout(() => {
        intro.classList.add('done');
        document.body.classList.remove('intro-active');
        setTimeout(() => intro.classList.add('gone'), 1100);
      }, 250);
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(runIntro);
  setTimeout(() => {
    document.body.classList.remove('intro-active');
    if (intro) { intro.classList.add('done'); intro.classList.add('gone'); }
  }, 4000);

  // ============ Split hero text into chars for explode effect ============
  document.querySelectorAll('.name-big').forEach((h) => {
    const text = h.textContent;
    h.textContent = '';
    [...text].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'name-char';
      s.textContent = ch;
      // random direction for explode
      const ang = Math.random() * Math.PI * 2;
      const dist = 80 + Math.random() * 220;
      s.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
      s.style.setProperty('--dy', `${Math.sin(ang) * dist - 60}px`);
      s.style.setProperty('--rot', `${(Math.random() - 0.5) * 60}deg`);
      s.style.setProperty('--delay', `${i * 0.015}s`);
      h.appendChild(s);
    });
  });

  // ============ Custom cursor ============
  const cursor = document.createElement('div');
  cursor.className = 'cursor';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.append(cursor, ring);
  let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;
  window.addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; });
  function tickCursor() {
    cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tickCursor);
  }
  tickCursor();
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest('a, button, .face-label, .experiment')) {
      cursor.classList.add('hover'); ring.classList.add('hover');
    }
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest('a, button, .face-label, .experiment')) {
      cursor.classList.remove('hover'); ring.classList.remove('hover');
    }
  });

  // ============ Reveals ============
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // ============ Clock ============
  const clock = document.getElementById('clock');
  const heroClock = document.getElementById('hero-clock');
  function updClocks() {
    const d = new Date();
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).formatToParts(d);
    const get = (t) => parts.find(p => p.type === t).value;
    const s = `${get('hour')}:${get('minute')}:${get('second')}`;
    if (clock) clock.textContent = `${s} EST`;
    if (heroClock) heroClock.textContent = s;
  }
  if (clock || heroClock) { updClocks(); setInterval(updClocks, 1000); }

  // ============ Init 3D scene ============
  let scene3D = null;
  const sceneCanvas = document.getElementById('scene-canvas');
  if (sceneCanvas && window.initScene3D) {
    scene3D = window.initScene3D(sceneCanvas, {
      projects: PROJECTS,
      onFaceClick: (p, idx) => openProject(p, idx),
    });
    window.__scene3d = scene3D;
  }

  // ============ Face labels ============
  const labelsContainer = document.getElementById('face-labels');
  const faceLabels = [];
  if (labelsContainer) {
    PROJECTS.forEach((p, i) => {
      const el = document.createElement('button');
      el.className = 'face-label';
      el.type = 'button';
      el.innerHTML = `
        <span class="fl-num">0${i+1}</span>
        <span class="fl-title">${p.title}</span>
        <span class="fl-tag">${p.tags[0]}</span>
        <span class="fl-line"></span>
      `;
      el.addEventListener('click', () => openProject(p, i));
      labelsContainer.appendChild(el);
      faceLabels.push(el);
    });
  }

  // ============ Quick-link sub-facet labels ============
  // Placed at barycentric positions on specific big faces. Each entry:
  // { face: 0..7, bary: [a,b,c] summing to 1, href, label, kicker }
  // Barycentric coords land the label on one of the base octahedron corner
  // vertices — the "small diamond" intersection points where 4 big faces meet.
  const QUICK_LINKS = [
    { face: 2, bary: [1, 0, 0], href: '#about',    label: 'About',   kicker: '→ me' },
    { face: 4, bary: [0, 1, 0], href: 'docs.html', label: 'Docs',    kicker: '→ case studies' },
    { face: 6, bary: [0, 0, 1], href: '#contact',  label: 'Contact', kicker: '→ say hi' },
  ];
  const qlContainer = document.getElementById('quick-links');
  const qlEls = [];
  if (qlContainer) {
    QUICK_LINKS.forEach((q) => {
      const a = document.createElement('a');
      a.className = 'quick-link';
      a.href = q.href;
      a.innerHTML = `
        <span class="ql-kicker">${q.kicker}</span>
        <span class="ql-label">${q.label}</span>
      `;
      qlContainer.appendChild(a);
      qlEls.push({ el: a, conf: q });
    });
  }

  // ============ Scroll-driven updates ============
  const hero = document.getElementById('top');
  const work = document.getElementById('work');
  const about = document.getElementById('about');
  let lastScroll = 0;
  function onScroll() {
    const sy = window.scrollY;
    lastScroll = sy;
    const vh = window.innerHeight;

    const heroH = hero ? hero.offsetHeight : vh;
    const workRect = work ? work.getBoundingClientRect() : null;
    const aboutRect = about ? about.getBoundingClientRect() : null;

    // Hero exit completes very quickly so the sphere gets a clean stage.
    const heroExit = Math.max(0, Math.min(1, sy / (vh * 0.35)));
    document.documentElement.style.setProperty('--hero-exit', heroExit);
    if (hero) hero.classList.toggle('exiting', heroExit > 0.02);
    if (hero) hero.classList.toggle('exited', heroExit > 0.98);
    document.body.classList.toggle('past-hero', heroExit > 0.6);

    // Work-in: ramps up only after the hero is mostly gone.
    let inWork = 0;
    if (workRect) {
      // 0 when work top is at vh*0.85, 1 when at vh*0.2
      inWork = Math.max(0, Math.min(1, (vh * 0.85 - workRect.top) / (vh * 0.65)));
    }
    document.documentElement.style.setProperty('--work-in', inWork);

    // About-zoom: driven by how close the about section is to filling the
    // viewport. 0 until about's top is within 1.2vh of the viewport top,
    // 1 once it reaches the viewport top. During this window the sphere
    // smoothly rotates from its current pose toward the zoom target, then
    // the canvas fades as about content takes over.
    let aboutProg = 0;
    if (aboutRect) {
      const zoomStart = vh * 1.2;
      const zoomEnd = vh * 0.1;
      aboutProg = Math.max(0, Math.min(1, (zoomStart - aboutRect.top) / (zoomStart - zoomEnd)));
    }
    document.documentElement.style.setProperty('--about-zoom', aboutProg);
    document.body.classList.toggle('zooming-about', aboutProg > 0.02 && aboutProg < 0.98);
    document.body.classList.toggle('in-about', aboutProg > 0.85);

    // Scene mode: 'work' once hero is gone; 'past' once about takes over.
    let mode = 'hero';
    if (aboutProg > 0.5) {
      mode = 'past';
    } else if (heroExit > 0.7 && (!workRect || workRect.bottom > vh * 0.3)) {
      mode = 'work';
    } else if (workRect && workRect.bottom < vh * 0.3) {
      mode = 'past';
    }
    if (scene3D) {
      scene3D.setMode(mode);
      const totalProg = Math.max(0, Math.min(1, sy / (heroH + (work ? work.offsetHeight : vh))));
      scene3D.setScrollProg(totalProg);
      scene3D.setAboutProg(aboutProg);
    }
    document.body.dataset.sceneMode = mode;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // ============ Label positioning (follows 3D faces) ============
  function positionLabels() {
    if (!scene3D || !faceLabels.length) {
      requestAnimationFrame(positionLabels);
      return;
    }
    const mode = document.body.dataset.sceneMode;
    const showLabels = mode === 'work';
    faceLabels.forEach((el, i) => {
      const basis = scene3D.getFaceScreenBasis(i);
      if (!basis || !showLabels || !basis.visible) {
        el.style.opacity = '0';
        return;
      }
      const alpha = Math.min(1, Math.max(0, basis.facing) * 1.5);
      el.style.opacity = String(alpha);
      const HALF = 90;
      const a = basis.ux / HALF;
      const b = basis.uy / HALF;
      const c = basis.vx / HALF;
      const d = basis.vy / HALF;
      el.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${basis.ox}, ${basis.oy}) translate(-50%, -50%)`;
    });
    // Quick-links: anchored on sub-facets
    qlEls.forEach(({ el, conf }) => {
      const basis = scene3D.getSubFacetBasis(conf.face, conf.bary[0], conf.bary[1], conf.bary[2]);
      if (!basis || !showLabels || !basis.visible) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        return;
      }
      const alpha = Math.min(1, Math.max(0, basis.facing) * 1.8);
      el.style.opacity = String(alpha);
      el.style.pointerEvents = alpha > 0.5 ? 'auto' : 'none';
      el.style.transform = `translate(${basis.ox}px, ${basis.oy}px) translate(-50%, -50%)`;
    });
    requestAnimationFrame(positionLabels);
  }
  requestAnimationFrame(positionLabels);

  // ============ Project drawer ============
  const drawer = document.getElementById('project-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerTitle = document.getElementById('drawer-title');
  const drawerIndex = document.getElementById('drawer-index');
  const drawerDesc = document.getElementById('drawer-desc');
  const drawerTags = document.getElementById('drawer-tags');
  const drawerMeta = document.getElementById('drawer-meta');
  const drawerCta = document.getElementById('drawer-cta');

  function renderDrawerTags(tags) {
    drawerTags.replaceChildren(
      ...tags.map((t) => {
        const s = document.createElement('span');
        s.textContent = t;
        return s;
      })
    );
  }
  function renderDrawerMeta(meta) {
    drawerMeta.replaceChildren(
      ...meta.map(([k, v]) => {
        const wrap = document.createElement('div');
        const dt = document.createElement('dt');
        dt.textContent = k;
        const dd = document.createElement('dd');
        dd.textContent = v;
        wrap.append(dt, dd);
        return wrap;
      })
    );
  }

  function openProject(p, idx) {
    if (!drawer || !p) return;
    drawerTitle.textContent = p.title;
    drawerIndex.textContent = p.num;
    drawerDesc.textContent = p.desc;
    renderDrawerTags(p.tags);
    renderDrawerMeta(p.meta);
    if (drawerCta) {
      if (p.url) {
        drawerCta.href = p.url;
        drawerCta.target = '_blank';
        drawerCta.rel = 'noopener noreferrer';
        drawerCta.textContent = 'VIEW ON GITHUB \u2197';
        drawerCta.style.display = '';
      } else {
        drawerCta.style.display = 'none';
      }
    }
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // ============ Experiment tiles ============
  if (window.initExperimentTile) {
    document.querySelectorAll('.experiment-canvas').forEach((c) => {
      window.initExperimentTile(c, c.dataset.variant);
    });
  }

  // ============ Tweaks ============
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "typeVibe": "serif-sans",
    "accent": "default"
  }/*EDITMODE-END*/;
  const state = { ...TWEAK_DEFAULTS };
  function applyTweaks() {
    document.body.dataset.typeVibe = state.typeVibe;
    document.body.dataset.accent = state.accent;
  }
  applyTweaks();

  const panel = document.createElement('div');
  panel.className = 'tweaks-panel';
  panel.innerHTML = `
    <div class="tweak-title">Tweaks</div>
    <div class="tweak-group">
      <h4>Typography</h4>
      <div class="tweak-options" data-key="typeVibe">
        <button data-v="serif-sans">Serif + Sans (default)</button>
        <button data-v="all-sans">All sans, big &amp; bold</button>
        <button data-v="mono">Mono display</button>
      </div>
    </div>
    <div class="tweak-group">
      <h4>Accent intensity</h4>
      <div class="tweak-options" data-key="accent">
        <button data-v="subtle">Subtle</button>
        <button data-v="default">Default</button>
        <button data-v="intense">Intense</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  function syncActive() {
    panel.querySelectorAll('.tweak-options').forEach(group => {
      const key = group.dataset.key;
      group.querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b.dataset.v === state[key]);
      });
    });
  }
  syncActive();
  panel.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]');
    if (!b) return;
    const key = b.parentElement.dataset.key;
    state[key] = b.dataset.v;
    applyTweaks(); syncActive();
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: b.dataset.v } }, '*');
  });
  window.addEventListener('message', (e) => {
    if (!e.data) return;
    if (e.data.type === '__activate_edit_mode') panel.classList.add('visible');
    if (e.data.type === '__deactivate_edit_mode') panel.classList.remove('visible');
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');
})();
