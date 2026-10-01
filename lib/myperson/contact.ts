import "server-only";
import { site } from "./site";

/**
 * Your phone number comes from the CONTACT_PHONE environment variable in Vercel
 * (Settings, Environment Variables), never from the code, because the repo is
 * public. It is only read here, on the server, after her answers line up.
 */
function phone(): string {
  return (process.env.CONTACT_PHONE ?? "").trim();
}

export function hasPhone(): boolean {
  return phone().replace(/[^\d]/g, "").length >= 7;
}

/** What the browser gets once she qualifies. */
export interface Contact {
  /** "(407) 555-0123" */
  display: string;
  /** "sms:+14075550123". The page adds her message to it. */
  sms: string;
}

/** "+14075550123" becomes "(407) 555-0123". Anything else is returned as it came in. */
function formatPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

export function contactDetails(): Contact | null {
  if (!hasPhone()) return null;
  return { display: formatPhone(phone()), sms: `sms:${phone()}` };
}

/** A contact card her phone can save in one tap. */
export function contactCard(): string {
  const name = site.person.fullName;
  const [first, ...rest] = name.split(" ");
  const website = site.socials.find((social) => social.id === "website")?.url ?? "";
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${rest.join(" ")};${first};;;`,
    `FN:${name}`,
    `TEL;TYPE=CELL:${phone()}`,
    website ? `URL:${website}` : "",
    `NOTE:We met through ${site.name}.`,
    "END:VCARD"
  ]
    .filter(Boolean)
    .join("\r\n");
}
