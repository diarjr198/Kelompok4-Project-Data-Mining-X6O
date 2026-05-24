"use client";

import { useAppStore } from "@/store";
import { formatRupiah } from "@/lib/data";
import { BrainCircuit, Trash2, ArrowRight, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { PredictionResult } from "@/types";

const SEGMEN_CONFIG = {
  terjangkau: { label: "Terjangkau", cls: "badge-green" },
  menengah: { label: "Menengah", cls: "badge-blue" },
  premium: { label: "Premium", cls: "badge-amber" },
  "ultra-premium": { label: "Ultra-Premium", cls: "badge-red" },
};

function PredictionCard({ pred }: { pred: PredictionResult }) {
  const seg = SEGMEN_CONFIG[pred.segmen];
  const date = new Date(pred.timestamp);

  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={seg.cls}>{seg.label}</span>
            <span className="text-xs text-foreground-muted">
              {date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
              {" · "}
              {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="text-2xl font-bold mt-1">
            {formatRupiah(pred.harga, true)}
          </div>
          <div className="text-xs text-foreground-muted font-mono">
            {formatRupiah(pred.hargaMin, true)} — {formatRupiah(pred.hargaMax, true)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-foreground-muted mb-1">Confidence</div>
          <div className="text-xl font-bold text-emerald-400 font-mono">{pred.confidence}%</div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="h-1.5 bg-background-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all"
          style={{ width: `${pred.confidence}%` }}
        />
      </div>

      {/* Specs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Lokasi", val: pred.input.lokasi },
          { label: "LT / LB", val: `${pred.input.lt} / ${pred.input.lb} m²` },
          { label: "KT / KM", val: `${pred.input.kt} / ${pred.input.km}` },
          { label: "Garasi", val: pred.input.garasi.toString() },
          { label: "Harga/m²", val: formatRupiah(pred.hargaPerMeter, true) + "/m²" },
        ].map((s) => (
          <div key={s.label} className="bg-background-tertiary rounded-xl p-3">
            <div className="text-xs text-foreground-muted">{s.label}</div>
            <div className="text-sm font-medium mt-0.5 font-mono">{s.val}</div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="space-y-1.5">
        {pred.insights.map((insight, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-foreground-secondary">
            <TrendingUp className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
            {insight}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HasilPrediksiPage() {
  const { predictions, clearPredictions } = useAppStore();

  if (!predictions.length) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="text-lg font-semibold">Belum ada prediksi</div>
        <div className="text-sm text-foreground-muted mt-1 mb-5">
          Lakukan prediksi terlebih dahulu untuk melihat hasilnya di sini
        </div>
        <Link href="/prediksi" className="btn-primary">
          <BrainCircuit className="w-4 h-4" />
          Prediksi Sekarang
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hasil Prediksi</h1>
          <p className="text-foreground-muted text-sm mt-1">
            {predictions.length} prediksi tersimpan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/prediksi" className="btn-primary">
            <BrainCircuit className="w-4 h-4" />
            Prediksi Baru
          </Link>
          <button onClick={clearPredictions} className="btn-danger">
            <Trash2 className="w-4 h-4" />
            Hapus Semua
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Rata-rata Prediksi",
            value: formatRupiah(
              predictions.reduce((a, b) => a + b.harga, 0) / predictions.length,
              true
            ),
          },
          {
            label: "Tertinggi",
            value: formatRupiah(Math.max(...predictions.map((p) => p.harga)), true),
          },
          {
            label: "Terendah",
            value: formatRupiah(Math.min(...predictions.map((p) => p.harga)), true),
          },
          {
            label: "Avg Confidence",
            value: `${Math.round(predictions.reduce((a, b) => a + b.confidence, 0) / predictions.length)}%`,
          },
        ].map((s) => (
          <div key={s.label} className="card-sm text-center">
            <div className="text-xs text-foreground-muted">{s.label}</div>
            <div className="text-lg font-bold mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4">
        {predictions.map((pred) => (
          <PredictionCard key={pred.id} pred={pred} />
        ))}
      </div>
    </div>
  );
}
