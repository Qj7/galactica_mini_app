"use client";

import { useState } from "react";

import { MonitorEvents } from "@/components/MonitorEvents";
import { MonitorStatus } from "@/components/MonitorStatus";
import { ProductDetails } from "@/components/ProductDetails";
import { SetMonitorButton } from "@/components/SetMonitorButton";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatDateTime,
  formatRelative,
  formatTelegramUser,
} from "@/lib/format";
import { getRequestPreviewMeta, getRequestTitle } from "@/lib/monitor";
import type { ParserRequest } from "@/lib/types";

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-slate-200 break-words">{value}</p>
    </div>
  );
}

export function RequestCard({
  request,
  onUpdated,
}: {
  request: ParserRequest;
  onUpdated?: () => void | Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const title = getRequestTitle(request);
  const previewMeta = getRequestPreviewMeta(request);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400">{formatRelative(request.created_at)}</p>
            <h2 className="mt-1 text-base font-semibold leading-snug text-slate-100">
              {title}
            </h2>
            {previewMeta ? (
              <p className="mt-1 text-sm text-slate-400">{previewMeta}</p>
            ) : null}
          </div>
          <StatusBadge status={request.status} />
        </div>

        {request.error ? (
          <div className="mt-3 rounded-xl bg-rose-950/50 px-3 py-2.5 text-sm text-rose-300 ring-1 ring-rose-900">
            {request.error}
          </div>
        ) : null}

        {request.monitor_enabled ? (
          <div className="mt-3">
            <MonitorStatus request={request} />
          </div>
        ) : null}

        <div className="mt-4">
          <SetMonitorButton request={request} compact onUpdated={onUpdated} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full min-h-12 items-center justify-between border-t border-slate-800 bg-slate-900/80 px-4 py-3 text-left text-sm font-medium text-slate-300 active:bg-slate-800"
        aria-expanded={expanded}
      >
        <span>{expanded ? "Hide details" : "Show details"}</span>
        <span
          className={`text-slate-500 transition-transform ${expanded ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {expanded ? (
        <div className="space-y-5 border-t border-slate-800 px-4 py-4">
          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Request
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <MetaItem label="Query" value={request.query} />
              <MetaItem
                label="User"
                value={formatTelegramUser(
                  request.telegram_user_id,
                  request.telegram_username,
                )}
              />
              <MetaItem
                label="Search"
                value={request.search_type === "sku" ? "SKU" : "Description"}
              />
              <MetaItem label="Created" value={formatDateTime(request.created_at)} />
              <MetaItem label="Processed" value={formatDateTime(request.processed_at)} />
              <div className="sm:col-span-2">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Request ID
                </p>
                <p className="mt-0.5 break-all font-mono text-xs text-slate-400">
                  {request.id}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Product
            </h3>
            <ProductDetails product={request.product} />
          </section>

          <section>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Detected changes
            </h3>
            <MonitorEvents events={request.monitor_events} />
          </section>
        </div>
      ) : null}
    </article>
  );
}
