# language: id
Fitur: Detail Produk

  @TC-004 @positive
  Skenario: Membuka halaman detail produk dari halaman katalog
    Diketahui pengguna sudah login dengan username "standard_user" dan password "secret_sauce"
    Ketika pengguna membuka detail produk "Sauce Labs Backpack"
    Maka halaman detail menampilkan judul "Sauce Labs Backpack" dan harga "$29.99"
    Dan halaman detail menampilkan deskripsi produk
    Ketika pengguna kembali ke daftar produk
    Maka pengguna diarahkan ke halaman produk
