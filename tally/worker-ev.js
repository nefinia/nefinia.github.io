// Server side of Tally, for a Cloudflare Worker with a D1 database bound as DB.
// Route POST /ev to ev(env, body, out, req). Needs helpers sha(), getMany() and a `usage (k TEXT PRIMARY KEY, n INTEGER)` table.
// Table: CREATE TABLE events (app TEXT NOT NULL, day TEXT NOT NULL, hour INTEGER NOT NULL, name TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (app, day, hour, name));

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
