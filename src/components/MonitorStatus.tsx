import { formatDateTime, formatRelative } from "@/lib/format";
import { formatDuration } from "@/lib/monitor";
import type { ParserRequest } from "@/lib/types";

export function MonitorStatus({ request }: { request: ParserRequest }) {
  if (!request.monitor_enabled) return null;

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
      <p className="font-medium">Monitoring active</p>
      <p className="mt-1 text-xs text-sky-800">
        {request.monitor_interval_seconds
          ? formatDuration(request.monitor_interval_seconds)
          : "—"}
        {request.monitor_until
          ? ` · until ${formatDateTime(request.monitor_until)}`
          : null}
      </p>
      {request.next_check_at ? (
        <p className="mt-1 text-xs text-sky-700">
          Next check {formatRelative(request.next_check_at)}
        </p>
      ) : null}
    </div>
  );
}
