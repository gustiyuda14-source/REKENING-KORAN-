import { state } from '../state.js';
import { getTier, calculateExpectedAnswer } from '../logic.js';
import { startTimer, stopTimer } from '../timer.js';
import { playWrongSound } from '../audio.js';
import { INPUT_DEBOUNCE_MS } from '../config.js';
import { switchView, setAppHeight } from './views.js';
import { renderDashboard } from './dashboard.js';
import { renderReview } from './review.js';

let prevFocusIndex = -1;
let inputLocked    = false;

function showTicker() {
  const t = document.getElementById('ticker-wrap');
  if (t) t.style.display = '';
}

function hideTicker() {
  const t = document.getElementById('ticker-wrap');
  if (t) t.style.display = 'none';
}

export function startTest(pkgIndex) {
  state.currentPackageIndex  = pkgIndex;
  state.currentQuestionIndex = 0;
  state.answers              = [];
  state.isTestActive         = true;
  prevFocusIndex             = -1;

  const label = state.packages[pkgIndex].title;
  document.getElementById('numpad-pkg-label').textContent = label;
  const badge = document.getElementById('test-pkg-badge');
  if (badge) badge.textContent = label;
  const fl = document.getElementById('formula-label');
  if (fl) fl.textContent = state.mode === 'add' ? '(a + b) mod 10' : '(a × b) mod 10';

  _buildTrack();
  switchView('test');
  showTicker();
  startTimer();

  setTimeout(() => {
    setAppHeight();
    _updateFocus(0);
  }, 80);
}

function _buildTrack() {
  const pkg   = state.packages[state.currentPackageIndex];
  const track = document.getElementById('test-track');

  track.innerHTML      = '';
  track.style.transform = 'translate3d(0,0,0)';

  const total = pkg.numbers.length - 1;
  document.getElementById('progress-text').textContent = `0 / ${total}`;
  document.getElementById('progress-bar-fill').style.width = '0%';

  const frag = document.createDocumentFragment();
  pkg.numbers.forEach((num, i) => {
    const numDiv       = document.createElement('div');
    numDiv.id          = `n${i}`;
    numDiv.className   = 'track-num';
    numDiv.textContent = num;
    frag.appendChild(numDiv);

    if (i < pkg.numbers.length - 1) {
      const wrapper     = document.createElement('div');
      wrapper.id        = `w${i}`;
      wrapper.className = 'track-wrapper';
      const box         = document.createElement('div');
      box.id            = `b${i}`;
      box.className     = 'track-box';
      wrapper.appendChild(box);
      frag.appendChild(wrapper);
    }
  });
  track.appendChild(frag);
}

function _updateFocus(index) {
  const pkg    = state.packages[state.currentPackageIndex];
  const track  = document.getElementById('test-track');
  const vp     = document.getElementById('test-viewport');
  const target = document.getElementById(`w${index}`);

  if (!target) return;
  state.currentQuestionIndex = index;

  const vpH       = vp.clientHeight;
  const targTop   = target.offsetTop;
  const targH     = target.clientHeight;
  const translateY = Math.round(vpH / 2 - (targTop + targH / 2));
  const total     = pkg.numbers.length - 1;
  const prev      = prevFocusIndex;

  requestAnimationFrame(() => {
    if (prev >= 0) {
      const pNum  = document.getElementById(`n${prev}`);
      const pNext = document.getElementById(`n${prev + 1}`);
      const pWrap = document.getElementById(`w${prev}`);
      const pBox  = document.getElementById(`b${prev}`);
      if (pNum)  pNum.dataset.state  = 'past';
      if (pNext && (prev + 1) !== index) pNext.dataset.state = 'past';
      if (pWrap) pWrap.dataset.state  = 'past';
      if (pBox && pBox.dataset.state === 'active') pBox.dataset.state = '';
    }

    const cNum  = document.getElementById(`n${index}`);
    const cNext = document.getElementById(`n${index + 1}`);
    const cWrap = document.getElementById(`w${index}`);
    const cBox  = document.getElementById(`b${index}`);
    if (cNum)  cNum.dataset.state  = 'active';
    if (cNext) cNext.dataset.state = 'active-next';
    if (cWrap) cWrap.dataset.state = 'active';
    if (cBox)  cBox.dataset.state  = 'active';

    track.style.transform = `translate3d(0, ${translateY}px, 0)`;
    document.getElementById('progress-text').textContent = `${index} / ${total}`;
    document.getElementById('progress-bar-fill').style.width = `${(index / total) * 100}%`;

    prevFocusIndex = index;
  });
}

