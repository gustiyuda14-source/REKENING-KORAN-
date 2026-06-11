# CAT Rekening Koran

Sistem Evaluasi Komputasi Arithmetic Test (CAT) berbasis web untuk mengukur kecepatan dan akurasi komputasi deret angka. Digunakan sebagai alat simulasi tes psikotes rekening koran.

## Fitur

- 20 paket soal deret angka (99 soal/paket)
- Mode Penjumlahan dan Perkalian (mod 10)
- Sistem tier performa: S+, S, A, B, C, D
- Tampilan responsif (mobile & desktop)
- Review jawaban salah setelah tiap paket
- Numpad sentuh + keyboard support
- Feedback audio & getar saat jawaban salah

## Cara Menjalankan

### Prasyarat

- Node.js v18+
- npm v9+

### Development

```bash
npm install
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

### Production Build

```bash
npm run build
npm run preview
```

### Testing

```bash
# Jalankan semua test sekali
npm test

# Mode watch (re-run saat file berubah)
npm run test:watch
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

## Struktur Proyek

```
REKENING-KORAN-/
├── index.html          # Shell HTML + CSS
├── src/
│   ├── main.js         # Entry point
│   ├── config.js       # Konstanta global
│   ├── state.js        # State aplikasi
│   ├── logic.js        # Logika bisnis murni (testable)
│   ├── audio.js        # Web Audio API
│   ├── timer.js        # Timer sesi
│   ├── ui/
│   │   ├── views.js    # Manajemen tampilan
│   │   ├── login.js    # View login
│   │   ├── dashboard.js# View dashboard
│   │   ├── test.js     # View tes aktif
│   │   └── review.js   # View hasil evaluasi
│   └── __tests__/
│       └── logic.test.js # Unit tests
├── package.json
├── vite.config.js
└── vitest.config.js
```

## Cara Bermain

1. Masukkan nama peserta dan klik **Masuk Sistem**
2. Pilih paket soal dari dashboard (Mode Tambah atau Kali)
3. Jawab tiap soal dengan mengetuk angka di numpad — jawaban adalah `(a OP b) mod 10`
4. Lihat hasil dan tier performa setelah paket selesai

## Sistem Tier

| Tier | Syarat Waktu | Syarat Akurasi |
|------|-------------|----------------|
| S+   | ≤ 80 detik  | > 99.5%        |
| S    | ≤ 90 detik  | ≥ 90%          |
| A    | ≤ 100 detik | ≥ 85%          |
| B    | ≤ 130 detik | ≥ 75%          |
| C    | ≤ 180 detik | ≥ 60%          |
| D    | > 180 detik | < 60%          |

## Teknologi

- [Vite](https://vitejs.dev/) — build tool & dev server
- [Tailwind CSS](https://tailwindcss.com/) via CDN
- Vanilla JavaScript (ES Modules)
- [Vitest](https://vitest.dev/) — unit testing
