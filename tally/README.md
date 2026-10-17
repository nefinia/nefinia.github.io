# Tally

Small, privacy-first statistics for my sites and apps. It counts what people do (pages opened, tabs, buttons, game plays) as anonymous hourly totals on my own Cloudflare server.

- No cookies, no visitor or device code, no IP stored, nothing typed is ever sent.
- Respects Do Not Track and Global Privacy Control.
- Each opening also counts device type (phone, tablet, desktop), installed or browser, light or dark mode, language and country.

## Where it runs
- sofiagallego.com: every page, `data-app="auto"` (the app is named after the folder, `home` for top-level pages).
- MoC7 Atlas: built in, app `moc7`.
- sofi.games: app `games`; `cozy/stats.js` adds `play:`, `win:`, `loss:`, `solved:`, `best:`, `minute:` (minutes played), `ev:` and `player:new` / `player:back-…` (days since this browser last played; only the bucket is sent).
- Little Agent Lab: app `lal`.

## Reading the data
- Dashboard: https://sofiagallego.com/tally/ (asks for the key once; kept in that browser only).
- Raw data, for a spreadsheet, any AI or a script:
  `https://moc7-ask.sofiag-gallego.workers.dev/stats?key=KEY&format=csv` (or `format=json`), optional `&from=YYYY-MM-DD&to=YYYY-MM-DD&app=games`.
  Columns: `app, day, hour_utc, name, n` (one row per app, UTC day and hour, counter).

## Adding it to a new page or app
```html
<script defer src="https://sofiagallego.com/tally/tally.js" data-app="myapp"></script>
```
Mark buttons with `data-ev="name"` (or `data-act`, `data-tab`), or call `window.__tally.track("name")`.
A new domain must be added to `EV_ORIGINS` in the worker.

## Files
- `tally.js`: the browser part.
- `worker-ev.js`: the server part (Cloudflare Worker + D1 table `events`).
- `index.html`: the dashboard.
