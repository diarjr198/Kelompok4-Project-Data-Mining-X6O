"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { predict } from "@/lib/model";
import { LOKASI_OPTIONS } from "@/lib/data";
import { BrainCircuit, Loader2, Sliders } from "lucide-react";
import type { PredictionInput } from "@/types";

const INIT: PredictionInput = {
  lokasi: "Bintaro",
  lt: 150,
  lb: 100,
  kt: 3,
  km: 2,
  garasi: 1,
};

export default function PrediksiPage() {
  const router = useRouter();
  const { addPrediction, addToast } = useAppStore();
  const [form, setForm] = useState<PredictionInput>(INIT);
  const [loading, setLoading] = useState(false);

  function handleChange(field: keyof PredictionInput, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePredict() {
    if (!form.lokasi || !form.lb || !form.lt) {
      addToast({ type: "error", message: "Lengkapi semua field terlebih dahulu" });
      return;
    }
    setLoading(true);
    try {
      const result = await predict(form);
      addPrediction(result);
      addToast({ type: "success", message: "Prediksi berhasil!" });
      router.push("/hasil-prediksi");
    } catch {
      addToast({ type: "error", message: "Gagal melakukan prediksi" });
    } finally {
      setLoading(false);
    }
  }

  const SliderField = ({
    label,
    field,
    min,
    max,
    step = 1,
    unit = "",
  }: {
    label: string;
    field: keyof PredictionInput;
    min: number;
    max: number;
    step?: number;
    unit?: string;
  }) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground-secondary">{label}</label>
        <span className="text-sm font-mono text-indigo-400">
          {form[field]}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={form[field] as number}
        onChange={(e) => handleChange(field, parseFloat(e.target.value))}
        className="w-full accent-indigo-500"
      />
      <div className="flex justify-between text-xs text-foreground-muted mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Prediksi Harga</h1>
        <p className="text-foreground-muted text-sm mt-1">
          Masukkan spesifikasi properti untuk mendapatkan estimasi harga
        </p>
      </div>

      <div className="card space-y-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground-secondary">
          <Sliders className="w-4 h-4 text-indigo-400" />
          Spesifikasi Properti
        </div>

        {/* Lokasi */}
        <div>
          <label className="text-sm font-medium text-foreground-secondary block mb-1.5">Lokasi</label>
          <div className="relative">
            <select
              className="select pr-8"
              value={form.lokasi}
              onChange={(e) => handleChange("lokasi", e.target.value)}
            >
              {LOKASI_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Luas */}
        <div className="space-y-5">
          <SliderField label="Luas Tanah" field="lt" min={30} max={1000} step={10} unit=" m²" />
          <SliderField label="Luas Bangunan" field="lb" min={20} max={600} step={10} unit=" m²" />
        </div>

        {/* Kamar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Kamar Tidur", field: "kt" as const, min: 1, max: 8 },
            { label: "Kamar Mandi", field: "km" as const, min: 1, max: 6 },
            { label: "Garasi", field: "garasi" as const, min: 0, max: 4 },
          ].map((f) => (
            <div key={f.field}>
              <label className="text-sm font-medium text-foreground-secondary block mb-1.5">
                {f.label}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleChange(f.field, Math.max(f.min, (form[f.field] as number) - 1))
                  }
                  className="w-8 h-8 rounded-lg bg-background-tertiary border border-border flex items-center justify-center text-sm hover:bg-border transition-colors"
                >
                  −
                </button>
                <div className="flex-1 text-center font-mono text-lg font-bold">
                  {form[f.field]}
                </div>
                <button
                  onClick={() =>
                    handleChange(f.field, Math.min(f.max, (form[f.field] as number) + 1))
                  }
                  className="w-8 h-8 rounded-lg bg-background-tertiary border border-border flex items-center justify-center text-sm hover:bg-border transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
          <div className="text-xs font-semibold text-indigo-400 mb-2 uppercase tracking-wider">
            Ringkasan Input
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-foreground-muted">Lokasi: <span className="text-foreground">{form.lokasi}</span></div>
            <div className="text-foreground-muted">LT: <span className="text-foreground font-mono">{form.lt} m²</span></div>
            <div className="text-foreground-muted">LB: <span className="text-foreground font-mono">{form.lb} m²</span></div>
            <div className="text-foreground-muted">KT: <span className="text-foreground font-mono">{form.kt}</span></div>
            <div className="text-foreground-muted">KM: <span className="text-foreground font-mono">{form.km}</span></div>
            <div className="text-foreground-muted">Garasi: <span className="text-foreground font-mono">{form.garasi}</span></div>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="btn-primary w-full justify-center py-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memproses…
            </>
          ) : (
            <>
              <BrainCircuit className="w-4 h-4" />
              Prediksi Sekarang
            </>
          )}
        </button>
      </div>
    </div>
  );
}
