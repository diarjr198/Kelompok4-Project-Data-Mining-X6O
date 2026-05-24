"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store";
import { getHargaPerLokasi, getDistribusiHarga, MODEL_METRICS, formatRupiah, getTotalDataset } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Database, TrendingUp, MapPin, BrainCircuit, Activity } from "lucide-react";

export default function DashboardPage() {
  const { dataset, predictions } = useAppStore();

  const hargaPerLokasi = useMemo(() => getHargaPerLokasi(), []);
  const distribusiHarga = useMemo(() => getDistribusiHarga(), []);

  const avgHarga = useMemo(
    () => dataset.reduce((a, b) => a + b.harga, 0) / dataset.length,
    [dataset]
  );

  const stats = [
    {
      label: "Total Data",
      value: getTotalDataset().toLocaleString("id-ID"),
      sub: `${dataset.length} loaded`,
      icon: Database,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Rata-rata Harga",
      value: formatRupiah(avgHarga, true),
      sub: "seluruh dataset",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Lokasi",
      value: hargaPerLokasi.length.toString(),
      sub: "kecamatan/kawasan",
      icon: MapPin,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Total Prediksi",
      value: predictions.length.toString(),
      sub: "di sesi ini",
      icon: BrainCircuit,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-foreground-muted text-sm mt-1">
          Overview analitik properti Tangerang Selatan
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card flex items-start gap-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <div>
                <div className="text-xs text-foreground-muted">{s.label}</div>
                <div className="text-xl font-bold mt-0.5">{s.value}</div>
                <div className="text-xs text-foreground-muted mt-0.5">{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Bar chart harga per lokasi */}
        <div className="col-span-2 card">
          <div className="text-sm font-semibold mb-4">Rata-rata Harga per Lokasi</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={hargaPerLokasi} barSize={22}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 14%)" vertical={false} />
              <XAxis
                dataKey="lokasi"
                tick={{ fontSize: 11, fill: "hsl(240 5% 62%)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1e9).toFixed(1)}M`}
                tick={{ fontSize: 11, fill: "hsl(240 5% 62%)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v: number) => [formatRupiah(v, true), "Avg Harga"]}
                contentStyle={{
                  background: "hsl(240 6% 8%)",
                  border: "1px solid hsl(240 5% 14%)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="avgHarga" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie distribusi harga */}
        <div className="card">
          <div className="text-sm font-semibold mb-4">Distribusi Harga</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={distribusiHarga}
                dataKey="count"
                nameKey="range"
                cx="50%"
                cy="50%"
                outerRadius={75}
                innerRadius={40}
              >
                {distribusiHarga.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => [v, "Properti"]}
                contentStyle={{
                  background: "hsl(240 6% 8%)",
                  border: "1px solid hsl(240 5% 14%)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span style={{ fontSize: 11, color: "hsl(240 5% 62%)" }}>{v}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {distribusiHarga.map((d) => (
              <div key={d.range} className="flex items-center justify-between text-xs">
                <span className="text-foreground-muted">{d.range}</span>
                <span className="font-mono text-foreground-secondary">{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model metrics */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-indigo-400" />
          <div className="text-sm font-semibold">Model Performance — HistGradientBoosting</div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="metric-card">
            <div className="metric-label">R² Score</div>
            <div className="metric-value text-emerald-400 font-mono">{MODEL_METRICS.r2Score}</div>
            <div className="text-xs text-foreground-muted mt-1">Explained variance</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">MAE</div>
            <div className="metric-value text-amber-400">{formatRupiah(MODEL_METRICS.mae, true)}</div>
            <div className="text-xs text-foreground-muted mt-1">Mean Abs. Error</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">RMSE</div>
            <div className="metric-value text-red-400">{formatRupiah(MODEL_METRICS.rmse, true)}</div>
            <div className="text-xs text-foreground-muted mt-1">Root Mean Sq. Error</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Train / Test Split</div>
            <div className="metric-value text-indigo-400 font-mono text-lg">80/20</div>
            <div className="text-xs text-foreground-muted mt-1">
              {MODEL_METRICS.trainSize.toLocaleString()} / {MODEL_METRICS.testSize.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs text-foreground-muted mb-2">Features used ({MODEL_METRICS.features.length})</div>
          <div className="flex flex-wrap gap-1.5">
            {MODEL_METRICS.features.map((f) => (
              <span key={f} className="badge-accent font-mono text-xs">{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
