import type { RequestStats, StatusFilter } from "@/lib/types";

const ITEMS: Array<{
  key: keyof RequestStats | "all";
  label: string;
  accent: string;
}> = [
  { key: "all", label: "Total", accent: "text-slate-100" },
  { key: "pending", label: "Pending", accent: "text-amber-400" },
  { key: "processing", label: "Processing", accent: "text-sky-400" },
  { key: "done", label: "Done", accent: "text-emerald-400" },
  { key: "failed", label: "Failed", accent: "text-rose-400" },
];

export function StatsBar({
  stats,
  active,
}: {
  stats: RequestStats;
  active: StatusFilter;
}) {
  return (
    <div className="hidden gap-3 sm:grid sm:grid-cols-3 lg:grid-cols-5">
      {ITEMS.map((item) => {
        const value = item.key === "all" ? stats.total : stats[item.key];
        const isActive = active === item.key;

        return (
          <div
            key={item.key}
            className={`rounded-xl border bg-slate-900 p-4 shadow-sm transition ${
              isActive
                ? "border-slate-500 ring-2 ring-slate-500/20"
                : "border-slate-800"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {item.label}
            </p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums ${item.accent}`}>
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
