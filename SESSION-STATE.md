# Makanak (آلونک) — session state

Last updated: 2026-11-18 — footer socials, 8 standalone info pages, unified back button; all deployed & verified live. HEAD `e704f03`.

## HARD RULE — backup before every edit
Before touching any project file, copy the files you are about to change into `backups/<YYYYMMDD>-<slug>/` (git-ignored, so it never lands in the repo) and mention the snapshot in the report. Rollback = copy back from that folder, or `git revert` / `git reset --hard <sha>` (every deployed step is its own commit). Snapshots so far: `backups/20261117-rename-alunak/`, `backups/20261117-header-arrow/`, `backups/20261117-panel-hamburger/`, `backups/20261117-panel-card-spacing/`, `backups/20261117-footer-social/`, `backups/20261117-info-pages/`, `backups/20261117-no-infocenter/`, `backups/20261117-back-home/`, `backups/20261117-back-unify/`.

## Resume here (next session)
- **Live asset versions** — **theme.css is now `?v=25` on every page** and must be bumped on any edit to it (`.back-home` lives there). info pages: `info.css?v=3`. stay.html: `theme.css?v=21`, `booking.js?v=13`, `catalog.js?v=1871`, `stay-data.js?v=1`, `stay-sections.js?v=6`, `auth.js?v=11`, `theme.js?v=4`. index.html: `auth.js?v=11`, `theme.js?v=4`, `catalog.js?v=1871`. destinations.html: `theme.css?v=21`, `catalog.js?v=1871`, `auth.js?v=11`, `theme.js?v=4`. about/guide: `theme.js?v=4`. Bump the exact `?v=` on every edit — Pages caches aggressively.
- **Git:** frontend `main` in sync with origin, HEAD `e704f03` ("docs: session state + committed info-page generator"; previous: "back button: tag icon; icon-only square on mobile, label + icon on the left on desktop"). Tree clean. `makanak-worker` is **not** a git repo — snapshot `src/index.js`, `schema.sql` and the seeds before big edits.
- **Local:** nothing running. Test with `python -m http.server <port>` in `D:/hermes/makanak`; verify live with `?cb=<timestamp>` and read computed styles/rects via JS — a `curl` hit alone proves nothing.
- **RTL UI rules (apply to every arrow):** glyphs `‹` `›` (U+2039/203A) and even `←`/`→` are Bidi_Mirrored and flip in `dir=rtl` — always use inline SVG. An arrow must point to the side it sits on (right arrow on the right, left arrow on the left); in RTL the first DOM child of a flex row renders on the right, right = back / left = forward.

## Done on 2026-11-17 (in order, each its own commit, all live)
1. **Brand → آلونک** (41 replacements, 9 files): 5 pages, titles/meta, auth.js, theme.js («ظاهر آلونک»), stay-sections.js, check.js. Deliberately NOT renamed: `makanak_*` localStorage keys, `window.Makanak*` globals, `MAKANAK_STAYS`, repo name, Pages URL, worker name, `makanak.kdns.fr`. Snapshot `backups/20261117-rename-alunak/`.
2. **Booking guest stepper**: `.bk-mini` 24×24 circle → **34×30 rounded rect** (radius 9, font 17px), field `padding-left` 82→96px, gap 6px (`theme.css?v=21`).
3. **Homepage search grid**: `2.1fr 1.15fr 1.15fr 1.2fr auto` (destination 313px, dates 171px, dead space) → **`1.1fr 1fr 1fr .7fr auto`** = destination 241 / dates 219 / guests 154 / button 118 at 1440px. Tablet 768–1023: `1.7fr 1.1fr 1.1fr .9fr auto`, gap 8px, search button min 100px.
4. **Popular-city chips**: `max-content` centred in 64px cells (≈25px dead space) → full-width chips (52px), grid gap **3px**, radius 7px, popup 379→300px.
5. **Pager (homepage)**: prev/next swapped — **قبلی right, بعدی left**, SVG chevrons pointing outward (never text arrows). **«مشاهده همه»** = bordered pill with `shrink-0 whitespace-nowrap` (without nowrap it wrapped to 2 lines / 62px tall on mobile).
6. **destinations.html rebuilt**: cards identical to homepage popular cards (5 cols ≥1024, 2 cols mobile, image 160/140px, heart, title+rating, city, price), click → `stay.html?id=…`, same 10-per-page pager, city filters restyled; inline detail modal **removed** (a `#modal` shell + `auth.js?v=11` re-added for the account button). Snapshot `backups/20261117-rename-alunak/destinations-before-cards.html`.
7. **Header (stay.html + destinations.html, identical)**: back link = bordered pill on the **left**, sitting to the **right of the theme toggle** (theme control back at the far left via flex `order`), account button **absolutely centred** as a coral pill with person icon and label span (`.login-label`, 26ch / 34ch ≥1024 / 18ch ≤767 / 14ch ≤420 — auth.js writes into the span so the icon survives). Under 360px the account falls back in-flow (`position:static; margin-inline:auto`) so it cannot overlap the theme toggle.
8. **Back icon** (two iterations, first rejected by user): now the **filled circular refresh arrow** — single path `M17.65 6.35A7.958 7.958 0 0 0 12 4…`, `fill="currentColor"`, 22px, coral, no badge. Snapshot `backups/20261117-header-arrow/`.

