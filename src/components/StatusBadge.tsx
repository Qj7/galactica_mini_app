import type { RequestStatus } from "@/lib/types";

const STYLES: Record<RequestStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  processing: "bg-sky-100 text-sky-800 ring-sky-200",
  done: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  failed: "bg-rose-100 text-rose-800 ring-rose-200",
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
