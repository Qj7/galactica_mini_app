export type RequestStatus = "pending" | "processing" | "done" | "failed";
export type SearchType = "sku" | "description";

export interface Product {
  id: string;
  sku: string | null;
  description: string | null;
  price_usd: number | null;
  price_eur: number | null;
  ean: string | null;
  brand: string | null;
  category: string | null;
  qty: number | null;
  source: string | null;
  target_price: number | null;
  qty_order: number | null;
  comment: string | null;
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonitorChange {
  before: unknown;
  after: unknown;
}

export interface MonitorEvent {
  id: string;
  request_id: string;
  product_id: string;
  changes: Record<string, MonitorChange>;
  checked_at: string;
}

export interface ParserRequest {
  id: string;
  product_id: string;
  search_type: SearchType;
  query: string;
  status: RequestStatus;
  error: string | null;
  telegram_user_id: number;
  telegram_username: string | null;
  monitor_enabled: boolean;
  monitor_interval_seconds: number | null;
  monitor_until: string | null;
  next_check_at: string | null;
  last_checked_at: string | null;
  created_at: string;
  processed_at: string | null;
  product: Product | null;
  monitor_events?: MonitorEvent[];
}

export type StatusFilter = RequestStatus | "all";

export interface RequestStats {
  total: number;
  pending: number;
  processing: number;
  done: number;
  failed: number;
}

export interface MonitorOption {
  label: string;
  seconds: number;
}

export const MONITOR_INTERVAL_OPTIONS: MonitorOption[] = [
  { label: "Every 5 minutes", seconds: 5 * 60 },
  { label: "Every 15 minutes", seconds: 15 * 60 },
  { label: "Every 30 minutes", seconds: 30 * 60 },
  { label: "Every hour", seconds: 60 * 60 },
  { label: "Every 6 hours", seconds: 6 * 60 * 60 },
  { label: "Every 24 hours", seconds: 24 * 60 * 60 },
];

export const MONITOR_DURATION_OPTIONS: MonitorOption[] = [
  { label: "1 hour", seconds: 60 * 60 },
  { label: "6 hours", seconds: 6 * 60 * 60 },
  { label: "24 hours", seconds: 24 * 60 * 60 },
  { label: "7 days", seconds: 7 * 24 * 60 * 60 },
  { label: "30 days", seconds: 30 * 24 * 60 * 60 },
];
