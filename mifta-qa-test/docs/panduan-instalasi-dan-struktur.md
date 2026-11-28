# Panduan Instalasi Lengkap dan Penjelasan Dependensi

Dokumen pelengkap untuk [README.md](../README.md). Pembagian tugasnya:

| Dokumen | Isi |
|---|---|
| [README.md](../README.md) | Pegangan utama: setup singkat, konfigurasi, struktur dan standar penulisan skrip, menjalankan tes, laporan, troubleshooting |
| Dokumen ini | Detail instalasi, fungsi tiap dependensi, membuat project serupa dari nol, mengelola paket |
| [penamaan.md](penamaan.md) | Standar penamaan file, class, locator, Gherkin, dan tag |

Struktur folder dan alur kerja satu skenario **tidak diulang di sini**. Lihat README bagian 2.

Project: test automation web untuk [saucedemo.com](https://www.saucedemo.com) dengan Playwright dan playwright-bdd. Semua perintah dijalankan dari folder `mifta-qa-test/` (tempat `package.json` berada).

---

## 1. Ringkasan perintah instalasi

```bash
git clone https://github.com/miftahulfiqri044/MIFTA-QA-TEST.git
cd MIFTA-QA-TEST/mifta-qa-test
npm install
npx playwright install chromium
cp .env.example .env        # lalu isi nilai akun di .env
npm test
```

Penjelasan tiap langkah dan isi `.env` ada di README bagian 1.

---

## 2. Memasang Node.js

Cek dulu:

```bash
node -v    # harus v20 ke atas
npm -v     # harus 10 ke atas
```

Kalau belum ada, pasang versi LTS dari <https://nodejs.org>, atau lewat nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
# buka terminal baru, lalu:
nvm install --lts
```

Java **tidak diperlukan**. Allure 3 berjalan di Node.

---

## 3. Fungsi tiap dependensi

Semuanya berada di `devDependencies` dan terpasang otomatis lewat `npm install`.

### Inti pengujian

| Paket | Fungsi |
|---|---|
| `@playwright/test` | Runner tes, library otomasi browser, dan `expect` yang menunggu otomatis. Ini yang menjalankan tes sebenarnya (`playwright test`). |
| `playwright-bdd` | Menghubungkan Gherkin dengan Playwright. Perintah `bddgen` membaca file `.feature` dan step, lalu menulis file test ke `.features-gen/`. Satu-satunya syarat paket ini adalah `@playwright/test` (peer dependency). Konfigurasinya lewat `defineBddConfig` di `playwright.config.ts`. |
| `dotenv` | Memuat isi `.env` ke `process.env` (dipanggil di `playwright.config.ts`). |
| `@types/node` | Tipe TypeScript untuk `process.env` dan sejenisnya. Hanya untuk editor, tidak dipakai saat tes berjalan. |

### Laporan

| Paket | Fungsi |
|---|---|
| `allure-playwright` | Reporter Allure untuk Playwright. Menulis hasil mentah ke `allure-results/`. Didaftarkan di `reporter` pada `playwright.config.ts`. |
| `allure` | CLI Allure 3 untuk `allure generate`, `allure open`, dan `allure serve`. Berjalan di Node, tanpa Java. |
| `allure-js-commons` | Fungsi Allure yang bisa dipanggil dari kode (misalnya melampirkan file). Dibutuhkan juga oleh `allure-playwright`. |

### Sisa pendekatan lama (legacy)

Paket berikut masih ada di `package.json`, tetapi tidak dipakai oleh `npm test`:

| Paket | Keterangan |
|---|---|
| `@cucumber/cucumber` | **Tidak** dibutuhkan oleh `playwright-bdd`. Hanya dipakai `allure-cucumberjs` dan file `support/hooks.ts` dan `support/world.ts`. |
| `allure-cucumberjs` | Reporter Allure untuk `cucumber-js`. Dipakai konfigurasi `cucumber.mjs`. |
| `tsx` | Tidak dipanggil oleh script npm maupun config yang aktif. |

Kelompok ini aman dibersihkan kalau pendekatan Cucumber-js sudah dipastikan tidak dipakai lagi. Keputusannya belum diambil. Sebelum menghapus, pastikan dulu `hooks.ts`, `world.ts`, dan `cucumber.mjs` ikut ditangani, karena `hooks.ts` dan `world.ts` mengimpor `@cucumber/cucumber`.

---

## 4. Membuat project serupa dari nol

Bagian ini untuk membuat project baru dengan pola yang sama, bukan untuk memasang project ini (cukup `npm install`).

```bash
mkdir mifta-qa-test && cd mifta-qa-test
npm init -y

# Inti pengujian
npm install -D @playwright/test playwright-bdd dotenv @types/node
npx playwright install chromium        # unduh browser (terpisah dari npm)

# Laporan
npm install -D allure-playwright allure-js-commons allure
```

Lalu dua penyesuaian manual di `package.json`:

1. Tambahkan `"type": "module"` (project memakai ES Module).
2. Tambahkan bagian `scripts` (lihat daftar script di README bagian 1.4).

Buat `playwright.config.ts` dengan pola ini (disederhanakan dari file asli):

```ts
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import { defineBddConfig } from 'playwright-bdd';

dotenv.config({ quiet: true });

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['support/fixtures.ts', 'step-definitions/**/*.ts'],
});

