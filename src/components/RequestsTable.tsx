import { MonitorEvents } from "@/components/MonitorEvents";
import { MonitorStatus } from "@/components/MonitorStatus";
import { ProductDetails } from "@/components/ProductDetails";
import { SetMonitorButton } from "@/components/SetMonitorButton";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatDateTime,
  formatTelegramUser,
  truncate,
} from "@/lib/format";
import type { ParserRequest } from "@/lib/types";

export function RequestsTable({ requests }: { requests: ParserRequest[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Request
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Product
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Monitor
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((request) => (
              <RequestRow key={request.id} request={request} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RequestRow({ request }: { request: ParserRequest }) {
  const product = request.product;
  const hasChanges = (request.monitor_events?.length ?? 0) > 0;

  return (
    <>
      <tr className="align-top hover:bg-slate-50/80">
        <td className="px-4 py-4 whitespace-nowrap">
          <StatusBadge status={request.status} />
        </td>
        <td className="px-4 py-4">
          <div className="max-w-xs">
            <p className="font-medium text-slate-900" title={request.query}>
              {truncate(request.query, 48)}
            </p>
            <p className="mt-1 text-xs capitalize text-slate-500">
              {request.search_type}
            </p>
            {request.error ? (
              <p className="mt-2 text-xs text-rose-600">{request.error}</p>
            ) : null}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-slate-700">
          {formatTelegramUser(
            request.telegram_user_id,
            request.telegram_username,
          )}
        </td>
        <td className="px-4 py-4">
          {product ? (
            <div className="max-w-sm">
              <p className="font-medium text-slate-900">
                {product.sku ?? product.ean ?? "—"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {truncate(product.description, 64)}
              </p>
            </div>
          ) : (
            <span className="text-slate-400">—</span>
          )}
        </td>
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex flex-col gap-2">
            <SetMonitorButton request={request} compact />
            {request.monitor_enabled ? (
              <span className="text-xs text-sky-700">Active</span>
            ) : null}
            {hasChanges ? (
              <span className="text-xs text-emerald-700">Changes logged</span>
            ) : null}
          </div>
        </td>
        <td className="px-4 py-4 whitespace-nowrap text-slate-700">
          {formatDateTime(request.created_at)}
        </td>
      </tr>
      <tr className="bg-slate-50/60">
        <td colSpan={6} className="px-4 py-4">
          <details className="group space-y-4">
            <summary className="cursor-pointer text-sm font-medium text-slate-700 marker:content-none">
              <span className="inline-flex items-center gap-2">
                <span className="text-slate-400 transition group-open:rotate-90">
                  ▸
                </span>
                Details & changes
              </span>
            </summary>
            <div className="space-y-4 border-t border-slate-200 pt-4">
              {request.monitor_enabled ? <MonitorStatus request={request} /> : null}
              <ProductDetails product={product} />
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Detected changes
                </h4>
                <MonitorEvents events={request.monitor_events} />
              </div>
            </div>
          </details>
        </td>
      </tr>
    </>
  );
}
