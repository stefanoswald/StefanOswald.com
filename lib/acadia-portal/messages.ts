// Short messages shown at the top of a portal page after an action. The page address carries only
// a code, such as ?ok=entry_posted, never the message text or any private detail.

export const okMessages: Record<string, string> = {
  signed_out: "You are signed out.",
  request_sent: "Your request was sent to the board.",
  note_added: "Your note was added.",
  status_saved: "The request status was updated.",
  homes_added: "The homes were added.",
  person_added: "The person was added. Create a sign-in link so they can get in.",
  person_disabled: "That person can no longer sign in.",
  person_enabled: "That person can sign in again. Create a new sign-in link for them.",
  board_changed: "Board access was updated.",
  entry_posted: "The entry was posted to the ledger.",
  charge_all_posted: "The charge was posted to every home.",
  entry_reversed: "The entry was reversed. Both lines stay on the ledger.",
  duplicate: "That was already saved. Nothing was posted twice.",
  notice_posted: "The notice was posted.",
  notice_removed: "The notice was removed.",
  settings_saved: "The settings were saved.",
  backup_done: "A backup copy was written on the records server."
};

export const errorMessages: Record<string, string> = {
  missing: "Please fill in every required box.",
  amount: "Please enter the amount in dollars, like 1035 or 1035.00.",
  date: "Please enter a valid date.",
  home: "That home could not be found.",
  no_homes: "Add the homes first. There is nothing to post a charge to yet.",
  homes_format: "Use one home per line. Start each line with the house number.",
  not_found: "That record could not be found.",
  reversed_already: "That entry was already reversed.",
  self: "You cannot remove your own access. Ask another board member.",
  category: "Please pick a category.",
  not_allowed: "That action is not allowed.",
  offline: "The records server is not answering right now. Nothing was saved. Please try again in a few minutes."
};

export type LinkState = { url?: string; error?: string };
/** What a form action hands back. "values" lets the form keep what was typed after an error. */
export type FormState = { error?: string; values?: Record<string, string> };
