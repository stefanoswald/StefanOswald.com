import { getPortalState } from "@/lib/acadia-portal/auth";
import { getLedgerExport } from "@/lib/acadia-portal/data";
import { PortalUnavailableError } from "@/lib/acadia-portal/db";
import { todayInFlorida } from "@/lib/acadia-portal/format";

export const dynamic = "force-dynamic";

// Text that starts with one of these could run as a formula when the file is opened in a
// spreadsheet. A leading apostrophe makes the spreadsheet treat it as plain text.
function cell(value: string | number | null) {
  let text = value === null ? "" : String(value);
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET() {
  const state = await getPortalState();
  if (state.status !== "signed_in" || !state.viewer.isBoard) {
    return new Response("Not found", { status: 404 });
  }

  let rows;
  try {
    rows = await getLedgerExport();
  } catch (error) {
    if (error instanceof PortalUnavailableError) {
      return new Response("The records server is not answering right now. Please try again in a few minutes.", { status: 503 });
    }
    throw error;
  }

  const lines = [
    ["Entry", "Date", "Home", "Type", "Amount", "Description", "Due date", "Paid by", "Reference", "Reverses entry", "Recorded at", "Recorded by"].join(",")
  ];
  for (const row of rows) {
    lines.push(
      [
        cell(row.id),
        cell(row.effective_date),
        cell(row.house_number),
        cell(row.kind),
        cell((row.amount_cents / 100).toFixed(2)),
        cell(row.memo),
        cell(row.due_date),
        cell(row.method),
        cell(row.reference),
        cell(row.reverses_id),
        cell(row.created_at),
        cell(row.created_by_name)
      ].join(",")
    );
  }

  return new Response(`${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="acadia-ledger-${todayInFlorida()}.csv"`,
      "Cache-Control": "no-store"
    }
  });
}
