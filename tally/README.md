# Tally

Small, privacy-first analytics for my apps. It counts what people do (tabs opened, buttons used) as anonymous hourly totals on my own Cloudflare server.

- No cookies, no device or visitor code, no IP stored, nothing typed is ever sent.
- Respects Do Not Track and Global Privacy Control.
- Each app opening also records device type (phone, tablet, desktop), installed or browser, light or dark scheme, language and country.

Client: `tally.js` (one script tag, see the comment at the top). Server: `worker-ev.js` plus one D1 table.

First used in MoC7 Atlas (sofiagallego.com/moc7).
