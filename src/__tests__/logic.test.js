import { describe, it, expect } from 'vitest';
import { getTier, generatePackages, calculateExpectedAnswer, formatTime, sanitizeName } from '../logic.js';

describe('getTier', () => {
  it('returns S+ for perfect score at 80s', () => {
    expect(getTier(80, 100).rank).toBe('S+');
  });
  it('returns S+ for 99.6% accuracy under 80s', () => {
    expect(getTier(75, 99.6).rank).toBe('S+');
  });
  it('does NOT return S+ for 99.4% accuracy', () => {
    expect(getTier(75, 99.4).rank).not.toBe('S+');
  });
  it('returns S for 90% score at 90s', () => {
    expect(getTier(90, 90).rank).toBe('S');
  });
  it('returns A for 85% score at 100s', () => {
    expect(getTier(100, 85).rank).toBe('A');
  });
  it('returns B for 75% score at 130s', () => {
    expect(getTier(130, 75).rank).toBe('B');
  });
  it('returns C for 60% score at 180s', () => {
    expect(getTier(180, 60).rank).toBe('C');
  });
  it('returns D for slow/low score', () => {
    expect(getTier(300, 50).rank).toBe('D');
  });
  it('each tier object has required properties', () => {
    const tier = getTier(100, 90);
    expect(tier).toHaveProperty('rank');
    expect(tier).toHaveProperty('label');
    expect(tier).toHaveProperty('emoji');
    expect(tier).toHaveProperty('bg');
    expect(tier).toHaveProperty('text');
  });
});

describe('generatePackages', () => {
  it('generates 20 packages', () => {
    expect(generatePackages('add')).toHaveLength(20);
  });
  it('each package has 100 numbers', () => {
    generatePackages('add').forEach(pkg => {
      expect(pkg.numbers).toHaveLength(100);
    });
  });
  it('numbers are between 1 and 9 inclusive', () => {
    generatePackages('add').forEach(pkg => {
      pkg.numbers.forEach(n => {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(9);
      });
    });
  });
  it('all packages start as not completed', () => {
    generatePackages('add').forEach(pkg => {
      expect(pkg.completed).toBe(false);
      expect(pkg.score).toBeNull();
      expect(pkg.tier).toBeNull();
    });
  });
  it('assigns the correct mode to each package', () => {
    generatePackages('add').forEach(pkg => expect(pkg.mode).toBe('add'));
    generatePackages('mul').forEach(pkg => expect(pkg.mode).toBe('mul'));
  });
  it('titles follow pattern Paket 01..20', () => {
    const pkgs = generatePackages('add');
    expect(pkgs[0].title).toBe('Paket 01');
    expect(pkgs[19].title).toBe('Paket 20');
  });
});

describe('calculateExpectedAnswer', () => {
  it('add mode: (7+5) mod 10 = 2', () => {
    expect(calculateExpectedAnswer('add', 7, 5)).toBe(2);
  });
  it('add mode: (3+4) mod 10 = 7', () => {
    expect(calculateExpectedAnswer('add', 3, 4)).toBe(7);
  });
  it('add mode: (9+9) mod 10 = 8', () => {
    expect(calculateExpectedAnswer('add', 9, 9)).toBe(8);
  });
  it('mul mode: (7×5) mod 10 = 5', () => {
    expect(calculateExpectedAnswer('mul', 7, 5)).toBe(5);
  });
  it('mul mode: (3×4) mod 10 = 2', () => {
    expect(calculateExpectedAnswer('mul', 3, 4)).toBe(2);
  });
  it('mul mode: (9×9) mod 10 = 1', () => {
    expect(calculateExpectedAnswer('mul', 9, 9)).toBe(1);
  });
  it('result is always 0-9', () => {
    for (let a = 1; a <= 9; a++) {
      for (let b = 1; b <= 9; b++) {
        const r = calculateExpectedAnswer('add', a, b);
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThanOrEqual(9);
      }
    }
  });
});

describe('formatTime', () => {
  it('formats seconds only', () => {
    expect(formatTime(45)).toBe('45s');
  });
  it('formats 0 seconds', () => {
    expect(formatTime(0)).toBe('0s');
  });
  it('formats exactly 60 seconds as 1m 00s', () => {
    expect(formatTime(60)).toBe('1m 00s');
  });
  it('formats 90 seconds as 1m 30s', () => {
    expect(formatTime(90)).toBe('1m 30s');
  });
  it('pads single-digit seconds', () => {
    expect(formatTime(65)).toBe('1m 05s');
  });
  it('formats 2+ minutes', () => {
    expect(formatTime(150)).toBe('2m 30s');
  });
});

describe('sanitizeName', () => {
  it('strips angle bracket characters', () => {
    expect(sanitizeName('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });
  it('removes angle brackets from name', () => {
    expect(sanitizeName('Ali <Budi>')).toBe('Ali Budi');
  });
  it('trims whitespace', () => {
    expect(sanitizeName('  Ahmad  ')).toBe('Ahmad');
  });
  it('keeps normal names intact', () => {
    expect(sanitizeName('Budi Santoso')).toBe('Budi Santoso');
  });
});
