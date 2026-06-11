import { state } from '../state.js';
import { generatePackages, sanitizeName } from '../logic.js';
import { switchView } from './views.js';
import { renderDashboard } from './dashboard.js';

export function initLogin() {
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const raw  = document.getElementById('student-name').value.trim();
    const name = sanitizeName(raw);
    if (!name) return;

    state.studentName = name;
    const udEl = document.getElementById('user-display');
    udEl.querySelector('span').textContent = name;
    udEl.classList.remove('hidden');
    udEl.classList.add('flex');

    state.packagesAdd = generatePackages('add');
    state.packagesMul = generatePackages('mul');
    state.mode        = 'add';
    state.packages    = state.packagesAdd;

    renderDashboard();
    switchView('dashboard');
  });
}
