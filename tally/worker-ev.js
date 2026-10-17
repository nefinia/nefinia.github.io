// Server side of Tally, for a Cloudflare Worker with a D1 database bound as DB.
// Routes: POST /ev -> ev(env, body, out, req)   (allow the sending sites' origins)
//         GET /stats -> stats(env, url, cors)   (needs TALLY_KEY; keep it private, e.g. as a Worker secret)
// Needs helpers sha() and getMany(), a `usage (k TEXT PRIMARY KEY, n INTEGER)` table, and:
// CREATE TABLE events (app TEXT NOT NULL, day TEXT NOT NULL, hour INTEGER NOT NULL, name TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (app, day, hour, name));
const TALLY_KEY = "set-your-own-key";

/* ---- own analytics ----
 * Counts what people do in the app as anonymous hourly totals per action (table events).
 * No cookies, no device code, no IP stored, never any text people typed.
 * Country comes from Cloudflare's network header, counted once per app opening.
 */
const EV_NET_DAY = 20000;
async function ev(env, body, out, req) {
  const now = new Date(), day = now.toISOString().slice(0, 10), hour = now.getUTCHours();
  const app = typeof body.app === "string" && /^[a-z0-9-]{1,30}$/.test(body.app) ? body.app : "moc7";
  const kN = `ev:${day}:${(await sha("ev:" + (req.headers.get("cf-connecting-ip") || "0"))).slice(0, 16)}`;
  const [nN] = await getMany(env, [kN]);
  if (nN >= EV_NET_DAY) return out(429, { error: "Too many" });
  const rows = [];
  for (const [name, n] of Object.entries(body.ev && typeof body.ev === "object" ? body.ev : {}).slice(0, 80)) {
    const c = Math.min(Math.max(parseInt(n, 10) || 0, 0), 200);
    if (c && /^[a-z0-9:_.\-]{1,48}$/.test(name)) rows.push([name, c]);
  }
  if (body.start === true) rows.push(["country:" + String(req.headers.get("cf-ipcountry") || "xx").slice(0, 2).toLowerCase(), 1]);
  if (!rows.length) return out(200, { ok: true });
  const st = env.DB.prepare("INSERT INTO events (app, day, hour, name, n) VALUES (?, ?, ?, ?, ?) ON CONFLICT(app, day, hour, name) DO UPDATE SET n = n + excluded.n");
  await env.DB.batch([...rows.map(([k, c]) => st.bind(app, day, hour, k, c)),
    env.DB.prepare("INSERT INTO usage (k, n) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET n = n + excluded.n").bind(kN, rows.reduce((s, r) => s + r[1], 0))]);
  return out(200, { ok: true });
}
/* Tally data for the owner: GET /stats?key=…&from=YYYY-MM-DD&to=YYYY-MM-DD&app=…&format=csv|json
 * Rows: app, day (UTC), hour (UTC, 0-23), name, n. Works from a browser, a spreadsheet or any script. */
async function stats(env, url, cors) {
  const q = url.searchParams;
  if (q.get("key") !== TALLY_KEY) return new Response("Not found", { status: 404 });
  const from = /^\d{4}-\d\d-\d\d$/.test(q.get("from") || "") ? q.get("from") : "2000-01-01";
  const to = /^\d{4}-\d\d-\d\d$/.test(q.get("to") || "") ? q.get("to") : "2999-12-31";
  const app = q.get("app") || "";
  const { results } = await env.DB.prepare("SELECT app, day, hour, name, n FROM events WHERE day >= ? AND day <= ? AND (? = '' OR app = ?) ORDER BY day, hour, app, name LIMIT 200000").bind(from, to, app, app).all();
  const h = { ...cors, "access-control-allow-origin": "*", "cache-control": "no-store" };
  if (q.get("format") === "csv") {
    const csv = "app,day,hour_utc,name,n\n" + results.map(r => [r.app, r.day, r.hour, r.name, r.n].join(",")).join("\n") + "\n";
    return new Response(csv, { headers: { ...h, "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="tally-${from}-${to}.csv"` } });
  }
  return new Response(JSON.stringify({ fields: ["app", "day", "hour_utc", "name", "n"], rows: results.map(r => [r.app, r.day, r.hour, r.name, r.n]) }), { headers: { ...h, "content-type": "application/json" } });
}
