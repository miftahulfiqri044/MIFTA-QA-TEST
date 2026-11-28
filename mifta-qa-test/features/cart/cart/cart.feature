# language: id
Fitur: Keranjang Belanja

  @TC-008 @positive
  Skenario: Menghapus produk dari keranjang menggunakan tombol Remove
    Diketahui pengguna sudah login dengan username "standard_user" dan password "secret_sauce"
    Dan produk "Sauce Labs Onesie" sudah ada di keranjang
    Ketika pengguna membuka halaman keranjang
    Dan pengguna menghapus produk "Sauce Labs Onesie" dari keranjang
    Maka produk "Sauce Labs Onesie" tidak ada di keranjang
    Dan badge keranjang tidak tampil
