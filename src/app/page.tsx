import { Header } from "@/components/Header";
import { RequestCard } from "@/components/RequestCard";
import { RequestsTable } from "@/components/RequestsTable";
import { StatsBar } from "@/components/StatsBar";
import { StatusFilter } from "@/components/StatusFilter";
import { fetchParserRequests, fetchRequestStats } from "@/lib/supabase";
import type { RequestStatus, StatusFilter as StatusFilterType } from "@/lib/types";

export const revalidate = 30;

const VALID_STATUSES = new Set<RequestStatus>([
  "pending",
  "processing",
  "done",
  "failed",
]);

function parseStatus(value: string | undefined): StatusFilterType {
  if (value && VALID_STATUSES.has(value as RequestStatus)) {
    return value as RequestStatus;
  }
  return "all";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const status = parseStatus(params.status);

  let requests: Awaited<ReturnType<typeof fetchParserRequests>> = [];
  let stats: Awaited<ReturnType<typeof fetchRequestStats>> = {
    total: 0,
    pending: 0,
    processing: 0,
    done: 0,
    failed: 0,
  };
  let error: string | null = null;

  try {
    [requests, stats] = await Promise.all([
      fetchParserRequests(status),
      fetchRequestStats(),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load data";
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <StatsBar stats={stats} active={status} />
            <StatusFilter active={status} stats={stats} />

            {requests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <p className="text-base font-medium text-slate-900">
                  No requests yet
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  New registrations will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden lg:block">
                  <RequestsTable requests={requests} />
                </div>
                <div className="flex flex-col gap-3 lg:hidden">
                  <p className="text-sm text-slate-500">
                    {requests.length} {requests.length === 1 ? "request" : "requests"}
                  </p>
                  {requests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </>
  );
}
