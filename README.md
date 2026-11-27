# MIFTA-QA-TEST

Test automation web untuk [saucedemo.com](https://www.saucedemo.com) dengan **Playwright**, **Cucumber (Gherkin)**, **TypeScript**, dan **Allure Report**.

Cakupan saat ini: fitur **Login (auth)**.

## Prasyarat

| Kebutuhan | Versi | Cek |
|---|---|---|
| Node.js | 20 atau lebih baru | `node -v` |
| npm | 10 atau lebih baru | `npm -v` |
| Git | terbaru | `git --version` |

Java **tidak diperlukan**. Report memakai Allure 3 yang berjalan di Node.

## Setup awal

```bash
# 1. Clone repo
git clone https://github.com/miftahulfiqri044/MIFTA-QA-TEST.git
cd MIFTA-QA-TEST/mifta-qa-test

# 2. Pasang dependency
npm install

# 3. Pasang browser Playwright (cukup Chromium)
npx playwright install chromium

# 4. Siapkan environment
cp .env.example .env
```

Isi `.env`:

| Variabel | Default | Fungsi |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | Alamat aplikasi yang diuji |

Variabel opsional yang dibaca saat menjalankan test:

| Variabel | Default | Fungsi |
|---|---|---|
| `BROWSER` | `chromium` | `chromium`, `firefox`, atau `webkit` |
| `HEADED` | `false` | `true` untuk menampilkan jendela browser |

## Menjalankan test

Semua perintah dijalankan dari folder `mifta-qa-test/`.

```bash
npm run test:web            # headless, Chromium
npm run test:web:headed     # dengan jendela browser
BROWSER=firefox npm run test:web
```

Hasil mentah ditulis ke `allure-results/`.

## Membuat dan membuka report Allure

```bash
npm run report              # generate lalu buka di browser
```

Atau terpisah:

```bash
npm run report:generate     # allure-results/ -> allure-report/
npm run report:open
npm run clean               # hapus allure-results/ dan allure-report/
```

Jalankan `npm run clean` sebelum run baru kalau ingin report yang bersih.

## Struktur project

```
mifta-qa-test/
├── features/            skenario Gherkin (.feature)
│   └── auth/login/login.feature
├── step-definitions/    implementasi step
│   └── auth/login/login.steps.ts
├── pages/               Page Object Model
│   └── auth/login/LoginPage.ts
├── support/
│   ├── world.ts         state per skenario + inisialisasi Page Object
│   └── hooks.ts         buka/tutup browser, screenshot saat gagal
├── data/                data pendukung test
├── docs/penamaan.md     standar penamaan dan struktur folder
├── cucumber.mjs         konfigurasi Cucumber dan reporter Allure
└── .env.example
```

Aturan penamaan lengkap ada di [docs/penamaan.md](mifta-qa-test/docs/penamaan.md).

## Skenario login

| # | Skenario | Hasil yang diharapkan |
|---|---|---|
| 1 | Login berhasil dengan `standard_user` | Masuk ke `/inventory.html` |
| 2 | Password salah | Pesan `Username and password do not match` |
| 3 | `locked_out_user` | Pesan `Sorry, this user has been locked out` |

## Alur kerja satu skenario

```
login.feature  ->  login.steps.ts  ->  LoginPage.ts  ->  browser (Playwright)
 (kalimat)         (pencocokan)        (aksi + locator)
```

1. Cucumber membaca kalimat di file `.feature`.
2. Kalimat itu dicocokkan dengan step di `step-definitions/`.
3. Step memanggil method di Page Object lewat `this.loginPage`.
4. Page Object menggerakkan browser dan hasilnya dicek dengan `expect`.

Versi kode terbaru ada di file sumbernya. Potongan di bawah adalah ringkasan untuk memahami pola.

## Panduan contoh kode

### 1. Feature (`features/auth/login/login.feature`)

```gherkin
# language: id
Fitur: Login

  Skenario: Login gagal karena password salah
    Diberikan pengguna berada di halaman login
    Ketika pengguna login dengan username "standard_user" dan password "password-salah"
    Maka muncul pesan error "Username and password do not match"
```

- Baris pertama `# language: id` membuat keyword memakai Bahasa Indonesia: `Fitur`, `Skenario`, `Diberikan`, `Ketika`, `Maka`, `Dan`.
- Nilai di dalam tanda kutip menjadi parameter step.

### 2. Step (`step-definitions/auth/login/login.steps.ts`)

```ts
import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { CustomWorld } from '../../../support/world';

Given('pengguna berada di halaman login', async function (this: CustomWorld) {
  await this.loginPage.open();
});

When(
  'pengguna login dengan username {string} dan password {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  },
);

Then('muncul pesan error {string}', async function (this: CustomWorld, message: string) {
  await expect(this.loginPage.errorMessage).toContainText(message);
});
```

- `{string}` mengambil teks di dalam tanda kutip pada feature.
- Teks step harus **sama persis** dengan kalimat di feature. Beda satu huruf, step dianggap belum terdefinisi.
- Step cukup memanggil Page Object. Locator tidak ditulis di sini.

### 3. Page Object (`pages/auth/login/LoginPage.ts`)

```ts
import type { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.signInButton.click();
  }
}
```

- Locator didefinisikan satu kali di constructor, lalu dipakai ulang.
- `goto('/')` memakai `BASE_URL` dari `.env`.
- Method diberi nama sesuai aksi pengguna (`open`, `login`).

### 4. World (`support/world.ts`)

```ts
export class CustomWorld extends World {
  page!: Page;
  loginPage!: LoginPage;

  initPages(): void {
    this.loginPage = new LoginPage(this.page);
  }
}
```

World menyimpan state satu skenario. Setiap Page Object didaftarkan di sini supaya bisa dipanggil sebagai `this.loginPage` di step.

## Menambah test baru

Contoh berikut hanya ilustrasi untuk halaman lain (misalnya `ProductPage`). Berkas ini belum ada di project.

1. **Page Object.** Buat `pages/inventory/product/ProductPage.ts` dengan pola yang sama seperti `LoginPage`.
2. **Daftarkan di World.** Di `support/world.ts` tambahkan properti dan inisialisasinya:
   ```ts
   productPage!: ProductPage;

   initPages(): void {
     this.loginPage = new LoginPage(this.page);
     this.productPage = new ProductPage(this.page);
   }
   ```
3. **Feature.** Buat `features/inventory/product/product.feature` dan tulis skenarionya.
4. **Step.** Buat `step-definitions/inventory/product/product.steps.ts`. Gunakan `this.productPage` di dalam step.
5. **Jalankan.** `npm run test:web`, lalu `npm run report`.

Step yang sama boleh dipakai ulang di banyak skenario. Misalnya `pengguna berada di halaman login` cukup ditulis satu kali.

## Tips menulis skenario

- Satu skenario menguji satu hal.
- Pakai kalimat dari sudut pandang pengguna, bukan nama elemen teknis.
- Hindari mengulang locator di step. Letakkan di Page Object.
- Jangan menulis `waitForTimeout`. Playwright menunggu otomatis lewat `expect` dan aksi seperti `click` dan `fill`.

## Troubleshooting

| Masalah | Penyebab dan solusi |
|---|---|
| `Executable doesn't exist` | Browser belum terpasang. Jalankan `npx playwright install chromium`. |
| Browser gagal jalan di Linux | Pasang dependency sistem: `npx playwright install --with-deps chromium`. |
| `page.goto: WebKit encountered an internal error` | Masalah WebKit di Linux. Pakai `BROWSER=chromium`. |
| Timeout menunggu field Username | Pastikan `BASE_URL` benar dan situs bisa dibuka dari jaringanmu. |
| `no test runtime is found` | Peringatan dari `allure-js-commons`. Lihat bagian "Masalah yang diketahui". |
| `allure: command not found` | Jalankan lewat npm (`npm run report`), bukan langsung. |

## Masalah yang diketahui

- Run terakhir di environment pengembangan: 3 skenario login **timeout** saat menunggu field Username. Penyebabnya belum dipastikan (halaman tidak termuat atau locator tidak cocok).
- Pesan `no test runtime is found` dari Allure masih muncul saat run. Penyebabnya belum diselidiki.
- Folder `tests/`, `fixtures.ts`, dan `playwright.config.ts` adalah sisa pendekatan Playwright Test lama dan tidak dipakai oleh Cucumber.

## Rencana berikutnya

- Menambah skenario di luar login (halaman produk, keranjang).
- Test mobile dengan WebdriverIO untuk [sample-app-mobile](https://github.com/saucelabs/sample-app-mobile/releases).
