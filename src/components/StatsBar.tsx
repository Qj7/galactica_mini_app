import type { RequestStats, StatusFilter } from "@/lib/types";

const ITEMS: Array<{
  key: keyof RequestStats | "all";
  label: string;
  accent: string;
}> = [
  { key: "all", label: "Total", accent: "text-slate-900" },
  { key: "pending", label: "Pending", accent: "text-amber-700" },
  { key: "processing", label: "Processing", accent: "text-sky-700" },
  { key: "done", label: "Done", accent: "text-emerald-700" },
  { key: "failed", label: "Failed", accent: "text-rose-700" },
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
            className={`rounded-xl border bg-white p-4 shadow-sm transition ${
              isActive
                ? "border-slate-900 ring-2 ring-slate-900/10"
                : "border-slate-200"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
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