function _processInput(valStr) {
  if (!state.isTestActive || inputLocked) return;
  inputLocked = true;
  setTimeout(() => { inputLocked = false; }, INPUT_DEBOUNCE_MS);

  const userAns = parseInt(valStr, 10);
  const idx     = state.currentQuestionIndex;
  const pkg     = state.packages[state.currentPackageIndex];
  const total   = pkg.numbers.length - 1;
  const expected = calculateExpectedAnswer(state.mode, pkg.numbers[idx], pkg.numbers[idx + 1]);
  const isCorrect = userAns === expected;

  const box = document.getElementById(`b${idx}`);
  if (box) {
    box.textContent   = userAns;
    box.style.color   = '#475569';
    box.dataset.state = 'done';
    if (!isCorrect) {
      box.classList.add('shake');
      setTimeout(() => box.classList.remove('shake'), 400);
    }
  }

  state.answers.push({
    num1: pkg.numbers[idx],
    num2: pkg.numbers[idx + 1],
    userAnswer: userAns,
    expectedAnswer: expected,
    isCorrect
  });

  const next = idx + 1;
  if (next < total) {
    _updateFocus(next);
  } else {
    state.isTestActive = false;
    stopTimer();
    document.getElementById('progress-text').textContent = 'Memproses…';
    document.getElementById('progress-bar-fill').style.width = '100%';
    setTimeout(_finishTest, 550);
  }

  return isCorrect;
}

function _finishTest() {
  const correct  = state.answers.filter(a => a.isCorrect).length;
  const total    = state.answers.length;
  const score    = total > 0 ? Math.round((correct / total) * 100) : 0;
  const accExact = total > 0 ? (correct / total) * 100 : 0;
  const pkg      = state.packages[state.currentPackageIndex];

  pkg.completed = true;
  pkg.score     = score;
  pkg.time      = state.sessionTime;
  pkg.tier      = getTier(state.sessionTime, accExact);

  hideTicker();
  renderReview();
  switchView('review');
}

export function initTest() {
  document.querySelectorAll('.numpad-btn').forEach(btn => {
    let touchFired = false;

    btn.addEventListener('touchstart', e => {
      e.preventDefault();
      touchFired = true;
      btn.classList.add('pressed');
      const correct = _processInput(btn.getAttribute('data-val'));
      if (correct === false) {
        try { navigator.vibrate && navigator.vibrate([80, 30, 80]); } catch (_) {}
        playWrongSound();
      }
    }, { passive: false });

    btn.addEventListener('touchend', () => {
      btn.classList.remove('pressed');
      setTimeout(() => { touchFired = false; }, 300);
    }, { passive: true });

    btn.addEventListener('click', () => {
      if (!touchFired) _processInput(btn.getAttribute('data-val'));
    });
  });

  document.addEventListener('keydown', e => {
    if (state.isTestActive && e.key >= '0' && e.key <= '9') _processInput(e.key);
  });

  document.getElementById('btn-cancel-test').addEventListener('click', () => {
    if (confirm('Akhiri sesi ini?')) {
      state.isTestActive = false;
      stopTimer();
      hideTicker();
      renderDashboard();
      switchView('dashboard');
    }
  });

  document.addEventListener('startTest', e => startTest(e.detail));
}
