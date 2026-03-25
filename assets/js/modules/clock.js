const TARGET = new Date("April 24, 2026 23:59:59").getTime();
const UNITS  = ['days','hours','minutes','seconds'];
const LABELS = ['Dias','Horas','Minutos','Segundos'];
const clock  = document.getElementById('clock');

// ── Build DOM ─────────────────────────────────────────────
UNITS.forEach((u, i) => {
  if (i > 0) {
    const sep = document.createElement('div');
    sep.className = 'separator';
    sep.textContent = ':';
    clock.appendChild(sep);
  }

  const sec = document.createElement('div');
  sec.className = 'fc-section';
  sec.innerHTML = `
    <div class="flip-unit" id="u-${u}">
      <div class="panel st"><div class="panel-txt" id="st-${u}">00</div></div>
      <div class="panel sb"><div class="panel-txt" id="sb-${u}">00</div></div>
      <div class="panel ft" id="ft-${u}">
        <div class="panel-txt" id="ftt-${u}">00</div>
        <div class="shade"    id="fts-${u}"></div>
      </div>
      <div class="panel fb" id="fb-${u}">
        <div class="panel-txt" id="fbt-${u}">00</div>
        <div class="shade"    id="fbs-${u}"></div>
      </div>
      <div class="divider"></div>
    </div>
    <span class="fc-label">${LABELS[i]}</span>`;
  clock.appendChild(sec);
});

// ── State ─────────────────────────────────────────────────
const prev = { days: null, hours: null, minutes: null, seconds: null };

// ── Flip ──────────────────────────────────────────────────
// 4-panel split-flap physics:
//   static-top  → always shows NEW value (revealed when ft falls away)
//   static-bot  → shows OLD value during phase-1; updated after animation
//   flap-top    → OLD value, rotates 0° → -90° (phase 1: 0–0.28s)
//   flap-bot    → NEW value, rotates 90° → 0°  (phase 2: 0.28–0.56s)
function flip(u, nv) {
  const ov = prev[u];
  if (ov === nv) return;

  // First call: initialise silently without animation
  if (ov === null) {
    prev[u] = nv;
    ['st','sb','ftt','fbt'].forEach(p =>
      document.getElementById(`${p}-${u}`).textContent = nv);
    return;
  }

  prev[u] = nv;

  const st  = document.getElementById(`st-${u}`);
  const sb  = document.getElementById(`sb-${u}`);
  const ft  = document.getElementById(`ft-${u}`);
  const fb  = document.getElementById(`fb-${u}`);
  const ftt = document.getElementById(`ftt-${u}`);
  const fbt = document.getElementById(`fbt-${u}`);
  const fts = document.getElementById(`fts-${u}`);
  const fbs = document.getElementById(`fbs-${u}`);

  st.textContent  = nv; // background top already shows new value
  ftt.textContent = ov; // flap top shows OLD (will fall away)
  fbt.textContent = nv; // flap bot shows NEW (will rise from behind)

  // Cancel any in-progress animations
  [ft, fb, fts, fbs].forEach(el => { el.style.animation = 'none'; });
  void ft.offsetWidth; // force reflow to reset

  // Phase 1 – top flap falls (ease-in = accelerates like gravity)
  ft.style.animation  = 'ftAnim  0.28s cubic-bezier(0.4,0,1,1)     both';
  fts.style.animation = 'shadeIn 0.28s ease-in                      both';
  // Phase 2 – bottom flap rises (ease-out = decelerates as it settles)
  fb.style.animation  = 'fbAnim   0.28s cubic-bezier(0,0,0.6,1) 0.28s both';
  fbs.style.animation = 'shadeOut 0.28s ease-out                 0.28s both';

  // Cleanup: update static-bot, reset flap positions for next flip
  setTimeout(() => {
    sb.textContent = nv;
    [ft, fb, fts, fbs].forEach(el => { el.style.animation = 'none'; });
    ft.style.transform  = 'rotateX(0deg)';
    fb.style.transform  = 'rotateX(90deg)';
    fts.style.opacity   = '0';
    fbs.style.opacity   = '0';
    ftt.textContent = nv;
    fbt.textContent = nv;
  }, 700);
}

// ── Countdown ─────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const d = TARGET - Date.now();
  if (d < 0) { UNITS.forEach(u => flip(u, '00')); return; }
  flip('days',    pad(Math.floor(d / 86400000)));
  flip('hours',   pad(Math.floor((d % 86400000) / 3600000)));
  flip('minutes', pad(Math.floor((d % 3600000)  / 60000)));
  flip('seconds', pad(Math.floor((d % 60000)    / 1000)));
}

tick();
setInterval(tick, 1000);
