import { formatDateTime, formatRelative } from "@/lib/format";
import type { MonitorEvent } from "@/lib/types";

const FIELD_LABELS: Record<string, string> = {
  sku: "SKU",
  description: "Description",
  price_usd: "Price USD",
  price_eur: "Price EUR",
  target_price: "Target price",
  ean: "EAN",
  brand: "Brand",
  category: "Category",
  qty: "Quantity",
  note: "Note",
  source: "Source",
};

function formatValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  return String(value);
}

export function MonitorEvents({ events }: { events: MonitorEvent[] | undefined }) {
  const sorted = [...(events ?? [])].sort(
    (a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-slate-500">No changes detected yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((event) => {
        const fields = Object.entries(event.changes);
        return (
          <div
            key={event.id}
            className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3"
          >
            <p className="text-xs text-emerald-800">
              {formatRelative(event.checked_at)} · {formatDateTime(event.checked_at)}
            </p>
            <ul className="mt-2 space-y-1.5">
              {fields.map(([field, change]) => (
                <li key={field} className="text-sm text-slate-800">
                  <span className="font-medium">{FIELD_LABELS[field] ?? field}:</span>{" "}
                  <span className="text-slate-500 line-through">
                    {formatValue(change.before)}
                  </span>
                  {" → "}
                  <span className="font-medium text-emerald-800">
                    {formatValue(change.after)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
