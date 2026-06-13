"use client";

import { useState } from "react";

import {
  MONITOR_DURATION_OPTIONS,
  MONITOR_INTERVAL_OPTIONS,
  type ParserRequest,
} from "@/lib/types";
import { disableRequestMonitor, setRequestMonitor } from "@/lib/supabase";

function TimerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2.5 1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3h6" strokeLinecap="round" />
    </svg>
  );
}

export function SetMonitorButton({
  request,
  compact = false,
  onUpdated,
}: {
  request: ParserRequest;
  compact?: boolean;
  onUpdated?: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(
    MONITOR_INTERVAL_OPTIONS[1].seconds,
  );
  const [durationSeconds, setDurationSeconds] = useState(
    MONITOR_DURATION_OPTIONS[2].seconds,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveMonitor() {
    setLoading(true);
    setError(null);
    try {
      await setRequestMonitor(request.id, intervalSeconds, durationSeconds);
      setOpen(false);
      await onUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save monitor");
    } finally {
      setLoading(false);
    }
  }

  async function stopMonitor() {
    setLoading(true);
    setError(null);
    try {
      await disableRequestMonitor(request.id);
      setOpen(false);
      await onUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to stop monitor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.98] ${
          compact
            ? "min-h-10 px-3 py-2 text-sm"
            : "min-h-11 px-4 py-2.5 text-sm"
        }`}
      >
        <TimerIcon className="h-4 w-4 shrink-0" />
        Set timeout
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center">
          <div
            className="absolute inset-0"
            onClick={() => !loading && setOpen(false)}
            aria-hidden
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                <TimerIcon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Set timeout</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Periodically re-check this product via API and log any changes.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <label className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm font-medium text-slate-700">
                  Check every
                </span>
                <select
                  value={intervalSeconds}
                  onChange={(event) => setIntervalSeconds(Number(event.target.value))}
                  className="select-input min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none ring-sky-500 focus:ring-2"
                  disabled={loading}
                >
                  {MONITOR_INTERVAL_OPTIONS.map((option) => (
                    <option key={option.seconds} value={option.seconds}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-sm font-medium text-slate-700">For</span>
                <select
                  value={durationSeconds}
                  onChange={(event) => setDurationSeconds(Number(event.target.value))}
                  className="select-input min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none ring-sky-500 focus:ring-2"
                  disabled={loading}
                >
                  {MONITOR_DURATION_OPTIONS.map((option) => (
                    <option key={option.seconds} value={option.seconds}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {error ? (
              <p className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {request.monitor_enabled ? (
                <button
                  type="button"
                  onClick={stopMonitor}
                  disabled={loading}
                  className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-medium text-rose-700 ring-1 ring-rose-200 hover:bg-rose-50 disabled:opacity-60"
                >
                  Stop monitoring
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveMonitor}
                disabled={loading}
                className="min-h-11 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {loading ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
