# language: id
Fitur: Side Menu

  @TC-005 @positive
  Skenario: Membuka halaman eksternal melalui side menu
    Diketahui pengguna sudah login dengan username "standard_user" dan password "secret_sauce"
    Ketika pengguna membuka side menu
    Maka menu "About" tampil di side menu
    Ketika pengguna memilih menu "About"
    Maka halaman tujuan dimuat dengan alamat yang mengandung "saucelabs.com"
