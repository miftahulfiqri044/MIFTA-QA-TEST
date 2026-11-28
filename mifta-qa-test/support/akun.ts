// Nama akun yang dipakai di file .feature  ->  nama variabel di file .env
const akun: Record<string, { user: string; password: string }> = {
  valid: { user: 'VALID_USER', password: 'VALID_PASSWORD' },
  terkunci: { user: 'LOCKED_USER', password: 'LOCKED_PASSWORD' },
  'password salah': { user: 'WRONGPASS_USER', password: 'WRONGPASS_PASSWORD' },
};

// Mengambil username dan password dari .env berdasarkan nama akun.
// Berhenti dengan pesan jelas kalau nama akun salah ketik atau isi .env kosong.
export function ambilAkun(namaAkun: string): { username: string; password: string } {
  const variabel = akun[namaAkun];
  if (!variabel) {
    throw new Error(`Akun "${namaAkun}" tidak dikenal. Pilihan: ${Object.keys(akun).join(', ')}`);
  }

  const username = process.env[variabel.user];
  const password = process.env[variabel.password];
  if (!username || !password) {
    throw new Error(`${variabel.user} / ${variabel.password} belum diisi di file .env`);
  }

  return { username, password };
}
