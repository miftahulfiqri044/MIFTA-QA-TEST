Feature: Verifikasi Fitur Login (Authentication)

  @TC-001 @positive
  Scenario: Login berhasil menggunakan kredensial valid
    Given pengguna berada di halaman login
    When pengguna login dengan akun "valid"
    Then pengguna diarahkan ke halaman produk

  @TC-002 @negative
  Scenario: Login gagal menggunakan akun yang terkunci
    Given pengguna berada di halaman login
    When pengguna login dengan akun "terkunci"
    Then muncul pesan error "Sorry, this user has been locked out."
    And pengguna tetap berada di halaman login

  @TC-003 @negative
  Scenario: Login gagal menggunakan password yang salah
    Given pengguna berada di halaman login
    When pengguna login dengan akun "password salah"
    Then muncul pesan error "Username and password do not match any user in this service"
    And pengguna tetap berada di halaman login