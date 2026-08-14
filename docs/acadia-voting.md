# Acadia Project Voting

Acadia project votes are informal community feedback, not a binding election.

## Data flow

1. The browser requests aggregate totals from `GET /api/acadia/votes`.
2. A resident submits `projectId`, `houseNumber`, and `voteType` to `POST /api/acadia/votes`.
3. The server validates the project, house range, and vote type.
4. Supabase upserts the private row using `(project_id, house_number)` as the primary key.
5. The server returns only aggregate upvote, downvote, and net totals.

House numbers never appear in a public response. The table has row-level security enabled, and
direct access is revoked from Supabase's `anon` and `authenticated` roles. Only the server-side
service role can read or write rows.

## Database setup

Run [`supabase/acadia-votes.sql`](../supabase/acadia-votes.sql) in the HOA Supabase project.

The application uses the same server-only environment variables as the Acadia document assistant:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Never expose the service-role key through a `NEXT_PUBLIC_` environment variable.

## Behavior

- Accepted house numbers: 8000 through 8039.
- One vote per project and house number.
- A later vote from the same house replaces the earlier choice.
- Public responses contain totals only.
- The UI shows totals as unavailable rather than displaying a misleading zero during an outage.
