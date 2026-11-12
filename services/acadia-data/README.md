# Acadia data service

This is the database for the Acadia Estates owner portal. It keeps every record in one SQLite file
on a machine the board runs itself. Nothing is stored with a database company.

## How the pieces fit

```
Owner's browser  ->  Website on Vercel  ->  secure tunnel  ->  this service  ->  acadia.db
```

- The website cannot hold a database file. It asks this service for records over HTTPS.
- Every request must carry a long shared key. Without the key the service answers nothing.
- The tunnel gives the service a steady https address. No port is opened on the router.
- The service is one file, `server.mjs`. It has no dependencies. It needs Node 22.13 or newer.

What this means in practice:

- If this machine or its internet is down, owners cannot sign in and votes show as unavailable.
  The rest of the Acadia site keeps working. Nothing is lost. The portal comes back when the
  machine does.
- The board owns the backups. The service writes one copy a day. Keep that folder in the
  machine's normal backup as well.

## What you need

1. A machine that stays on. A NAS that runs Docker is the best fit.
2. A tunnel. Pick one:
   - **Tailscale Funnel.** Free. Gives an address ending in `.ts.net`. No domain needed.
   - **Cloudflare Tunnel.** Free. Needs a domain that uses Cloudflare for DNS. A good fit once
     Acadia has its own domain.
3. Three settings on Vercel (see below).

The tunnel steps here follow the vendors' own instructions. They have not been run on the board's
machine yet. Check them against the linked pages when you set up.

## Set up on a NAS with Docker

1. Copy this folder (`services/acadia-data`) to the NAS. Put it somewhere that is backed up.
2. Copy `.env.example` to `.env` in the same folder.
3. Make a long random key and put it in `.env` as `ACADIA_DATA_KEY`. For example:

   ```
   openssl rand -base64 48
   ```

4. Fill in the tunnel values in `.env` (see the tunnel sections below).
5. Start it. On Synology, open Container Manager, choose Project, create a project from this
   folder, and use `compose.yaml`. From a command line it is one of these:

   ```
   docker compose --profile tailscale up -d
   docker compose --profile cloudflare up -d
   ```

6. Check it. From any browser, open `https://YOUR-ADDRESS/health`. It should show
   `{"ok":true,"service":"acadia-data"}`.

The database appears at `data/acadia.db`. Daily copies appear in `data/backups`.

### Tunnel option A: Tailscale Funnel

Vendor page: https://tailscale.com/kb/1223/tailscale-funnel

1. Create a Tailscale account. The free plan is enough.
2. In the Tailscale admin console, turn on MagicDNS and HTTPS certificates.
3. Allow Funnel in the access policy. Funnel is off until the policy allows it.
4. Create an auth key under Settings, Keys. Put it in `.env` as `TS_AUTHKEY`.
5. Start with the `tailscale` profile.
6. The address is `https://acadia-data.YOUR-TAILNET.ts.net`. The admin console shows the exact name.

Funnel only serves on ports 443, 8443, and 10000. `funnel.json` uses 443 and passes requests to the
data service.

### Tunnel option B: Cloudflare Tunnel

Vendor page: https://developers.cloudflare.com/tunnel/

1. The domain must use Cloudflare for DNS.
2. In the Cloudflare dashboard, create a tunnel. Copy its token into `.env` as `CF_TUNNEL_TOKEN`.
3. Add a public hostname, such as `data.YOUR-DOMAIN`. Point it at `http://acadia-data:8787`.
4. Start with the `cloudflare` profile.

Do not use a Cloudflare quick tunnel (`trycloudflare.com`). Its address changes on every restart.

## Run it without Docker

On a Mac or any machine with Node 22.13 or newer:

```
ACADIA_DATA_KEY="the long key" ACADIA_DATA_DIR="/path/to/acadia-data" node server.mjs
```

It listens on `127.0.0.1:8787`. Point the tunnel at that address. Use a launchd agent (Mac) or a
service manager so it starts again after a restart.

## Settings on Vercel

Add these to the site's environment variables, for Production. Then redeploy.

| Name | Value |
| --- | --- |
| `ACADIA_DATA_URL` | The tunnel address, starting with `https://` |
| `ACADIA_DATA_KEY` | The same key as in `.env` on the machine |
| `ACADIA_ADMIN_KEY` | A second long random secret, at least 24 characters. It lets the first board member in. |

Leave them off Preview deployments. A preview should never touch the real records.

Then open `/Acadia/portal/setup` on the site, enter the admin key, and you are in as a board member.
The site creates its own tables the first time it connects. There is nothing to run by hand.

## Backups and restore

- The service writes `data/backups/acadia-YYYY-MM-DD.db` once a day and keeps the last 30.
- A board member can also press "Write a backup now" on the portal's Settings page.
- To restore: stop the service. Copy a backup file over `data/acadia.db`. Delete `acadia.db-wal`
  and `acadia.db-shm` if they exist. Start the service.

## Changing the key

1. Put the new key in `.env` and restart the service.
2. Put the same key in `ACADIA_DATA_KEY` on Vercel and redeploy.

The portal is offline between the two steps. Do them one right after the other.

## Safety notes

- The key is the lock on the database. Keep it only in `.env` on the machine and in Vercel. Never
  put it in the code, in chat, or in email.
- The service refuses statements that could reach other files (`ATTACH`, `PRAGMA`, `VACUUM`).
- The request log never includes names, balances, or any other values.
- The ledger and the change log reject edits and deletes. Rules inside the database block them,
  and the portal has no button for it. Someone holding the key could remove those rules, so guard
  the key. The daily backups are the record of what the ledger said on each day.
- Sign-in links and sessions are stored only as hashes. A copy of the database cannot be used to
  sign in as someone.

## Tests

```
node --test services/acadia-data/test.mjs
```

The tests start the real service on a spare port with a throwaway folder and a made-up key.
