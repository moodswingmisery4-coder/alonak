# Makanak (آلونک) — session state

Last updated: 2026-11-17 (evening) — brand = آلونک, homepage/search/cards/header rework; all deployed & verified live.

## HARD RULE — backup before every edit
Before touching any project file, copy the files you are about to change into `backups/<YYYYMMDD>-<slug>/` (git-ignored, so it never lands in the repo) and mention the snapshot in the report. Rollback = copy back from that folder, or `git revert` / `git reset --hard <sha>` (every deployed step is its own commit). Snapshots so far: `backups/20261117-rename-alunak/`, `backups/20261117-header-arrow/`.

## Resume here (next session)
- **Live asset versions** — stay.html: `theme.css?v=21`, `booking.js?v=13`, `catalog.js?v=1871`, `stay-data.js?v=1`, `stay-sections.js?v=6`, `auth.js?v=11`, `theme.js?v=4`. index.html: `auth.js?v=11`, `theme.js?v=4`, `catalog.js?v=1871`. destinations.html: `theme.css?v=21`, `catalog.js?v=1871`, `auth.js?v=11`, `theme.js?v=4`. about/guide: `theme.js?v=4`. Bump the exact `?v=` on every edit — Pages caches aggressively.
- **Git:** frontend `main` in sync with origin, HEAD `ddbb758` ("back icon is now a clean filled circular-arrow"). Tree clean. `makanak-worker` is **not** a git repo — snapshot `src/index.js`, `schema.sql` and the seeds before big edits.
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
