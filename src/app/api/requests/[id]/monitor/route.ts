import { NextResponse } from "next/server";

import { disableRequestMonitor, setRequestMonitor } from "@/lib/supabase";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let body: { intervalSeconds?: number; durationSeconds?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { intervalSeconds, durationSeconds } = body;
  if (
    !intervalSeconds ||
    !durationSeconds ||
    intervalSeconds <= 0 ||
    durationSeconds <= 0
  ) {
    return NextResponse.json(
      { error: "intervalSeconds and durationSeconds must be positive" },
      { status: 400 },
    );
  }

  try {
    const updated = await setRequestMonitor(id, intervalSeconds, durationSeconds);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to set monitor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const updated = await disableRequestMonitor(id);
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to disable monitor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
