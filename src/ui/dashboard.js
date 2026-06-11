import { state, activePkgs } from '../state.js';
import { formatTime } from '../logic.js';
import { TOTAL_PACKAGES, RING_CIRCUMFERENCE } from '../config.js';

export function renderDashboard() {
  state.packages = activePkgs();
  const list      = document.getElementById('package-list');
  const completed = state.packages.filter(p => p.completed).length;
  const pct       = Math.round((completed / TOTAL_PACKAGES) * 100);

  document.getElementById('overall-progress-bar').style.width = `${pct}%`;
  document.getElementById('overall-progress-text').textContent = `${completed} / ${TOTAL_PACKAGES} selesai`;
  document.getElementById('mobile-done-count').textContent = `${completed}/20`;

  const ringEl = document.getElementById('sidebar-ring-fill');
  if (ringEl) ringEl.style.strokeDashoffset = RING_CIRCUMFERENCE - (RING_CIRCUMFERENCE * pct / 100);
  const sdText = document.getElementById('sidebar-done-text');
  if (sdText) sdText.textContent = completed;
  const sdPct = document.getElementById('sidebar-pct');
  if (sdPct) sdPct.textContent = pct + '%';

  const completedPkgs = state.packages.filter(p => p.completed);
  const totalCorrect  = completedPkgs.reduce((acc, p) => acc + Math.round((p.score / 100) * 99), 0);
  const avgAcc        = completedPkgs.length
    ? Math.round(completedPkgs.reduce((a, p) => a + p.score, 0) / completedPkgs.length)
    : null;
  const totalTime = completedPkgs.reduce((a, p) => a + (p.time || 0), 0);

  document.getElementById('stat-correct').textContent  = completedPkgs.length ? totalCorrect : '—';
  document.getElementById('stat-accuracy').textContent = avgAcc !== null ? avgAcc + '%' : '—';
  document.getElementById('stat-time').textContent     = completedPkgs.length ? formatTime(totalTime) : '—';

  const isAdd   = state.mode === 'add';
  const subtitle = document.getElementById('dashboard-subtitle');
  if (subtitle) subtitle.textContent = isAdd ? 'Mode Penjumlahan · 20 Paket' : 'Mode Perkalian · 20 Paket';
  document.getElementById('btn-mode-add').className = `mode-btn ${isAdd ? 'active-add' : ''}`;
  document.getElementById('btn-mode-mul').className = `mode-btn ${!isAdd ? 'active-mul' : ''}`;

  list.innerHTML = '';
  const frag = document.createDocumentFragment();
  state.packages.forEach((pkg, index) => {
    const done = pkg.completed;
    const btn  = document.createElement('button');
    btn.style.cssText = 'touch-action:manipulation;-webkit-tap-highlight-color:transparent';
    btn.className = `pkg-card ${done ? 'pkg-card-done' : ''} flex flex-col p-4 rounded-2xl border-2 text-left ${
      done ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-white'
    }`;
    btn.innerHTML = `
      <div class="flex items-start justify-between w-full mb-2">
        <span class="mono text-[10px] font-bold tracking-widest text-slate-400 uppercase">${pkg.title}</span>
        <span class="w-5 h-5 flex items-center justify-center rounded-full shrink-0 ${done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}">
          ${done
            ? `<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
            : `<svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`}
        </span>
      </div>
      <div class="text-xl font-extrabold text-slate-900">${done ? pkg.score + '%' : '—'}</div>
      <div class="flex items-center justify-between mt-0.5">
        <span class="text-[11px] font-medium ${done ? 'text-emerald-600' : 'text-slate-400'}">
          ${done ? formatTime(pkg.time) : '99 soal'}
        </span>
        ${done && pkg.tier ? `<span class="tier-badge-sm" style="background:${pkg.tier.bg};color:${pkg.tier.text}">${pkg.tier.emoji} ${pkg.tier.rank}</span>` : ''}
      </div>`;
    btn.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('startTest', { detail: index }));
    });
    frag.appendChild(btn);
  });
  list.appendChild(frag);
}

export function initDashboard() {
  document.getElementById('btn-mode-add').addEventListener('click', () => {
    if (state.mode === 'add') return;
    state.mode     = 'add';
    state.packages = state.packagesAdd;
    renderDashboard();
  });
  document.getElementById('btn-mode-mul').addEventListener('click', () => {
    if (state.mode === 'mul') return;
    state.mode     = 'mul';
    state.packages = state.packagesMul;
    renderDashboard();
  });
}
