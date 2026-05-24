// ============================================================
// src/types/index.ts — Shared TypeScript types
// ============================================================

export interface RumahData {
  id: string;
  lokasi: string;
  lt: number; // luas tanah m²
  lb: number; // luas bangunan m²
  kt: number; // kamar tidur
  km: number; // kamar mandi
  garasi: number;
  harga: number; // in Rupiah
  hargaDisplay: string;
  source?: "csv" | "xlsx" | "manual";
  createdAt?: Date;
}

export interface PredictionInput {
  lokasi: string;
  lt: number;
  lb: number;
  kt: number;
  km: number;
  garasi: number;
}

export interface PredictionResult {
  id: string;
  input: PredictionInput;
  harga: number;
  hargaMin: number;
  hargaMax: number;
  confidence: number;
  hargaPerMeter: number;
  segmen: "terjangkau" | "menengah" | "premium" | "ultra-premium";
  insights: string[];
  timestamp: Date;
}

export interface ModelMetrics {
  r2Score: number;
  mae: number;
  rmse: number;
  trainSize: number;
  testSize: number;
  totalData: number;
  features: string[];
}

export interface DashboardStats {
  totalData: number;
  avgHarga: number;
  medianHarga: number;
  totalLokasi: number;
  totalPrediksi: number;
  modelR2: number;
}

export interface HargaPerLokasi {
  lokasi: string;
  avgHarga: number;
  count: number;
  minHarga: number;
  maxHarga: number;
}

export interface DistribusiHarga {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

export type NavPage =
  | "dashboard"
  | "data-rumah"
  | "tambah-data"
  | "prediksi"
  | "hasil-prediksi";

export interface NavItem {
  id: NavPage;
  label: string;
  href: string;
  icon: string;
  group: "utama" | "ml";
}

export interface ToastConfig {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

export interface TableState {
  search: string;
  filterLokasi: string;
  sortField: keyof RumahData | "";
  sortDir: "asc" | "desc";
  page: number;
  perPage: number;
}

export interface FormAddData {
  lokasi: string;
  lt: string;
  lb: string;
  kt: string;
  km: string;
  garasi: string;
  harga: string;
}

export interface FormErrors {
  [key: string]: string;
}
