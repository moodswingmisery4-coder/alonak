# Makanak — session state

Last updated: 2026-11-14 (local machine time zone)

## Live surfaces
- Frontend (GitHub Pages): https://moodswingmisery4-coder.github.io/makanak/
- Frontend repo: https://github.com/moodswingmisery4-coder/makanak (branch main)
- Local frontend: D:\hermes\makanak
- Backend repo/local: D:\hermes\makanak-worker (Cloudflare Worker, module syntax)
- API base 1 (primary): https://makanak-worker.makanak-app.workers.dev/api
- API base 2 (fallback): https://makanak.kdns.fr/api  ← blocked on Soheil's mobile LTE; works elsewhere
- D1 database: makanak-db (6d0fd00a-a76b-401b-9baf-9f31c55f2b45), tables users / sessions / bookings

## Verified working
- Registration, login, token session (localStorage `makanak_token`), logout
- Booking create from stay.html and listing in the user panel
- Anonymous "درخواست رزرو" → prompts login
- 84 stays, 453 same-origin gallery photos (assets/gallery), 40 popular stays over 4 pages
- Card click navigates straight to stay.html?id=... (no intermediate modal on index)
- City dataset 1628 cities with Persian district labels ("تهران، منطقه ۱")

## Latest UI state (deployed, commit 15116e4)
- Stays pagination: «بعدی ←» on the right, «→ قبلی» on the left (arrows, coral, no emoji) (positions swapped), page label «صفحه X از Y» mid-row on one line, «N اقامتگاه» centered on the line below; Persian digits.
- Older UI notes (commit 95cb786)
- Desktop booking grid keeps the destination field wider so «شهر یا نام اقامتگاه» is not clipped.
- Desktop guest label «تعداد نفرات» is forced onto one line; mobile booking remains stacked with no horizontal overflow.
- City dropdown: maximum 5 cities per desktop row, 3 per mobile row; rows are centered and evenly aligned inside the panel; mobile chips keep a 44px touch height.
- Booking popups open directly below their triggering field.
- Calendar rules are deployed: past days are faded and disabled; check-in is today or later; checkout cannot be earlier than check-in.
- Live URL verified after Pages propagation: https://moodswingmisery4-coder.github.io/makanak/?v=95cb786-final

## Open / unconfirmed
- Visual confirmation of the latest calendar rules on Soheil's own device is still pending.
- Test accounts created during E2E still exist in D1 (emails starting e2e/dbg/verify/flow/tok/final).
  Cleanup needs his explicit consent (the delete command was blocked once).
- Deployment quirk: `wrangler deploy --domains ...` disables the workers.dev route. Use plain
  `npx wrangler deploy` (config has workers_dev = true) to keep both endpoints alive.
- kdns.fr custom domain requires Cloudflare SSL to be fully issued; it works from Ukraine/EU nodes
  but not from his carrier.

## Commands
- Deploy backend: `cd D:/hermes/makanak-worker && npx wrangler deploy`
- Apply schema: `npx wrangler d1 execute makanak-db --remote --file=schema.sql`
- Push frontend: `cd D:/hermes/makanak && git add -A && git commit -m "..." && git push origin main`
  (if TLS handshake fails: `git -c http.version=HTTP/1.1 push origin main`)
- Bump `assets/auth.js?v=N` and `assets/catalog.js?v=N` whenever those files change.
