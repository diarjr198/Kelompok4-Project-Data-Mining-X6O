"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  PlusCircle,
  BrainCircuit,
  BarChart3,
  Home,
  Users,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard",      label: "Dashboard",     icon: LayoutDashboard, group: "Utama" },
  { href: "/data-rumah",     label: "Data Rumah",    icon: Database,        group: "Utama" },
  { href: "/tambah-data",    label: "Tambah Data",   icon: PlusCircle,      group: "Utama" },
  { href: "/kelompok",       label: "Kelompok 4",    icon: Users,           group: "Utama" },
  { href: "/prediksi",       label: "Prediksi Harga",icon: BrainCircuit,    group: "ML"    },
  { href: "/hasil-prediksi", label: "Hasil Prediksi",icon: BarChart3,       group: "ML"    },
];

export default function Sidebar() {
  const pathname = usePathname();
  const groups = Array.from(new Set(NAV_ITEMS.map((n) => n.group)));

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 bg-background-secondary border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl gradient-accent flex items-center justify-center shrink-0">
            <Home className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Rumah Tangsel</div>
            <div className="text-xs text-foreground-muted leading-tight">ML Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((group) => (
          <div key={group}>
            <div className="text-xs font-semibold text-foreground-muted uppercase tracking-wider px-2 mb-1.5">
              {group}
            </div>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter((n) => n.group === group).map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${
                      active
                        ? "bg-indigo-500/10 text-indigo-400 font-medium"
                        : "text-foreground-secondary hover:bg-background-tertiary hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border">
        <div className="text-xs text-foreground-muted">
          Model R² = <span className="text-emerald-400 font-mono">0.7934</span>
        </div>
        <div className="text-xs text-foreground-muted mt-0.5">
          Dataset: <span className="text-foreground-secondary font-mono">29.420</span> properti
        </div>
      </div>
    </aside>
  );
}
