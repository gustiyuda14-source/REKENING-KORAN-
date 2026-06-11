import { TOTAL_PACKAGES, NUMBERS_PER_PACKAGE } from './config.js';

export function generatePackages(mode = 'add') {
  return Array.from({ length: TOTAL_PACKAGES }, (_, i) => ({
    id: i,
    mode,
    title: `Paket ${String(i + 1).padStart(2, '0')}`,
    numbers: Array.from({ length: NUMBERS_PER_PACKAGE }, () => Math.floor(Math.random() * 9) + 1),
    completed: false,
    score: null,
    time: null,
    tier: null
  }));
}

export function getTier(time, score) {
  if (time <= 80  && score > 99.5) return { rank: 'S+', label: 'Manusia Setengah Dewa',   emoji: '🧬', bg: '#6d28d9', text: '#ede9fe' };
  if (time <= 90  && score >= 90)  return { rank: 'S',  label: 'Manusia Super',            emoji: '⚡', bg: '#b45309', text: '#fef3c7' };
  if (time <= 100 && score >= 85)  return { rank: 'A',  label: 'Manusia Turbo',            emoji: '🔥', bg: '#1d4ed8', text: '#dbeafe' };
  if (time <= 130 && score >= 75)  return { rank: 'B',  label: 'Manusia Keren',            emoji: '💪', bg: '#047857', text: '#d1fae5' };
  if (time <= 180 && score >= 60)  return { rank: 'C',  label: 'Manusia Kebanyakan Mikir', emoji: '🤔', bg: '#475569', text: '#f1f5f9' };
  return                                  { rank: 'D',  label: 'Anak Kemarin Sore',        emoji: '🐌', bg: '#94a3b8', text: '#f8fafc' };
}

export const tierDesc = {
  'S+': 'Otakmu diisi GPU ya? Hampir mustahil ini.',
  'S' : 'Kamu bukan manusia biasa. Mungkin.',
  'A' : 'Jari-jarimu lebih cepat dari pikiranmu.',
  'B' : 'Solid! Tinggal dikit lagi jadi legend.',
  'C' : 'Santai ya... nggak apa-apa, latihan lagi!',
  'D' : 'Baru lahir kemarin ya? Tenang, semua pernah mulai dari sini!'
};

export function calculateExpectedAnswer(mode, num1, num2) {
  return mode === 'add' ? (num1 + num2) % 10 : (num1 * num2) % 10;
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, '0')}s` : `${s}s`;
}

export function sanitizeName(input) {
  return input.replace(/[<>&"']/g, '').trim();
}
