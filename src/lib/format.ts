import { format, formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  return format(new Date(value), "MMM d, yyyy · h:mm a", { locale: enUS });
}

export function formatRelative(value: string | null | undefined): string {
  if (!value) return "—";
  return formatDistanceToNow(new Date(value), { addSuffix: true, locale: enUS });
}

export function formatMoney(
  value: number | null | undefined,
  currency: "USD" | "EUR",
): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatTelegramUser(
  userId: number,
  username: string | null | undefined,
): string {
  if (username) return `@${username}`;
  return `User ${userId}`;
}

export function truncate(text: string | null | undefined, max = 80): string {
  if (!text) return "—";
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}
