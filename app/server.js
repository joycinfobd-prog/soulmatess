const express = require('express'), fs = require('fs'), path = require('path'), crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;
const PASS = process.env.ADMIN_PASSWORD || 'admin123';
const SECRET = process.env.SECRET || crypto.createHash('sha256').update('s:' + PASS).digest('hex');
const FILE = path.join(__dirname, 'data', 'content.json'), UP = path.join(__dirname, 'data', 'uploads');
const MIME = { '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

// ---- storage: Upstash Redis (needed on Vercel) or local files (VPS / your PC) ----
let gateCache = { t: 0, v: null };
const RURL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const RTOK = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const noStore = () => Object.assign(new Error('Storage not set up: add an Upstash Redis database to this Vercel project (see README), then redeploy.'), { status: 503 });
const redis = async cmd => {
  const r = await fetch(RURL, { method: 'POST', headers: { Authorization: 'Bearer ' + RTOK, 'content-type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json(); if (j.error) throw new Error(j.error); return j.result;
};
const LAYOUTS = ['accordion', 'notes', 'envelopes', 'timeline', 'slider'], DECORS = ['hearts', 'diya', 'flowers', 'stars', 'none'], THEMES = ['rose', 'lavender', 'peach', 'midnight', 'saffron', 'crimson', 'gold'];
const readSeed = () => JSON.parse(fs.readFileSync(FILE, 'utf8'));
const DEF = require('./defaults');
const rid = () => crypto.randomBytes(4).toString('hex');
async function load() {
  let c; if (RURL) { const raw = await redis(['GET', 'content']); c = raw ? JSON.parse(raw) : readSeed(); } else c = readSeed();
  if (!c.photos) c.photos = [];
  if (!c.photoThemes) c.photoThemes = JSON.parse(fs.readFileSync(path.join(__dirname, 'photo-defaults.json'), 'utf8'));
  const fresh = c.boxes === undefined;
  const oldSeed = c.seedVersion || 0;
  const clone = v => JSON.parse(JSON.stringify(v));              // never share objects with the defaults
  for (const k in DEF) if (c[k] === undefined) c[k] = clone(DEF[k]);
  if (fresh && Array.isArray(c.letters)) {                       // old version: single letter list -> "Open When…" box
    const ow = c.boxes.find(b => b.id === 'openwhen');
    if (ow && c.letters.length) ow.letters = c.letters.map(l => ({ id: 'l' + rid(), emoji: '💌', title: l.title || '', photoId: '', body: l.body || '' }));
  }
  delete c.letters; delete c.letterTitle;
  c.photos = c.photos.map(p => ({ id: p.id, file: p.file, _cap: p.caption || '' }));
  if (!Array.isArray(c.gallery)) c.gallery = c.photos.map(p => ({ id: 'g' + p.id.slice(0, 8), photoId: p.id, caption: p._cap }));   // birthday-page photos (separate from Photo Letters)
  c.photos.forEach(p => { delete p._cap; });
  c.photoLetters = (Array.isArray(c.photoLetters) ? c.photoLetters : []).map((l, i) => ({ id: l.id || 'pl' + i, photoId: l.photoId || '', caption: l.caption || '', title: l.title || '', body: l.body || '' }));
  c.boxes.forEach(b => { const d = DEF.boxes.find(x => x.id === b.id) || {}; if (!LAYOUTS.includes(b.layout)) b.layout = d.layout || 'accordion'; if (!DECORS.includes(b.decor)) b.decor = d.decor || 'hearts'; if (b.replies === undefined) b.replies = true; });
  if (!c.migratedV3) { const w = c.boxes.find(b => b.id === 'wishes'); if (w && w.title === 'Birthday Wishes') { w.title = 'Chirkut'; w.subtitle = 'চিরকুট — ছোট ছোট চিঠি, সাথে ছবি'; w.icon = '📝'; w.layout = 'notes'; } c.migratedV3 = true; }
  c.labels = { ...DEF.labels, ...(c.labels || {}) };
  if (oldSeed < DEF.seedVersion) {                  // add newly shipped default letters once, without touching your own
    for (const d of DEF.boxes) { const b = c.boxes.find(x => x.id === d.id); if (!b) continue; const have = new Set((b.letters || []).map(l => l.id)); b.letters = b.letters || []; d.letters.forEach(l => { if (!have.has(l.id)) b.letters.push(clone(l)); }); }
    c.seedVersion = DEF.seedVersion;
  }
  return c;
}
async function save(c) {
  gateCache.t = 0;
  if (RURL) return redis(['SET', 'content', JSON.stringify(c)]);
  if (process.env.VERCEL) throw noStore();
  fs.writeFileSync(FILE + '.tmp', JSON.stringify(c, null, 2)); fs.renameSync(FILE + '.tmp', FILE);
}
async function putImg(name, mime, buf) {
  if (RURL) return redis(['SET', 'img:' + name, mime + '|' + buf.toString('base64')]);
  if (process.env.VERCEL) throw noStore();
  fs.mkdirSync(UP, { recursive: true }); fs.writeFileSync(path.join(UP, name), buf);
}
async function getImg(name) {
  if (RURL) { const v = await redis(['GET', 'img:' + name]); if (!v) return null; const i = v.indexOf('|'); return { mime: v.slice(0, i), buf: Buffer.from(v.slice(i + 1), 'base64') }; }
  const f = path.join(UP, name); return fs.existsSync(f) ? { mime: MIME[path.extname(name)], buf: fs.readFileSync(f) } : null;
}
async function delImg(name) { if (RURL) return redis(['DEL', 'img:' + name]); fs.rm(path.join(UP, name), () => {}); }

const A = f => (q, s, n) => f(q, s, n).catch(e => { console.error(e); s.status(e.status || 500).json({ error: e.status ? e.message : 'Server error' }); });
const pick = a => a[Math.floor(Math.random() * a.length)];
async function kvGet(name, def) {            // small extra stores (messages, admin password)
  if (RURL) { const raw = await redis(['GET', 'kv:' + name]); return raw ? JSON.parse(raw) : def; }
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', name + '.json'), 'utf8')); } catch { return def; }
}
async function kvSet(name, v) {
  if (RURL) return redis(['SET', 'kv:' + name, JSON.stringify(v)]);
  if (process.env.VERCEL) throw noStore();
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true }); fs.writeFileSync(path.join(__dirname, 'data', name + '.json'), JSON.stringify(v, null, 2));
}
const sign = t => crypto.createHmac('sha256', SECRET).update(t).digest('hex');
const safeEq = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && crypto.timingSafeEqual(x, y); };

app.set('trust proxy', 1);
app.use((q, r, n) => (q.method === 'POST' && q.path === '/api/admin/photos') ? n() : express.json({ limit: '4mb' })(q, r, n));

// ---- text generators: unlimited combos, emoji always matches the theme ----
const gen = themes => { const t = pick(themes); return { text: pick(t.starts) + ' ' + pick(t.ends), emoji: pick(t.emoji) }; };
async function ai(kind, n) {   // optional: set ANTHROPIC_API_KEY and tick "Use AI" in admin
  if (!process.env.ANTHROPIC_API_KEY) return null;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 400,
        messages: [{ role: 'user', content: `Write ${n} new, short, sweet ${kind} for a romantic birthday website (Bubu & Dudu bear/panda couple theme). One line each, max 12 words, no emoji inside the text. Reply ONLY with JSON: [{"text":"...","emoji":"ONE emoji that matches the text"}]` }] })
    });
    const j = await r.json();
    return JSON.parse(j.content[0].text.replace(/```json|```/g, '').trim()).slice(0, n).map(x => ({ text: String(x.text), emoji: String(x.emoji) }));
  } catch { return null; }
}
const make = (key, kind) => A(async (req, res) => {
  const c = await load(), n = Math.min(Math.max(+req.query.n || 1, 1), 6);
  let items = c.useAI ? await ai(kind, n) : null;
  if (!items) items = Array.from({ length: n }, () => gen(c[key]));
  res.json({ items });
});

