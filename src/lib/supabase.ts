import { createClient } from "@supabase/supabase-js";

import type { ParserRequest, RequestStats, RequestStatus, StatusFilter } from "./types";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy admin/.env.local.example to .env.local.",
    );
  }

  return { url, key };
}

export function createSupabaseClient() {
  const { url, key } = getSupabaseEnv();
  return createClient(url, key);
}

const REQUEST_SELECT = `
  *,
  product:products (*),
  monitor_events:request_monitor_events (*)
`;

export async function fetchParserRequests(
  status: StatusFilter = "all",
): Promise<ParserRequest[]> {
  const supabase = createSupabaseClient();

  let query = supabase
    .from("parser_requests")
    .select(REQUEST_SELECT)
    .order("created_at", { ascending: false })
    .order("checked_at", {
      referencedTable: "request_monitor_events",
      ascending: false,
    });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to load parser requests: ${error.message}`);
  }

  return (data ?? []) as ParserRequest[];
}

export async function fetchRequestStats(): Promise<RequestStats> {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("parser_requests")
    .select("status");

  if (error) {
    throw new Error(`Failed to load request stats: ${error.message}`);
  }

  const rows = data ?? [];
  const stats: RequestStats = {
    total: rows.length,
    pending: 0,
    processing: 0,
    done: 0,
    failed: 0,
  };

  for (const row of rows) {
    const status = row.status as RequestStatus;
    stats[status] += 1;
  }

  return stats;
}

export async function setRequestMonitor(
  requestId: string,
  intervalSeconds: number,
  durationSeconds: number,
) {
  const supabase = createSupabaseClient();
  const monitorUntil = new Date(Date.now() + durationSeconds * 1000).toISOString();

  const { data, error } = await supabase
    .from("parser_requests")
    .update({
      monitor_enabled: true,
      monitor_interval_seconds: intervalSeconds,
      monitor_until: monitorUntil,
      next_check_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .select(REQUEST_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ParserRequest;
}

export async function disableRequestMonitor(requestId: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("parser_requests")
    .update({
      monitor_enabled: false,
      monitor_interval_seconds: null,
      monitor_until: null,
      next_check_at: null,
    })
    .eq("id", requestId)
    .select(REQUEST_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ParserRequest;
}
