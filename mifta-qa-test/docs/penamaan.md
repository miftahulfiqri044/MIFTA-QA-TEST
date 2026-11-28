# Standar Penamaan dan Struktur Folder

Tujuan: semua orang menamai hal yang sama dengan cara yang sama, sehingga kode mudah dicari dan dibaca.

## Ringkasan cepat

| Objek | Format | Contoh |
|---|---|---|
| Folder | kebab-case | `auth`, `shopping-cart` |
| File feature | kebab-case + `.feature` | `login.feature` |
| File step | kebab-case + `.steps.ts` | `login.steps.ts` |
| File Page Object | PascalCase + `Page.ts` | `LoginPage.ts` |
| File komponen | PascalCase + `Component.ts` | `HeaderComponent.ts` |
| File data | kebab-case + `.json` | `users.json` |
| Class | PascalCase | `LoginPage` |
| Locator (property) | camelCase + jenis elemen | `usernameField`, `loginButton` |
| Method aksi | camelCase, diawali kata kerja | `login()`, `addToCart()` |
| Method pengecekan boolean | diawali `is` / `has` | `isLoggedIn()` |
| Variabel dan parameter | camelCase | `productName` |
| Konstanta | UPPER_SNAKE_CASE | `BASE_URL` |
| Tag Gherkin | ID test case `@TC-xxx` dan jenis huruf kecil | `@TC-001`, `@positive`, `@negative` |

---

## 1. Struktur folder

- `features/` berisi file Gherkin (`.feature`).
- `step-definitions/` berisi implementasi step, mengikuti struktur `features/`.
- `pages/` berisi Page Object Model.
- `pages/components/` berisi bagian UI yang dipakai di banyak halaman.
- `support/` berisi fixtures Playwright (`fixtures.ts`) dan file pendukung lain (`akun.ts`). `hooks.ts` dan `world.ts` adalah sisa Cucumber-js (legacy), tidak dipakai oleh `npm test`.
- `.features-gen/` dibuat otomatis oleh `bddgen`. Jangan diedit dan tidak masuk git.
- `data/` berisi data pendukung test.
- `docs/` berisi dokumentasi project.

### Struktur modul

```text
features/<modul>/<menu>/<nama>.feature
step-definitions/<modul>/<menu>/<nama>.steps.ts
pages/<modul>/<menu>/<Nama>Page.ts
```

`<modul>` adalah kelompok besar fitur (misalnya `auth`, `inventory`, `checkout`). `<menu>` adalah halaman atau menu di dalamnya.

Modul yang ada saat ini: `auth`, `inventory`, `cart`, `checkout`, dan `navigation`. Contoh modul `auth`:

```text
features/auth/login/login.feature
step-definitions/auth/login/login.steps.ts
pages/auth/login/LoginPage.ts
```

Contoh modul `inventory` (sudah ada di project):

```text
features/inventory/product-list/product-list.feature
step-definitions/inventory/product-list/product-list.steps.ts
pages/inventory/product-list/ProductListPage.ts
```

Nama `feature`, `steps`, dan `Page` untuk satu menu harus **satu akar nama** yang sama (`product-list` / `ProductList`) supaya mudah dipasangkan.

### Aturan folder

- Huruf kecil semua, kata dipisah tanda hubung: `shopping-cart`, bukan `ShoppingCart` atau `shopping_cart`.
- Tanpa spasi, tanpa huruf besar, tanpa karakter khusus.
- Pakai bahasa Inggris untuk nama folder, file, class, dan locator. Bahasa Indonesia dipakai di isi skenario Gherkin.
- Struktur `step-definitions/` selalu mengikuti `features/`.

---

## 2. Nama file

