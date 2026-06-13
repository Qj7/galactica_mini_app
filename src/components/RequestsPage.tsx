"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { RequestCard } from "@/components/RequestCard";
import { RequestsTable } from "@/components/RequestsTable";
import { StatsBar } from "@/components/StatsBar";
import { StatusFilter } from "@/components/StatusFilter";
import { fetchParserRequests, fetchRequestStats } from "@/lib/supabase";
import type {
  ParserRequest,
  RequestStats,
  RequestStatus,
  StatusFilter as StatusFilterType,
} from "@/lib/types";

const VALID_STATUSES = new Set<RequestStatus>([
  "pending",
  "processing",
  "done",
  "failed",
]);

const EMPTY_STATS: RequestStats = {
  total: 0,
  pending: 0,
  processing: 0,
  done: 0,
  failed: 0,
};

function parseStatus(value: string | null | undefined): StatusFilterType {
  if (value && VALID_STATUSES.has(value as RequestStatus)) {
    return value as RequestStatus;
  }
  return "all";
}

export function RequestsPage() {
  const searchParams = useSearchParams();
  const status = parseStatus(searchParams.get("status"));
  const [requests, setRequests] = useState<ParserRequest[]>([]);
  const [stats, setStats] = useState<RequestStats>(EMPTY_STATS);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      try {
        const [nextRequests, nextStats] = await Promise.all([
          fetchParserRequests(status),
          fetchRequestStats(),
        ]);

        if (cancelled) return;

        setRequests(nextRequests);
        setStats(nextStats);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRequests();

    return () => {
      cancelled = true;
    };
  }, [status, refreshKey]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRefreshKey((value) => value + 1);
    }, 30_000);

    return () => window.clearInterval(intervalId);
  }, []);

  if (loading && requests.length === 0 && !error) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
        Loading requests…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <StatsBar stats={stats} active={status} />
      <StatusFilter active={status} stats={stats} />

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <p className="text-base font-medium text-slate-900">No requests yet</p>
          <p className="mt-2 text-sm text-slate-500">
            New registrations will appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <RequestsTable requests={requests} onUpdated={refresh} />
          </div>
          <div className="flex flex-col gap-3 lg:hidden">
            <p className="text-sm text-slate-500">
              {requests.length} {requests.length === 1 ? "request" : "requests"}
            </p>
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onUpdated={refresh}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
