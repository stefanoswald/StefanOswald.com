"""Browser walk-through of the real owner portal. It checks sign-in, the ledger, requests, and
above all the access rules: what an owner must never be able to see or do.

Run it only against a test copy on your own computer. It adds test homes, people, and payments.
It refuses to run against any address that is not localhost. Every name and amount is made up.

How to run it:

1. Make a throwaway settings file, for example /tmp/acadia-e2e.env:

     ACADIA_DATA_KEY=<40 or more random letters and numbers>
     ACADIA_ADMIN_KEY=<30 or more random letters and numbers>
     ACADIA_DATA_DIR=/tmp/acadia-e2e-data

   The data folder must be empty or missing at the start.

2. Start the data service with those values:

     ACADIA_DATA_KEY=... ACADIA_DATA_DIR=/tmp/acadia-e2e-data node services/acadia-data/server.mjs

3. Build and start the site with the same two keys:

     npm run build
     ACADIA_DATA_URL=http://127.0.0.1:8787 ACADIA_DATA_KEY=... ACADIA_ADMIN_KEY=... npx next start -p 3210

4. Run the walk-through (needs Python with the playwright package and a Chrome or Chromium):

     python3 scripts/acadia-portal/e2e.py /tmp/acadia-e2e.env [folder for screenshots]

   Set CHROME_PATH if playwright should use a browser that is already installed.

Partway through, the script stops and restarts the data service to prove the site handles an outage.
"""
import json
import os
import re
import subprocess
import sys
import time
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import expect, sync_playwright

env = dict(line.strip().split("=", 1) for line in open(sys.argv[1]) if "=" in line and not line.startswith("#"))
BASE = os.environ.get("PORTAL_BASE", "http://localhost:3210").rstrip("/")
DATA_URL = env.get("ACADIA_DATA_URL", "http://127.0.0.1:8787").rstrip("/")
DATA_DIR = env["ACADIA_DATA_DIR"]
SHOTS = sys.argv[2] if len(sys.argv) > 2 else None
ADMIN_KEY = env["ACADIA_ADMIN_KEY"]
SERVER = Path(__file__).resolve().parents[2] / "services" / "acadia-data" / "server.mjs"

for address in (BASE, DATA_URL):
    if urlparse(address).hostname not in ("localhost", "127.0.0.1"):
        sys.exit(f"Refusing to run against {address}. This walk-through is for a test copy on your own computer only.")

results = []
issues = []


def check(name, condition, detail=""):
    results.append((name, bool(condition), detail))
    print(("PASS " if condition else "FAIL ") + name + (f"  [{detail}]" if detail and not condition else ""))


def watch(page, label):
    page.on("pageerror", lambda e: issues.append(f"{label} PAGEERROR {e}"))
    page.on("console", lambda m: issues.append(f"{label} CONSOLE {m.text[:200]}") if m.type == "error" else None)


def flash(page):
    # Scoped to <main>, since Next.js keeps its own hidden role="alert" element for screen readers.
    loc = page.locator('main [role="status"], main [role="alert"]').first
    return loc.inner_text() if loc.count() else ""


def saw(page, text):
    """True once the message line on the page shows this text."""
    try:
        expect(page.locator('main [role="status"], main [role="alert"]').first).to_contain_text(text, timeout=8000)
        return True
    except AssertionError:
        return False


def shot(page, name, full=True):
    if SHOTS:
        page.screenshot(path=f"{SHOTS}/{name}.png", full_page=full)