// ---- admin auth helpers (signed, HttpOnly cookie) ----
let fails = 0, lockUntil = 0;
const adminState = async () => (await kvGet('admin', null)) || { ver: 0 };
const hashPw = (pw, salt) => crypto.scryptSync(pw, salt, 32).toString('hex');
const checkPw = async pw => { const st = await adminState(); return st.hash ? safeEq(hashPw(pw, st.salt), st.hash) : safeEq(pw, PASS); };
const mkTok = (ts, ver) => ts + '.' + ver + '.' + sign(ts + ':' + ver);
const cookieOf = (req, name) => { const m = (req.headers.cookie || '').match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)')); return m ? decodeURIComponent(m[1]) : ''; };
const authed = async req => {
  const raw = cookieOf(req, 'tok'); if (!raw) return false;
  const [ts, ver, sig] = raw.split('.');
  if (!sig || !safeEq(sig, sign(ts + ':' + ver)) || Date.now() - +ts > 7 * 864e5) return false;
  return +ver === ((await adminState()).ver || 0);
};
const guard = A(async (req, res, next) => (await authed(req)) ? next() : res.status(401).json({ error: 'login required' }));
const setCookie = (req, res, ver) => res.cookie('tok', mkTok(String(Date.now()), ver), { httpOnly: true, sameSite: 'strict', secure: req.secure, maxAge: 7 * 864e5 });

