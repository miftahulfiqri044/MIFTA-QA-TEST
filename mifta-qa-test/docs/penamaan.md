# Standar Penamaan dan Struktur Folder

## Struktur

- `features/` berisi file Gherkin (`.feature`).
- `step-definitions/` berisi implementasi step, mengikuti struktur `features/`.
- `pages/` berisi Page Object Model.
- `support/` berisi World dan hooks Cucumber.
- `data/` berisi data pendukung test.
- `docs/` berisi dokumentasi project.
- Nama folder menggunakan kebab-case.
- Nama class dan file Page Object menggunakan PascalCase dan diakhiri `Page`, misalnya `LoginPage.ts`.
- Nama file feature dan steps menggunakan kebab-case: `login.feature`, `login.steps.ts`.

## Struktur Modul

```text
features/<modul>/<menu>/<nama>.feature
step-definitions/<modul>/<menu>/<nama>.steps.ts
pages/<modul>/<menu>/<Nama>Page.ts
```

Saat ini hanya modul `auth`:

```text
features/auth/login/login.feature
step-definitions/auth/login/login.steps.ts
pages/auth/login/LoginPage.ts
```

## Lokator

- Prioritaskan peran dan label pengguna: `getByRole`, `getByLabel`, `getByPlaceholder`.
- Gunakan `data-test` hanya bila tidak ada locator yang ramah pengguna.
- Hindari CSS atau XPath.
- Periksa elemen menggunakan `expect`.
