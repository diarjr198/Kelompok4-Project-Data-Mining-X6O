# Tutorial Menjalankan Project UI (Lengkap)

Panduan ini untuk menjalankan aplikasi `UI` dari nol sampai siap dipakai, dari folder utama repository.

## 1. Prasyarat
Pastikan software berikut sudah terpasang:
- Node.js `>= 18.17` (disarankan Node 20 LTS)
- npm (biasanya ikut saat install Node.js)
- Terminal (macOS/Linux/Windows)

Cek versi:
```bash
node -v
npm -v
```

## 2. Masuk ke Folder Project
Dari folder utama repository:
```bash
cd UI
```

Pastikan ada file `package.json`:
```bash
ls
```

## 3. Install Dependencies
Install semua package yang dibutuhkan:
```bash
npm install
```

Tunggu sampai selesai tanpa error.

## 4. Jalankan Mode Development
Start server development:
```bash
npm run dev
```

Jika berhasil, terminal akan menampilkan URL lokal (default):
- `http://localhost:3000`

Buka URL tersebut di browser.

## 5. Verifikasi Halaman Utama
Cek route penting:
- `/dashboard`
- `/data-rumah`
- `/tambah-data`
- `/prediksi`
- `/hasil-prediksi`

Contoh:
- `http://localhost:3000/dashboard`

## 6. Cek Kualitas Kode (Wajib Sebelum Deploy/PR)
Jalankan lint:
```bash
npm run lint
```

Jalankan type check:
```bash
npm run type-check
```

Semua harus `pass`.

## 7. Build Production
Buat build production:
```bash
npm run build
```

Jika build sukses, jalankan mode production:
```bash
npm run start
```

Aplikasi akan berjalan (default) di `http://localhost:3000`.

## 8. Menghentikan Server
Di terminal server, tekan:
```bash
Ctrl + C
```

## 9. Troubleshooting Singkat
- Port 3000 terpakai: jalankan `npm run dev -- -p 3001`, lalu buka `http://localhost:3001`.
- Install gagal: hapus `node_modules` dan install ulang.
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Prediksi API backend: default project memakai mode lokal (`useApi = false` di `src/lib/model.ts`). Ubah ke `true` hanya jika endpoint `/api/predict` sudah tersedia.