| Jenis | Aturan | Benar | Salah |
|---|---|---|---|
| Feature | kebab-case, akhiran `.feature` | `add-to-cart.feature` | `AddToCart.feature`, `add_to_cart.feature` |
| Steps | kebab-case, akhiran `.steps.ts` | `add-to-cart.steps.ts` | `addToCartSteps.ts`, `steps.ts` |
| Page Object | PascalCase, akhiran `Page.ts` | `CartPage.ts` | `cart.page.ts`, `Cart.ts` |
| Komponen | PascalCase, akhiran `Component.ts` | `HeaderComponent.ts` | `header.ts` |
| Data | kebab-case, `.json` | `test-users.json` | `Data1.json` |
| Support | kebab-case | `fixtures.ts`, `akun.ts` | `Fixtures.ts` |

Satu file = satu hal. Jangan menaruh dua Page Object dalam satu file.

---

## 3. Class dan method

### Class

- PascalCase, nama sama dengan nama file: `LoginPage` di `LoginPage.ts`.
- Page Object berakhiran `Page`, komponen berakhiran `Component`.

### Method aksi

Diawali kata kerja, dari sudut pandang pengguna:

| Benar | Salah |
|---|---|
| `open()` | `page()` |
| `login(username, password)` | `loginMethod()`, `doLogin()` |
| `addToCart(productName)` | `cart()`, `click1()` |
| `selectSortOption(option)` | `sort()` |
| `removeProduct(productName)` | `remove1()` |

### Method pengecekan

- Nilai benar/salah: diawali `is` atau `has`: `isLoggedIn()`, `hasError()`.
- Mengambil nilai: diawali `get`: `getTotalPrice()`, `getProductNames()`.
- Assertion (`expect`) **ditulis di step**, bukan di Page Object.

### Variabel dan konstanta

- Variabel dan parameter: camelCase dan bermakna. `productName`, bukan `pn` atau `x`.
- Konstanta tingkat modul: `UPPER_SNAKE_CASE`, misalnya `BASE_URL`.
- Hindari singkatan yang tidak umum.

---

## 4. Penamaan locator (field, text, card, image, dll)

### Rumus

```
<nama-bermakna><Jenis elemen>
```

Nama menjelaskan **fungsi/isi elemen**, akhiran menjelaskan **jenis elemen**. Pakai camelCase dan `readonly Locator`.

```ts
readonly usernameField: Locator;
readonly loginButton: Locator;
```

### Tabel akhiran per jenis elemen

| Jenis elemen | Akhiran | Contoh |
|---|---|---|
| Kolom input teks | `Field` | `usernameField`, `passwordField`, `searchField` |
| Textarea | `TextArea` | `notesTextArea` |
| Tombol | `Button` | `loginButton`, `checkoutButton`, `addToCartButton` |
| Link | `Link` | `forgotPasswordLink`, `cartLink` |
| Dropdown / select | `Dropdown` | `sortDropdown`, `countryDropdown` |
| Checkbox | `Checkbox` | `rememberMeCheckbox` |
| Radio button | `Radio` | `shippingExpressRadio` |
| Toggle / switch | `Toggle` | `notificationToggle` |
| Teks biasa | `Text` | `productNameText`, `totalPriceText`, `pageTitleText` |
| Judul | `Title` / `Heading` | `pageTitle`, `sectionHeading` |
| Label formulir | `Label` | `usernameLabel` |
| Pesan error | `ErrorMessage` | `errorMessage`, `passwordErrorMessage` |
| Pesan sukses | `SuccessMessage` | `orderSuccessMessage` |
| Notifikasi / toast | `Toast` | `savedToast` |
| Alert / banner | `Alert` | `warningAlert` |
| Gambar | `Image` | `productImage`, `logoImage`, `avatarImage` |
| Ikon | `Icon` | `cartIcon`, `menuIcon` |
| Kartu | `Card` | `productCard`, `summaryCard` |
| Daftar (banyak elemen) | `List` atau bentuk jamak | `productList`, `productCards` |
| Item dalam daftar | `Item` | `cartItem`, `menuItem` |
| Tabel | `Table` | `orderTable` |
| Baris tabel | `Row` | `orderRow` |
| Sel tabel | `Cell` | `priceCell` |
| Header halaman/seksi | `Header` | `pageHeader` |
| Footer | `Footer` | `pageFooter` |
| Menu navigasi | `Menu` | `sideMenu` |
| Tab | `Tab` | `profileTab` |
| Modal / dialog | `Modal` / `Dialog` | `confirmModal` |
| Badge / penghitung | `Badge` | `cartBadge` |
| Breadcrumb | `Breadcrumb` | `productBreadcrumb` |
| Pagination | `Pagination` | `productPagination` |
| Loading / spinner | `Spinner` | `loadingSpinner` |
| Kontainer umum | `Container` | `inventoryContainer` |