export default defineConfig({
  testDir,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['allure-playwright', { resultsDir: 'allure-results' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
  },
});
```

Setelah itu buat `tsconfig.json`, folder `features/`, `step-definitions/`, `pages/`, dan `support/fixtures.ts` mengikuti README bagian 2. Folder `.features-gen/` tidak dibuat manual; ia muncul saat `bddgen` dijalankan.

---

## 5. Mengelola paket

| Kebutuhan | Perintah |
|---|---|
| Tambah paket baru | `npm install -D nama-paket` |
| Pasang versi tertentu | `npm install -D nama-paket@1.2.3` |
| Lihat paket yang terpasang | `npm ls --depth=0` |
| Lihat paket yang bisa diperbarui | `npm outdated` |
| Perbarui satu paket | `npm update nama-paket` |
| Hapus paket | `npm uninstall nama-paket` |
| Lihat siapa yang membutuhkan suatu paket | `npm ls nama-paket` |

Catatan penting:

- Setiap kali `@playwright/test` diperbarui, jalankan lagi `npx playwright install chromium`, karena versi browser ikut berubah.
- `allure-playwright` dan `allure-js-commons` sebaiknya berada di versi mayor yang sama (saat ini 3.x).
- Jangan edit `package-lock.json` secara manual. File itu diperbarui otomatis oleh npm dan harus ikut di-commit.
- Untuk instalasi yang bersih dan persis sesuai lockfile (cocok untuk CI), pakai `npm ci`.
- Jangan pakai `sudo npm install`. Kalau muncul error izin, perbaiki lewat nvm atau pengaturan prefix npm.

Memastikan semuanya terpasang:

```bash
npm ls --depth=0
npx playwright --version
```

---

## 6. Masalah yang sering muncul saat instalasi

| Masalah | Penyebab dan solusi |
|---|---|
| `Executable doesn't exist` | Browser belum terpasang. Jalankan `npx playwright install chromium`. |
| Browser gagal jalan di Linux | Pasang library sistem: `npx playwright install --with-deps chromium` (meminta `sudo`). |
| `Cannot find module` | Jalankan `npm install` lagi dari folder `mifta-qa-test/`. |
| `allure: command not found` | Jalankan lewat npm (`npm run report`) atau `npx allure ...`. |
| `.env` tidak terbaca | Pastikan file `.env` ada di folder `mifta-qa-test/`, bukan di root repo. |

Masalah saat menjalankan tes (`Missing step definitions`, `.features-gen` basi, `--project` tidak ditemukan, dan lainnya) ada di README bagian 5.
