import { state } from '../state.js';
import { formatTime, tierDesc } from '../logic.js';
import { TOTAL_PACKAGES } from '../config.js';
import { switchView } from './views.js';
import { renderDashboard } from './dashboard.js';

export function renderReview() {
  const pkg     = state.packages[state.currentPackageIndex];
  const wrong   = state.answers.filter(a => !a.isCorrect);
  const correct = state.answers.length - wrong.length;
  const acc     = state.answers.length > 0 ? Math.round((correct / state.answers.length) * 100) : 0;
  const nextIdx = state.currentPackageIndex + 1;
  const tier    = pkg.tier;

  document.getElementById('review-pkg-label').textContent =
    `${pkg.title} · ${formatTime(state.sessionTime)}`;

  const reviewStatsPanel = document.getElementById('review-stats-panel');
  let tierBanner = document.getElementById('tier-banner');
  if (!tierBanner) {
    tierBanner = document.createElement('div');
    tierBanner.id = 'tier-banner';
    reviewStatsPanel.insertBefore(tierBanner, reviewStatsPanel.firstChild);
  }
  tierBanner.className = 'tier-banner';
  tierBanner.style.cssText = `background:${tier.bg};color:${tier.text};margin:1rem 1rem 0;`;
  tierBanner.innerHTML = `
    <div style="font-size:2.4rem;line-height:1">${tier.emoji}</div>
    <div style="flex:1;min-width:0">
      <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">
        <span class="tier-rank" style="color:${tier.text};font-size:1.5rem">${tier.rank}</span>
        <span style="font-size:0.75rem;font-weight:800;letter-spacing:0.08em;opacity:0.9;font-family:'JetBrains Mono',monospace">${tier.label.toUpperCase()}</span>
      </div>
      <p style="font-size:0.7rem;opacity:0.78;margin:0.2rem 0 0;font-weight:500">${tierDesc[tier.rank]}</p>
    </div>`;

  const accColor = acc >= 80 ? 'text-emerald-600' : acc >= 60 ? 'text-amber-500' : 'text-red-500';
  document.getElementById('review-stats').innerHTML = `
    <div class="text-center lg:text-left lg:bg-white lg:rounded-2xl lg:p-4 lg:border lg:border-slate-100">
      <div class="text-2xl font-extrabold text-slate-900 mono">${state.answers.length}</div>
      <div class="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">Total Soal</div>
    </div>
    <div class="text-center lg:text-left lg:bg-white lg:rounded-2xl lg:p-4 lg:border lg:border-slate-100">
      <div class="text-2xl font-extrabold mono ${accColor}">${acc}%</div>
      <div class="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">Akurasi</div>
    </div>
    <div class="text-center lg:text-left lg:bg-white lg:rounded-2xl lg:p-4 lg:border lg:border-slate-100">
      <div class="text-2xl font-extrabold text-blue-600 mono">${formatTime(state.sessionTime)}</div>
      <div class="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">Waktu</div>
    </div>`;

  const container = document.getElementById('review-answers-panel');
  container.innerHTML = '';

  if (wrong.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full py-10 text-center">
        <div class="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 class="text-lg font-extrabold text-slate-800">Sempurna!</h3>
        <p class="text-sm text-slate-400 mt-1">Seluruh komputasi valid — akurasi 100%.</p>
      </div>`;
  } else {
    const frag = document.createDocumentFragment();
    const hdr  = document.createElement('p');
    hdr.className   = 'text-xs font-bold text-slate-400 uppercase tracking-widest mono mb-3';
    hdr.textContent = `${wrong.length} Anomali Ditemukan`;
    frag.appendChild(hdr);

    wrong.forEach(ans => {
      const item = document.createElement('div');
      item.className = 'bg-red-50 border border-red-100 p-3.5 rounded-xl mb-2.5 flex items-center justify-between';
      item.innerHTML = `
        <div class="flex items-center gap-5">
          <div class="mono text-center text-sm">
            <div class="text-slate-600 font-bold">${ans.num1}</div>
            <div class="text-slate-400 text-xs">${state.mode === 'add' ? '+' : '×'}${ans.num2}</div>
            <div class="border-t border-slate-200 mt-1 pt-1 font-extrabold text-slate-700">${ans.expectedAnswer}</div>
          </div>
          <div class="text-sm">
            <div class="text-slate-500">Kunci: <span class="font-extrabold text-emerald-600 mono">${ans.expectedAnswer}</span></div>
            <div class="text-slate-500">Input: <span class="font-extrabold text-red-500 mono">${ans.userAnswer}</span></div>
          </div>
        </div>
        <div class="w-7 h-7 bg-red-100 text-red-400 rounded-full flex items-center justify-center text-sm font-bold">✕</div>`;
      frag.appendChild(item);
    });
    container.appendChild(frag);
  }

  const nextBtn = document.getElementById('btn-next-package');
  if (nextIdx < TOTAL_PACKAGES) {
    nextBtn.classList.remove('hidden');
    nextBtn.textContent = `Lanjut ${state.packages[nextIdx].title} →`;
    nextBtn.onclick = () => {
      document.dispatchEvent(new CustomEvent('startTest', { detail: nextIdx }));
    };
  } else {
    nextBtn.classList.add('hidden');
  }
}

export function initReview() {
  document.getElementById('btn-back-dashboard').addEventListener('click', () => {
    renderDashboard();
    switchView('dashboard');
  });
}