### Aturan

1. **Nama menjelaskan fungsi, bukan lokasi atau tampilan.**
   - Benar: `loginButton`
   - Salah: `blueButton`, `button1`, `topRightButton`
2. **Selalu pakai akhiran jenis elemen.**
   - Benar: `usernameField`
   - Salah: `username` (membingungkan dengan nilai teks), `input1`
3. **Pakai bahasa Inggris** dan sama dengan istilah di UI bila ada: tombol "Add to cart" menjadi `addToCartButton`.
4. **Daftar elemen pakai bentuk jamak atau `List`:** `productCards`, `cartItems`.
5. **Satu elemen = satu locator.** Jangan membuat `loginButton` dan `signInButton` untuk tombol yang sama.
6. **Locator dasar dibuat di constructor**, dipakai ulang oleh method.
7. **Jangan menyimpan nilai teks di locator.** Nilai diambil lewat method atau dicek lewat `expect`.

### Locator yang butuh parameter (kartu produk, baris tabel)

Elemen yang jumlahnya banyak dan dicari berdasarkan nama dibuat sebagai **method yang mengembalikan `Locator`**, bukan property:

```ts
export class InventoryPage {
  readonly page: Page;
  readonly productCards: Locator;          // semua kartu
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  // satu kartu berdasarkan nama produk
  productCard(productName: string): Locator {
    return this.productCards.filter({ hasText: productName });
  }

  // elemen di dalam kartu
  productImage(productName: string): Locator {
    return this.productCard(productName).getByRole('img');
  }

  productPriceText(productName: string): Locator {
    return this.productCard(productName).getByTestId('inventory-item-price');
  }

  addToCartButton(productName: string): Locator {
    return this.productCard(productName).getByRole('button', { name: 'Add to cart' });
  }
}
```

Pola: `productCard(name)` untuk kartunya, lalu elemen di dalamnya diberi awalan konteks yang sama (`productImage`, `productPriceText`, `addToCartButton`).

### Urutan prioritas strategi locator

1. `getByRole` (dengan `name`)
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText` (untuk teks statis yang stabil)
5. `getByAltText` / `getByTitle` (gambar atau ikon)
6. `getByTestId` / `data-test` **hanya bila** 1 sampai 5 tidak memungkinkan
7. CSS atau XPath: **dihindari**

Dengan kata lain: cari elemen seperti pengguna melihatnya.

### Contoh lengkap

```ts
export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly swagLabText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.getByRole('textbox', { name: 'Username' });
    this.passwordField = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByRole('alert');
    this.swagLabText = page.getByText('Swag Labs');
  }
}
```

> Catatan: contoh ini disederhanakan dari `pages/auth/login/LoginPage.ts` yang asli. Di file aslinya tombol login sudah bernama `loginButton` (mengikuti label "Login"), dan locator pesan error memakai `getByRole('alert')`.

---

## 5. Penamaan Gherkin (feature, skenario, step)

### Feature dan skenario

- Keyword Gherkin memakai **bahasa Inggris**: `Feature`, `Scenario`, `Given`, `When`, `Then`, `And`. Jangan memakai `# language: id`.
- Judul dan isi langkah memakai **bahasa Indonesia**.
- Judul `Feature:` singkat, satu frasa: `Feature: Verifikasi Fitur Login (Authentication)`, `Feature: Keranjang Belanja`.
- Judul `Scenario:` menjelaskan **kondisi dan hasil**, diawali kata kerja/hasil yang jelas:
  - Benar: `Login gagal karena password salah`
  - Salah: `Test 1`, `Cek login`
