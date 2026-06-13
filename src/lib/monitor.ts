import {
  MONITOR_DURATION_OPTIONS,
  MONITOR_INTERVAL_OPTIONS,
  type MonitorOption,
  type ParserRequest,
} from "@/lib/types";

export function formatDuration(seconds: number): string {
  const option = [...MONITOR_INTERVAL_OPTIONS, ...MONITOR_DURATION_OPTIONS].find(
    (item) => item.seconds === seconds,
  );
  if (option) return option.label;

  if (seconds < 3600) return `Every ${Math.round(seconds / 60)} min`;
  if (seconds < 86400) return `Every ${Math.round(seconds / 3600)} h`;
  return `Every ${Math.round(seconds / 86400)} d`;
}

export function findMonitorOption(
  options: MonitorOption[],
  seconds: number | null | undefined,
): MonitorOption | undefined {
  if (!seconds) return undefined;
  return options.find((option) => option.seconds === seconds);
}

export function getRequestTitle(request: ParserRequest): string {
  const product = request.product;
  if (product?.sku) return product.sku;
  if (product?.ean) return product.ean;
  return request.query;
}

export function getRequestPreviewMeta(request: ParserRequest): string | null {
  const product = request.product;
  if (!product) return null;

  const parts: string[] = [];
  if (product.price_eur != null) {
    parts.push(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(product.price_eur),
    );
  }
  if (product.qty != null) parts.push(`Qty ${product.qty}`);
  if (product.brand) parts.push(product.brand);

  return parts.length > 0 ? parts.join(" · ") : null;
}
