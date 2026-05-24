"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store";
import { LOKASI_OPTIONS, parseHargaStr, formatRupiah } from "@/lib/data";
import { PlusCircle, CheckCircle } from "lucide-react";
import type { FormAddData, FormErrors } from "@/types";

const INIT: FormAddData = {
  lokasi: "",
  lt: "",
  lb: "",
  kt: "3",
  km: "2",
  garasi: "1",
  harga: "",
};

function validate(form: FormAddData): FormErrors {
  const errors: FormErrors = {};
  if (!form.lokasi) errors.lokasi = "Lokasi wajib dipilih";
  if (!form.lt || parseInt(form.lt) < 20) errors.lt = "Luas tanah minimal 20 m²";
  if (!form.lb || parseInt(form.lb) < 15) errors.lb = "Luas bangunan minimal 15 m²";
  if (!form.kt || parseInt(form.kt) < 1) errors.kt = "Kamar tidur minimal 1";
  if (!form.km || parseInt(form.km) < 1) errors.km = "Kamar mandi minimal 1";
  if (!form.harga) errors.harga = "Harga wajib diisi";
  return errors;
}

export default function TambahDataPage() {
  const router = useRouter();
  const { addRumah, addToast } = useAppStore();
  const [form, setForm] = useState<FormAddData>(INIT);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof FormAddData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function handleSubmit() {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const harga = parseHargaStr(form.harga) || parseInt(form.harga.replace(/\D/g, ""));

    addRumah({
      lokasi: form.lokasi,
      lt: parseInt(form.lt),
      lb: parseInt(form.lb),
      kt: parseInt(form.kt),
      km: parseInt(form.km),
      garasi: parseInt(form.garasi),
      harga,
      source: "manual",
    });

    addToast({ type: "success", message: "Data berhasil ditambahkan!" });
    setSubmitted(true);
    setTimeout(() => {
      router.push("/data-rumah");
    }, 1500);
  }

  if (submitted) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="text-lg font-semibold">Data berhasil ditambahkan!</div>
        <div className="text-sm text-foreground-muted mt-1">Mengalihkan ke halaman data…</div>
      </div>
    );
  }

  const hargaPreview = form.harga ? parseHargaStr(form.harga) : 0;

  return (
    <div className="p-6 max-w-2xl animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tambah Data Rumah</h1>
        <p className="text-foreground-muted text-sm mt-1">
          Tambahkan data properti baru ke dalam dataset
        </p>
      </div>

      <div className="card space-y-5">
        {/* Lokasi */}
        <div>
          <label className="text-sm font-medium text-foreground-secondary block mb-1.5">
            Lokasi / Kawasan <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              className="select pr-8"
              value={form.lokasi}
              onChange={(e) => handleChange("lokasi", e.target.value)}
            >
              <option value="">Pilih lokasi…</option>
              {LOKASI_OPTIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          {errors.lokasi && <p className="text-xs text-red-400 mt-1">{errors.lokasi}</p>}
        </div>

        {/* Luas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-1.5">
              Luas Tanah (m²) <span className="text-red-400">*</span>
            </label>
            <input
              className="input"
              type="number"
              min={20}
              placeholder="cth. 150"
              value={form.lt}
              onChange={(e) => handleChange("lt", e.target.value)}
            />
            {errors.lt && <p className="text-xs text-red-400 mt-1">{errors.lt}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-1.5">
              Luas Bangunan (m²) <span className="text-red-400">*</span>
            </label>
            <input
              className="input"
              type="number"
              min={15}
              placeholder="cth. 100"
              value={form.lb}
              onChange={(e) => handleChange("lb", e.target.value)}
            />
            {errors.lb && <p className="text-xs text-red-400 mt-1">{errors.lb}</p>}
          </div>
        </div>

        {/* Kamar */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-1.5">
              Kamar Tidur <span className="text-red-400">*</span>
            </label>
            <input
              className="input"
              type="number"
              min={1}
              max={10}
              value={form.kt}
              onChange={(e) => handleChange("kt", e.target.value)}
            />
            {errors.kt && <p className="text-xs text-red-400 mt-1">{errors.kt}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-1.5">
              Kamar Mandi <span className="text-red-400">*</span>
            </label>
            <input
              className="input"
              type="number"
              min={1}
              max={10}
              value={form.km}
              onChange={(e) => handleChange("km", e.target.value)}
            />
            {errors.km && <p className="text-xs text-red-400 mt-1">{errors.km}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-1.5">
              Garasi
            </label>
            <input
              className="input"
              type="number"
              min={0}
              max={5}
              value={form.garasi}
              onChange={(e) => handleChange("garasi", e.target.value)}
            />
          </div>
        </div>

        {/* Harga */}
        <div>
          <label className="text-sm font-medium text-foreground-secondary block mb-1.5">
            Harga <span className="text-red-400">*</span>
          </label>
          <input
            className="input"
            placeholder="cth. 2,5 M atau 850 jt atau 2500000000"
            value={form.harga}
            onChange={(e) => handleChange("harga", e.target.value)}
          />
          {hargaPreview > 0 && (
            <p className="text-xs text-indigo-400 mt-1 font-mono">
              = {formatRupiah(hargaPreview)}
            </p>
          )}
          {errors.harga && <p className="text-xs text-red-400 mt-1">{errors.harga}</p>}
          <p className="text-xs text-foreground-muted mt-1">
            Format: <span className="font-mono">2,5 M</span> / <span className="font-mono">850 jt</span> / angka penuh
          </p>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSubmit} className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            Tambah Data
          </button>
          <button onClick={() => setForm(INIT)} className="btn-ghost">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