- Pola: `<Aksi> <berhasil/gagal> <alasan/kondisi>`.

### Step

- Sudut pandang pengguna, kalimat utuh, huruf kecil di awal (kecuali nama):
  - Benar: `pengguna berada di halaman login`
  - Salah: `klik tombol xpath login`
- Nilai yang berubah-ubah dijadikan parameter dengan tanda kutip dan `{string}`: `pengguna login dengan akun "valid"`.
- Akun diacu dengan **nama** (`"valid"`, `"terkunci"`, `"password salah"`), bukan username dan password. Nilai aslinya disimpan di `.env`.
- Tidak menyebut nama elemen teknis (`id`, `class`, `xpath`) di kalimat step.
- Satu kalimat step hanya didefinisikan **sekali** dan dipakai ulang.

### Pembagian keyword

| Keyword | Dipakai untuk | Contoh |
|---|---|---|
| `Given` | kondisi awal | `pengguna berada di halaman login` |
| `When` | aksi pengguna | `pengguna login dengan akun "..."` |
| `Then` | hasil yang diharapkan | `muncul pesan error "..."` |
| `And` | lanjutan dari keyword sebelumnya | `pengguna tetap berada di halaman login` |

### Tag

Diletakkan di atas `Scenario`. Setiap skenario wajib punya ID test case `@TC-xxx` (tiga digit, urut) dan satu tag jenis `@positive` atau `@negative`. Tag jenis ditulis huruf kecil:

```gherkin
@TC-001 @positive
Scenario: Login berhasil menggunakan kredensial valid
```

Tag tambahan yang boleh dipakai bila perlu: `@smoke`, `@regression`, `@wip`.

Tag ikut menjadi bagian judul tes, sehingga bisa dipakai untuk memfilter saat menjalankan: `npx playwright test --grep "@TC-001"` atau `--grep "@negative"`.

---

## 6. Penamaan data

- File di `data/`: kebab-case, bernama sesuai isi: `users.json`, `checkout-info.json`.
- Kunci JSON: camelCase.
- Jangan menyimpan password atau token asli di repo. Data rahasia lewat `.env`.
- Akun yang dipakai skenario disimpan sebagai variabel `.env` berpola `<JENIS>_USER` dan `<JENIS>_PASSWORD`, misalnya `VALID_USER` dan `LOCKED_PASSWORD`. `.env.example` hanya berisi nama variabelnya.

```json
{
  "standardUser": { "username": "standard_user", "password": "secret_sauce" },
  "lockedUser": { "username": "locked_out_user", "password": "secret_sauce" }
}
```

(Akun di atas adalah akun demo publik milik saucedemo.com.)

---

## 7. Lokator: aturan umum

- Prioritaskan peran dan label pengguna: `getByRole`, `getByLabel`, `getByPlaceholder`.
- Gunakan `data-test` hanya bila tidak ada locator yang ramah pengguna.
- Hindari CSS atau XPath.
- Periksa elemen menggunakan `expect`, di step.
- Jangan memakai `waitForTimeout`. Playwright menunggu otomatis.

---

## 8. Checklist sebelum commit

- [ ] Nama folder kebab-case dan struktur `step-definitions/` mengikuti `features/`.
- [ ] Nama file sesuai jenisnya (`.feature`, `.steps.ts`, `...Page.ts`).
- [ ] Semua locator berakhiran jenis elemen (`Field`, `Button`, `Text`, `Card`, `Image`, dst).
- [ ] Method aksi diawali kata kerja.
- [ ] Tidak ada nama seperti `button1`, `test1`, `data`, `temp`.
- [ ] Locator hanya ada di Page Object, `expect` hanya ada di step.
- [ ] Page Object baru sudah didaftarkan di `support/fixtures.ts`.
- [ ] Setiap skenario punya tag `@TC-xxx` dan `@positive` atau `@negative`.
- [ ] Keyword Gherkin bahasa Inggris, tanpa `# language: id`.
- [ ] Tidak ada username atau password asli di file `.feature`.
- [ ] `npx bddgen` berjalan tanpa `Missing step definitions`.
