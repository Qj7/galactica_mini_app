"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { RequestStats, StatusFilter } from "@/lib/types";

const FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "done", label: "Done" },
  { value: "failed", label: "Failed" },
];

function countForFilter(stats: RequestStats, filter: StatusFilter): number {
  if (filter === "all") return stats.total;
  return stats[filter];
}

export function StatusFilter({
  active,
  stats,
}: {
  active: StatusFilter;
  stats: RequestStats;
}) {
  const pathname = usePathname();

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
      <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        {FILTERS.map((filter) => {
          const isActive = active === filter.value;
          const href =
            filter.value === "all" ? pathname : `${pathname}?status=${filter.value}`;

          return (
            <Link
              key={filter.value}
              href={href}
              className={`inline-flex min-h-11 snap-start items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.98] ${
                isActive
                  ? "bg-slate-100 text-slate-950 shadow-sm"
                  : "bg-slate-900 text-slate-300 ring-1 ring-slate-700 hover:bg-slate-800"
              }`}
            >
              {filter.label}
              <span
                className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                  isActive ? "bg-slate-950/15 text-slate-950" : "bg-slate-800 text-slate-400"
                }`}
              >
                {countForFilter(stats, filter.value)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
