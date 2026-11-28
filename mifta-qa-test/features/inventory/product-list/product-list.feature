# language: id
Fitur: Daftar Produk

  @TC-007 @positive
  Skenario: Mengurutkan produk dari harga terendah dan menambahkannya ke keranjang
    Diketahui pengguna sudah login dengan username "standard_user" dan password "secret_sauce"
    Ketika pengguna mengurutkan produk dengan opsi "Price (low to high)"
    Maka produk terurut dari harga terendah
    Dan produk pertama adalah "Sauce Labs Onesie" dengan harga "$7.99"
    Ketika pengguna menambahkan produk pertama ke keranjang
    Maka badge keranjang menampilkan angka 1
    Ketika pengguna membuka halaman keranjang
    Maka keranjang menampilkan produk "Sauce Labs Onesie"
