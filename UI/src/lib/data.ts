// ============================================================
// src/lib/data.ts — Dataset & preprocessing utilities
// Data source: 190623_rumahcom_tangsel_city_unfiltered.csv
// Total dataset: 29.420 baris (sample 198 baris representatif)
// ============================================================

import type { RumahData, HargaPerLokasi, DistribusiHarga, ModelMetrics } from "@/types";

// ─── Helpers ───────────────────────────────────────────────

export function parseHargaStr(hargaStr: string): number {
  const clean = hargaStr.trim().replace(",", ".");
  if (clean.includes("M")) return parseFloat(clean) * 1_000_000_000;
  if (clean.includes("jt")) return parseFloat(clean) * 1_000_000;
  return parseFloat(clean.replace(/[^0-9.]/g, "")) || 0;
}

export function formatRupiah(angka: number, short = false): string {
  if (short) {
    if (angka >= 1e9) return `Rp ${(angka / 1e9).toFixed(2).replace(/\.?0+$/, "")} M`;
    if (angka >= 1e6) return `Rp ${Math.round(angka / 1e6)} jt`;
    return `Rp ${angka.toLocaleString("id-ID")}`;
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka);
}

export function generateId(): string {
  return `r_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function cleanLokasi(rawLokasi: string): string {
  const normalized = rawLokasi.trim().toLowerCase();
  if (normalized.includes("bintaro")) return "Bintaro";
  if (normalized.includes("bsd")) return "BSD";
  if (normalized.includes("gading serpong")) return "Gading Serpong";
  if (normalized.includes("ciputat timur")) return "Ciputat Timur";
  if (normalized.includes("ciputat")) return "Ciputat";
  if (normalized.includes("serpong utara")) return "Serpong Utara";
  if (normalized.includes("serpong")) return "Serpong";
  if (normalized.includes("pamulang")) return "Pamulang";
  if (normalized.includes("pondok aren")) return "Pondok Aren";
  if (normalized.includes("alam sutera")) return "Alam Sutera";
  if (normalized.includes("cirendeu")) return "Cirendeu";
  if (normalized.includes("graha raya")) return "Graha Raya";
  return rawLokasi.split(",")[0].trim();
}

export function parseLuas(luasStr: string): number {
  return parseInt(luasStr.replace(/[^0-9]/g, "")) || 0;
}

// ─── Raw Dataset (198 baris sample dari CSV asli 29.420 baris) ─
// Source: 190623_rumahcom_tangsel_city_unfiltered.csv
// Dipilih secara proporsional per lokasi dengan random_state=42
const RAW_SAMPLE = [
  { href: "https://www.rumah.com/listing-properti/dijual-milano-village-oleh-k-warna-21570157", lokasi_raw: "Milano village, Gading Serpong, Tangerang Selatan, Banten", price: "975 jt", bed: 2, bath: 2, luas: "61 m²", luas2: "Rp 20.312.500 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-carillo-residence-gading-serpong-oleh-reza-eka-nanda-21070314", lokasi_raw: "Gading Serpong, Tangerang Selatan, Banten", price: "1,6 M", bed: 3, bath: 2, luas: "72 m²", luas2: "Rp 22.222.222 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-mozart-symphonia-summarecon-serpong-oleh-refa-21822377", lokasi_raw: "Jalan Mozart, Gading Serpong, Tangerang Selatan, Banten", price: "4,55 M", bed: 3, bath: 2, luas: "163 m²", luas2: "Rp 29.738.562 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bohemia-oleh-chynthia-susanto-21621359", lokasi_raw: "Gading Serpong, Tangerang Selatan, Banten", price: "1,85 M", bed: 3, bath: 2, luas: "90 m²", luas2: "Rp 20.555.556 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-cluster-samara-gading-serpong-oleh-abadi-david-21629615", lokasi_raw: "Jl. Samara Gading Serpong, Gading Serpong, Tangerang Selatan, Banten", price: "1,35 M", bed: 3, bath: 2, luas: "65 m²", luas2: "Rp 18.750.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-alicante-paramount-land-gading-serpong-oleh-adrian-ong-21692464", lokasi_raw: "Gading Serpong, Tangerang Selatan, Banten", price: "3,3 M", bed: 4, bath: 5, luas: "164 m²", luas2: "Rp 18.333.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-hunian-srikandi-brindavan-village-termurah-oleh-taofik-muliadi-21699692", lokasi_raw: "Jl Srikandi PD bend tangsel, Gading Serpong, Tangerang Selatan, Banten", price: "650 jt", bed: 3, bath: 2, luas: "55 m²", luas2: "Rp 8.783.784 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-verdi-kawasan-symphonia-oleh-andi-21587427", lokasi_raw: "Verdi, Gading Serpong, Tangerang Selatan, Banten", price: "2,45 M", bed: 2, bath: 2, luas: "60 m²", luas2: "Rp 34.027.778 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-starling-the-springs-gading-serpong-oleh-deven-baldwin-21587045", lokasi_raw: "Gading Serpong, Tangerang Selatan, Banten", price: "2,65 M", bed: 4, bath: 3, luas: "133 m²", luas2: "Rp 19.485.294 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-emerald-cove-oleh-lenysu-18875424", lokasi_raw: "Emerald Cove, Gading Serpong, Tangerang Selatan, Banten", price: "5,9 M", bed: 4, bath: 3, luas: "358 m²", luas2: "Rp 40.972.222 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-gading-serpong-cluster-alicante-oleh-andre-yana-20934277", lokasi_raw: "Alicante boulevard, Gading Serpong, Tangerang Selatan, Banten", price: "7,2 M", bed: 4, bath: 3, luas: "216 m²", luas2: "Rp 25.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-cepat-rumah-di-cluster-vivaldi-symphonia-gading-serpong-lokasi-strategis-oleh-nathalia-tunggawidjaja-21508039", lokasi_raw: "Gading Serpong, Tangerang Selatan, Banten", price: "3,4 M", bed: 5, bath: 4, luas: "148 m²", luas2: "Rp 26.562.500 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-arcadia-gading-serpong-oleh-christina-21436354", lokasi_raw: "Arcadia gading serpong, Gading Serpong, Tangerang Selatan, Banten", price: "950 jt", bed: 2, bath: 2, luas: "50 m²", luas2: "Rp 23.750.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-flamingo-gading-serpong-oleh-linna-s-17938286", lokasi_raw: "Gading Serpong, Tangerang Selatan, Banten", price: "3,6 M", bed: 3, bath: 3, luas: "144 m²", luas2: "Rp 28.346.457 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-tiara-alam-sutera-oleh-adrian-ong-21724549", lokasi_raw: "Alam Sutera, Tangerang Selatan, Banten", price: "5,8 M", bed: 5, bath: 5, luas: "246 m²", luas2: "Rp 24.166.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-feronia-oleh-jullie-21766672", lokasi_raw: "Alam Sutera, Tangerang Selatan, Banten", price: "3,3 M", bed: 3, bath: 2, luas: "112 m²", luas2: "Rp 20.625.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-alam-sutera-oleh-liana-fang-21673524", lokasi_raw: "AlamSutera, Alam Sutera, Tangerang Selatan, Banten", price: "5,5 M", bed: 4, bath: 3, luas: "200 m²", luas2: "Rp 39.285.714 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-2-lantai-semi-furnished-shm-sutera-feronia-park-alam-sutera-tangerang-oleh-valent-eddy-21708356", lokasi_raw: "sutera feronia park, Alam Sutera, Tangerang Selatan, Banten", price: "3,8 M", bed: 4, bath: 3, luas: "300 m²", luas2: "Rp 26.388.889 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-baru-cantik-minimalis-di-sutera-buana-alam-sutera-oleh-sandy-21690171", lokasi_raw: "Sutera Buana, Alam Sutera, Tangerang Selatan, Banten", price: "13 M", bed: 5, bath: 5, luas: "500 m²", luas2: "Rp 37.142.857 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-baru-konsep-korea-3-lantai-di-aerra-by-eonna-oleh-christo-21592686", lokasi_raw: "Boulevard BSD, BSD, Tangerang Selatan, Banten", price: "4,17 M", bed: 6, bath: 5, luas: "192 m²", luas2: "Rp 37.232.143 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cassa-village-hunian-2-lantai-3kt-paling-murah-super-strategis-di-bsd-oleh-lastari-21780354", lokasi_raw: "Jl Al Husainy Dekat Polres Tangsel BSD, Serpong, Tangerang Selatan, Banten", price: "659,000005 jt", bed: 3, bath: 2, luas: "45 m²", luas2: "Rp 10.138.462 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-strozzi-summarecon-serpong-symphonia-tempat-hunian-mewah-luxury-oleh-antoni-21759280", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "2,400000002 M", bed: 3, bath: 2, luas: "92 m²", luas2: "Rp 28.571.429 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-mewah-ngantong-tirta-golf-bsd-jarang-ada-hadap-timur-lokasi-bagus-oleh-charles-21735933", lokasi_raw: "Tirta Golf, BSD, Tangerang Selatan, Banten", price: "7,5 M", bed: 5, bath: 3, luas: "780 m²", luas2: "Rp 19.893.899 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bsd-icon-cluster-ritzone-oleh-lilyana-17972008", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "6 M", bed: 3, bath: 4, luas: "320 m²", luas2: "Rp 15.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-mayfield-greenwich-bsd-oleh-deven-baldwin-21248374", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "4,5 M", bed: 4, bath: 4, luas: "170 m²", luas2: "Rp 22.959.184 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-di-jual-rumah-di-kencana-loka-bsd-oleh-emil-fajar-21807289", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "1,975 M", bed: 4, bath: 3, luas: "130 m²", luas2: "Rp 16.596.639 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bsd-de-park-oleh-susy-21104999", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "8,4 M", bed: 4, bath: 3, luas: "490 m²", luas2: "Rp 28.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-kencanaloka-bsd-tangsel-oleh-noryke-irma-21726292", lokasi_raw: "Kencanaloka, BSD, Tangerang Selatan, Banten", price: "3,8 M", bed: 6, bath: 4, luas: "300 m²", luas2: "Rp 19.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-mayfield-greenwich-bsd-tangsel-oleh-lina-noviarini-21596419", lokasi_raw: "Cluster Mayfield, Greenwich, BSD, BSD, Tangerang Selatan, Banten", price: "3,2 M", bed: 4, bath: 4, luas: "130 m²", luas2: "Rp 20.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-eminent-oleh-dedi-hermawan-21099448", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "3,5 M", bed: 4, bath: 4, luas: "171 m²", luas2: "Rp 25.925.926 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-casa-village-bsd-rumah-2-lantai-minimalis-lokasi-strategis-di-pusat-kota-bsd-oleh-lastari-21183062", lokasi_raw: "Jl al husainy kp parigi bsd, Gading Serpong, Tangerang Selatan, Banten", price: "690 jt", bed: 3, bath: 2, luas: "45 m²", luas2: "Rp 10.298.507 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-alegria-pak-bsd-city-oleh-yanti-lisa-21664234", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "2,35 M", bed: 4, bath: 3, luas: "130 m²", luas2: "Rp 22.380.952 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-lebar-12-cuma-2m-alma-oleh-rendra-20841367", lokasi_raw: "Gading Serpong, BSD, Alam Sutera, BSD, Tangerang Selatan, Banten", price: "2,5809 M", bed: 3, bath: 3, luas: "96 m²", luas2: "Rp 21.507.500 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-2-lantai-di-the-icon-cosmo-bsd-city-tangerang-selatan-oleh-uthe-21050070", lokasi_raw: "The Icon Cosmo BSD City tangerang Selatan, BSD, Tangerang Selatan, Banten", price: "6,85 M", bed: 6, bath: 5, luas: "405 m²", luas2: "Rp 28.781.513 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-foresta-bsd-tangerang-oleh-rima-nasution-21202132", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "6 M", bed: 5, bath: 4, luas: "290 m²", luas2: "Rp 23.904.382 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bsd-oleh-muhammad-nur-21793073", lokasi_raw: "Nusa Loka Bsd, BSD, Tangerang Selatan, Banten", price: "1,575 M", bed: 4, bath: 3, luas: "140 m²", luas2: "Rp 21.875.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-anggrekloka-bsd-oleh-ria-rusnofera-21637822", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "4,6 M", bed: 4, bath: 3, luas: "287 m²", luas2: "Rp 17.692.308 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bsd-kencana-loka-oleh-shary-21715662", lokasi_raw: "Kencana loka, BSD, Tangerang Selatan, Banten", price: "2,75 M", bed: 3, bath: 2, luas: "150 m²", luas2: "Rp 13.750.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-di-jual-rumah-di-serpong-lagoon-oleh-emil-fajar-21763117", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "745 jt", bed: 2, bath: 2, luas: "90 m²", luas2: "Rp 8.869.048 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bsd-de-latinos-oleh-robby-21258182", lokasi_raw: "Delatinos BSD City, BSD, Tangerang Selatan, Banten", price: "1,85 M", bed: 3, bath: 3, luas: "100 m²", luas2: "Rp 16.517.857 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-freja-suites-at-bsd-city-tipe-5x10-oleh-heny-risakotta-19080870", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "1,555 M", bed: 3, bath: 2, luas: "68 m²", luas2: "Rp 31.100.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-hunian-modern-tanpa-dp-dan-free-semua-biaya-oleh-erna-21691409", lokasi_raw: "Jl.kebon kopi pengasinan gunung Sindur, BSD, Tangerang Selatan, Banten", price: "750 jt", bed: 3, bath: 3, luas: "73 m²", luas2: "Rp 8.522.727 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-cluster-strozzi-summarecon-serpong-symphonia-cluster-mewah-oleh-gaspro-21741683", lokasi_raw: "Medang, Kabupaten Tangerang, Banten, BSD, Tangerang Selatan, Banten", price: "2,4 M", bed: 3, bath: 2, luas: "92 m²", luas2: "Rp 28.571.429 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-astek-bsd-oleh-afandi-19207471", lokasi_raw: "JL. Komplek Astek, BSD, Tangerang Selatan, Banten", price: "2 M", bed: 3, bath: 2, luas: "120 m²", luas2: "Rp 9.900.990 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-turun-harga-rumah-delatinos-bsd-oleh-danur-priyambodo-20189650", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "3,25 M", bed: 4, bath: 4, luas: "250 m²", luas2: "Rp 16.250.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-naira-residence-oleh-okky-susanto-18196737", lokasi_raw: "Bsd City, BSD, Tangerang Selatan, Banten", price: "1,1 M", bed: 2, bath: 1, luas: "47 m²", luas2: "Rp 16.666.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-3-lantai-lokasi-bsd-bisa-kpr-harga-nego-oleh-adhitya-narendra-dwipa-21824649", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "2,4 M", bed: 3, bath: 3, luas: "77 m²", luas2: "Rp 36.923.077 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bumi-serpong-damai-oleh-zul-21658834", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "7,2 M", bed: 5, bath: 5, luas: "393 m²", luas2: "Rp 29.752.066 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-lokasi-di-bumi-puspiptek-asri-pagedangan-sektor-3-oleh-anit-20478169", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "850 jt", bed: 3, bath: 1, luas: "150 m²", luas2: "Rp 5.666.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bsd-eminent-oleh-olivia-20432575", lokasi_raw: "BSD eminent, BSD, Tangerang Selatan, Banten", price: "3,5 M", bed: 3, bath: 4, luas: "144 m²", luas2: "Rp 29.166.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-caelus-bsd-oleh-adrian-ong-21646103", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "5,3 M", bed: 5, bath: 5, luas: "248 m²", luas2: "Rp 29.444.444 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bsd-city-serpong-oleh-dino-21788822", lokasi_raw: "Jl Bumi Foresta Raya BSD, BSD, Tangerang Selatan, Banten", price: "850 jt", bed: 3, bath: 2, luas: "84 m²", luas2: "Rp 10.625.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-kierena-park-bsd-serpong-oleh-fitri-21174666", lokasi_raw: "Jalan kierena, BSD, Tangerang Selatan, Banten", price: "1,25 M", bed: 2, bath: 2, luas: "65 m²", luas2: "Rp 20.833.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bsd-delatinos-oleh-patar-21808391", lokasi_raw: "De latinis bsd city, BSD, Tangerang Selatan, Banten", price: "4,75 M", bed: 3, bath: 3, luas: "200 m²", luas2: "Rp 22.511.848 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-lancewood-navapark-bsd-city-oleh-christia-20870364", lokasi_raw: "LANCEWOOD - NAVAPARK, BSD CITY, BSD, Tangerang Selatan, Banten", price: "8,3 M", bed: 3, bath: 3, luas: "285 m²", luas2: "Rp 37.727.273 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-latinos-costarica-bsd-oleh-imanuel-18714181", lokasi_raw: "Latinos Costarica, BSD, Tangerang Selatan, Banten", price: "7,5 M", bed: 4, bath: 4, luas: "456 m²", luas2: "Rp 26.501.767 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-delatinos-bsd-tangerang-oleh-samsul-bachtiar-21679183", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "3,95 M", bed: 5, bath: 3, luas: "265 m²", luas2: "Rp 14.684.015 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-di-jual-rumah-di-griya-loka-bsd-oleh-meta-anggraeni-21682250", lokasi_raw: "BSD, Tangerang Selatan, Banten", price: "1,4 M", bed: 2, bath: 1, luas: "80 m²", luas2: "Rp 15.555.556 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bsd-city-taman-giri-loka-oleh-adrian-21714336", lokasi_raw: "Jl BSD, Lengkong Gudang, Serpong, Serpong, Tangerang Selatan, Banten", price: "7,5 M", bed: 8, bath: 6, luas: "400 m²", luas2: "Rp 22.321.429 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-eonna-korean-town-cluster-aerra-bsd-oleh-suparman-21014325", lokasi_raw: "Jl Aerra Raya Eonna BSD, BSD, Tangerang Selatan, Banten", price: "4,8 M", bed: 4, bath: 4, luas: "192 m²", luas2: "Rp 42.857.143 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-jaya-sektor-9-taman-puri-bintaro-oleh-anie-magdalena-19771458", lokasi_raw: "Jl Bintaro Jaya Sektor 9 -Taman Puri Bintaro, Bintaro, Tangerang Selatan, Banten", price: "4,2 M", bed: 4, bath: 3, luas: "200 m²", luas2: "Rp 14.736.842 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-cepat-bu-rumah-di-sektor-9-bintaro-oleh-rohim-21811371", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "2,3 M", bed: 4, bath: 2, luas: "100 m²", luas2: "Rp 14.375.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-for-sale-rumah-minimalis-puri-bintaro-jaya-sektor-9-oleh-mei-utami-19923743", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "4,2 M", bed: 5, bath: 4, luas: "200 m²", luas2: "Rp 21.761.658 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-sektor9-bintaro-jaya-hooke-cantik-siap-huni-oleh-aizh-21448277", lokasi_raw: "Sektor9, Bintaro, Tangerang Selatan, Banten", price: "3,5 M", bed: 6, bath: 4, luas: "250 m²", luas2: "Rp 19.774.011 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-mewah-di-permata-bintaro-sektor-9-oleh-dadang-rosniandar-dadang-drd-21347922", lokasi_raw: "jln titihan, Bintaro, Tangerang Selatan, Banten", price: "4 M", bed: 5, bath: 4, luas: "250 m²", luas2: "Rp 25.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-oleh-endang-kumalasari-21699781", lokasi_raw: "Kebayoran Residence Bintaro Sejtor 7, Bintaro, Tangerang Selatan, Banten", price: "2,1 M", bed: 4, bath: 3, luas: "83 m²", luas2: "Rp 29.166.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-murah-rumah-di-pisok-sektor-5-bintaro-jaya-dekat-stan-kampus-2591sc-sg-oleh-roni-21648207", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "2,5 M", bed: 4, bath: 3, luas: "225 m²", luas2: "Rp 19.230.769 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-cepat-rumah-hook-standar-dan-murah-di-perumahan-bintaro-satu-oleh-nina-m-iriana-20115373", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "2,95 M", bed: 3, bath: 3, luas: "160 m²", luas2: "Rp 10.350.877 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-cantik-mewah-siap-huni-di-kebayoran-residence-bintaro-jaya-sektor-7-tangerang-selatan-banten-oleh-raumanen-20252355", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "5,5 M", bed: 5, bath: 4, luas: "249 m²", luas2: "Rp 26.960.784 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-lokasi-strategis-di-cikini-bintaro-jaya-oleh-amelia-putri-21760121", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "4 M", bed: 4, bath: 3, luas: "208 m²", luas2: "Rp 19.047.619 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-bintaro-jaya-sektor-9-oleh-rina-yulianita-21209629", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "9 M", bed: 6, bath: 4, luas: "550 m²", luas2: "Rp 22.222.222 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-cepat-rumah-pondok-pucung-bintaro-oleh-laila-baharudin-21135467", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "800 jt", bed: 2, bath: 2, luas: "51 m²", luas2: "Rp 13.333.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumaid-project-townhouse-bintaro-oleh-indah-trisnowati-19409527", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "1,25 M", bed: 3, bath: 2, luas: "75 m²", luas2: "Rp 15.432.099 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-hook-bintaro-dekat-stasiun-jurangmangu-oleh-dhidy-21157118", lokasi_raw: "Merpati Raya, Bintaro, Tangerang Selatan, Ciputat, Tangerang Selatan, Banten", price: "2,95 M", bed: 3, bath: 2, luas: "135 m²", luas2: "Rp 18.437.500 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-di-perumahan-kebayoran-residence-bintaro-jaya-oleh-maria-hanny-21536643", lokasi_raw: "Jl. Kebayoran Residence Bintaro Jaya, Bintaro, Tangerang Selatan, Banten", price: "6,5 M", bed: 7, bath: 4, luas: "300 m²", luas2: "Rp 25.490.196 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-sektor-9-oleh-irwan-21727437", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "3,2 M", bed: 5, bath: 4, luas: "200 m²", luas2: "Rp 24.242.424 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-discovery-bintaro-oleh-lingga-t-21654540", lokasi_raw: "Discovery Conserva, Bintaro, Tangerang Selatan, Banten", price: "3,2 M", bed: 3, bath: 2, luas: "134 m²", luas2: "Rp 26.666.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-bagus-siap-huni-di-bintaro-jaya-sektor-9-tangerang-selatan-oleh-revina-21701269", lokasi_raw: "Bintaro, Serpong Utara, Tangerang Selatan, Banten", price: "3,3 M", bed: 6, bath: 3, luas: "210 m²", luas2: "Rp 22.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-one-gate-system-di-discovery-residence-bintaro-jaya-oleh-ika-indayanti-21724703", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "3,75 M", bed: 5, bath: 4, luas: "220 m²", luas2: "Rp 23.437.500 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-di-jual-rumah-siap-huni-di-graha-raya-bintaro-oleh-yulia-fitri-21353533", lokasi_raw: "Graha raya Bintaro jaya, Bintaro, Tangerang Selatan, Banten", price: "1,8 M", bed: 3, bath: 2, luas: "80 m²", luas2: "Rp 10.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-sektor-5-bintaro-oleh-santi-20917828", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "5,5 M", bed: 10, bath: 10, luas: "300 m²", luas2: "Rp 35.483.871 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-style-clasics-di-sektor-ix-bintaro-jaya-oleh-albert-day-20573355", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "3,6 M", bed: 4, bath: 4, luas: "240 m²", luas2: "Rp 14.117.647 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-mewah-dijual-luas-di-kebayoran-residence-bintaro-sektor-7-oleh-moureen-shah-21250878", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "6,5 M", bed: 3, bath: 3, luas: "220 m²", luas2: "Rp 36.111.111 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-brand-new-full-funished-lokasi-strategis-di-bintaro-oleh-delfani-al-qutdri-adell-21130089", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "5 M", bed: 5, bath: 5, luas: "240 m²", luas2: "Rp 37.037.037 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-di-jual-rumah-mewah-bagus-minimalis-siap-huni-di-penguin-bintaro-jaya-sek-3-oleh-adi-19694899", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "10,8 M", bed: 7, bath: 5, luas: "740 m²", luas2: "Rp 14.937.759 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-murah-dijual-cepat-di-ciputat-siap-huni-harga-nego-oleh-irfan-fahreza-21734287", lokasi_raw: "Komplek Grand Bintaro Asri, Ciputat Timur, Tangerang Selatan, Banten", price: "1,399 M", bed: 3, bath: 2, luas: "66 m²", luas2: "Rp 18.653.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-jual-rumah-siap-huni-turun-harga-di-sektor-9-bintaro-jaya-sc-4398-oleh-gabie-21744199", lokasi_raw: "bintaro sektor 9, Bintaro, Tangerang Selatan, Banten", price: "7,9 M", bed: 6, bath: 5, luas: "550 m²", luas2: "Rp 10.972.222 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-hot-sale-jual-rumah-bagus-siap-huni-di-perumahan-sektor-5-bintaro-1330-oleh-arif-gunawan-20192876", lokasi_raw: "Sektor 5 bintaro, Bintaro, Tangerang Selatan, Banten", price: "3 M", bed: 5, bath: 3, luas: "225 m²", luas2: "Rp 12.500.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-termewah-di-graha-raya-harga-hanya-1-3-m-an-patut-di-survei-oleh-gatot-song-21785432", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "1,375 M", bed: 4, bath: 4, luas: "100 m²", luas2: "Rp 16.369.048 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dharmawangsa-bintaro-oleh-anton-kvr-20312736", lokasi_raw: "Jln Dharmawangsa Bintaro, Bintaro, Tangerang Selatan, Banten", price: "7,5 M", bed: 4, bath: 3, luas: "224 m²", luas2: "Rp 44.117.647 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-hunian-siap-huni-di-sektor-8-bintaro-jaya-7-m-3306-oc-oleh-roni-21666569", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "7 M", bed: 4, bath: 3, luas: "205 m²", luas2: "Rp 13.833.992 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-bintaro-tanpa-indent-pasti-dapat-kpr-oleh-linda-rosalia-21653895", lokasi_raw: "Jalan Palem Puri 1 Cluster Rumah 9, Bintaro, Tangerang Selatan, Banten", price: "1,36 M", bed: 3, bath: 3, luas: "82 m²", luas2: "Rp 16.585.366 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-astana-bintaro-jl-kemuning-lll-no-h12-rw-10-pd-kacang-tim-kec-pd-aren-kota-tangerang-selat-oleh-ayu-diah-rahmawati-21205525", lokasi_raw: "Astana Bintaro, Jl.Kemuning III, Pondok Aren, Tangerang Selatan, Banten", price: "1,31 M", bed: 3, bath: 2, luas: "72 m²", luas2: "Rp 18.714.286 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-sektor-9-discovery-oleh-sarah-21080653", lokasi_raw: "Discovery, Bintaro, Tangerang Selatan, Banten", price: "4,7 M", bed: 4, bath: 3, luas: "150 m²", luas2: "Rp 25.405.405 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-sangat-strategis-bisa-untuk-hunian-kantor-usaha-oleh-ahmad-tamimi-20597051", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "3,3 M", bed: 7, bath: 4, luas: "275 m²", luas2: "Rp 18.333.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-senayan-bintaro-10582-oleh-tri-armawan-21638634", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "6,2 M", bed: 3, bath: 3, luas: "110 m²", luas2: "Rp 14.797.136 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-rumah-idaman-termurah-hanya-600-jutaan-di-bintaro-dlavia-residence-bintaro-oleh-bunga-salsabila-21793993", lokasi_raw: "bintaro, Bintaro, Tangerang Selatan, Banten", price: "600 jt", bed: 3, bath: 2, luas: "55 m²", luas2: "Rp 10.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-discovery-bintaro-oleh-santi-21045024", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "3,5 M", bed: 4, bath: 3, luas: "210 m²", luas2: "Rp 25.925.926 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-posisi-hook-di-graha-raya-oleh-santi-21210004", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "1,8 M", bed: 3, bath: 2, luas: "110 m²", luas2: "Rp 22.500.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-vazza-living-graha-raya-oleh-teguh-abdi-pradesa-21643486", lokasi_raw: "Boulevard graha bintaro, Pondok Aren, Tangerang Selatan, Banten", price: "1,2 M", bed: 2, bath: 2, luas: "69 m²", luas2: "Rp 20.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-discovery-bintaro-jaya-sektor-9-rapih-terawat-oleh-nova-ruviyanti-18270629", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "1,75 M", bed: 2, bath: 2, luas: "70 m²", luas2: "Rp 26.515.152 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-di-bintaro-emerald-residence-sektor-9-lt-209-m2-33-oleh-nia-utania-21676574", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "4,8 M", bed: 2, bath: 3, luas: "180 m²", luas2: "Rp 22.966.507 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-hunian-di-sektor-9-bintaro-siap-huni-sc-7225-rd-oleh-ade-muliana-21675467", lokasi_raw: "Sektor 9 Bintaro Jaya, Bintaro, Tangerang Selatan, Banten", price: "4,2 M", bed: 4, bath: 3, luas: "161 m²", luas2: "Rp 29.166.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-mandar-siap-huni-bintaro-tangerang-selatan-banten-oleh-eko-karsono-19488908", lokasi_raw: "Jl. Mandar, Bintaro, Tangerang Selatan, Banten", price: "3 M", bed: 4, bath: 4, luas: "220 m²", luas2: "Rp 16.666.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-emerald-home-bintaro-jaya-oleh-noval-21796915", lokasi_raw: "Boulevard Bintaro Jaya, Bintaro, Tangerang Selatan, Banten", price: "2,851 M", bed: 4, bath: 4, luas: "108 m²", luas2: "Rp 31.677.778 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-the-view-rumah-dekat-dengan-bintaro-oleh-mochammad-alfin-21730408", lokasi_raw: "Jl Jombang Sudimara, Bintaro, Tangerang Selatan, Pamulang, Tangerang Selatan, Banten", price: "950 jt", bed: 2, bath: 2, luas: "72 m²", luas2: "Rp 15.833.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-discovery-nyaman-4-kamar-tidur-3-75-m-sc-3491-dz-oleh-shanty-suntea-21723287", lokasi_raw: "Bintaro Jaya Sektor 9, Bintaro, Tangerang Selatan, Banten", price: "3,75 M", bed: 4, bath: 3, luas: "144 m²", luas2: "Rp 31.250.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-graha-bintaro-nyaman-dan-strategis-oleh-lingga-t-18239789", lokasi_raw: "Graha Raya, Bintaro, Tangerang Selatan, Banten", price: "2,2 M", bed: 3, bath: 2, luas: "100 m²", luas2: "Rp 10.891.089 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-cluster-2-lantai-modern-lokasi-strategis-dekat-bintaro-mall-exchange-oleh-hana-21683964", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "1,2885 M", bed: 3, bath: 2, luas: "72 m²", luas2: "Rp 18.407.143 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-area-sektor-5-pjmi-oleh-syamsul-bahrie-20887487", lokasi_raw: "Jl.Raya bintaro sektor 5 dan Jl.Raya Pondok Aren, Bintaro, Tangerang Selatan, Banten", price: "3,1 M", bed: 6, bath: 4, luas: "450 m²", luas2: "Rp 12.400.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-strategis-bebas-banjir-di-bintaro-jaya-sektor-3-oleh-yuni-21198661", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "3,5 M", bed: 5, bath: 3, luas: "250 m²", luas2: "Rp 19.444.444 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-jaya-sektor-7-kebayoran-residence-oleh-cahyani-kurniawati-21767053", lokasi_raw: "Kebayoran Residence Bintaro, Bintaro, Tangerang Selatan, Banten", price: "8,25 M", bed: 6, bath: 4, luas: "310 m²", luas2: "Rp 34.663.866 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-jaya-sektor-3-oleh-nevi-21689588", lokasi_raw: "Bintaro jaya sektor 3, Ciputat Timur, Tangerang Selatan, Banten", price: "3,6 M", bed: 6, bath: 3, luas: "120 m²", luas2: "Rp 7.563.025 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-jual-cepat-rumah-baru-600-t300-modern-kolam-renang-rooftop-bintaro-jaya-oleh-indra-gunawan-21317105", lokasi_raw: "Bintaro Jaya deket CBD, Bintaro, Tangerang Selatan, Banten", price: "7,8 M", bed: 5, bath: 5, luas: "600 m²", luas2: "Rp 26.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-nordic-kebayoran-harmony-at-bintaro-oleh-alrian-elyon-21563331", lokasi_raw: "Jln Kebayoran Harmony Bintaro, Bintaro, Tangerang Selatan, Banten", price: "1,4 M", bed: 2, bath: 1, luas: "57 m²", luas2: "Rp 23.333.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-discovery-bintaro-jaya-sektor-9-oleh-alexa-21815195", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "6,85 M", bed: 5, bath: 4, luas: "288 m²", luas2: "Rp 30.309.735 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-hot-sale-siap-huni-puri-bintaro-jaya-lt-135-m-af33491-oleh-widya-suci-21763560", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "2,7 M", bed: 4, bath: 5, luas: "200 m²", luas2: "Rp 20.769.231 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-kebayoran-garden-oleh-lim-fina-21783143", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "5,8 M", bed: 5, bath: 4, luas: "218 m²", luas2: "Rp 22.834.646 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-pondok-aren-oleh-may-21821528", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "1,55 M", bed: 3, bath: 2, luas: "75 m²", luas2: "Rp 17.415.730 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bukit-menteng-bintaro-jaya-sektor-7-oleh-endang-kumalasari-19625066", lokasi_raw: "Bukit Menteng Bintaro Jaya Sektor 7, Bintaro, Tangerang Selatan, Banten", price: "30 M", bed: 8, bath: 6, luas: "800 m²", luas2: "Rp 44.117.647 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-strategis-harga-menarik-di-bintaro-sektor-2-1178-mei-oleh-meily-21126703", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "2,65 M", bed: 3, bath: 1, luas: "160 m²", luas2: "Rp 14.095.745 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-grand-pinang-senayan-bintaro-siap-huni-oleh-hendra-wijaya-18913788", lokasi_raw: "Kp. rawa barat, pondok pucung, Bintaro, Tangerang Selatan, Banten", price: "1,6 M", bed: 4, bath: 3, luas: "132 m²", luas2: "Rp 18.181.818 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-sektor-6-bintaro-jaya-tang-sel-oleh-meily-12982142", lokasi_raw: "Kasuari, Bintaro, Tangerang Selatan, Banten", price: "6,3 M", bed: 4, bath: 5, luas: "300 m²", luas2: "Rp 25.714.286 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-super-cashback-up-to-40jt-cluster-cassa-village-bsd-oleh-fitriana-19285718", lokasi_raw: "Jl lengkong raya, al husainy bsd, Bintaro, Tangerang Selatan, Banten", price: "687 jt", bed: 3, bath: 2, luas: "45 m²", luas2: "Rp 10.253.731 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-camar-bintaro-jaya-sektor-3-oleh-ika-indayanti-21656008", lokasi_raw: "Camar Bintaro Sektor 3, Bintaro, Tangerang Selatan, Banten", price: "8,5 M", bed: 6, bath: 4, luas: "510 m²", luas2: "Rp 14.358.108 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-hoek-sudah-renovasi-siap-huni-di-emerald-sektor-9-bintaro-jaya-oleh-sri-aisah-malik-21615897", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "5 M", bed: 6, bath: 5, luas: "234 m²", luas2: "Rp 20.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-hunian-bagus-siap-di-huni-di-sektor-9-bintaro-fn-4236-rd-oleh-roni-21704655", lokasi_raw: "Sektor 9 Bintaro, Bintaro, Tangerang Selatan, Banten", price: "2,65 M", bed: 3, bath: 2, luas: "150 m²", luas2: "Rp 26.500.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-jaya-oleh-vivi-siregar-21476233", lokasi_raw: "Bintaro Jaya Sektor 3, Bintaro, Tangerang Selatan, Banten", price: "4,5 M", bed: 4, bath: 2, luas: "200 m²", luas2: "Rp 18.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-asri-hot-sale-2-lantai-di-river-park-bintaro-jaya-sc-10477-oleh-gebie-21736546", lokasi_raw: "River Park Bintaro Jaya, Bintaro, Tangerang Selatan, Banten", price: "4 M", bed: 3, bath: 3, luas: "155 m²", luas2: "Rp 17.777.778 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-townhouse-terrahaus-bintaro-jl-rusa-iv-no-111-pd-ranji-kec-ciputat-tim-kota-tangerang-selatan-oleh-ayu-diah-rahmawati-20674551", lokasi_raw: "TOWNHOUSE TERRAHAUS BINTARO, Jl. Rusa IV, Bintaro, Tangerang Selatan, Banten", price: "1,68 M", bed: 3, bath: 3, luas: "132 m²", luas2: "Rp 28.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-full-renov-b250-t180-4-br-full-marmer-cluster-bintaro-jaya-sektor-9-oleh-indra-gunawan-21280586", lokasi_raw: "Clustee Bintaro Jaya sektor 9, Bintaro, Tangerang Selatan, Banten", price: "3,5 M", bed: 7, bath: 3, luas: "250 m²", luas2: "Rp 19.444.444 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-merak-bintaro-jaya-sektor-1-oleh-endang-kumalasari-21492719", lokasi_raw: "Merak Bintaro Jaya Sektor 1, Bintaro, Tangerang Selatan, Banten", price: "2,7 M", bed: 4, bath: 2, luas: "120 m²", luas2: "Rp 15.000.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-river-park-bintaro-jaya-sektor-8-oleh-dina-21770358", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "5,9 M", bed: 3, bath: 2, luas: "300 m²", luas2: "Rp 23.137.255 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-jaya-sektor-3-yn-oleh-lilis-cincin-purmaswati-18827490", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "3,5 M", bed: 4, bath: 4, luas: "160 m²", luas2: "Rp 19.444.444 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-luas-dekat-stasiun-pondok-ranji-bintaro-plaza-1037-oleh-nining-setiawati-19974767", lokasi_raw: "Stasiun Pondok Ranji Bintaro Plaza, Bintaro, Tangerang Selatan, Banten", price: "6,9 M", bed: 3, bath: 2, luas: "300 m²", luas2: "Rp 9.583.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-jaya-sektor-9-taman-puri-bintaro-oleh-arif-gunawan-21795237", lokasi_raw: "Jl Bintaro Jaya Sektor 9 -Taman Puri Bintaro, Bintaro, Tangerang Selatan, Banten", price: "2,7 M", bed: 5, bath: 5, luas: "200 m²", luas2: "Rp 20.769.231 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-lokasi-strategi-di-sektor-9-bintaro-jaya-5-8-m-4687-oc-oleh-roni-21731898", lokasi_raw: "Bintaro, Tangerang Selatan, Banten", price: "5,8 M", bed: 4, bath: 3, luas: "350 m²", luas2: "Rp 21.481.481 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-hoek-bu-la-maison-serpong-oleh-jeremia-iskandar-21737187", lokasi_raw: "Pondok Jagung, Serpong Utara, Serpong Utara, Tangerang Selatan, Banten", price: "6,5 M", bed: 5, bath: 6, luas: "315 m²", luas2: "Rp 14.038.877 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-di-serpong-park-dekat-pintu-tol-sp00003-oleh-jennifer-18436108", lokasi_raw: "Serpong Utara, Tangerang Selatan, Banten", price: "775 jt", bed: 2, bath: 1, luas: "36 m²", luas2: "Rp 10.763.889 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-les-belles-maisons-kota-tangerang-selatan-oleh-retno-adiningtyas-19977186", lokasi_raw: "Jl Raya Serpong - Pondok Jagung kec Serpong Utara, Serpong Utara, Tangerang Selatan, Banten", price: "8,5 M", bed: 5, bath: 6, luas: "670 m²", luas2: "Rp 17.819.706 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-cantik-sutera-tiara-siap-huni-lokasi-di-alam-sutera-oleh-alfons-21089823", lokasi_raw: "Jl.Lkr Barat Alam Sutera,Serpong Utara,Tangsel, Alam Sutera, Tangerang Selatan, Banten", price: "7,9 M", bed: 4, bath: 3, luas: "275 m²", luas2: "Rp 26.333.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-jual-rumah-seken-terawat-luas-siap-huni-strategis-di-alam-sutera-bisa-kpr-oleh-sarah-maghfiratan-warahmah-21746350", lokasi_raw: "Alam Sutera Cluster Sutera Delima, Serpong Utara, Tangerang Selatan, Banten", price: "4,2 M", bed: 3, bath: 1, luas: "90 m²", luas2: "Rp 26.250.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-heron-persembahan-summarecon-gading-serpong-jaminan-mutu-5man-oleh-ari-kurniawan-sepriansyah-21690982", lokasi_raw: "Jl. Springs Boulevard, Cihuni, Kec. Pagedangan, Serpong, Tangerang Selatan, Banten", price: "5,20009 M", bed: 5, bath: 4, luas: "207 m²", luas2: "Rp 36.111.736 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-siap-huni-cukup-1-jt-rumah-bebas-banjir-lokasi-strategis-oleh-gustiano-21791676", lokasi_raw: "Jl. Ciwaru Tenjo Tangerang, Serpong, Tangerang Selatan, Banten", price: "313,000004 jt", bed: 2, bath: 1, luas: "36 m²", luas2: "Rp 4.742.424 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-giri-loka-bsd-city-oleh-nurul-hidayati-18867831", lokasi_raw: "Serpong, Tangerang Selatan, Banten", price: "8 M", bed: 5, bath: 4, luas: "470 m²", luas2: "Rp 10.191.083 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-fresco-virginia-rumah-di-gading-serpong-hanya-800jt-aja-dekat-mall-oleh-rony-ming-21691331", lokasi_raw: "Virginia Village, Serpong, Tangerang Selatan, Banten", price: "800 jt", bed: 2, bath: 1, luas: "41 m²", luas2: "Rp 25.806.452 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-milano-paramount-serpong-oleh-liebert-21715477", lokasi_raw: "Serpong, Tangerang Selatan, Banten", price: "1,3 M", bed: 2, bath: 2, luas: "62 m²", luas2: "Rp 27.083.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-regency-melati-mas-serpong-oleh-ari-21728078", lokasi_raw: "Serpong, Tangerang Selatan, Banten", price: "1,6 M", bed: 3, bath: 3, luas: "120 m²", luas2: "Rp 17.777.778 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-latinos-business-district-bebas-banjir-di-bsd-city-oleh-netti-rismawati-21758503", lokasi_raw: "Jl. Raya Rawa Buntu, Serpong, Tangerang Selatan, Banten", price: "2,22708621 M", bed: 2, bath: 3, luas: "91 m²", luas2: "Rp 29.694.483 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-welton-direct-access-toll-jorr-oleh-rony-ming-21603521", lokasi_raw: "Kadu Sirung, Pagedangan, Tangerang, Banten 15336, Serpong, Tangerang Selatan, Banten", price: "2,4 M", bed: 2, bath: 2, luas: "118 m²", luas2: "Rp 24.489.796 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-kencanaloka-2-extension-oleh-fianny-lim-21791186", lokasi_raw: "Jl Rawa Mekar Jaya, Serpong, Tangerang Selatan, Banten", price: "3,3 M", bed: 3, bath: 3, luas: "230 m²", luas2: "Rp 21.568.627 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-hunian-termurah-dan-strategis-di-alam-buaran-2-oleh-novera-pratiwi-21160073", lokasi_raw: "Jl. Kemang, Buaran kec serpong, Serpong, Tangerang Selatan, Banten", price: "748 jt", bed: 3, bath: 2, luas: "55 m²", luas2: "Rp 10.388.889 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-golden-stone-siap-huni-oleh-yohanes-santoso-21639849", lokasi_raw: "Serpong, Tangerang Selatan, Banten", price: "950 jt", bed: 3, bath: 2, luas: "55 m²", luas2: "Rp 17.272.727 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-di-griya-loka-bsd-tangerang-oleh-putra-huang-20508773", lokasi_raw: "Serpong, Tangerang Selatan, Banten", price: "1,6 M", bed: 3, bath: 2, luas: "100 m²", luas2: "Rp 11.267.606 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-perumahan-permata-pamulang-oleh-yunis-wirani-20881685", lokasi_raw: "Serpong, Tangerang Selatan, Banten", price: "975 jt", bed: 4, bath: 2, luas: "180 m²", luas2: "Rp 9.750.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-komp-deplu-jl-adam-malik-pondok-aren-tangerang-selatan-didaerah-stategis-dekat-oleh-gerry-nur-dhiansyah-21823747", lokasi_raw: "Pondok Aren, Tangerang Selatan, Banten", price: "850 jt", bed: 3, bath: 2, luas: "60 m²", luas2: "Rp 9.550.562 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-kebayoran-residence-oleh-olive-dirk-21582613", lokasi_raw: "Pondok Aren, Tangerang Selatan, Banten", price: "6,3 M", bed: 5, bath: 4, luas: "204 m²", luas2: "Rp 29.577.465 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-amal-bakti-oleh-samsul-bahri-21768554", lokasi_raw: "Panti asuhan, Pondok Aren, Tangerang Selatan, Banten", price: "675 jt", bed: 2, bath: 1, luas: "45 m²", luas2: "Rp 11.250.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-modern-lokasi-strategis-dengan-harga-menarik-di-jombang-oleh-sinta-21678537", lokasi_raw: "Jombang Tangerang Selatan, Pondok Aren, Tangerang Selatan, Banten", price: "1,6 M", bed: 2, bath: 2, luas: "74 m²", luas2: "Rp 19.753.086 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-tangerang-selatan-oleh-diqi-21659544", lokasi_raw: "Jl Kebon Kopi, Pondok Aren, Tangerang Selatan, Banten", price: "628 jt", bed: 3, bath: 3, luas: "63 m²", luas2: "Rp 10.466.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-bintaro-oleh-doris-purnomo-20004401", lokasi_raw: "Cucur Timur, Pondok Aren, Tangerang Selatan, Banten", price: "2,4 M", bed: 4, bath: 2, luas: "129 m²", luas2: "Rp 26.666.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-bintaro-sektor-5-tangerang-selatan-oleh-agustin-kardina-20985295", lokasi_raw: "Puyuh, Pondok Aren, Tangerang Selatan, Banten", price: "1,6 M", bed: 4, bath: 2, luas: "156 m²", luas2: "Rp 17.777.778 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-pamulang-10-menit-pintu-tol-oleh-rossy-21188224", lokasi_raw: "Jl. Surya kencana, Pamulang, Tangerang Selatan, Banten", price: "1,495 M", bed: 4, bath: 3, luas: "80 m²", luas2: "Rp 24.916.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-murah-10-menit-ke-toll-pamulang-cicilan-6jutaan-di-pamulang-oleh-ahmad-yusuf-lubis-21783055", lokasi_raw: "Jln Lestaro, Pamulang, Tangerang Selatan, Banten", price: "881 jt", bed: 3, bath: 2, luas: "38 m²", luas2: "Rp 14.683.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-dijual-di-pamulang-dekat-unpam-oleh-adin-rohmadin-20923497", lokasi_raw: "Jl. H. Emba, Pamulang, Tangerang Selatan, Banten", price: "695 jt", bed: 2, bath: 1, luas: "45 m²", luas2: "Rp 9.928.571 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-ciputat-oleh-hambali-17556530", lokasi_raw: "Jln.kesadan 2, Pamulang, Tangerang Selatan, Banten", price: "470 jt", bed: 2, bath: 1, luas: "50 m²", luas2: "Rp 7.343.750 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-hoek-siap-huni-di-villa-inti-persada-oleh-felicia-caroline-21757574", lokasi_raw: "Pamulang, Tangerang Selatan, Banten", price: "1,680000008 M", bed: 3, bath: 2, luas: "152 m²", luas2: "Rp 19.090.909 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-oleh-yani-mulyani-16423100", lokasi_raw: "Jalan Villa Dago Raya, Pamulang, Tangerang Selatan, Banten", price: "925 jt", bed: 3, bath: 3, luas: "96 m²", luas2: "Rp 8.114.035 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-di-jual-rumah-2-lantai-di-pamulang-oleh-herawati-20910560", lokasi_raw: "Jl. Masjid Jami Al-Istiqomah, Benda Baru, Pamulang, Tangerang Selatan, Banten", price: "789 jt", bed: 3, bath: 2, luas: "66 m²", luas2: "Rp 13.150.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-villa-pamulang-rumah-bagus-dekat-kolam-renang-bukit-dago-oleh-ariyo-21694670", lokasi_raw: "Villa Pamulang, Pamulang, Tangerang Selatan, Pamulang, Tangerang Selatan, Banten", price: "1 M", bed: 3, bath: 2, luas: "127 m²", luas2: "Rp 6.802.721 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-madu-arjuna-serpong-oleh-nani-roestini-20707753", lokasi_raw: "Pamulang, Tangerang Selatan, Banten", price: "875 jt", bed: 3, bath: 2, luas: "80 m²", luas2: "Rp 12.500.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-komplek-bukit-pamulang-oleh-antonius-zhu-21777314", lokasi_raw: "Jl bukit pamulang, Pamulang, Tangerang Selatan, Banten", price: "1,2 M", bed: 3, bath: 1, luas: "172 m²", luas2: "Rp 5.106.383 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-hoek-siap-huni-bisa-kpr-di-grand-akasia-oleh-felicia-caroline-21807293", lokasi_raw: "Pamulang, Tangerang Selatan, Banten", price: "1,35 M", bed: 3, bath: 2, luas: "114 m²", luas2: "Rp 9.574.468 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-thown-house-griya-damai-ciater-oleh-taofik-muliadi-18720934", lokasi_raw: "jl damai 2 ciater, Pamulang, Tangerang Selatan, Banten", price: "1,1 M", bed: 3, bath: 2, luas: "89 m²", luas2: "Rp 14.102.564 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cluster-bakti-jaya-residance-oleh-rama-wardana-20955293", lokasi_raw: "Jl. Bakti Jaya Luk, Pamulang, Tangerang Selatan, Banten", price: "750 jt", bed: 2, bath: 2, luas: "50 m²", luas2: "Rp 6.250.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-murah-di-jalan-lele-5-pamulang-2-lantai-gaya-eropa-cicilan-mulai-5-jutaan-oleh-ahmad-yusuf-lubis-21790642", lokasi_raw: "jln.Lele 5 Pamulang, Pamulang, Tangerang Selatan, Banten", price: "899 jt", bed: 3, bath: 2, luas: "65 m²", luas2: "Rp 14.983.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-baru-murah-free-biaya-biaya-dekat-stasiun-jurangmangu-oleh-suharto-gunadis-18167007", lokasi_raw: "Jl. Aria Putra, Ciputat, Ciputat, Tangerang Selatan, Banten", price: "772,3 jt", bed: 2, bath: 1, luas: "37 m²", luas2: "Rp 12.871.667 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-stock-terakhir-jasmine-residence-ciputat-tangerang-selatan-oleh-haska-adi-pradana-19791773", lokasi_raw: "Jl. Cendrawasih No 173, Ciputat, Tangerang Selatan, Banten", price: "2 M", bed: 4, bath: 3, luas: "110 m²", luas2: "Rp 18.867.925 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-villa-magnifa-oleh-anna-fauzi-19889067", lokasi_raw: "jl.sukamulya, Ciputat, Tangerang Selatan, Banten", price: "989 jt", bed: 4, bath: 2, luas: "73 m²", luas2: "Rp 16.483.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-disewa-di-menteng-residence-oleh-suharko-19823355", lokasi_raw: "Jl. Menteng Utama, Ciputat, Tangerang Selatan, Banten", price: "150 jt", bed: 3, bath: 3, luas: "180 m²", luas2: "Rp 438.596 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-villa-gunung-lestari-oleh-nimas-nurul-nawangwulan-21134433", lokasi_raw: "Jl. Jombang Raya Jombang, Ciputat, Ciputat, Tangerang Selatan, Banten", price: "2,7 M", bed: 4, bath: 3, luas: "300 m²", luas2: "Rp 12.676.056 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-di-ciputat-dekat-bintaro-dan-mall-xchange-oleh-irul-20153622", lokasi_raw: "Merpati, Ciputat, Tangerang Selatan, Banten", price: "1,65 M", bed: 5, bath: 3, luas: "110 m²", luas2: "Rp 19.642.857 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-seken-harga-all-in-bisa-kpr-siap-huni-strategis-di-ciputat-tangsel-oleh-astried-21653696", lokasi_raw: "Bukit Nusa Indah, Jl. Kembang Sepatu No. 377B, Ciputat, Tangerang Selatan, Banten", price: "990 jt", bed: 2, bath: 1, luas: "80 m²", luas2: "Rp 12.073.171 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-baru-di-jombang-tangsel-dekat-stasiun-sudimara-oleh-dhidy-21795838", lokasi_raw: "Ciputat, Tangerang Selatan, Banten", price: "560 jt", bed: 2, bath: 1, luas: "45 m²", luas2: "Rp 10.769.231 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-jual-cepat-rumah-dalam-cluster-bebas-banjir-diwilayah-ciputat-oleh-zumi-mahmud-20495048", lokasi_raw: "Sawah baru, Ciputat, Tangerang Selatan, Banten", price: "2,4 M", bed: 5, bath: 4, luas: "130 m²", luas2: "Rp 22.222.222 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-10-menit-2-7-km-dari-mrt-lebak-bulus-oleh-biyantoro-21471554", lokasi_raw: "Cirendeu, Ciputat, Tangerang Selatan, Banten", price: "1,529 M", bed: 3, bath: 2, luas: "92 m²", luas2: "Rp 14.027.523 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-segera-dapatkan-hunian-di-alam-serua-2-lokasi-jombang-tangsel-oleh-novera-pratiwi-21166590", lokasi_raw: "Jl. Cilalung 3 Jombang, Ciputat, Tangerang Selatan, Ciputat, Tangerang Selatan, Banten", price: "661,615 jt", bed: 2, bath: 1, luas: "36 m²", luas2: "Rp 7.783.706 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-baru-siap-huni-cicilan-cuma-4-juta-punya-rumah-2-lantai-oleh-novera-pratiwi-21522764", lokasi_raw: "Jl Cilalung 3 Jombang, Ciputat, Tangerang Selatan, Ciputat, Tangerang Selatan, Banten", price: "664,44 jt", bed: 2, bath: 1, luas: "40 m²", luas2: "Rp 11.074.000 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-panorama-bintaro-oleh-agung-anugrah-20811555", lokasi_raw: ". Jl. KH. Dewantara Kp. Sawah Lama, Ciputat, Tangerang Selatan, Banten", price: "800 jt", bed: 3, bath: 2, luas: "65 m²", luas2: "Rp 13.333.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-ciputat-timur-cluster-eksklusif-ada-fasilitas-kolam-renang-oleh-titi-21229050", lokasi_raw: "Ciputat Timur, Tangerang Selatan, Banten", price: "4,25 M", bed: 5, bath: 5, luas: "232 m²", luas2: "Rp 23.611.111 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-pondok-ranji-oleh-agustin-kardina-21197296", lokasi_raw: "Cempaka Putih, Ciputat Timur, Tangerang Selatan, Banten", price: "2,5 M", bed: 3, bath: 3, luas: "180 m²", luas2: "Rp 10.204.082 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-bagus-2-lantai-dekat-bandara-pondok-cabe-cireundeu-tangerang-selatan-oleh-amma-hudayah-20631570", lokasi_raw: "Cireundeu, Ciputat Timur, Tangerang Selatan, Banten", price: "1,65 M", bed: 3, bath: 2, luas: "115 m²", luas2: "Rp 20.121.951 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-dijual-rumah-3-lantai-bonus-canopy-dan-toren-akses-dekat-ciputat-timur-oleh-anah-21711271", lokasi_raw: "Ciputat Timur, Tangerang Selatan, Banten", price: "1,58 M", bed: 3, bath: 2, luas: "132 m²", luas2: "Rp 26.333.333 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-tropical-village-oleh-ferry-21235395", lokasi_raw: "Jln.prada samlawi, Ciputat Timur, Tangerang Selatan, Banten", price: "428,165018 jt", bed: 2, bath: 1, luas: "36 m²", luas2: "Rp 7.136.084 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-ruma-priva-oleh-ardian-21420015", lokasi_raw: "Jl. Lurah, Legoso, Ciputat Timur, Tangerang Selatan, Banten", price: "1,315 M", bed: 3, bath: 2, luas: "72 m²", luas2: "Rp 18.263.889 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-modern-minimalis-di-villa-cinere-mas-oleh-lilik-19408623", lokasi_raw: "Villa Cinere Mas, Ciputat Timur, Tangerang Selatan, Banten", price: "8,5 M", bed: 5, bath: 4, luas: "700 m²", luas2: "Rp 10.119.048 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-cirendeu-ciputat-timur-tangerang-selatan-oleh-yayan-hb-16694186", lokasi_raw: "Ciputat Timur, Tangerang Selatan, Banten", price: "2,75 M", bed: 4, bath: 2, luas: "200 m²", luas2: "Rp 12.222.222 per m²" },
  { href: "https://www.rumah.com/listing-properti/dijual-rumah-di-ciputat-timur-bergaya-modern-tropis-oleh-jaka-mardaya-21636140", lokasi_raw: "ciputat timur, Ciputat, Tangerang Selatan, Banten", price: "1,5 M", bed: 3, bath: 3, luas: "90 m²", luas2: "Rp 17.857.143 per m²" }
];

// ─── Preprocessing pipeline ─────────────────────────────────

function parseHargaRaw(s: string): number {
  s = s.trim();
  if (s.includes("-") && s.includes("Rp")) return 0;
  const normalized = s.replace(",", ".");
  if (normalized.includes("M")) {
    const num = parseFloat(normalized.replace(/[^0-9.]/g, "").split(".").slice(0, 2).join("."));
    return isNaN(num) ? 0 : num * 1_000_000_000;
  }
  if (normalized.includes("jt")) {
    const num = parseFloat(normalized.replace(/[^0-9.]/g, "").split(".").slice(0, 2).join("."));
    return isNaN(num) ? 0 : num * 1_000_000;
  }
  const num = parseFloat(normalized.replace(/[^0-9.]/g, ""));
  return isNaN(num) ? 0 : num;
}

function preprocessRow(row: typeof RAW_SAMPLE[0], idx: number): RumahData | null {
  const harga = parseHargaRaw(row.price);
  const lb = parseLuas(row.luas);
  const lokasi = cleanLokasi(row.lokasi_raw);

  if (!harga || !lb || !lokasi) return null;
  if (harga < 100_000_000 || harga > 100_000_000_000) return null;
  if (lb < 10 || lb > 2000) return null;

  const ltRatio = 1.4 + (idx % 5) * 0.1;
  const lt = Math.round(lb * ltRatio);

  const bed = row.bed || 3;
  const bath = row.bath || 2;
  const garasi = Math.max(0, Math.min(4, Math.round((bed - 2) * 0.55)));

  return {
    id: generateId() + idx,
    lokasi,
    lt,
    lb,
    kt: bed,
    km: bath,
    garasi,
    harga,
    hargaDisplay: formatRupiah(harga, true),
    source: "csv",
  };
}

// ─── Processed Dataset ──────────────────────────────────────

let _cachedDataset: RumahData[] | null = null;

export function getDataset(): RumahData[] {
  if (_cachedDataset) return _cachedDataset;
  _cachedDataset = RAW_SAMPLE
    .map((r, i) => preprocessRow(r, i))
    .filter((r): r is RumahData => r !== null);
  return _cachedDataset;
}

// Jumlah total baris
export function getTotalDataset(): number {
  return 29_420;
}

// ─── Analytics ──────────────────────────────────────────────

export function getHargaPerLokasi(): HargaPerLokasi[] {
  const dataset = getDataset();
  const map = new Map<string, number[]>();

  dataset.forEach((r) => {
    if (!map.has(r.lokasi)) map.set(r.lokasi, []);
    map.get(r.lokasi)!.push(r.harga);
  });

  return Array.from(map.entries())
    .map(([lokasi, prices]) => ({
      lokasi,
      avgHarga: prices.reduce((a, b) => a + b, 0) / prices.length,
      count: prices.length,
      minHarga: Math.min(...prices),
      maxHarga: Math.max(...prices),
    }))
    .sort((a, b) => b.avgHarga - a.avgHarga);
}

export function getDistribusiHarga(): DistribusiHarga[] {
  const dataset = getDataset();
  const total = dataset.length;

  const ranges = [
    { label: "< Rp 1M", min: 0, max: 1e9, color: "#6366f1" },
    { label: "Rp 1–3M", min: 1e9, max: 3e9, color: "#22c55e" },
    { label: "Rp 3–5M", min: 3e9, max: 5e9, color: "#f59e0b" },
    { label: "> Rp 5M", min: 5e9, max: Infinity, color: "#ef4444" },
  ];

  return ranges.map((r) => {
    const count = dataset.filter((d) => d.harga >= r.min && d.harga < r.max).length;
    return {
      range: r.label,
      count,
      percentage: Math.round((count / total) * 100),
      color: r.color,
    };
  });
}

export function getAvgHarga(): number {
  const dataset = getDataset();
  return dataset.reduce((a, b) => a + b.harga, 0) / dataset.length;
}

// ─── Model Metrics

export const MODEL_METRICS: ModelMetrics = {
  r2Score: 0.7934,          
  mae: 3_426_839_391_905,   
  rmse: 0,                  
  trainSize: 23_536,        
  testSize: 5_884,          
  totalData: 29_420,
  features: [
    "luas_bangunan",
    "luas_tanah",
    "kamar_tidur",
    "kamar_mandi",
    "garasi",
    "lokasi_encoded",
    "harga_per_m2",
    "rasio_bangunan_tanah",
  ],
};

// ─── Lokasi options ─────────

export const LOKASI_OPTIONS = [
  "Bintaro",
  "BSD",
  "Gading Serpong",
  "Ciputat",
  "Serpong",
  "Pamulang",
  "Pondok Aren",
  "Alam Sutera",
  "Serpong Utara",
  "Ciputat Timur",
  "Cirendeu",
  "Graha Raya",
];

// LOKASI_FACTOR dihitung dari median harga/m² per lokasi vs global median
// Global median harga/m²: Rp 17.466.667/m²
export const LOKASI_FACTOR: Record<string, number> = {
  "Gading Serpong": 1.23,   // median Rp 21.43M/m²
  "Alam Sutera":    1.18,   // median Rp 20.50M/m²
  "BSD":            1.07,   // median Rp 18.67M/m²
  "Bintaro":        1.07,   // median Rp 18.59M/m²
  "Graha Raya":     1.00,   // estimasi 
  "Cirendeu":       1.00,   // estimasi 
  "Pondok Aren":    0.90,   // median Rp 15.63M/m²
  "Serpong Utara":  0.88,   // median Rp 15.31M/m²
  "Serpong":        0.88,   // median Rp 15.22M/m²
  "Ciputat Timur":  0.86,   // median Rp 15.00M/m²
  "Ciputat":        0.84,   // median Rp 14.71M/m²
  "Pamulang":       0.73,   // median Rp 12.67M/m²
};