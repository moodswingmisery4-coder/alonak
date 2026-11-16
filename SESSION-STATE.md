# Makanak — session state

Last updated: 2026-11-16 (late evening) — gallery/lightbox rework, rules notice, brand revert. Everything below is deployed and verified live.

## Resume here (next session)
- **Live asset versions** — stay.html: `booking.js?v=13`, `theme.css?v=20`, `catalog.js?v=1871`, `stay-sections.js?v=5`, `stay-data.js?v=1`, `auth.js?v=9`, `theme.js?v=3`. index.html: `auth.js?v=9`, `theme.js?v=3`, `catalog.js?v=1871`. destinations/about/guide: `theme.js?v=3`. Bump the exact `?v=` on every edit — Pages caches aggressively.
- **Git:** frontend `main` is in sync with origin (last commit `brand: revert to مکانک and replace جاباما mentions with مکانک`) and the tree is clean. `makanak-worker` is **not** a git repo — snapshot `src/index.js`, `schema.sql` and the SQL seeds before big edits.
- **Local:** nothing running. Test with `python -m http.server 8765` in `D:/hermes/makanak`; `curl` on the live HTML does not prove the browser has it — open the live URL with `?cb=<timestamp>&id=…` and print the loaded `script[src]` list before trusting any UI check.
- **RTL UI rules learned (apply to every new arrow/chevron):** glyphs `‹` `›` (U+2039/203A) are Bidi_Mirrored and flip inside `dir=rtl` — never use them for arrows, use inline SVG chevrons. An arrow must point to the side it sits on (right arrow on the right, left arrow on the left); in RTL the first DOM child of a flex row renders on the right, and right = back / left = forward in the gallery.
- **Done on 2026-11-16 (late evening, in this order):**
  1. Booking card: the amber rules notice became a small centred pill (11px, `border-radius:999px`, `align-self:center`, ~223px wide inside a 679px card) at the very bottom of the card instead of a full-width strip.
  2. «قوانین و مقررات» jump: `scrollIntoView({block:'start'})` hid the «مقررات آپارتمان» heading under the 80px sticky header — replaced with a manual `window.scrollTo` using the real header height + 24px, plus a 900ms correction pass and `#secRules{scroll-margin-top:110px}`.
  3. Lightbox single-photo view was only ~80px tall: the hidden grid **wrapper** still held half the modal height. Added `#galGridWrap` and hide it in photo mode, so the photo now fills the viewer.
  4. Bottom controls moved out of the photo: «همه عکسها» + counter («۷ از ۱۲») are a normal row under the image; the prev/next buttons float over the image edges; `#galBig{padding-inline:48px}` keeps the photo off the arrows.
  5. Arrow direction fixed twice: first by swapping the handlers, then properly — all four nav spots (lightbox, thumb strip, grid pager) now draw **SVG chevrons** so RTL bidi cannot mirror them.
  6. Gallery paging: `GAL_PER_PAGE=8` → desktop 4 columns × 2 rows, mobile 2 columns × 4 rows, with `#galGrid{grid-auto-rows:minmax(0,1fr)}` + `min-h-0 flex-1` so 4 rows fit a phone screen without extra scrolling.
  7. Brand: briefly renamed to «مکان آباد» (commit 64648cb), then reverted to **«مکانک»** everywhere (5 pages, titles, auth.js, theme.js, stay-sections.js) and the only visible «جاباما» string («امتیاز کلی اقامتگاه در جاباما») now reads «... در مکانک». Only `backups/` still contains old copies.
- **Next candidates:** (1) if the CDN dependency ever bites, move the 1421 remote photos to Cloudflare R2 (they are all already on disk in `assets/gallery`, untracked) — pushing them to Pages is not viable at Soheil's ~11 KB/s uplink; (2) seed a few clearly-labelled sample reviews so the list does not look empty; (3) migrate the hours/rules copy out of the template if per-stay values are ever needed; (4) the two long-open items below (`RESEND_API_KEY`, consent to delete the 6 old test accounts).

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