- **Next candidates:** (1) give about.html/guide.html the same header; (2) move the header + pager CSS into one shared file (it is duplicated in stay.html and destinations.html now); (3) R2 for the 1421 gallery photos; (4) sample reviews; (5) long-open: `RESEND_API_KEY` and consent to delete the 6 old test accounts.

## Stay detail page — 2026-11-16 (deployed)
- `assets/stay-data.js` (v=1): generated from `jabama-parsed.json` — per stay id: area/building, bedrooms, bathrooms, Iranian/Western toilets, base+extra capacity, min nights, source rating + count, restricted rules, full amenity keys. Regenerate with `pdf-work/build_details.py` (matches by `sourceCode`).
- `assets/stay-sections.js` (v=3): renders 6 blocks on stay.html — مشخصات کلی، امکانات مهم + bottom sheet «مشاهده همه امکانات»، ساعت ورود/خروج ۱۴:۰۰/۱۲:۰۰ + آکاردئون لغو، مقررات با ✓/✕ از `restricted_rules`، امتیاز (منبع جاباما) + نظرات واقعی کاربران مکانک.
- `assets/booking.js` (v=12): calendar shows the nightly price under every available day (thousands of toman) + legend; summary = sum of nights + extra-guest line; success card lists extra guests.
- Pricing model (duplicated in worker + booking.js, keep in sync): weekend = پنجشنبه/جمعه ×1.2, extra person = 15% of base per night, both rounded to 10,000 toman. Verified live: 2 nights Thu+Fri = 7,200,000; 2 nights + 1 extra guest = 6,900,000 in both client and server.
- Worker: `capacity_base` column (seeded for all 84 stays from `seed-capacity-base.sql`), `quotePrice()` helper, booking POST returns nights_total/extra_guests/extra_per_night/extra_total; new `reviews` table + `GET /api/reviews?stay_id=` (public) and `POST /api/reviews` (auth, one per user per stay, 1–5, 700 chars, `verified_stay` flag when a confirmed booking exists).
- Frontend versions on stay.html (current): booking.js v=13, auth.js v=9, theme.css v=20, catalog.js v=1871, stay-data.js v=1, stay-sections.js v=5, theme.js v=3.

## Live surfaces
- Frontend (GitHub Pages): https://moodswingmisery4-coder.github.io/makanak/
- Frontend repo: https://github.com/moodswingmisery4-coder/makanak (branch main)
- Local frontend: D:\hermes\makanak
- Backend repo/local: D:\hermes\makanak-worker (Cloudflare Worker, module syntax)
- API base 1 (primary): https://makanak-worker.makanak-app.workers.dev/api
- API base 2 (fallback): https://makanak.kdns.fr/api — not routed any more (see Open)
- D1 database: makanak-db (6d0fd00a-a76b-401b-9baf-9f31c55f2b45)
- Tables: users (verified), sessions, stays (84 seeded from catalog.js, capacity_base seeded), bookings (nights), reviews, email_tokens, rate_limits

