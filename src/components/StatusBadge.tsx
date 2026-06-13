import type { RequestStatus } from "@/lib/types";

const STYLES: Record<RequestStatus, string> = {
  pending: "bg-amber-950 text-amber-300 ring-amber-800",
  processing: "bg-sky-950 text-sky-300 ring-sky-800",
  done: "bg-emerald-950 text-emerald-300 ring-emerald-800",
  failed: "bg-rose-950 text-rose-300 ring-rose-800",
};

const LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  done: "Done",
  failed: "Failed",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
