// ============================================================
// src/store/index.ts — Global state (Zustand)
// ============================================================
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RumahData, PredictionResult, ToastConfig } from "@/types";
import { getDataset, formatRupiah } from "@/lib/data";

interface AppState {
  dataset: RumahData[];
  addRumah: (data: Omit<RumahData, "id" | "hargaDisplay">) => void;
  removeRumah: (id: string) => void;
  predictions: PredictionResult[];
  addPrediction: (pred: PredictionResult) => void;
  clearPredictions: () => void;
  toasts: ToastConfig[];
  addToast: (toast: Omit<ToastConfig, "id">) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Dataset selalu dimulai dari CSV data (198 baris real)
      dataset: getDataset(),

      addRumah: (data) =>
        set((state) => ({
          dataset: [
            {
              ...data,
              id: `r_${Date.now()}`,
              hargaDisplay: formatRupiah(data.harga, true),
            },
            ...state.dataset,
          ],
        })),

      removeRumah: (id) =>
        set((state) => ({
          dataset: state.dataset.filter((r) => r.id !== id),
        })),

      predictions: [],
      addPrediction: (pred) =>
        set((state) => ({
          predictions: [pred, ...state.predictions].slice(0, 100),
        })),
      clearPredictions: () => set({ predictions: [] }),

      toasts: [],
      addToast: (toast) =>
        set((state) => ({
          toasts: [
            ...state.toasts,
            { ...toast, id: `toast_${Date.now()}` },
          ],
        })),
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "rumah-tangsel-store",

      // Hanya simpan data manual & predictions ke localStorage
      partialize: (state) => ({
        predictions: state.predictions,
        manualData: state.dataset.filter((r) => r.source === "manual"),
      }),

      // Saat restore dari localStorage: gabungkan data CSV fresh + data manual tersimpan
      merge: (persisted: unknown, current: AppState) => {
        const p = persisted as { manualData?: RumahData[]; predictions?: PredictionResult[] };
        const csvData = getDataset();
        const manualData: RumahData[] = p?.manualData ?? [];

        return {
          ...current,
          // Manual data di depan, CSV data di belakang
          dataset: [...manualData, ...csvData],
          predictions: p?.predictions ?? [],
        };
      },
    }
  )
);