with sync_playwright() as p:
    chrome = os.environ.get("CHROME_PATH")
    browser = p.chromium.launch(executable_path=chrome, args=["--no-sandbox"]) if chrome else p.chromium.launch()

    # ---------------- Board member ----------------
    board_ctx = browser.new_context(viewport={"width": 1280, "height": 900})
    board = board_ctx.new_page()
    watch(board, "board")

    board.goto(f"{BASE}/Acadia/portal/setup", wait_until="networkidle")
    board.get_by_label("Admin key").fill("definitely-not-the-right-key-000000")
    board.get_by_label("Your name").fill("Test Board Member")
    board.get_by_label("Your email").fill("board@example.com")
    board.get_by_role("button", name="Sign in as a board member").click()
    board.wait_for_selector('main [role="alert"]')
    check("setup: wrong admin key is refused", saw(board, "not right"), flash(board))

    check("setup: typed name and email are kept after an error", board.get_by_label("Your name").input_value() == "Test Board Member" and board.get_by_label("Your email").input_value() == "board@example.com")
    board.get_by_label("Admin key").fill(ADMIN_KEY)
    board.get_by_label("Your house number").fill("8001")
    board.get_by_role("button", name="Sign in as a board member").click()
    board.wait_for_url("**/Acadia/portal/board")
    check("setup: right admin key signs in as board", "/Acadia/portal/board" in board.url)
    cookies = board_ctx.cookies()
    session_cookie = [c for c in cookies if "acadia_session" in c["name"]]
    check("session cookie is HttpOnly and SameSite=Lax", session_cookie and session_cookie[0]["httpOnly"] and session_cookie[0]["sameSite"] == "Lax", str(session_cookie))

    # Add homes
    board.goto(f"{BASE}/Acadia/portal/board/settings", wait_until="networkidle")
    board.get_by_label("Add homes").fill("8001, Sample Street\n8002, Sample Street\n8003, Sample Street\n8004, Sample Street\n8005, Sample Street")
    board.get_by_role("button", name="Add homes").click()
    board.wait_for_url("**ok=homes_added")
    check("homes: bulk add", saw(board, "homes were added"), flash(board))

    board.goto(f"{BASE}/Acadia/portal/board", wait_until="networkidle")
    check("board: five homes listed", board.locator("tbody tr").count() == 5, str(board.locator("tbody tr").count()))
    check("homes: a missing street is filled in for a home that already existed", "Sample Street" in board.locator("tr", has_text="8001").inner_text())

    # Add an owner to 8003 and make a sign-in link
    board.get_by_role("link", name="8003", exact=True).click()
    board.wait_for_url("**/board/homes/*")
    home3_url = board.url.split("?")[0]
    board.get_by_label("Name", exact=True).fill("Test Owner")
    board.get_by_label("Email").fill("owner@example.com")
    board.get_by_role("button", name="Add person").click()
    board.wait_for_url("**ok=person_added")
    check("people: owner added", saw(board, "person was added"), flash(board))

    board.get_by_role("button", name="Create sign-in link").click()
    link_input = board.get_by_label("Sign-in link for Test Owner")
    link_input.wait_for()
    owner_link = link_input.input_value()
    check("link: uses a # fragment for the secret", re.search(r"/Acadia/portal/enter#[A-Za-z0-9_-]{40,}$", owner_link) is not None, owner_link[:60])

    # Post dues to every home
    board.goto(f"{BASE}/Acadia/portal/board/billing", wait_until="networkidle")
    all_form = board.locator("form", has=board.get_by_role("button", name=re.compile("Post to all")))
    all_form.get_by_label("Amount per home in dollars").fill("1,035.00")
    all_form.get_by_label("Description").fill("Q1 2027 dues")
    all_form.get_by_label("Due date").fill("2027-01-01")
    all_form.get_by_role("button", name=re.compile("Post to all")).click()
    board.wait_for_url("**ok=charge_all_posted")
    check("billing: charge posted to every home", saw(board, "every home"), flash(board))
    shot(board, "board-billing")

    # Bad amount is refused
    all_form = board.locator("form", has=board.get_by_role("button", name=re.compile("Post to all")))
    amount_box = all_form.get_by_label("Amount per home in dollars")
    amount_box.fill("abc")
    check("billing: the browser flags a bad amount before sending", amount_box.evaluate("el => !el.checkValidity()"))
    # Take the browser check away to prove the server refuses it too.
    amount_box.evaluate("el => el.removeAttribute('pattern')")
    all_form.get_by_label("Description").fill("Bad amount")
    all_form.get_by_role("button", name=re.compile("Post to all")).click()
    board.wait_for_url("**error=amount")
    check("billing: a bad amount is refused", saw(board, "amount in dollars"), flash(board))

    board.goto(f"{BASE}/Acadia/portal/board", wait_until="networkidle")
    body = board.locator("main").inner_text()
    check("board: total owed is 5 x $1,035", "$5,175.00" in body, body[:300])
    check("board: nothing past due before the due date", "$0.00" in board.locator("text=Past due").first.locator("xpath=..").inner_text())

    # Record a payment for 8003, then test the double-send guard
    board.goto(home3_url, wait_until="networkidle")
    pay = board.locator("details", has_text="Record a payment").first
    nonce = pay.locator('input[name="nonce"]').input_value()
    pay.get_by_label("Amount in dollars").fill("1035")
    pay.get_by_label("Check number or reference").fill("1234")
    pay.get_by_label("Description").fill("Q1 2027 dues")
    pay.get_by_role("button", name="Record payment").click()
    board.wait_for_url("**ok=entry_posted")
    check("ledger: payment recorded", saw(board, "posted to the ledger"), flash(board))

    pay = board.locator("details", has_text="Record a payment").first
    pay.locator('input[name="nonce"]').evaluate("(el, v) => { el.value = v; }", nonce)
    pay.get_by_label("Amount in dollars").fill("1035")
    pay.get_by_role("button", name="Record payment").click()
    board.wait_for_url("**ok=duplicate")
    check("ledger: the same form sent twice posts once", saw(board, "Nothing was posted twice"), flash(board))
    check("ledger: 8003 balance is zero after one payment", "$0.00" in board.locator("text=Balance owed").first.locator("xpath=..").inner_text())

    # Charge to this home only, then reverse it
    charge = board.locator("details", has_text="Post a charge to this home only").first
    charge.locator("summary").click()
    charge.get_by_label("Amount in dollars").fill("25")
    charge.get_by_label("Description").fill("Late fee entered by mistake")
    charge.get_by_role("button", name="Post charge").click()
    board.wait_for_url("**ok=entry_posted")

    row = board.locator("tr", has_text="Late fee entered by mistake").first
    row.locator("summary", has_text="Reverse this entry").click()
    row.get_by_label("Why is this being reversed?").fill("Entered on the wrong home")
    row.get_by_role("button", name="Post the reversal").click()
    board.wait_for_url("**ok=entry_reversed")
    check("ledger: reversal posted", saw(board, "was reversed"), flash(board))
    ledger_text = board.locator("table").first.inner_text()
    check("ledger: both the charge and its reversal remain", "Reversed: Late fee entered by mistake" in ledger_text and ledger_text.count("Late fee entered by mistake") == 2)
    check("ledger: reversed entry has no second reverse control", board.locator("tr", has_text="Late fee entered by mistake").locator("summary").count() == 0)
    shot(board, "board-home-detail")

    # A payment on another home, for the access test later
    board.goto(f"{BASE}/Acadia/portal/board/billing", wait_until="networkidle")
    pay_any = board.locator("form", has=board.get_by_role("button", name="Record payment"))
    pay_any.get_by_label("Home").select_option(label="8002")
    pay_any.get_by_label("Amount in dollars").fill("500.00")
    pay_any.get_by_label("Paid by").select_option("Cash")
    pay_any.get_by_role("button", name="Record payment").click()
    board.wait_for_url("**ok=entry_posted")

    # Notice and how-to-pay note
    board.goto(f"{BASE}/Acadia/portal/board/settings", wait_until="networkidle")
    board.get_by_label("Title").fill("Test notice")
    board.get_by_label("Message").fill("This is a test notice for the proof of concept.")
    board.get_by_role("button", name="Post notice").click()
    board.wait_for_url("**ok=notice_posted")
    board.get_by_label("Note shown to owners on their home page").fill("Test note: mail a check to the association for now.")
    board.get_by_role("button", name="Save note").click()
    board.wait_for_url("**ok=settings_saved")
    check("settings: notice and pay note saved", saw(board, "settings were saved"), flash(board))
    board.wait_for_load_state("networkidle")
    check("settings: records server shows online with a backup", "Online" in board.locator("main").inner_text() and "acadia-" in board.locator("main").inner_text())

    # The board member's own request, from their owner view (home 8001)
    board.goto(f"{BASE}/Acadia/portal/home/requests", wait_until="networkidle")
    board.get_by_label("Category").select_option("Question for the board")
    board.get_by_label("Subject").fill("Board member's own request")
    board.get_by_label("Details").fill("Private to home 8001.")
    board.get_by_role("button", name="Send request").click()
    board.wait_for_url("**/home/requests/*ok=request_sent")
    other_request_id = re.search(r"/requests/(\d+)", board.url).group(1)

    # ---------------- Owner ----------------
    owner_ctx = browser.new_context(viewport={"width": 1280, "height": 900})
    owner = owner_ctx.new_page()
    watch(owner, "owner")
    owner.goto(owner_link, wait_until="networkidle")
    owner.get_by_role("button", name="Sign in to the owner portal").wait_for()
    check("enter: the secret is removed from the address bar", "#" not in owner.url, owner.url)
    owner.get_by_role("button", name="Sign in to the owner portal").click()
    owner.wait_for_url("**/Acadia/portal/home")
    text = owner.locator("main").inner_text()
    check("owner: lands on their own home", "HOME 8003" in text.upper() and "Hello, Test" in text, text[:200])
    check("owner: balance shows paid up", "Paid up" in text)
    check("owner: sees the notice and the pay note", "Test notice" in text and "mail a check" in text)
    check("owner: no board tools in the menu", owner.get_by_role("link", name="Billing").count() == 0)
    shot(owner, "owner-home")

    # The link cannot be used a second time
    third_ctx = browser.new_context()
    third = third_ctx.new_page()
    third.goto(owner_link, wait_until="networkidle")
    third.get_by_role("button", name="Sign in to the owner portal").click()
    third.wait_for_selector('main [role="alert"]')
    check("enter: a used link is refused", saw(third, "already been used"), flash(third))
    third.goto(f"{BASE}/Acadia/portal/home", wait_until="networkidle")
    check("enter: a refused link leaves the visitor signed out", "/sign-in" in third.url, third.url)
    third_ctx.close()

    # Owner ledger and receipt
    owner.goto(f"{BASE}/Acadia/portal/home/ledger", wait_until="networkidle")
    check("owner ledger: four lines", owner.locator("tbody tr").count() == 4, str(owner.locator("tbody tr").count()))
    check("owner ledger: no reverse control for owners", owner.locator("summary", has_text="Reverse this entry").count() == 0)
    shot(owner, "owner-ledger")
    owner.locator("table").get_by_role("link", name=re.compile("Receipt R-")).first.click()
    owner.wait_for_url("**/receipt/*")
    receipt_text = owner.locator("article").inner_text()
    own_receipt_id = int(re.search(r"/receipt/(\d+)", owner.url).group(1))
    check("receipt: shows amount, home, and check number", "$1,035.00" in receipt_text and "Home 8003" in receipt_text and "Check 1234" in receipt_text, receipt_text[:200])
    shot(owner, "owner-receipt")

    # Access rules for an owner
    owner.goto(f"{BASE}/Acadia/portal/board", wait_until="networkidle")
    check("access: owner is turned away from board tools", owner.url.rstrip("/").endswith("/Acadia/portal/home"), owner.url)
    for path in ["/board/billing", "/board/settings", "/board/log", "/board/requests", "/board/homes/1"]:
        owner.goto(f"{BASE}/Acadia/portal{path}", wait_until="networkidle")
        check(f"access: owner cannot open {path}", owner.url.rstrip("/").endswith("/Acadia/portal/home"), owner.url)
    response = owner.request.get(f"{BASE}/Acadia/portal/board/export")
    check("access: owner cannot download the ledger export", response.status == 404, str(response.status))
    other_receipt = None
    for candidate in range(1, 15):
        if candidate == own_receipt_id:
            continue
        r = owner.request.get(f"{BASE}/Acadia/portal/receipt/{candidate}")
        if r.status == 200:
            other_receipt = candidate
    check("access: owner cannot open any other receipt", other_receipt is None, str(other_receipt))
    r = owner.request.get(f"{BASE}/Acadia/portal/home/requests/{other_request_id}")
    check("access: owner cannot open another home's request", r.status == 404, str(r.status))

    # Owner sends a request
    owner.goto(f"{BASE}/Acadia/portal/home/requests", wait_until="networkidle")
    owner.get_by_label("Category").select_option("Common-area repair")
    owner.get_by_label("Subject").fill("Street light out near the entrance")
    owner.get_by_label("Details").fill("The light by the front sign has been out for three nights.")
    owner.get_by_role("button", name="Send request").click()
    owner.wait_for_url("**/home/requests/*ok=request_sent")
    owner_request_url = owner.url.split("?")[0]
    owner_request_id = re.search(r"/requests/(\d+)", owner_request_url).group(1)
    check("requests: owner request sent", saw(owner, "sent to the board"), flash(owner))

    # Owner tries to add a note to another home's request by changing the hidden form value
    owner.locator('input[name="requestId"]').evaluate("(el, v) => { el.value = v; }", other_request_id)
    owner.get_by_label("Your note").fill("This note should never be saved.")
    owner.get_by_role("button", name="Send note").click()
    owner.wait_for_url("**error=not_found")
    check("access: owner cannot add a note to another home's request", saw(owner, "could not be found"), flash(owner))

    # Board replies, with one board-only note
    board.goto(f"{BASE}/Acadia/portal/board/requests/{other_request_id}", wait_until="networkidle")
    check("access: the tampered note was not saved", "should never be saved" not in board.locator("main").inner_text())
    board.goto(f"{BASE}/Acadia/portal/board/requests/{owner_request_id}", wait_until="networkidle")
    board.get_by_label("Your note").fill("Board only: ask the utility for a repair date.")
    board.get_by_label("Board only. Do not show this note to the owner.").check()
    board.get_by_role("button", name="Post note").click()
    board.wait_for_url("**ok=note_added")
    check("requests: board-only note posted", saw(board, "note was added"))
    board.goto(f"{BASE}/Acadia/portal/board/requests/{owner_request_id}", wait_until="networkidle")
    board.get_by_label("Your note").fill("Thanks. We reported it to the utility today.")
    board.get_by_role("button", name="Post note").click()
    board.wait_for_url("**ok=note_added")
    check("requests: board reply posted", saw(board, "note was added"))
    board.get_by_label("Set the status").select_option("in_progress")
    board.get_by_role("button", name="Save status").click()
    board.wait_for_url("**ok=status_saved")
    check("requests: status saved", saw(board, "status was updated"))
    shot(board, "board-request")

    owner.goto(owner_request_url, wait_until="networkidle")
    thread = owner.locator("main").inner_text()
    check("requests: owner sees the board's reply and the new status", "reported it to the utility" in thread and "In progress" in thread)
    check("requests: owner never sees the board-only note", "ask the utility for a repair date" not in thread and "ask the utility for a repair date" not in owner.content())
    shot(owner, "owner-request")

    # Change log and export
    board.goto(f"{BASE}/Acadia/portal/board/log", wait_until="networkidle")
    log_text = board.locator("main").inner_text()
    check("log: money actions are recorded with the board member's name", all(s in log_text for s in ["Recorded a payment", "Reversed a ledger entry", "Posted a charge to every home", "Test Board Member"]))
    check("log: sign-ins are recorded", "Signed in with a link" in log_text and "Created a sign-in link" in log_text)
    shot(board, "board-log")
    csv = board.request.get(f"{BASE}/Acadia/portal/board/export")
    csv_text = csv.text()
    check("export: board can download the ledger", csv.status == 200 and csv_text.startswith("Entry,Date,Home,Type,Amount") and "-1035.00" in csv_text and "reversal" in csv_text, csv_text[:120])
    check("export: one line per ledger entry", len(csv_text.strip().splitlines()) == 1 + 5 + 1 + 2 + 1, str(len(csv_text.strip().splitlines())))

    board.goto(f"{BASE}/Acadia/portal/board", wait_until="networkidle")
    shot(board, "board-all-homes")

    # Phone-size screenshots
    phone_ctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2)
    phone_ctx.add_cookies(owner_ctx.cookies())
    phone = phone_ctx.new_page()
    watch(phone, "phone")
    phone.goto(f"{BASE}/Acadia/portal/home", wait_until="networkidle")
    overflow = phone.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
    check("phone: owner home has no sideways scroll", overflow <= 1, str(overflow))
    shot(phone, "phone-owner-home")
    phone.goto(f"{BASE}/Acadia/portal/home/ledger", wait_until="networkidle")
    phone_list = phone.locator("ul.sm\\:hidden").first
    check("phone: ledger shows amounts without a sideways table", phone_list.is_visible() and "-$1,035.00" in phone_list.inner_text() and not phone.locator("table").first.is_visible(), phone_list.inner_text()[:200])
    shot(phone, "phone-owner-ledger")
    phone_ctx.close()

    # Votes now use the same database
    vote = owner.request.post(f"{BASE}/api/acadia/votes", data=json.dumps({"projectId": "self-management-software", "houseNumber": 8003, "voteType": "up"}), headers={"Content-Type": "application/json"})
    check("votes: an up vote is saved", vote.status == 200 and vote.json()["counts"] == {"up": 1, "down": 0, "net": 1}, vote.text())
    vote = owner.request.post(f"{BASE}/api/acadia/votes", data=json.dumps({"projectId": "self-management-software", "houseNumber": 8003, "voteType": "down"}), headers={"Content-Type": "application/json"})
    check("votes: a later vote from the same house replaces it", vote.status == 200 and vote.json()["counts"] == {"up": 0, "down": 1, "net": -1}, vote.text())
    vote = owner.request.post(f"{BASE}/api/acadia/votes", data=json.dumps({"projectId": "self-management-software", "houseNumber": 9999, "voteType": "up"}), headers={"Content-Type": "application/json"})
    check("votes: a house number outside the range is refused", vote.status == 400, str(vote.status))
    totals = owner.request.get(f"{BASE}/api/acadia/votes").json()
    check("votes: totals carry no house numbers", "8003" not in json.dumps(totals) and totals["countsByProject"]["self-management-software"]["down"] == 1, json.dumps(totals))

    # Turning off a person ends their session
    board.goto(home3_url, wait_until="networkidle")
    board.get_by_role("button", name="Turn off sign-in").click()
    board.wait_for_url("**ok=person_disabled")
    owner.goto(f"{BASE}/Acadia/portal/home", wait_until="networkidle")
    check("access: a turned-off person is signed out at once", "/sign-in" in owner.url, owner.url)

    # Sign out
    board.get_by_role("button", name="Sign out").click()
    board.wait_for_url("**/sign-in?ok=signed_out")
    board.goto(f"{BASE}/Acadia/portal/board", wait_until="networkidle")
    check("sign out: board pages need a new sign-in", "/sign-in" in board.url, board.url)
    shot(board, "sign-in")

    # ---------------- Expired link ----------------
    def data_call(statements):
        req = urllib.request.Request(
            f"{DATA_URL}/v1/batch",
            data=json.dumps({"statements": statements}).encode(),
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {env['ACADIA_DATA_KEY']}"},
        )
        return json.loads(urllib.request.urlopen(req).read())

    admin_ctx = browser.new_context(viewport={"width": 1280, "height": 900})
    admin = admin_ctx.new_page()
    watch(admin, "admin")
    admin.goto(f"{BASE}/Acadia/portal/setup", wait_until="networkidle")
    admin.get_by_label("Admin key").fill(ADMIN_KEY)
    admin.get_by_label("Your name").fill("Test Board Member")
    admin.get_by_label("Your email").fill("board@example.com")
    admin.get_by_role("button", name="Sign in as a board member").click()
    admin.wait_for_url("**/Acadia/portal/board")
    people = data_call([{"sql": "SELECT COUNT(*) AS total FROM people WHERE is_board = 1"}])["results"][0]["rows"][0]["total"]
    check("setup: coming back with the same email reuses the board record", people == 1, str(people))

    admin.goto(f"{BASE}/Acadia/portal/board/homes/2", wait_until="networkidle")
    admin.get_by_label("Name", exact=True).fill("Second Owner")
    admin.get_by_role("button", name="Add person").click()
    admin.wait_for_url("**ok=person_added")
    admin.get_by_role("button", name="Create sign-in link").click()
    box = admin.get_by_label("Sign-in link for Second Owner")
    box.wait_for()
    second_link = box.input_value()
    data_call([{"sql": "UPDATE sign_in_links SET expires_at = '2020-01-01T00:00:00.000Z' WHERE used_at IS NULL"}])
    late_ctx = browser.new_context()
    late = late_ctx.new_page()
    late.goto(second_link, wait_until="networkidle")
    late.get_by_role("button", name="Sign in to the owner portal").click()
    check("enter: an expired link is refused", saw(late, "has expired"), flash(late))
    late_ctx.close()

    stored = data_call([{"sql": "SELECT token_hash FROM sessions LIMIT 3"}, {"sql": "SELECT token_hash FROM sign_in_links LIMIT 3"}])
    secrets_ok = all(re.fullmatch(r"[0-9a-f]{64}", r["token_hash"]) for res in stored["results"] for r in res["rows"])
    cookie_value = [c for c in admin_ctx.cookies() if "acadia_session" in c["name"]][0]["value"]
    in_db = data_call([{"sql": "SELECT COUNT(*) AS total FROM sessions WHERE token_hash = ?", "params": [cookie_value]}])["results"][0]["rows"][0]["total"]
    check("database: only hashes of sign-in secrets are stored", secrets_ok and in_db == 0)

    # ---------------- Records server offline ----------------
    subprocess.run(["pkill", "-f", "acadia-data/server.mjs"])  # stops the test data service started in step 2
    time.sleep(1)
    admin.goto(f"{BASE}/Acadia/portal/board", wait_until="networkidle")
    offline_text = admin.locator("main").inner_text()
    check("offline: a signed-in person sees a plain notice, not an error page", "/sign-in" in admin.url and "records server is not answering" in offline_text, admin.url)
    shot(admin, "offline")
    votes = admin.request.get(f"{BASE}/api/acadia/votes")
    time.sleep(31)
    votes = admin.request.get(f"{BASE}/api/acadia/votes")
    check("offline: vote totals report unavailable instead of zero", votes.status == 503, str(votes.status))
    public = admin.request.get(f"{BASE}/Acadia")
    check("offline: the public Acadia pages still load", public.status == 200, str(public.status))

    port = str(urlparse(DATA_URL).port or 8787)
    subprocess.Popen(
        ["node", str(SERVER)],
        env={**os.environ, "ACADIA_DATA_KEY": env["ACADIA_DATA_KEY"], "ACADIA_DATA_DIR": DATA_DIR, "PORT": port, "HOST": "127.0.0.1"},
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(1.5)
    admin.goto(f"{BASE}/Acadia/portal/board", wait_until="networkidle")
    check("offline: the same session works again once the server is back", admin.url.rstrip("/").endswith("/Acadia/portal/board") and "All homes" in admin.locator("main").inner_text(), admin.url)
    kept = data_call([{"sql": "SELECT COUNT(*) AS total FROM ledger_entries"}])["results"][0]["rows"][0]["total"]
    check("offline: every ledger line is still there after a restart", kept == 9, str(kept))

    # ---------------- Too many wrong admin keys ----------------
    guess_ctx = browser.new_context()
    guess = guess_ctx.new_page()
    guess.goto(f"{BASE}/Acadia/portal/setup", wait_until="networkidle")
    for attempt in range(7):  # one wrong try was already made at the start of this run
        guess.get_by_label("Admin key").fill(f"wrong-guess-number-{attempt}-padding-padding")
        guess.get_by_label("Your name").fill("Guesser")
        guess.get_by_label("Your email").fill("guess@example.com")
        guess.get_by_role("button", name="Sign in as a board member").click()
        expect(guess.locator('main [role="alert"]').first).to_contain_text("not right", timeout=8000)
        guess.goto(f"{BASE}/Acadia/portal/setup", wait_until="networkidle")
    guess.get_by_label("Admin key").fill(ADMIN_KEY)
    guess.get_by_label("Your name").fill("Guesser")
    guess.get_by_label("Your email").fill("guess@example.com")
    guess.get_by_role("button", name="Sign in as a board member").click()
    check("setup: eight wrong keys lock the page, even for the right key", saw(guess, "locked for 15 minutes"), flash(guess))
    guess_ctx.close()

    browser.close()

failed = [r for r in results if not r[1]]
print(f"\n{len(results) - len(failed)} of {len(results)} checks passed")
real_issues = [i for i in issues if "404" not in i]
print("browser issues:", real_issues[:10])
sys.exit(1 if failed else 0)
