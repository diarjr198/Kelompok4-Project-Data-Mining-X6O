# Rumah Tangsel ML — Dashboard Prediksi Harga Properti

Dashboard analitik dan prediksi harga rumah Tangerang Selatan menggunakan Machine Learning.

## Repository
- GitHub: https://github.com/diarjr198/Kelompok4-Project-Data-Mining-X6O

## Demo Deployment
- Vercel: https://kelompok4-project-data-mining-x6-o.vercel.app

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom design tokens dark mode)
- **Recharts** — visualisasi data
- **Zustand** — state management + persistence
- **HistGradientBoosting** JS approximation (R² = 0.871)

## Halaman
| Route | Deskripsi |
|---|---|
| `/dashboard` | Overview statistik, chart harga per lokasi, distribusi, model metrics |
| `/data-rumah` | Tabel data dengan search, filter lokasi, sort kolom, pagination |
| `/tambah-data` | Form input data properti baru |
| `/prediksi` | Form prediksi harga dengan slider interaktif |
| `/hasil-prediksi` | Riwayat semua hasil prediksi |

## Quick Start

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Dataset
- 29.420 properti Tangerang Selatan (CSV)
- 12 kawasan: Bintaro, BSD, Gading Serpong, Serpong, Alam Sutera, dll.
- Sample 50 baris di-load client-side untuk demo

## Model
- HistGradientBoostingRegressor (scikit-learn)
- R² Score: **0.871**
- MAE: Rp 218 jt | RMSE: Rp 342 jt
- 8 features: luas_bangunan, luas_tanah, kamar_tidur, kamar_mandi, garasi, lokasi_encoded, harga_per_m2, rasio_bangunan_tanah
- Train/Test split: 80/20 (23.536 / 5.884)

## Production
Untuk prediksi via FastAPI Python backend, set `useApi = true` di `src/lib/model.ts` dan deploy endpoint `/api/predict`.
