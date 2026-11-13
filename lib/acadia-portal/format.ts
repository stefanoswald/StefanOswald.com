// Money and date helpers for the portal. Money is always kept as whole cents.

const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function formatCents(cents: number) {
  return dollars.format(cents / 100);
}

/** Turns "1,035", "$1035.5", or "1035.50" into cents. Returns null when the text is not an amount. */
export function parseDollars(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(cleaned)) return null;
  const [whole, fraction = ""] = cleaned.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return cents > 0 ? cents : null;
}

const HOA_TIME_ZONE = "America/New_York";

/** Today's date in Florida, as YYYY-MM-DD. */
export function todayInFlorida(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: HOA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const dayFormat = new Intl.DateTimeFormat("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: HOA_TIME_ZONE,
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit"
});

/** "2027-01-01" becomes "Jan 1, 2027". */
export function formatDate(value: string | null | undefined) {
  if (!value || !isValidDate(value)) return "";
  return dayFormat.format(new Date(`${value}T00:00:00Z`));
}

/** A saved timestamp shown in Florida time, for example "Nov 12, 2026, 5:46 PM". */
export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : timeFormat.format(date);
}

export function receiptNumber(entryId: number) {
  return `R-${String(entryId).padStart(5, "0")}`;
}

export function cleanText(value: FormDataEntryValue | null, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}
