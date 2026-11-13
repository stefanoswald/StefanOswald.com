# Acadia Project Voting

Acadia project votes are informal community feedback, not a binding election.

## Data flow

1. The browser requests aggregate totals from `GET /api/acadia/votes`.
2. A resident submits `projectId`, `houseNumber`, and `voteType` to `POST /api/acadia/votes`.
3. The server validates the project, house range, and vote type.
4. The vote is saved in the `project_votes` table of the Acadia portal database, with
   `(project_id, house_number)` as the primary key.
5. The server returns only aggregate upvote, downvote, and net totals.

House numbers never appear in a public response.

## Where the votes live

Votes used to live in Supabase. They now live in the same SQLite file as the owner portal, on a
machine the board runs itself. The website reaches that file through the Acadia data service. See
[`services/acadia-data/README.md`](../services/acadia-data/README.md).

The table is created by the site itself (`lib/acadia-portal/schema.ts`). There is nothing to run by
hand. The site needs these server-only settings on Vercel:

- `ACADIA_DATA_URL`
- `ACADIA_DATA_KEY`

Never expose either one through a `NEXT_PUBLIC_` setting.

Votes cast while the site used Supabase were not carried over. That Supabase project could no
longer be reached when the move was made.

## Behavior

- Accepted house numbers: 8000 through 8039.
- One vote per project and house number.
- A later vote from the same house replaces the earlier choice.
- Public responses contain totals only.
- Totals are remembered for 30 seconds, so a busy page does not keep asking the home server.
- If the home server is offline, the UI shows totals as unavailable. It never shows a misleading zero.
- A visitor who sends a burst of votes is asked to wait a few minutes.