// ---- website entrance PIN (set in Admin -> Settings) ----
const gateCfg = async () => {
  if (Date.now() - gateCache.t < 4000 && gateCache.v) return gateCache.v;
  const c = await load(), pin = String(c.sitePin || '').trim();
  gateCache = { t: Date.now(), v: { on: c.sitePinOn !== false && !!pin, pin, title: c.gateTitle || DEF.gateTitle, hint: c.gateHint || DEF.gateHint } };
  return gateCache.v;
};
const gateTok = (pin, ts) => ts + '.' + sign('gate:' + ts + ':' + crypto.createHash('sha256').update(pin).digest('hex'));
const gateOk = (req, g) => { const [ts, sig] = cookieOf(req, 'gate').split('.'); return !!sig && Date.now() - +ts < 30 * 864e5 && safeEq(gateTok(g.pin, ts), ts + '.' + sig); };
const OPEN = [/^\/api\/gate$/, /^\/api\/(login|logout)$/, /^\/api\/admin\//];
app.use(A(async (req, res, next) => {
  if (!(req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) || OPEN.some(r => r.test(req.path))) return next();
  const g = await gateCfg(); if (!g.on || gateOk(req, g) || await authed(req)) return next();
  res.status(401).json({ error: 'locked', gate: true });
}));
app.get('/api/gate', A(async (req, res) => { const g = await gateCfg(); res.json({ needed: g.on && !gateOk(req, g) && !(await authed(req)), title: g.title, hint: g.hint }); }));
app.post('/api/gate', A(async (req, res) => {
  const g = await gateCfg(); if (!g.on) return res.json({ ok: true });
  if (limited('gate:' + req.ip, 8, 60000)) return res.status(429).json({ error: 'Too many tries. Please wait a minute.' });
  if (!safeEq(String((req.body || {}).pin || '').trim(), g.pin)) return res.status(401).json({ error: 'Wrong PIN 🥺 Try again' });
  res.cookie('gate', gateTok(g.pin, String(Date.now())), { httpOnly: true, sameSite: 'lax', secure: req.secure, maxAge: 30 * 864e5 }); res.json({ ok: true });
}));
app.use(express.static(path.join(__dirname, 'public')));

// ---- replies / conversations (every letter, every box, plus a general chat) ----
const getReplies = () => kvGet('replies', []);
const pubReply = r => ({ id: r.id, from: r.from, body: r.body, at: r.at });
const threadsOf = (list, scope) => { const m = {}; list.filter(r => r.scope === scope).forEach(r => { (m[r.item] = m[r.item] || []).push(pubReply(r)); }); return m; };
async function addReply(scope, item, from, body) {
  const list = await getReplies(), r = { id: rid() + rid(), scope, item, from, body, at: new Date().toISOString(), read: from === 'admin' };
  list.push(r); await kvSet('replies', list.slice(-3000)); return list;
}
const cleanBody = v => String(v || '').trim().slice(0, 20000);

// ---- public API ----
const isLocked = b => !!b.unlockAt && Date.now() < new Date(b.unlockAt + 'T00:00:00+06:00').getTime();   // Bangladesh time
const boxView = b => ({ id: b.id, title: b.title, subtitle: b.subtitle, icon: b.icon, kind: b.kind, target: b.target, theme: b.theme, layout: b.layout, decor: b.decor, hasPin: !!b.pin, locked: isLocked(b), unlockAt: b.unlockAt, lockMessage: b.lockMessage, count: (b.letters || []).length });
app.get('/api/content', A(async (req, res) => {
  const { momentThemes, reasonThemes, photoThemes, photos, gallery, photoLetters, useAI, boxes, sitePin, sitePinOn, gateTitle, gateHint, ...pub } = await load();
  pub.boxes = boxes.map(boxView); res.json(pub);
}));
const tries = new Map();
const limited = (key, max, ms) => { const now = Date.now(), t = (tries.get(key) || []).filter(x => now - x < ms); if (t.length >= max) return true; t.push(now); tries.set(key, t); return false; };
function boxAccess(b, pin, ip) {   // returns an error object or null
  if (!b) return { status: 404, error: 'Box not found' };
  if (isLocked(b)) return { status: 423, error: b.lockMessage || 'This box is still locked 🔒', locked: true, unlockAt: b.unlockAt };
  if (b.pin) {
    if (!pin) return { status: 401, error: 'PIN needed', needPin: true };
    if (limited('pin:' + ip, 12, 60000)) return { status: 429, error: 'Too many tries. Please wait a minute.', needPin: true };
    if (!safeEq(String(pin), b.pin)) return { status: 401, error: 'Wrong PIN 🥺 Try again', needPin: true };
  }
  return null;
}
app.post('/api/box/:id/open', A(async (req, res) => {
  const c = await load(), b = c.boxes.find(x => x.id === req.params.id && x.kind === 'letters');
  const err = boxAccess(b, String((req.body || {}).pin || ''), req.ip); if (err) return res.status(err.status).json(err);
  const src = new Map(c.photos.map(p => [p.id, '/uploads/' + p.file])), th = threadsOf(await getReplies(), b.id);
  res.json({ box: { ...boxView(b), canReply: b.replies !== false, letters: b.letters.map(l => ({ id: l.id, title: l.title, emoji: l.emoji, body: l.body, photo: src.get(l.photoId) || '', replies: th[l.id] || [] })) } });
}));
app.post('/api/reply', A(async (req, res) => {
  const q = req.body || {}, scope = String(q.scope || ''), item = String(q.item || ''), body = cleanBody(q.body), c = await load();
  if (!body) return res.status(400).json({ error: 'Write something first 💌' });
  if (limited('rep:' + req.ip, 12, 60000)) return res.status(429).json({ error: 'Slow down a little 💗' });
  if (scope === 'photos') { if (!c.photoLetters.some(l => l.id === item)) return res.status(404).json({ error: 'Not found' }); }
  else {
    const b = c.boxes.find(x => x.id === scope && x.kind === 'letters'), err = boxAccess(b, String(q.pin || ''), req.ip); if (err) return res.status(err.status).json(err);
    if (b.replies === false) return res.status(403).json({ error: 'Replies are off for this box' });
    if (!b.letters.some(l => l.id === item)) return res.status(404).json({ error: 'Not found' });
  }
  const list = await addReply(scope, item, 'visitor', body); res.json({ replies: list.filter(r => r.scope === scope && r.item === item).map(pubReply) });
}));
// general chat (the "Message me" box on the birthday page and the chat page)
app.post('/api/messages', A(async (req, res) => {
  const content = cleanBody((req.body || {}).content); if (!content) return res.status(400).json({ error: 'Empty message' });
  if (limited('msg:' + req.ip, 8, 60000)) return res.status(429).json({ error: 'Slow down a little 💗' });
  await addReply('chat', 'main', 'visitor', content); res.json({ ok: true });
}));
app.get('/api/chat', A(async (req, res) => res.json({ messages: (await getReplies()).filter(r => r.scope === 'chat').map(pubReply) })));
app.get('/api/moments', make('momentThemes', 'cute couple moment captions'));
app.get('/api/reasons', make('reasonThemes', '"reasons I love you" lines'));
app.get('/api/photolines', make('photoThemes', 'naughty-cute one-line photo captions (playful, teasing, affectionate)'));
// birthday-page gallery (its own photos) and the separate Photo Letters page
app.get('/api/gallery', A(async (req, res) => { const c = await load(), f = new Map(c.photos.map(p => [p.id, p.file])); res.json({ photos: c.gallery.filter(g => f.has(g.photoId)).map(g => ({ id: g.id, src: '/uploads/' + f.get(g.photoId), caption: g.caption || '' })) }); }));
app.get('/api/photoletters', A(async (req, res) => {
  const c = await load(), f = new Map(c.photos.map(p => [p.id, p.file])), th = threadsOf(await getReplies(), 'photos');
  res.json({ items: c.photoLetters.map(l => ({ id: l.id, src: f.has(l.photoId) ? '/uploads/' + f.get(l.photoId) : '', caption: l.caption, title: l.title, body: l.body, replies: th[l.id] || [] })) });
}));
app.get('/uploads/:file', A(async (q, s) => {
  if (!/^[a-f0-9]{12}\.(jpg|png|webp)$/.test(q.params.file)) return s.sendStatus(404);
  const im = await getImg(q.params.file); if (!im) return s.sendStatus(404);
  s.set('Content-Type', im.mime); s.set('Cache-Control', 'private, max-age=604800, immutable'); s.send(im.buf);
}));

// ---- admin login ----
app.post('/api/login', A(async (req, res) => {
  if (Date.now() < lockUntil) return res.status(429).json({ error: 'Too many attempts. Wait a minute.' });
  if (!(await checkPw(String((req.body || {}).password || '')))) {
    if (++fails >= 5) { lockUntil = Date.now() + 60000; fails = 0; }
    return setTimeout(() => res.status(401).json({ error: 'Wrong password' }), 700);
  }
  fails = 0; setCookie(req, res, (await adminState()).ver || 0); res.json({ ok: true });
}));
app.post('/api/logout', (req, res) => { res.clearCookie('tok'); res.json({ ok: true }); });
app.get('/api/admin/me', A(async (req, res) => { const ok = await authed(req), st = ok ? await adminState() : {}; res.json({ authed: ok, defaultPass: ok && !st.hash && PASS === 'admin123' }); }));
app.post('/api/admin/password', guard, A(async (req, res) => {
  const { current, next } = req.body || {};
  if (!(await checkPw(String(current || '')))) return res.status(401).json({ error: 'Current password is wrong' });
  if (typeof next !== 'string' || next.length < 6 || next.length > 100) return res.status(400).json({ error: 'New password must be 6–100 characters' });
  const salt = crypto.randomBytes(16).toString('hex'), ver = ((await adminState()).ver || 0) + 1;
  await kvSet('admin', { salt, hash: hashPw(next, salt), ver }); setCookie(req, res, ver); res.json({ ok: true });
}));
app.get('/api/admin/status', guard, (req, res) => res.json({ storage: RURL ? 'redis' : process.env.VERCEL ? 'none' : 'files', ai: !!process.env.ANTHROPIC_API_KEY }));

// ---- admin: conversations ----
app.get('/api/admin/replies', guard, A(async (req, res) => {
  const old = await kvGet('messages', []);   // messages from the previous version become chat messages once
  if (old.length) { const list = await getReplies(); old.slice().reverse().forEach(m => list.push({ id: m.id, scope: 'chat', item: 'main', from: 'visitor', body: m.content, at: m.at, read: !!m.read })); await kvSet('replies', list.slice(-3000)); await kvSet('messages', []); }
  res.json({ replies: await getReplies() });
}));
app.post('/api/admin/replies', guard, A(async (req, res) => {
  const q = req.body || {}, body = cleanBody(q.body); if (!body) return res.status(400).json({ error: 'Write something first' });
  const list = await addReply(String(q.scope || '').slice(0, 40), String(q.item || '').slice(0, 40), 'admin', body); res.json({ replies: list });
}));
app.post('/api/admin/replies/read', guard, A(async (req, res) => { const q = req.body || {}, l = await getReplies(); l.forEach(r => { if (r.scope === q.scope && r.item === q.item) r.read = true; }); await kvSet('replies', l); res.json({ ok: true }); }));
app.delete('/api/admin/replies/:id', guard, A(async (req, res) => { await kvSet('replies', (await getReplies()).filter(x => x.id !== req.params.id)); res.json({ ok: true }); }));

// ---- admin: content ----
app.get('/api/admin/content', guard, A(async (req, res) => res.json(await load())));
app.put('/api/admin/content', guard, A(async (req, res) => {
  const c = req.body, S = a => Array.isArray(a) && a.every(x => typeof x === 'string');
  const T = a => Array.isArray(a) && a.length && a.every(t => S(t.emoji) && t.emoji.length && S(t.starts) && t.starts.length && S(t.ends) && t.ends.length);
  if (!c || !S(c.letter) || !S(c.promises) || !S(c.hug) || !T(c.momentThemes) || !T(c.reasonThemes) || !Array.isArray(c.chips))
    return res.status(400).json({ error: 'Invalid data' });
  const cur = await load(), have = new Set(cur.photos.map(p => p.id));
  if (!T(c.photoThemes)) c.photoThemes = cur.photoThemes;
  const str = (v, n, d) => (typeof v === 'string' ? v.slice(0, n) : d), okId = v => /^[a-z0-9_-]{1,40}$/i.test(v || ''), pid = v => (have.has(v) ? v : '');
  const BIG = 300000;   // practically no limit for a letter
  c.photos = cur.photos;
  c.gallery = (Array.isArray(c.gallery) ? c.gallery : cur.gallery).slice(0, 300).map(g => ({ id: okId(g && g.id) ? g.id : 'g' + rid(), photoId: pid(g && g.photoId), caption: str(g && g.caption, 300, '') })).filter(g => g.photoId);
  c.photoLetters = (Array.isArray(c.photoLetters) ? c.photoLetters : cur.photoLetters).slice(0, 300).map(l => ({ id: okId(l && l.id) ? l.id : 'pl' + rid(), photoId: pid(l && l.photoId), caption: str(l && l.caption, 300, ''), title: str(l && l.title, 200, ''), body: str(l && l.body, BIG, '') })).filter(l => l.body.trim() || l.title.trim() || l.photoId);
  c.galleryTitle = str(c.galleryTitle, 80, DEF.galleryTitle) || DEF.galleryTitle;
  c.whatsapp = String(c.whatsapp || '').replace(/[^\d+]/g, '').slice(0, 20) || DEF.whatsapp;
  c.togetherSince = /^\d{4}-\d{2}-\d{2}$/.test(c.togetherSince || '') ? c.togetherSince : '';
  c.togetherLabel = str(c.togetherLabel, 120, DEF.togetherLabel);
  c.quick = S(c.quick) ? c.quick.map(x => x.slice(0, 120)).slice(0, 12) : DEF.quick;
  c.hubTitle = str(c.hubTitle, 120, DEF.hubTitle) || DEF.hubTitle; c.hubSubtitle = str(c.hubSubtitle, 200, DEF.hubSubtitle);
  c.sitePin = str(c.sitePin, 20, '').trim(); c.sitePinOn = c.sitePinOn !== false; c.gateTitle = str(c.gateTitle, 80, DEF.gateTitle) || DEF.gateTitle; c.gateHint = str(c.gateHint, 160, DEF.gateHint);
  c.boxes = (Array.isArray(c.boxes) ? c.boxes : cur.boxes).slice(0, 60).map(b => ({
    id: okId(b.id) ? b.id : 'b' + rid(), title: str(b.title, 80, ''), subtitle: str(b.subtitle, 160, ''), icon: str(b.icon, 8, '') || '💌',
    kind: ['birthday', 'photos', 'letters', 'link'].includes(b.kind) ? b.kind : 'letters',
    target: /^(https?:\/\/|\/)/.test(b.target || '') ? str(b.target, 300, '') : '',
    theme: THEMES.includes(b.theme) ? b.theme : 'rose', layout: LAYOUTS.includes(b.layout) ? b.layout : 'accordion', decor: DECORS.includes(b.decor) ? b.decor : 'hearts', replies: b.replies !== false,
    pin: str(b.pin, 12, '').trim(), unlockAt: /^\d{4}-\d{2}-\d{2}$/.test(b.unlockAt || '') ? b.unlockAt : '', lockMessage: str(b.lockMessage, 200, ''),
    letters: (Array.isArray(b.letters) ? b.letters : []).slice(0, 1000).map(l => ({ id: okId(l && l.id) ? l.id : 'l' + rid(), title: str(l && l.title, 200, ''), emoji: str(l && l.emoji, 8, '') || '💌', photoId: pid(l && l.photoId), body: str(l && l.body, BIG, '') })).filter(l => l.body.trim() || l.title.trim() || l.photoId)
  }));
  c.seedVersion = DEF.seedVersion; c.migratedV3 = true;
  const lb = {}; for (const k in DEF.labels) lb[k] = str(c.labels && c.labels[k], 300, ''); c.labels = lb;
  const seen = new Set(); c.boxes.forEach(b => { if (seen.has(b.id)) b.id = 'b' + rid(); seen.add(b.id); });
  delete c.letters; delete c.letterTitle;
  // photos nobody uses any more are removed from storage
  const used = new Set(c.gallery.map(g => g.photoId)); c.photoLetters.forEach(l => used.add(l.photoId)); c.boxes.forEach(b => b.letters.forEach(l => used.add(l.photoId)));
  const dead = c.photos.filter(p => !used.has(p.id)); c.photos = c.photos.filter(p => used.has(p.id));
  await save(c); await Promise.all(dead.map(p => delImg(p.file).catch(() => {}))); res.json({ ok: true });
}));
app.post('/api/admin/photos', guard, express.json({ limit: '4mb' }), A(async (req, res) => {
  const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(String((req.body || {}).data || ''));
  if (!m) return res.status(400).json({ error: 'Bad image' });
  const buf = Buffer.from(m[2], 'base64'), ext = m[1] === 'jpeg' ? 'jpg' : m[1];
  const id = crypto.randomBytes(6).toString('hex'), file = id + '.' + ext;
  await putImg(file, 'image/' + m[1], buf);
  const c = await load(), photo = { id, file }; c.photos.push(photo); await save(c); res.json({ photo });
}));
app.get('/letter', (req, res) => res.sendFile(path.join(__dirname, 'public', 'letter.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

module.exports = app;   // Vercel uses this export; locally we start a server below
if (require.main === module) {
  app.listen(PORT, () => console.log(`Site: http://localhost:${PORT}   Admin: http://localhost:${PORT}/admin`));
  if (PASS === 'admin123') console.log('WARNING: default admin password in use. Set ADMIN_PASSWORD.');
}
