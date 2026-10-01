import { contactCard, hasPhone } from "@/lib/myperson/contact";
import { assess } from "@/lib/myperson/engine";
import { questionnaire } from "@/lib/myperson/questionnaire";
import { answersFrom } from "@/lib/myperson/request";
import { site } from "@/lib/myperson/site";

/**
 * The "Save contact" button posts her answers here. They are checked once more,
 * and only answers that line up get the contact card. Nothing is saved.
 */
export async function POST(request: Request) {
  const notFound = () => new Response("Not found.", { status: 404, headers: { "cache-control": "no-store" } });

  let raw: unknown = null;
  try {
    const form = await request.formData();
    const value = form.get("answers");
    raw = typeof value === "string" && value.length <= 20_000 ? JSON.parse(value) : null;
  } catch {
    return notFound();
  }

  const answers = answersFrom(raw);
  if (!answers || !hasPhone()) return notFound();
  const result = assess(questionnaire, answers);
  if (!result.ok || !result.complete || result.evaluation.result !== "compatible") return notFound();

  return new Response(contactCard(), {
    headers: {
      "content-type": "text/vcard; charset=utf-8",
      // "inline" is what makes iPhones open the Add to Contacts sheet instead of downloading a file.
      "content-disposition": `inline; filename="${site.person.fullName.replace(/\s+/g, "-")}.vcf"`,
      "cache-control": "no-store"
    }
  });
}
