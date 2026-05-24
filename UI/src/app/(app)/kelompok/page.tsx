"use client";

import { useState, useEffect } from "react";
import { Users, BookOpen, GraduationCap, Cpu, Database, BarChart3 } from "lucide-react";

const MEMBERS = [
  {
    name: "Rifqi Fadhila Sulaeman",
    nim: "202343502440",
    initial: "R",
    color: "from-indigo-500 to-violet-600",
  },
  {
    name: "Diar Julianto Rahadi",
    nim: "202343502392",
    initial: "D",
    color: "from-sky-500 to-indigo-600",
  },
  {
    name: "Ahmad Alfiansyah Halim",
    nim: "202343502545",
    initial: "A",
    color: "from-violet-500 to-fuchsia-600",
  },
];

const TECH_STACK = [
  { icon: <Cpu className="w-4 h-4" />, label: "Hist Gradient Boosting Regressor" },
  { icon: <Database className="w-4 h-4" />, label: "29.420 Data Properti Tangsel" },
  { icon: <BarChart3 className="w-4 h-4" />, label: "Akurasi R² 79.34%" },
];

export default function KelompokPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6 max-w-2xl animate-fade-in">
      {/* Header */}
      <div
        className="mb-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
            Data Mining — Kelompok 4
          </span>
        </div>
        <h1 className="text-2xl font-bold leading-snug text-foreground">
          Kelompok 4
        </h1>
      </div>

      {/* Project Card */}
      <div
        className="card mb-5"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
        }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-1">
              Judul Project
            </p>
            <h2 className="text-sm font-semibold text-foreground leading-relaxed">
              PENERAPAN METODE HIST GRADIENT BOOSTING REGRESSOR DALAM ANALISIS PREDIKSI
              HARGA RUMAH STUDI KASUS TANGERANG SELATAN
            </h2>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-4" />

        {/* Tech highlights */}
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-tertiary border border-border text-xs text-foreground-secondary"
            >
              <span className="text-indigo-400">{t.icon}</span>
              {t.label}
            </div>
          ))}
        </div>
      </div>

      {/* Members */}
      <div
        className="card"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold text-foreground-secondary">
            Anggota Kelompok
          </span>
        </div>

        <div className="space-y-3">
          {MEMBERS.map((m, i) => (
            <div
              key={m.nim}
              className="flex items-center gap-4 p-3 rounded-xl bg-background-tertiary border border-border hover:border-indigo-500/30 transition-colors"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-12px)",
                transition: `opacity 0.4s ease ${0.3 + i * 0.08}s, transform 0.4s ease ${0.3 + i * 0.08}s`,
              }}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-lg`}
              >
                {m.initial}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {m.name}
                </p>
                <p className="text-xs text-foreground-muted font-mono">{m.nim}</p>
              </div>

              {/* Role badge */}
              <span className="shrink-0 text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
