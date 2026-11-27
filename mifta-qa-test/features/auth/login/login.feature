# language: id
Fitur: Login

  Skenario: Login berhasil dengan user standar
    Diberikan pengguna berada di halaman login
    Ketika pengguna login dengan username "standard_user" dan password "secret_sauce"
    Maka pengguna diarahkan ke halaman produk

  Skenario: Login gagal karena password salah
    Diberikan pengguna berada di halaman login
    Ketika pengguna login dengan username "standard_user" dan password "password-salah"
    Maka muncul pesan error "Username and password do not match"
    Dan pengguna tetap berada di halaman login

  Skenario: Login gagal untuk user yang terkunci
    Diberikan pengguna berada di halaman login
    Ketika pengguna login dengan username "locked_out_user" dan password "secret_sauce"
    Maka muncul pesan error "Sorry, this user has been locked out"
