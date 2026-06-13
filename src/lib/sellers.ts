import { formatMoney } from "@/lib/format";

export interface Seller {
  name: string | null;
  country: string | null;
  qty: number | null;
  price_net: number | null;
  price_gross: number | null;
  currency: string;
  deeplink: string | null;
}

export interface SellerFieldChange {
  field: keyof Seller;
  before: unknown;
  after: unknown;
}

export interface SellerChange {
  type: "added" | "removed" | "modified";
  seller: Seller;
  fields: SellerFieldChange[];
}

const SELLER_FIELDS: (keyof Seller)[] = [
  "qty",
  "price_net",
  "price_gross",
  "currency",
  "deeplink",
];

const SELLER_FIELD_LABELS: Record<keyof Seller, string> = {
  name: "Name",
  country: "Country",
  qty: "Qty",
  price_net: "Net",
  price_gross: "Gross",
  currency: "Currency",
  deeplink: "Link",
};

function toNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

function normalizeSeller(raw: Record<string, unknown>): Seller {
  return {
    name: typeof raw.name === "string" ? raw.name : raw.name != null ? String(raw.name) : null,
    country:
      typeof raw.country === "string"
        ? raw.country
        : raw.country != null
          ? String(raw.country)
          : null,
    qty: typeof raw.qty === "number" ? raw.qty : toNumber(raw.qty),
    price_net: toNumber(raw.price_net),
    price_gross: toNumber(raw.price_gross),
    currency: typeof raw.currency === "string" && raw.currency ? raw.currency : "EUR",
    deeplink:
      typeof raw.deeplink === "string"
        ? raw.deeplink
        : raw.deeplink != null
          ? String(raw.deeplink)
          : null,
  };
}

export function parseSellersFromValue(value: unknown): Seller[] {
  if (value == null || value === "") return [];

  let raw: unknown = value;
  if (typeof value === "string") {
    try {
      raw = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is Record<string, unknown> => item != null && typeof item === "object")
    .map(normalizeSeller);
}

export function parseSellers(comment: string | null | undefined): Seller[] {
  return parseSellersFromValue(comment);
}

export function sellerKey(seller: Seller): string {
  return `${seller.name ?? ""}|${seller.country ?? ""}`.toLowerCase();
}

function normalizeComparable(value: unknown): unknown {
  if (typeof value === "number") {
    return Number.isInteger(value) ? value : Number(value.toFixed(4));
  }
  return value ?? null;
}

export function diffSellers(before: Seller[], after: Seller[]): SellerChange[] {
  const beforeMap = new Map(before.map((seller) => [sellerKey(seller), seller]));
  const afterMap = new Map(after.map((seller) => [sellerKey(seller), seller]));
  const changes: SellerChange[] = [];

  for (const [key, seller] of beforeMap) {
    if (!afterMap.has(key)) {
      changes.push({ type: "removed", seller, fields: [] });
    }
  }

  for (const [key, seller] of afterMap) {
    const previous = beforeMap.get(key);
    if (!previous) {
      changes.push({ type: "added", seller, fields: [] });
      continue;
    }

    const fields: SellerFieldChange[] = [];
    for (const field of SELLER_FIELDS) {
      const oldVal = normalizeComparable(previous[field]);
      const newVal = normalizeComparable(seller[field]);
      if (oldVal !== newVal) {
        fields.push({ field, before: previous[field], after: seller[field] });
      }
    }

    if (fields.length > 0) {
      changes.push({ type: "modified", seller, fields });
    }
  }

  return changes.sort((a, b) => {
    const nameA = a.seller.name ?? "";
    const nameB = b.seller.name ?? "";
    return nameA.localeCompare(nameB);
  });
}

export function sellersChanged(before: Seller[], after: Seller[]): boolean {
  return diffSellers(before, after).length > 0;
}

export function formatSellerField(
  field: keyof Seller,
  value: unknown,
  currency?: string,
): string {
  if (value == null || value === "") return "—";

  if (field === "price_net" || field === "price_gross") {
    const amount = toNumber(value);
    if (amount == null) return "—";
    const resolvedCurrency = currency === "USD" ? "USD" : "EUR";
    return formatMoney(amount, resolvedCurrency);
  }

  if (field === "qty") {
    const qty = toNumber(value);
    return qty != null ? String(qty) : "—";
  }

  return String(value);
}

export function formatSellerLabel(seller: Seller): string {
  const parts = [seller.name ?? "Unknown seller"];
  if (seller.country) parts.push(seller.country);
  return parts.join(" · ");
}

export function getSellerFieldLabel(field: keyof Seller): string {
  return SELLER_FIELD_LABELS[field];
}