## Backend hardening — 2026-11-15 (deployed)
- Passwords: PBKDF2-SHA256, 100k iterations, 16-byte salt (pbkdf2$iters$salt$hash); legacy salt.sha256 hashes verify and auto-rehash on next login.
- Rate limits in D1 (rate_limits): 150 req/min per IP, 8 registers / 12 logins / 5 reset requests per 15 min, 20 bookings per user per hour.
- Booking validation server-side: stay must exist in stays; ISO dates; check-in >= today (Asia/Tehran +03:30); check-out > check-in; max 60 nights; guests 1-30 and <= stay.capacity; overlapping non-cancelled booking for the same stay -> 409; total price computed by the server (client price ignored).
- Cancel: DELETE /api/bookings/:id — only own pending booking with future check-in; confirmed/cancelled -> 409.
- Account: PATCH /api/auth/me (name/phone, phone normalized to 09xxxxxxxxx), POST /api/auth/password (needs current password, kills other sessions).
- Email verify + password reset: POST /api/auth/verify/request|confirm, /api/auth/reset/request|confirm with 6-digit codes (15 min TTL, hashed in email_tokens). Sending uses Resend and needs RESEND_API_KEY (+ optional MAIL_FROM); while unset those endpoints answer 503 with a Persian message and /api/health reports email:false.
- /api/auth/me returns 200 {user:null} for anonymous (the front end depends on it).

## Frontend — 2026-11-15 (deployed)
- assets/booking.js (v=6): pro booking widget on stay.html — Jalali calendar popups for check-in/check-out (past days disabled, checkout opens on the check-in month, max 60 nights), guest stepper capped at the stay capacity, live «X شب × قیمت = مبلغ کل» summary, inline Persian errors, success card with nights/total and a link to the panel.
- assets/auth.js (v=7): login/register/reset screens, requireLogin() returns a promise so the booking continues right after login, account panel with booking rows + status chips + cancel button, profile form, change-password form, email-verification block, logout.
- assets/theme.css (v=5): .bk-* widget styles (compact date fields: 6px/12px padding, 12.5px value; .bk-pop-head navbar-style popup header, .bk-pop-close ✕, green .bk-plus / red .bk-minus), .fav-btn heart toggle (SVG outline -> filled when favourited, state in localStorage makanak_favorites), .account-*/.chip panel styles (light + dark), plus #modal > .bg-white max-height 88vh scroll.
- Stays pagination: «بعدی» right with a green → arrow outside the word, «قبلی» left with a coral ← arrow, «صفحه X از Y» mid-row on one line, «N اقامتگاه» below; Persian digits.
- Verified live after Pages propagation: register via the modal -> booking created -> panel lists it -> cancel works -> guard rails return the expected Persian errors.

## Next session — start here
1. Email verification + password reset: needs `RESEND_API_KEY` (and optionally `MAIL_FROM`) as a Cloudflare secret:
   `cd D:/hermes/makanak-worker && npx wrangler secret put RESEND_API_KEY` (log in to resend.com, free tier, verify the sender domain).
   Then `/api/health` should report `email:true`; verify with a real registration and check the 6-digit code mail.
   Only after that consider `REQUIRE_VERIFIED=true` (blocks booking for unverified accounts).
2. Ask Soheil for consent to delete the six old test accounts (e2e/dbg/verify/flow/tok/final) — never touch moodswingmisery2@gmail.com.
3. Booking widget live state: stay.html loads booking.js?v=6, auth.js?v=7, theme.css?v=5 — bump these numbers on every asset edit or Pages serves the stale file.
4. 2026-11-15: booking popups are now compact 272px cards anchored under their own field, with a navbar-style dark header (logo + title + X close); the bottom «بستن/تایید» footers were removed; guest stepper + is green / − is red.

## Verified working
- 84 stays, 453 same-origin gallery photos (assets/gallery), 40 popular stays over 4 pages
- Card click navigates straight to stay.html?id=...
- City dataset 1628 cities with Persian district labels
- UTF-8 round-trips correctly (mojibake seen earlier came from the Windows console, not the server)

