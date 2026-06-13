import { formatDateTime, formatRelative } from "@/lib/format";
import {
  diffSellers,
  formatSellerField,
  formatSellerLabel,
  getSellerFieldLabel,
  parseSellersFromValue,
  type SellerChange,
} from "@/lib/sellers";
import type { MonitorChange, MonitorEvent } from "@/lib/types";

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
  sellers: "Sellers",
};

function formatValue(value: unknown): string {
  if (value == null || value === "") return "—";
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2);
  }
  return String(value);
}

function getSellerChanges(change: MonitorChange): SellerChange[] {
  return diffSellers(
    parseSellersFromValue(change.before),
    parseSellersFromValue(change.after),
  );
}

function SellerChangeItem({ change }: { change: SellerChange }) {
  const label = formatSellerLabel(change.seller);

  if (change.type === "added") {
    return (
      <li className="text-sm text-slate-200">
        <span className="font-medium text-emerald-400">Added:</span> {label}
        <span className="text-slate-400">
          {" "}
          · qty {formatSellerField("qty", change.seller.qty)} · net{" "}
          {formatSellerField("price_net", change.seller.price_net, change.seller.currency)}
        </span>
      </li>
    );
  }

  if (change.type === "removed") {
    return (
      <li className="text-sm text-slate-200">
        <span className="font-medium text-rose-400">Removed:</span> {label}
      </li>
    );
  }

  return (
    <li className="text-sm text-slate-200">
      <span className="font-medium">{label}:</span>
      <ul className="mt-1 space-y-0.5 pl-3">
        {change.fields.map((fieldChange) => (
          <li key={fieldChange.field}>
            <span className="text-slate-400">
              {getSellerFieldLabel(fieldChange.field)}:
            </span>{" "}
            <span className="text-slate-500 line-through">
              {formatSellerField(
                fieldChange.field,
                fieldChange.before,
                change.seller.currency,
              )}
            </span>
            {" → "}
            <span className="font-medium text-emerald-400">
              {formatSellerField(
                fieldChange.field,
                fieldChange.after,
                change.seller.currency,
              )}
            </span>
          </li>
        ))}
      </ul>
    </li>
  );
}

function SellerChanges({ change }: { change: MonitorChange }) {
  const sellerChanges = getSellerChanges(change);

  if (sellerChanges.length === 0) {
    return (
      <li className="text-sm text-slate-200">
        <span className="font-medium">{FIELD_LABELS.sellers}:</span> updated
      </li>
    );
  }

  return (
    <li className="space-y-1.5">
      <span className="text-sm font-medium text-slate-200">
        {FIELD_LABELS.sellers}
      </span>
      <ul className="space-y-1.5 border-l border-slate-700 pl-3">
        {sellerChanges.map((sellerChange) => (
          <SellerChangeItem
            key={`${sellerChange.type}-${formatSellerLabel(sellerChange.seller)}`}
            change={sellerChange}
          />
        ))}
      </ul>
    </li>
  );
}

function FieldChangeItem({
  field,
  change,
}: {
  field: string;
  change: MonitorChange;
}) {
  if (field === "sellers" || field === "comment") {
    return <SellerChanges change={change} />;
  }

  return (
    <li className="text-sm text-slate-200">
      <span className="font-medium">{FIELD_LABELS[field] ?? field}:</span>{" "}
      <span className="text-slate-500 line-through">{formatValue(change.before)}</span>
      {" → "}
      <span className="font-medium text-emerald-400">{formatValue(change.after)}</span>
    </li>
  );
}

export function MonitorEvents({ events }: { events: MonitorEvent[] | undefined }) {
  const sorted = [...(events ?? [])].sort(
    (a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-slate-400">No changes detected yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((event) => {
        const fields = Object.entries(event.changes).filter(
          ([field]) => field !== "comment",
        );

        return (
          <div
            key={event.id}
            className="rounded-xl border border-emerald-900 bg-emerald-950/40 p-3"
          >
            <p className="text-xs text-emerald-400">
              {formatRelative(event.checked_at)} · {formatDateTime(event.checked_at)}
            </p>
            <ul className="mt-2 space-y-1.5">
              {fields.length > 0 ? (
                fields.map(([field, change]) => (
                  <FieldChangeItem key={field} field={field} change={change} />
                ))
              ) : event.changes.comment ? (
                <FieldChangeItem field="comment" change={event.changes.comment} />
              ) : (
                <li className="text-sm text-slate-400">No visible changes.</li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
