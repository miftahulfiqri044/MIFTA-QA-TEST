# MIFTA-QA-TEST

Test automation web untuk [saucedemo.com](https://www.saucedemo.com) dengan **Playwright**, **playwright-bdd** (skenario Gherkin), **TypeScript**, dan laporan **Allure** serta **Playwright HTML Report**.

> Semua perintah di dokumen ini dijalankan dari folder **`mifta-qa-test/`** (folder ini, tempat `package.json` berada), bukan dari root repo.

## Daftar isi

1. [Setup, instalasi dependensi, dan konfigurasi](#1-setup-instalasi-dependensi-dan-konfigurasi)
2. [Arsitektur dan panduan penulisan skrip](#2-arsitektur-dan-panduan-penulisan-skrip)
3. [Panduan menjalankan pengujian](#3-panduan-menjalankan-pengujian)
4. [Laporan: Allure dan Playwright HTML Report](#4-laporan-allure-dan-playwright-html-report)
5. [Troubleshooting](#5-troubleshooting)
6. [Status yang diketahui](#6-status-yang-diketahui)

---

## 1. Setup, instalasi dependensi, dan konfigurasi

### 1.1 Prasyarat sistem

| Kebutuhan | Versi | Cek |
|---|---|---|
| Node.js | 20 atau lebih baru | `node -v` |
| npm | 10 atau lebih baru | `npm -v` |
| Git | terbaru | `git --version` |

**Java JDK tidak diperlukan.** Laporan memakai Allure 3 (paket npm `allure`) yang berjalan di Node. Perintah `allure generate` sudah dicoba tanpa Java terpasang dan berhasil.

### 1.2 Instalasi dari awal

```bash
# 1. Clone repo
git clone https://github.com/miftahulfiqri044/MIFTA-QA-TEST.git
cd MIFTA-QA-TEST/mifta-qa-test

# 2. Pasang semua dependensi project (dari package.json)
npm install

# 3. Pasang browser Playwright (cukup Chromium)
npx playwright install chromium

# 4. Siapkan environment
cp .env.example .env
```

Di Linux yang belum punya library sistem untuk browser, pakai `npx playwright install --with-deps chromium` (meminta `sudo`).

`npm install` memasang semua paket di bawah ini sekaligus. Anda tidak perlu memasangnya satu per satu.

| Paket | Versi terpasang | Fungsi |
|---|---|---|
| `@playwright/test` | 1.65.1 | Runner dan library otomasi browser, termasuk `expect` |
| `playwright-bdd` | 9.2.1 | Mengubah file `.feature` menjadi file test Playwright (`bddgen`) |
| `allure-playwright` | 3.15.0 | Reporter Allure untuk Playwright |
| `allure` | 3.33.0 | CLI Allure 3 untuk membuat dan membuka laporan |
| `allure-js-commons` | 3.15.0 | Fungsi Allure yang dipanggil dari kode |
| `dotenv` | 18.0.10 | Membaca file `.env` |
| `tsx` | 4.23.15 | Terpasang, tapi tidak dipanggil oleh script npm atau config yang aktif. Sisa alur Cucumber-js lama |
| `@types/node` | 26.6.11 | Tipe TypeScript untuk Node |
| `@cucumber/cucumber` | 13.3.0 | Tidak dibutuhkan `playwright-bdd`. Hanya dipakai `allure-cucumberjs` dan file legacy `hooks.ts`/`world.ts` (lihat bagian 2.3) |
| `allure-cucumberjs` | 3.15.0 | Reporter Allure untuk `cucumber-js`. Hanya dipakai konfigurasi legacy `cucumber.mjs` |

Semua paket berada di `devDependencies`.

### 1.3 Isi file `.env`

File `.env` ada di `.gitignore`, jadi tidak ikut ter-commit. `.env.example` adalah contoh yang ikut di git (nama variabel saja, tanpa nilai akun).

| Variabel | Default | Dibaca oleh | Fungsi |
|---|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | `playwright.config.ts` | Alamat aplikasi yang diuji |
| `SLOWMO` | `0` | `playwright.config.ts` | Jeda (milidetik) tiap aksi browser, berguna saat menonton tes |
| `VALID_USER`, `VALID_PASSWORD` | tidak ada | `login.steps.ts` | Akun valid untuk tes login |
| `LOCKED_USER`, `LOCKED_PASSWORD` | tidak ada | `login.steps.ts` | Akun terkunci |
| `WRONGPASS_USER`, `WRONGPASS_PASSWORD` | tidak ada | `login.steps.ts` | Akun dengan password salah |

Akun yang dipakai adalah akun demo publik milik saucedemo.com. Untuk aplikasi sungguhan, jangan menulis kredensial di file `.feature`; simpan di `.env`.

> `BROWSER` dan `HEADED` hanya dibaca oleh `support/hooks.ts` (file legacy). Variabel itu **tidak berpengaruh** pada `npm test`. Untuk menampilkan jendela browser, pakai `--headed` (bagian 3).

### 1.4 File konfigurasi utama

**`playwright.config.ts`**

| Bagian | Nilai | Artinya |
|---|---|---|
| `defineBddConfig({ features, steps })` | `features/**/*.feature`, dan `support/fixtures.ts` + `step-definitions/**/*.ts` | Lokasi skenario dan kode step. Hasilnya (`testDir`) adalah folder `.features-gen/` |
| `reporter` | `list`, `html` (`open: 'never'`), `allure-playwright` (`resultsDir: 'allure-results'`) | Tiga laporan sekaligus tiap run |
| `use.baseURL` | `process.env.BASE_URL` atau `https://www.saucedemo.com` | Dasar untuk `page.goto('/')` |
| `use.testIdAttribute` | `data-test` | Atribut yang dibaca `getByTestId` |
| `use.trace` | `on` | Rekaman langkah demi langkah untuk setiap tes |
| `use.screenshot` | `only-on-failure` | Screenshot hanya saat tes gagal |
| `use.launchOptions.slowMo` | `SLOWMO` atau `0` | Memperlambat aksi |

Config ini **belum punya `projects`**, jadi hanya satu konfigurasi browser (Chromium bawaan). Lihat bagian 3.4 untuk menambah browser lain.

**`tsconfig.json`**: `target` ES2022, `module` ESNext, `moduleResolution` Bundler, mode `strict`. Mencakup folder `features`, `step-definitions`, `support`, dan `pages`. Paket `typescript` tidak terpasang, jadi pengecekan tipe lewat `tsc` belum tersedia.

**Script di `package.json`**

| Script | Perintah sebenarnya | Kegunaan |
|---|---|---|
| `npm test` | `bddgen && playwright test` | Generate lalu jalankan semua tes (headless) |
| `npm run test:headed` | `bddgen && playwright test --headed` | Tampilkan jendela browser |
| `npm run test:ui` | `bddgen && playwright test --ui` | Buka Playwright UI Mode |
| `npm run test:staging` | `BASE_URL=https://www.saucedemo.staging.com npm test` | Jalankan ke staging (alamat saat ini hanya contoh) |
| `npm run test:prod` | `BASE_URL=https://www.saucedemo.com npm test` | Jalankan ke prod |
| `npm run report:playwright` | `playwright show-report` | Buka Playwright HTML Report |
| `npm run report:generate` | `allure generate allure-results --clean -o allure-report` | Buat laporan Allure |
| `npm run report:open` | `allure open allure-report` | Buka laporan Allure |
| `npm run report` | generate lalu open | Dua langkah Allure sekaligus |
| `npm run clean` | `rm -rf allure-results allure-report playwright-report test-results .features-gen` | Hapus semua hasil dan file hasil generate |

Format `BASE_URL=... perintah` bekerja di Linux dan macOS. Di Windows perlu paket `cross-env`.

---

## 2. Arsitektur dan panduan penulisan skrip

### 2.1 Alur kerja satu skenario

```
login.feature  ──bddgen──>  .features-gen/.../login.feature.spec.js  ──playwright test──>  browser
 (kalimat)                   (file test hasil generate)                   (menjalankan)
      │
      └─ tiap kalimat dicocokkan dengan ─>  login.steps.ts  ─>  LoginPage.ts  ─>  aksi di browser
                                            (+ expect)          (locator + aksi)
```

1. `bddgen` membaca file `.feature` dan mencocokkan tiap kalimat dengan step di `step-definitions/`. Hasilnya file `.spec.js` di `.features-gen/`.
2. `playwright test` menjalankan file `.spec.js` itu.
3. Step menerima Page Object lewat fixture, misalnya `{ loginPage }`, lalu memanggil method-nya.
4. Hasil dicek dengan `expect()` di step.

### 2.2 Struktur direktori

```
MIFTA-QA-TEST/                         <- root repository
└── mifta-qa-test/                     <- folder kerja
    ├── README.md                      dokumen ini
    ├── features/                      skenario Gherkin (.feature)
    │   ├── auth/login/
    │   ├── cart/cart/
    │   ├── checkout/checkout-information/
    │   ├── inventory/product-detail/
    │   ├── inventory/product-list/
    │   └── navigation/side-menu/
    ├── step-definitions/              kode step, struktur mengikuti features/
    ├── pages/                         Page Object Model
    │   ├── auth/login/LoginPage.ts
    │   ├── cart/cart/CartPage.ts
    │   ├── checkout/checkout-information/CheckoutInformationPage.ts
    │   ├── inventory/product-detail/ProductDetailPage.ts
    │   ├── inventory/product-list/ProductListPage.ts
    │   └── components/                komponen UI bersama
    │       ├── HeaderComponent.ts
    │       └── SideMenuComponent.ts
    ├── support/                       fixtures dan file pendukung (lihat 2.3)
    ├── data/                          data pendukung (saat ini hanya .gitkeep)
    ├── docs/                          dokumentasi tambahan
    ├── .features-gen/                 DIBUAT OTOMATIS oleh bddgen
    ├── allure-results/                DIBUAT OTOMATIS: hasil mentah Allure
    ├── allure-report/                 DIBUAT OTOMATIS: laporan Allure
    ├── playwright-report/             DIBUAT OTOMATIS: laporan HTML Playwright
    ├── test-results/                  DIBUAT OTOMATIS: trace dan screenshot
    ├── playwright.config.ts           konfigurasi Playwright + playwright-bdd
    ├── tsconfig.json
    ├── cucumber.mjs                   konfigurasi legacy (bukan jalur npm test)
    ├── package.json
    ├── .env.example                   contoh environment
    └── .env                           environment lokal (tidak di git)
```

| Folder | Fungsi | Masuk git? |
|---|---|---|
| `features/` | Skenario yang bisa dibaca QA, PM, dan developer tanpa perlu bisa coding | Ya |
| `step-definitions/` | Kode yang dijalankan saat sebuah kalimat skenario ditemukan | Ya |
| `pages/` | Satu class per halaman (locator + aksi). Perubahan tampilan cukup diperbaiki di sini | Ya |
| `support/` | Fixture dan file pendukung | Ya |
| `.features-gen/` | File test hasil `bddgen`. **Jangan diedit**: akan ditimpa saat `bddgen` berjalan lagi | Tidak |
| `allure-results/`, `allure-report/`, `playwright-report/`, `test-results/` | Hasil run dan laporan | Tidak |

### 2.3 Isi `support/`

| File | Status | Fungsi |
|---|---|---|
| `fixtures.ts` | **Aktif** | Mendaftarkan Page Object sebagai fixture (`loginPage`, `cartPage`, dst) dan mengekspor `Given`, `When`, `Then`. Dimuat oleh `playwright.config.ts` |
| `akun.ts` | Disiapkan | Pemetaan nama akun ke variabel `.env`. Belum dipakai step (`login.steps.ts` masih memiliki pemetaannya sendiri) |
| `hooks.ts` | Legacy | Hooks Cucumber-js (`BeforeAll`, `Before`, `After`). Hanya dimuat oleh `cucumber.mjs` |
| `world.ts` | Legacy | Class `CustomWorld` untuk Cucumber-js. Hanya dimuat oleh `cucumber.mjs` |

Browser, context, dan page dikelola Playwright lewat fixture bawaan (`page`). Project ini **tidak memakai** hooks `Before`/`After`. `hooks.ts` dan `world.ts` tidak dimuat oleh `playwright.config.ts` dan tidak ada script npm yang menjalankan `cucumber-js`, sehingga keduanya tidak berpengaruh pada `npm test`.

### 2.4 Standar penulisan tiap lapisan

#### a. `features/*.feature`

- Keyword Gherkin **bahasa Inggris**: `Feature`, `Scenario`, `Given`, `When`, `Then`, `And`.
- Deskripsi langkah dan judul **bahasa Indonesia**, dari sudut pandang pengguna.
- Setiap skenario diberi tag ID `@TC-xxx` dan tag jenis `@positive` atau `@negative`.
- Nilai yang berubah-ubah ditulis dalam tanda kutip. Akun diacu dengan **nama** (`"valid"`), bukan username dan password.

Contoh asli, [login.feature](features/auth/login/login.feature):

```gherkin
Feature: Verifikasi Fitur Login (Authentication)

  @TC-002 @negative
  Scenario: Login gagal menggunakan akun yang terkunci
    Given pengguna berada di halaman login
    When pengguna login dengan akun "terkunci"
    Then muncul pesan error "Sorry, this user has been locked out."
    And pengguna tetap berada di halaman login
```

Status keyword saat ini:

| File feature | Keyword | Sesuai standar? |
|---|---|---|
| `auth/login/login.feature` | Inggris | Ya |
| `cart/cart/cart.feature` | Indonesia (`# language: id`) | Belum, perlu dikonversi |
| `checkout/checkout-information/checkout-information.feature` | Indonesia | Belum |
| `inventory/product-detail/product-detail.feature` | Indonesia | Belum |
| `inventory/product-list/product-list.feature` | Indonesia | Belum |
| `navigation/side-menu/side-menu.feature` | Indonesia | Belum |

Satu kalimat step cukup didefinisikan **sekali** dan dipakai ulang di banyak skenario. Teks di step harus **sama persis** dengan kalimat di `.feature`.

#### b. `pages/*.ts` (Page Object Model)

- Satu class per halaman atau komponen. Nama file dan class sama: `LoginPage` di `LoginPage.ts`.
- Isinya hanya: properti `readonly` bertipe `Locator`, dan method `async` yang mewakili aksi pengguna (umumnya `Promise<void>`).
- Locator dibuat sekali di constructor.
- **Tidak ada `expect()`** di Page Object. Saat ini memang tidak ada.
- Method yang mengambil data boleh mengembalikan nilai, misalnya `getProductPrices(): Promise<number[]>`.

Contoh asli, [LoginPage.ts](pages/auth/login/LoginPage.ts):

```ts
import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByRole('alert');
  }

  async openLoginPage(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }
}
```

(Potongan di atas menghilangkan satu properti `swagLabText` agar ringkas.) `goto('/')` memakai `baseURL` dari `playwright.config.ts`.

Aturan penamaan lengkap ada di [docs/penamaan.md](docs/penamaan.md).

#### c. `step-definitions/*.steps.ts`

- Penghubung antara kalimat Gherkin dan Page Object.
- **Seluruh `expect()` ditulis di sini.**
- `Given`, `When`, `Then` diimpor dari `support/fixtures`, bukan dari `@cucumber/cucumber`.
- Page Object diterima lewat fixture di argumen pertama: `async ({ loginPage }) => { ... }`. Parameter dari `{string}` menyusul sebagai argumen berikutnya.

Contoh asli, [login.steps.ts](step-definitions/auth/login/login.steps.ts) (dipotong):

```ts
import { expect } from '@playwright/test';
import { Given, Then, When } from '../../../support/fixtures';

Given('pengguna berada di halaman login', async ({ loginPage }) => {
  await loginPage.openLoginPage();
});

When('pengguna login dengan akun {string}', async ({ loginPage }, namaAkun: string) => {
  // ...baca username dan password dari .env berdasarkan namaAkun
  await loginPage.login(username, password);
});

Then('muncul pesan error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.errorMessage).toContainText(message);
});
```

Kata `Given`/`When`/`Then` di file step hanya penanda jenis. Yang dicocokkan dengan `.feature` adalah **teks kalimatnya**. Urutan penulisan di file step tidak memengaruhi urutan eksekusi; urutan eksekusi mengikuti `.feature`.

#### d. `support/fixtures.ts`

Mendaftarkan tiap Page Object sebagai fixture, lalu mengekspor `Given`, `When`, `Then`:

```ts
import { createBdd, test as base } from 'playwright-bdd';
import { LoginPage } from '../pages/auth/login/LoginPage';

type Fixtures = {
  loginPage: LoginPage;
  // ...Page Object lain
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  // ...
});

export const { Given, When, Then } = createBdd(test);
```

Playwright membuat objek fixture ini otomatis untuk setiap tes, sehingga tiap skenario mulai dari browser context yang bersih.

### 2.5 Menambah fitur baru

1. **Feature**: buat `features/<modul>/<menu>/<nama>.feature` dengan keyword Inggris dan tag `@TC-xxx`.
2. **Page Object**: buat `pages/<modul>/<menu>/<Nama>Page.ts` (locator dan aksi, tanpa `expect`).
3. **Fixture**: daftarkan class itu di `support/fixtures.ts` (tipe di `Fixtures` dan entri di `base.extend`).
4. **Step**: buat `step-definitions/<modul>/<menu>/<nama>.steps.ts`, impor dari `support/fixtures`, taruh `expect()` di sini.
5. **Generate dan jalankan**: `npx bddgen`, lalu `npx playwright test` (atau cukup `npm test`).

Nama `feature`, `steps`, dan `Page` untuk satu menu memakai satu akar nama yang sama (misalnya `product-list` dan `ProductList`).

---

## 3. Panduan menjalankan pengujian

### 3.1 Wajib: jalankan `bddgen` sebelum `playwright test`

Playwright tidak membaca file `.feature` secara langsung. Ia menjalankan file `.spec.js` di `.features-gen/`, dan file itu dibuat oleh `bddgen`.

```bash
npx bddgen            # membuat/memperbarui .features-gen/ dari .feature + steps
npx playwright test   # menjalankan hasil generate
```

Script `npm test`, `test:headed`, dan `test:ui` sudah menjalankan `bddgen` lebih dulu secara otomatis. Kalau Anda memanggil `npx playwright test` langsung, pastikan `bddgen` sudah dijalankan setelah mengubah file `.feature` atau step. Kalau lupa, tes berjalan dengan file lama.

`bddgen` memeriksa **semua** file feature. Kalau ada satu kalimat tanpa step (`Missing step definitions`), `bddgen` berhenti dan tidak ada tes yang jalan (lihat bagian 5).

### 3.2 Perintah menjalankan tes

| Tujuan | Perintah |
|---|---|
| Semua tes, headless | `npm test` |
| Dengan jendela browser | `npm run test:headed` atau `npx playwright test --headed` |
| Jendela browser diperlambat | `SLOWMO=800 npx playwright test --headed` |
| UI Mode (daftar tes, timeline, snapshot) | `npm run test:ui` atau `npx playwright test --ui` |
| Debug (Playwright Inspector, langkah demi langkah) | `npx playwright test --debug` |
| Satu tag saja, saat menjalankan | `npx playwright test --grep "@TC-001"` |
| Beberapa tag | `npx playwright test --grep "@TC-001|@TC-002"` |
| Hanya yang negatif | `npx playwright test --grep "@negative"` |
| Satu file hasil generate | `npx playwright test .features-gen/features/auth/login/login.feature.spec.js` |
| Ke environment lain | `npm run test:staging` atau `npm run test:prod` |

`--grep` bekerja karena tag Gherkin ikut menjadi bagian judul tes (misalnya `... @TC-001 @positive`).

### 3.3 Membatasi saat generate

`bddgen` bisa dibatasi dengan tag, sehingga hanya skenario tertentu yang dibuat:

```bash
npx bddgen --tags "@TC-001 or @TC-002 or @TC-003"
npx playwright test
```

Ini berguna untuk menjalankan sebagian skenario tanpa terhalang fitur lain yang belum lengkap. Ingat bahwa folder `.features-gen/` kemudian hanya berisi skenario itu, sampai `bddgen` dijalankan lagi tanpa `--tags`.

### 3.4 Memilih browser (`--project`)

Saat ini `playwright.config.ts` tidak punya `projects`, sehingga `--project=firefox` akan gagal dengan pesan project tidak ditemukan. Untuk mendukungnya, tambahkan `projects` di `defineConfig` (contoh, **belum ada** di project):

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // ...
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
});
```

Setelah itu: `npx playwright test --project=firefox`. Pasang browser yang dibutuhkan lebih dulu, misalnya `npx playwright install firefox`.

### 3.5 Inspeksi locator

```bash
npx playwright codegen https://www.saucedemo.com
```

Membuka browser dan Inspector yang merekam klik menjadi kode, juga bisa dipakai untuk memilih elemen dan melihat locator-nya. Salin hasilnya ke Page Object, lalu rapikan sesuai standar penamaan.

---

## 4. Laporan: Allure dan Playwright HTML Report

Satu kali `playwright test` menghasilkan tiga keluaran sekaligus (diatur di `reporter` pada `playwright.config.ts`):

| Keluaran | Lokasi | Cara membuka |
|---|---|---|
| Ringkasan di terminal | terminal | otomatis |
| Playwright HTML Report | `playwright-report/` | `npm run report:playwright` |
| Hasil mentah Allure | `allure-results/` | lewat perintah Allure di bawah |

### 4.1 Playwright HTML Report

```bash
npm run report:playwright     # sama dengan: npx playwright show-report
```

Laporan dibuka di browser. Karena `trace: 'on'`, setiap tes punya trace (rekaman langkah demi langkah) yang bisa dibuka dari laporan itu. Screenshot hanya ada untuk tes yang gagal.

### 4.2 Allure Report

Allure 3 tidak memerlukan Java.

```bash
npm run report                # generate lalu buka (dua langkah sekaligus)
```

Atau terpisah:

```bash
npm run report:generate       # allure-results/ -> allure-report/
npm run report:open           # buka allure-report/ di browser
```

Alternatif tanpa membuat folder `allure-report/`: `npx allure serve allure-results` (perintah `serve` tersedia di CLI Allure 3).

Catatan penting:

- **Laporan HTML tidak otomatis dibuat saat tes selesai.** Menjalankan tes hanya mengisi `allure-results/` (hasil mentah). Folder `allure-report/` baru ada setelah `npm run report:generate` (atau `npm run report`) dijalankan. Kalau folder itu belum ada, `report:open` belum punya apa-apa untuk dibuka.
- **`report:open` dan `allure serve` menjalankan server lokal**, sehingga terminal tertahan sampai dihentikan dengan `Ctrl+C`. Jalankan di terminal tersendiri.
- **`playwright test --list` ikut tercatat di Allure sebagai `skipped`.** Perintah `--list` hanya menampilkan daftar tes tanpa menjalankannya, tetapi reporter Allure tetap menulis hasilnya. Hasil `skipped` seperti ini bukan kegagalan; jalankan `npm run clean` lalu tes lagi kalau ingin laporan yang bersih.

### 4.3 Membersihkan hasil lama

`allure-results/` menumpuk dari run ke run. Jalankan ini sebelum run baru kalau ingin laporan yang bersih:

```bash
npm run clean
```

Perintah ini menghapus `allure-results`, `allure-report`, `playwright-report`, `test-results`, dan `.features-gen`. Karena `.features-gen` ikut terhapus, jalankan `bddgen` lagi sesudahnya (otomatis lewat `npm test`).

---

## 5. Troubleshooting

| Masalah | Penyebab dan solusi |
|---|---|
| `Missing step definitions: N` | Ada kalimat di `.feature` yang tidak punya step. `bddgen` berhenti dan tidak ada tes yang jalan, termasuk tes yang stepnya lengkap. Buat step-nya atau samakan teksnya. Untuk menjalankan sebagian saja, pakai `npx bddgen --tags ...` (bagian 3.3). |
| Tes berjalan dengan perilaku lama setelah mengubah `.feature` | `.features-gen/` belum diperbarui. Jalankan `npx bddgen` (atau pakai `npm test`). |
| `Akun "..." tidak dikenal` | Nama akun di `.feature` tidak ada di daftar pemetaan di `login.steps.ts`. Pilihan yang valid ikut tertulis di pesan error. |
| `... belum diisi di file .env` | Variabel akun di `.env` kosong atau tidak ada. Salin dari `.env.example` dan isi nilainya. |
| `Executable doesn't exist` | Browser belum terpasang. Jalankan `npx playwright install chromium`. |
| Browser gagal jalan di Linux | `npx playwright install --with-deps chromium`. |
| `Project(s) "..." not found` | `--project` dipakai padahal config belum punya `projects` (bagian 3.4). |
| `ERR_NAME_NOT_RESOLVED` / tes timeout saat `test:staging` | Alamat staging di `package.json` masih contoh. Ganti dengan alamat yang sebenarnya. |
| `allure: command not found` | Jalankan lewat npm (`npm run report`) atau `npx allure ...`. |
| Laporan Allure "tidak jalan" atau `allure-report/` tidak ada | Hasil mentah di `allure-results/` memang terisi otomatis, tetapi laporan HTML harus dibuat dulu: `npm run report` (atau `npm run report:generate`, lalu `npm run report:open`). |
| `no test runtime is found` | Peringatan dari `allure-js-commons`. Lihat bagian 6. |

---

## 6. Status yang diketahui

- `npm test` untuk **semua** feature saat ini gagal di tahap `bddgen` dengan `Missing step definitions: 1`: step `pengguna sudah login dengan username {string} dan password {string}` dipakai oleh `cart`, `checkout-information`, `product-detail`, `product-list`, dan `side-menu`, tetapi definisinya sudah dihapus dari `login.steps.ts`. Tes login (TC-001 sampai TC-003) lulus bila dijalankan dengan `npx bddgen --tags "@TC-001 or @TC-002 or @TC-003"` lalu `npx playwright test`.
- Lima file feature selain `login.feature` masih memakai keyword Gherkin Indonesia (lihat 2.4a).
- `support/hooks.ts`, `support/world.ts`, dan `cucumber.mjs` adalah sisa pendekatan Cucumber-js dan tidak dipakai `npm test`.
- Alamat staging di script `test:staging` hanya contoh.
- Paket `typescript` belum terpasang, jadi `npx tsc` belum bisa dipakai untuk memeriksa tipe.

## Rencana berikutnya

- Mengembalikan step "sudah login" memakai akun dari `.env` agar semua feature bisa dijalankan.
- Mengonversi keyword lima file feature ke bahasa Inggris.
- Test mobile dengan WebdriverIO untuk [sample-app-mobile](https://github.com/saucelabs/sample-app-mobile/releases).