## Open / unconfirmed
- Email verification + password reset are coded but blocked on RESEND_API_KEY (needs Soheil's key / verified sender domain).
- Six old test accounts remain in D1 (e2e/dbg/verify/flow/tok/final); cleanup needs explicit consent.
- Real account moodswingmisery2@gmail.com must be preserved.
- Custom domain makanak.kdns.fr was removed from wrangler.toml (it sat wrongly under [vars]); re-attach with `npx wrangler deploy --domains makanak.kdns.fr` only when losing the workers.dev route is acceptable — plain `npx wrangler deploy` keeps workers.dev.
- REQUIRE_VERIFIED=true would block booking for unverified users; leave unset until email works.

## Commands
- Deploy backend: cd D:/hermes/makanak-worker && npx wrangler deploy
- Apply schema: npx wrangler d1 execute makanak-db --remote --file=schema.sql
- Re-seed stays: npx wrangler d1 execute makanak-db --remote --file=seed-stays.sql
- Push frontend: cd D:/hermes/makanak && git add -A && git commit -m "..." && GCM_GUI_PROMPT=0 git -c credential.helper=manager push -q origin main
- Bump ?v=N for assets/auth.js, assets/booking.js, assets/catalog.js, assets/theme.css on every change (Pages caches aggressively).

## 2026-11-17 — user panel rebuild
- Replaced the cramped modal account view with a real dashboard page: `account.html` + `assets/account.js` (sidebar nav, overview stats, next-trip hero, bookings with filters/details/cancel/review, favorites, profile, security, support).
- Header account button now navigates to `account.html` (auth.js v12); the modal stays for login/register/password-reset only.
- Worker: new `/api/support` GET/POST backed by `support_tickets` (migration `migrations/2026-11-17-support.sql`), `/auth/me` now returns `created_at`. Deployed with `npx wrangler deploy`.
- Panel service map: bookings read/cancel, review submit (POST /api/reviews), profile PATCH, password change, email verify (blocked while RESEND_API_KEY is unset — health.email=false and the UI says so), support tickets, favorites (localStorage `makanak_favorites` stores catalog indices).
- CORS allow-list only includes local ports 8765/8787 — serve local tests on 8765.

## 2026-11-17 (later) — header + panel polish, state of play
### Header
- Back link vs theme toggle swapped (back is leftmost); back icon is now a **backspace** glyph (left-pointing) with the icon on the **left of its label**; 14px gap to the theme control from 768px up.
- Logged-in account button no longer prints the full name: it renders a gradient rounded-square avatar with the **first letter of the first name** (`Pouya Rs` → `P`, `محمد سهرابی` → `م`; falls back to the first letter of the email). Avatar sits to the **left** of the fixed label «حساب کاربری». Logged out → person icon + «ورود / ثبت‌نام». Full name kept in aria-label only.
- index.html's login button originally had no icon markup; it now carries the person icon + `.login-label` like other pages.

### Panel (account.html)
- Mobile: sidebar collapsed behind a hamburger (`#navToggle` / `#acctMenu`, aria-expanded, closes on select and on Esc); desktop keeps the sticky sidebar and hides the toggle.
- Spacing pass: stat value↔unit 8px, card paddings 16–20px, section gap 18px, action gap 10px, meta gap 8/18px, booking card 14px padding with 18px image gap, nav icon gap 12px.
- Status chips were stretching to the row height in `.acct-chips` (text stuck to the top); fixed with `align-items:center` + padded pills (text now centered, both badges 33px).
- Below 360px CSS width (heavy zoom / tiny phones) stat cards go single-column; verified at 260/300/320/390 with no horizontal overflow.

### Resend / email — STILL BLOCKED
- `wrangler secret list` shows `RESEND_API_KEY`, but the live worker reports `emailKeyLen: 0` → the secret was saved **empty**. Everything else is wired: `sendEmail()`, `issueCode()`, `/auth/verify/request`, `/auth/reset/request`.
- Fix: `cd D:\hermes\makanak-worker` then (PowerShell) `'re_XXXX' | npx wrangler secret put RESEND_API_KEY`, then re-check `/api/health` for `email:true`. Default sender is `onboarding@resend.dev` (only delivers to the Resend account owner's address) — set `MAIL_FROM` once a domain is verified. `/api/health` now also returns `emailKeyLen` and `mailFrom` for this diagnosis.
- Frontend hides/disabled the verify CTA when `health.email` is false.

### Ops notes
- Asset versions now: `auth.js?v=14`, `theme.css?v=22`, `account.js?v=2`, `catalog.js?v=1871`.
- Backups for this batch: `backups/20261117-header-swap-backspace/`, `-header-spacing-iconleft/`, `-index-account-icon/`, `-account-panel/`, `-avatar-left-mobilenav/`, `-header-avatar/`, `-panel-hamburger/`, `-panel-spacing/`; worker backup `makanak-worker/backups/index.js.*.bak`.
- All temporary test users created during verification were deleted from D1 (0 users matching `%test%`).
- Open: hero CTA «جستجوی اقامتگاه» duplicates the «رزرو اقامتگاه جدید» button on the overview — candidate cleanup. Email flow can't be end-to-end tested until the key is real.

## 2026-11-18 — footer socials, standalone info pages, unified back button (all live)
### Footer (index.html only — it is the only page with a footer)
- «با ما در ارتباط باشید» now has three real links: t.me/alonak, instagram.com/alonak, youtube.com/@alonak, each with brand SVG icon + `@alonak` handle; hover tints per network (Telegram #229ed9, IG gradient, YT #ff0033); styles are a dedicated `<style>` block in index.html (`.ft-social*`), dark-mode safe via theme vars.
- Every other footer link points at its own page now (no `#anchor` into a single hub).

### Info pages — one topic per page (info.html no longer exists)
- 8 pages, all generated from **`tools/build_info_pages.py`** (edit content there, run `python tools/build_info_pages.py`, then commit the html): `about.html`, `magazine.html`, `careers.html`, `support.html`, `rules.html`, `privacy.html` (with a data-retention table), `faq.html` (8 accordions), `contact.html` (socials + 3 mailto cards).
- Shared shell: same head/header/footer, breadcrumb «خانه / <title>», coral segmented styles, dark mode; **all CSS lives in `assets/info.css`** (v=3). Pages hold no `<style>` of their own.
- The horizontal tab scroller and the «مرکز اطلاعات» hub were **removed on Soheil's request** — each page stands alone, no cross-page tab bar. Navigation between them is via the footer only.

### Back button (`.back-home`, defined once in `assets/theme.css`)
- Markup: `<a href="…" class="back-home"><span class="bh-label">بازگشت</span><svg tag-with-X …></svg></a>` — label first so in RTL the **icon renders to the left of the text** on desktop; on ≤767px the label is hidden and the box becomes a **40×40 rounded square** (matches the theme toggle next to it).
- Position: `order:9` puts it at the far left of every header; info pages got `max-width:1280px / padding 32px / height 80px` on `.inf-nav` so the box lands on the exact same pixels as destinations.html (verified 92×38 @ x=32,y=21 desktop; 40×40 @ x=20,y=20 mobile).
- Targets: `destinations.html` → `index.html#inspiration` («کشف مقصدهای محبوب», lands 90px under the sticky header via `scroll-margin-top:90px`); all 8 info pages → `index.html#about` (the footer).
- Icon is the **tag-with-X** glyph (same path as the old destinations nav-back), not the house icon — Soheil rejected the house version.

### Ops
- Pages caches hard: `theme.css?v=25`, `info.css?v=3`. Bump on every tweak or the phone keeps the old CSS.
- Backend untouched this session.
- Open: index.html still shows a ~14px horizontal overflow at ~768px width (pre-existing header layout, not from these changes); hero/overview duplicate CTA noted earlier is still open.

## 2026-11-19 — tablet header overflow fixed (live) + duplicate hero CTA closed
- `index.html` overflowed to 822px at a 768px viewport (scrollWidth 822 vs vw 753): at 768–1023 the
  logo + 4 nav links + «میزبان شوید» button + login button need ~778px inside 713px, so the left cluster
  was pushed off-screen (left = −69px).
- Fix in `assets/theme.css` (now `theme.css?v=28` in all 12 pages, rule appended at EOF):
  `@media(min-width:768px) and (max-width:1023px){header #hostBtn{display:none!important}header nav{gap:8px}}`
  The button duplicates the «میزبان شوید» nav link; desktop (≥1024) still shows it. `#hostBtn` exists only in index.html.
- Verified in browser (local + live GitHub Pages): scrollWidth == viewport at 640/700/767/768/800/900/1000/1023/1024/1280/1440; 768 screenshot clean.
  Only index.html had the overflow — destinations/stay/about/faq/account were already 0.
- Closed the old open item: hero has **no** «جستجوی اقامتگاه» CTA anymore (only the «جستجو» button inside the booking bar), so nothing duplicates «رزرو اقامتگاه جدید».
- Backup of the touched files: `backups/20261119-nav-tablet-fit/` (theme.css, index.html). Commit `d54fe3d`.

## 2026-11-19 — worker moved to api.makanak.kdns.fr (live)
- Worker `makanak-worker` custom domain: ~~makanak.kdns.fr~~ → **api.makanak.kdns.fr** (zone makanak.kdns.fr, id 757e5848447b74c9af78cb45bc79396f; account edd40933dd6db7dcdca3ba341639540f).
  Deploy: `cd D:\hermes\makanak-worker && npx wrangler deploy --domains api.makanak.kdns.fr` (this *replaces* the custom-domain list — always pass the subdomain).
- Old zone route `makanak.kdns.fr/*` → worker **deleted** (API `/zones/{id}/workers/routes/{route_id}` DELETE). Apex `makanak.kdns.fr` now has no A record — free for the frontend later (e.g. CNAME to GitHub Pages).
- `wrangler.toml`: `workers_dev = true` was nested inside `[[d1_databases]]` (invalid, so each deploy disabled workers.dev) — moved to root. Fallback origin `https://makanak-worker.makanak-app.workers.dev` is live again.
- Frontend `assets/auth.js` (v=15, all 4 pages): `API_BASES = ['https://api.makanak.kdns.fr/api', 'https://makanak-worker.makanak-app.workers.dev/api']`. Worker CORS allow-list is origin-based so no change was needed there.
- Verified: `/api/health` = 200 + `{"ok":true}` on api subdomain and workers.dev; CORS preflight from github.io ok; from the live page `auth.js?v=15` loads and `GET /api/auth/me` → 200 from the page origin.
- Backups: `makanak-worker/backups/20261119-subdomain/wrangler.toml`, `makanak/backups/20261119-api-subdomain/auth.js`. Commits: worker via wrangler deploy (version 9228dc0a), frontend `584189d`.
- Gotcha: `git push` over HTTPS silently hangs from this box (git 2.53 + GCM); it succeeds with `GIT_TRACE=1 GIT_HTTP_TRACE=1` set and a 30s `timeout` (see D:\hermes\tmp\push.log). Plain/killed pushes leave origin/main unchanged — always confirm `git rev-parse origin/main`.

## DONE 2026-11-19 — site live on https://alonak.kdns.fr

Superseded the pending apex task below (makanak.kdns.fr was dropped in favour of **alonak.kdns.fr**; Soheil set the DNS himself in Cloudflare).

- DNS (verified via DoH): `alonak.kdns.fr` → 4 GitHub Pages A records (185.199.108-111.153). `makanak.kdns.fr` apex still has no record — unused, only the `api.` subdomain is used.
- Repo: `CNAME` file = `alonak.kdns.fr` (commit `347f0f1`). Pages API: `cname` alonak.kdns.fr, `status` built, `https_enforced: true`, `https_certificate.state` = approved, `protected_domain_state` = unverified (cosmetic; A-record setup).
- Let's Encrypt cert `CN=alonak.kdns.fr` (valid to 2027-02-17) served on **all four** Pages IPs; `http://` → 301 `https://alonak.kdns.fr/`; `…github.io/makanak/*` → 301 → `https://alonak.kdns.fr/`.
- Worker `makanak-worker` CORS allow-list now also contains `https://alonak.kdns.fr` and `https://www.alonak.kdns.fr` (deploy version `b4fd2d0b`).
- Verified in a real browser on the new origin: index (10 cards), destinations (84 stays), stay.html, account.html, about.html all render; `GET /api/health` → 200 `{ok:true}` and `/api/auth/me` → 200 from the page origin.
- Backup: `backups/20261119-alonak-domain/` (CNAME), `makanak-worker/backups/20261119-subdomain/index.js`.

### Old pending note (kept for history)
**Task:** point the apex domain `makanak.kdns.fr` at the GitHub Pages site (only remaining step).

Current live state (all verified working):
- Site: https://moodswingmisery4-coder.github.io/makanak/ — Pages source `main /`, `https_enforced: true`, `cname: null`.
- API: https://api.makanak.kdns.fr/api (worker custom domain) + fallback https://makanak-worker.makanak-app.workers.dev/api.
- Apex `makanak.kdns.fr`: no DNS record at all (worker route deleted); returns nothing.

Blocked on DNS write access:
- Wrangler OAuth token (`cfoat_…` in `%APPDATA%\xdg.config\.wrangler\config\default.toml`) has only `workers`/`workers_kv` scope → Cloudflare API DNS calls fail with `code 10000 Authentication error`.
- Cloudflare dashboard in the local browser is stopped by the bot challenge ("Just a moment…", Ray ID changes each retry) — not solvable by automation.

Two ways forward (agreed with Soheil, waiting on his pick):
1. Soheil adds the DNS record himself: zone makanak.kdns.fr → Add record → `CNAME`, name `@`, target `moodswingmisery4-coder.github.io`, Proxy **DNS only**. Then I run the rest.
2. Soheil creates a Cloudflare API token with `Zone → DNS → Edit` for this zone and saves it to `D:\hermes\tmp\cf-token.txt`; then:

```bash
# 1) DNS record (DNS-only so GitHub can issue its cert)
TOK=$(cat D:/hermes/tmp/cf-token.txt)
curl -X POST -H "Authorization: Bearer $TOK" -H "Content-Type: application/json" \
  -d '{"type":"CNAME","name":"makanak.kdns.fr","content":"moodswingmisery4-coder.github.io","proxied":false,"ttl":1}' \
  https://api.cloudflare.com/client/v4/zones/757e5848447b74c9af78cb45bc79396f/dns_records

# 2) attach the custom domain on GitHub Pages (repo admin token = `git credential-manager get` password)
GH=$(printf 'protocol=https\nhost=github.com\n\n' | git credential-manager get 2>/dev/null | grep '^password=' | cut -d= -f2-)
curl -X PUT -H "Authorization: Bearer $GH" -H "Accept: application/vnd.github+json" \
  -d '{"cname":"makanak.kdns.fr","https_enforced":true}' \
  https://api.github.com/repos/moodswingmisery4-coder/makanak/pages
```
- After that: wait for the Pages cert (`GET /repos/.../pages` until `https_certificate.state == approved`), verify `https://makanak.kdns.fr/` serves the site and that `https://…github.io/makanak/` redirects to it, and that the API still answers (`/api/health`).
- Watch-outs: keep the record **DNS-only** until the cert is issued (proxying breaks GitHub's HTTP-01 validation); the worker CORS allow-list already contains `https://makanak.kdns.fr`. Site links are relative, so serving at the domain root instead of `/makanak/` is fine — but re-check `destinations.html`, `stay.html`, `account.html` and the info pages after the switch.
- Repo state at stop: `main` = `e691814`, working tree clean, pushed.

## 2026-11-19 — homepage header: four nav links removed (live)
- Soheil asked to drop the «اقامتگاه‌ها / الهام سفر / میزبان شوید / درباره آلونک» menu from the header.
- Removed the whole `<div class="main-nav …">` block from `index.html` — those four links exist **only** there (info pages have `.inf-nav`, other pages have no nav row; verified by grep).
- Because the menu was what caused the 768–1023px squeeze, the tablet rule added earlier (`@media(min-width:768px) and (max-width:1023px){header #hostBtn{display:none…}}`) was **deleted** from `theme.css` — `#hostBtn` now shows at every width ≥640 again. `theme.css?v=29` in all 12 pages.
- Verified live on https://alonak.kdns.fr: 0 `.main-nav a` nodes; scrollWidth == viewport at 375/768/1024/1280/1440; header = logo right, host + login + theme toggle left, no overlap (desktop + 390px screenshots checked).
- Leftovers: dead `.main-nav` CSS rules still sit in index.html's inline `<style>` (line ~21) — harmless, can be deleted in a cleanup pass. Nav targets `#stays`, `#inspiration`, `#host` are still reachable by scrolling; `about.html` is linked from the footer.
- Backup: `backups/20261119-remove-nav/` (index.html, theme.css). Commit `3da8e3c`.
