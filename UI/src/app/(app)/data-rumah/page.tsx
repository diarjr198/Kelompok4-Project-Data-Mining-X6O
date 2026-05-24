"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/store";
import { LOKASI_OPTIONS, formatRupiah } from "@/lib/data";
import { Search, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { RumahData } from "@/types";

type SortField = keyof RumahData | "";
type SortDir = "asc" | "desc";

const PER_PAGE = 20;

export default function DataRumahPage() {
  const { dataset, removeRumah } = useAppStore();
  const [search, setSearch] = useState("");
  const [filterLokasi, setFilterLokasi] = useState("");
  const [sortField, setSortField] = useState<SortField>("harga");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let data = [...dataset];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((r) => r.lokasi.toLowerCase().includes(q));
    }
    if (filterLokasi) {
      data = data.filter((r) => r.lokasi === filterLokasi);
    }
    if (sortField) {
      data.sort((a, b) => {
        const av = a[sortField as keyof RumahData] as number;
        const bv = b[sortField as keyof RumahData] as number;
        return sortDir === "asc" ? av - bv : bv - av;
      });
    }
    return data;
  }, [dataset, search, filterLokasi, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronsUpDown className="w-3 h-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-indigo-400" />
    ) : (
      <ChevronDown className="w-3 h-3 text-indigo-400" />
    );
  }

  const segmenBadge = (harga: number) => {
    if (harga >= 7e9) return <span className="badge-red">Ultra-Premium</span>;
    if (harga >= 4e9) return <span className="badge-amber">Premium</span>;
    if (harga >= 1.5e9) return <span className="badge-blue">Menengah</span>;
    return <span className="badge-green">Terjangkau</span>;
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Data Rumah</h1>
        <p className="text-foreground-muted text-sm mt-1">
          {filtered.length.toLocaleString()} dari {dataset.length.toLocaleString()} properti
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted" />
          <input
            className="input pl-9"
            placeholder="Cari lokasi…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="relative">
          <select
            className="select pr-8"
            value={filterLokasi}
            onChange={(e) => { setFilterLokasi(e.target.value); setPage(1); }}
          >
            <option value="">Semua Lokasi</option>
            {LOKASI_OPTIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("lokasi")}>
                  <div className="flex items-center gap-1">Lokasi <SortIcon field="lokasi" /></div>
                </th>
                <th onClick={() => handleSort("lt")}>
                  <div className="flex items-center gap-1">LT (m²) <SortIcon field="lt" /></div>
                </th>
                <th onClick={() => handleSort("lb")}>
                  <div className="flex items-center gap-1">LB (m²) <SortIcon field="lb" /></div>
                </th>
                <th onClick={() => handleSort("kt")}>
                  <div className="flex items-center gap-1">KT <SortIcon field="kt" /></div>
                </th>
                <th onClick={() => handleSort("km")}>
                  <div className="flex items-center gap-1">KM <SortIcon field="km" /></div>
                </th>
                <th>Garasi</th>
                <th onClick={() => handleSort("harga")}>
                  <div className="flex items-center gap-1">Harga <SortIcon field="harga" /></div>
                </th>
                <th>Segmen</th>
                <th>Sumber</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r) => (
                <tr key={r.id}>
                  <td>{r.lokasi}</td>
                  <td className="font-mono">{r.lt.toLocaleString()}</td>
                  <td className="font-mono">{r.lb.toLocaleString()}</td>
                  <td className="font-mono">{r.kt}</td>
                  <td className="font-mono">{r.km}</td>
                  <td className="font-mono">{r.garasi}</td>
                  <td className="font-mono text-foreground">{formatRupiah(r.harga, true)}</td>
                  <td>{segmenBadge(r.harga)}</td>
                  <td>
                    <span className={`badge ${r.source === "manual" ? "badge-accent" : "bg-background-tertiary text-foreground-muted"}`}>
                      {r.source ?? "csv"}
                    </span>
                  </td>
                  <td>
                    {r.source === "manual" && (
                      <button
                        onClick={() => removeRumah(r.id)}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center text-foreground-muted py-8">
                    Tidak ada data ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="text-xs text-foreground-muted">
              Halaman {page} dari {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40"
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs transition-colors ${
                      p === page
                        ? "bg-indigo-500 text-white"
                        : "text-foreground-secondary hover:bg-background-tertiary"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-ghost text-xs px-3 py-1.5 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
