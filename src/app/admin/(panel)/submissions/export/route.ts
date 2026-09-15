import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/token";
import { listSubmissions } from "@/lib/submissions";

// Spreadsheet apps treat cells starting with = + - @ as formulas, so those get a leading quote.
function cell(value: string) {
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET() {
  const session = await verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const submissions = await listSubmissions();
  const fieldKeys = [...new Set(submissions.flatMap((s) => Object.keys(s.fields)))];
  const header = ["type", "submitted_at", "read", ...fieldKeys];
  const rows = submissions.map((s) => [s.type, s.createdAt, s.read ? "yes" : "no", ...fieldKeys.map((k) => s.fields[k] ?? "")]);
  const csv = [header, ...rows].map((row) => row.map((v) => cell(String(v))).join(",")).join("\r\n");

  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="velnora-submissions-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
