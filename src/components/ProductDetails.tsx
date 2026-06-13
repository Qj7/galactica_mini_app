import {
  formatDateTime,
  formatMoney,
  truncate,
} from "@/lib/format";
import type { Product } from "@/lib/types";

function Field({
  label,
  value,
  mono = false,
  fullWidth = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "col-span-full" : undefined}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-sm text-slate-900 ${mono ? "font-mono text-xs break-all" : ""}`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}

export function ProductSummary({ product }: { product: Product | null }) {
  if (!product) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        Product not found or deleted
      </div>
    );
  }

  const identifier = product.sku ?? product.ean ?? "No SKU";

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm font-semibold text-slate-900">
            {identifier}
          </p>
          {product.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">
              {product.description}
            </p>
          ) : null}
          {(product.brand || product.source) && (
            <p className="mt-2 text-xs text-slate-500">
              {[product.brand, product.source].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {product.price_usd != null && (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
            {formatMoney(product.price_usd, "USD")}
          </span>
        )}
        {product.price_eur != null && (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
            {formatMoney(product.price_eur, "EUR")}
          </span>
        )}
        {product.qty != null && (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
            Qty {product.qty}
          </span>
        )}
      </div>
    </div>
  );
}

export function ProductDetails({ product }: { product: Product | null }) {
  if (!product) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Product not found or deleted
      </div>
    );
  }

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="SKU" value={product.sku ?? "—"} mono />
      <Field label="EAN" value={product.ean ?? "—"} mono />
      <Field label="Brand" value={product.brand ?? "—"} />
      <Field label="Category" value={product.category ?? "—"} />
      <Field label="Price USD" value={formatMoney(product.price_usd, "USD")} />
      <Field label="Price EUR" value={formatMoney(product.price_eur, "EUR")} />
      <Field label="Target price" value={formatMoney(product.target_price, "EUR")} />
      <Field label="Quantity" value={product.qty != null ? String(product.qty) : "—"} />
      <Field label="Order qty" value={product.qty_order != null ? String(product.qty_order) : "—"} />
      <Field label="Source" value={product.source ?? "—"} />
      <Field label="Updated" value={formatDateTime(product.updated_at)} />
      <Field
        label="Description"
        value={truncate(product.description, 120)}
        fullWidth
      />
      {product.comment ? (
        <Field label="Comment" value={product.comment} fullWidth />
      ) : null}
      {product.note ? (
        <Field label="Note" value={product.note} fullWidth />
      ) : null}
    </dl>
  );
}
