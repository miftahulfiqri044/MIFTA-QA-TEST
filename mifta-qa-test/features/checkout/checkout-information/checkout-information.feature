# language: id
Fitur: Checkout - Informasi Pembeli

  @TC-009 @negative
  Skenario: Melanjutkan checkout dengan formulir data pembeli kosong
    Diketahui pengguna sudah login dengan username "standard_user" dan password "secret_sauce"
    Dan produk "Sauce Labs Onesie" sudah ada di keranjang
    Dan pengguna membuka halaman keranjang
    Ketika pengguna menekan tombol Checkout
    Dan pengguna melanjutkan checkout dengan first name "", last name "", dan postal code ""
    Maka pengguna tetap berada di halaman informasi checkout
    Dan muncul pesan error checkout "First Name is required"
