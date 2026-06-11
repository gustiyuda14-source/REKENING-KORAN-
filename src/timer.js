import { state } from './state.js';

let timerInterval  = null;
let elapsedSeconds = 0;

export function startTimer() {
  elapsedSeconds = 0;
  _renderTimer();
  timerInterval = setInterval(() => { elapsedSeconds++; _renderTimer(); }, 1000);
}

export function stopTimer() {
  clearInterval(timerInterval);
  timerInterval     = null;
  state.sessionTime = elapsedSeconds;
}

function _renderTimer() {
  const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
  const s = (elapsedSeconds % 60).toString().padStart(2, '0');
  const el = document.getElementById('timer-display');
  if (el) el.textContent = `${m}:${s}`;
}
