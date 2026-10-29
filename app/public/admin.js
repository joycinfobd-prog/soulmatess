(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const h = (t, a = {}, ...k) => {
  const e = document.createElement(t);
  for (const x in a) { const v = a[x]; if (v == null || v === false) continue;
    if (x === 'class') e.className = v; else if (x === 'style') e.style.cssText = v; else if (x.startsWith('on')) e.addEventListener(x.slice(2), v);
    else if (x === 'value' || x === 'checked' || x === 'disabled') e[x] = v; else e.setAttribute(x, v === true ? '' : v); }
  k.flat(9).forEach(c => { if (c != null && c !== false) e.append(c.nodeType ? c : String(c)); });
  return e;
};
const S = { C: null, replies: [], status: {}, me: {}, dirty: false, route: ['dashboard', ''] };
const rid = p => p + Math.random().toString(36).slice(2, 8);
const EMO = ['💌', '🎂', '🎁', '🥺', '✨', '💞', '🌙', '🔥', '🦇', '🌹', '😤', '😔', '😄', '📸', '🕊️', '💍', '🧸', '🌧️', '☀️', '🏠', '🗡️', '🥀', '🔗', '🥳', '🪔', '🎊', '🌸', '📝', '🎉', '🙏'];
const THEMES = [['rose', '#ffc2d6', 'Rose'], ['lavender', '#d9c2ff', 'Lavender'], ['peach', '#ffd0a8', 'Peach'], ['midnight', '#3a2468', 'Midnight'], ['saffron', '#ffb347', 'Saffron (puja)'], ['crimson', '#e5383b', 'Crimson (boishakh)'], ['gold', '#f3d98b', 'Gold (anniversary)']];
const GRAD = { rose: 'linear-gradient(160deg,#fff0f5,#ffc2d6)', lavender: 'linear-gradient(160deg,#f6eeff,#d9c2ff)', peach: 'linear-gradient(160deg,#fff4e6,#ffd0a8)', midnight: 'linear-gradient(160deg,#3a2468,#241040)', saffron: 'linear-gradient(160deg,#fff3d6,#ffb347)', crimson: 'linear-gradient(160deg,#ffffff,#ffb3b3)', gold: 'linear-gradient(160deg,#fff8e1,#f3d98b)' };
const DARK = { midnight: 1 };
const KINDS = [['letters', 'Letter box (own page with letters)'], ['birthday', 'Birthday website'], ['photos', 'Photo letters page'], ['link', 'Custom link']];
const LAYOUTS = [['accordion', '📖 Tap-to-open letters'], ['notes', '📝 Serial notes with photos (Chirkut)'], ['envelopes', '✉️ Envelope grid — tap to open'], ['timeline', '🌌 Timeline / chapters'], ['slider', '🎴 Swipe cards, one at a time']];
const DECORS = [['hearts', 'Hearts ♥'], ['diya', 'Diya & lights 🪔'], ['flowers', 'Flowers 🌸'], ['stars', 'Stars ✦'], ['none', 'Nothing']];
const LABELS = [['introHint', 'Envelope hint (under the envelope)', 1], ['greeting', 'Letter greeting'], ['signature', 'Letter signature'], ['usTitle', '“This is us” title'], ['momentsTitle', 'Cute Moments title'], ['momentsBtn', 'Cute Moments button'],
  ['nextBtn', 'Gallery “next” button'], ['reasonsTitle', 'Reasons title'], ['reasonsBtn', 'Reasons button'], ['promisesTitle', 'Promises title'], ['timerTitle', 'Love Timer title'],
  ['meterTitle', 'Love Meter title'], ['meterHint', 'Love Meter hint'], ['meterBtn', 'Love Meter button'], ['meterResult', 'Love Meter result'], ['hugBtn', 'Hug button'], ['msgBtn', '“Send your message” button'], ['modalTitle', 'Message box title'], ['modalSend', 'Message box send button']];
const PAGES = { dashboard: ['Dashboard', '🏠'], boxes: ['Home & Boxes', '🎁'], letters: ['Letters', '💌'], photos: ['Photo Letters', '📸'], birthday: ['Birthday Page', '🎂'], replies: ['Replies', '💬'], generators: ['Auto Text', '✨'], settings: ['Settings', '⚙️'] };
const PRESETS = [
  { id: 'classic', name: 'Love Letters', emoji: '💌', desc: 'Soft pink. Tap a letter to open it.', box: { title: 'Love Letters', subtitle: 'Open one whenever you like', icon: '💌', theme: 'rose', layout: 'accordion', decor: 'hearts' }, sample: [['💌', 'My first letter', 'Write your letter here…']] },
  { id: 'chirkut', name: 'Chirkut Notes', emoji: '📝', desc: 'Paper notes in serial order, each with its own photo.', box: { title: 'Chirkut', subtitle: 'চিরকুট — ছোট ছোট চিঠি', icon: '📝', theme: 'peach', layout: 'notes', decor: 'hearts' }, sample: [['📝', 'চিরকুট ১', 'এখানে তোমার প্রথম চিরকুট লেখো…']] },
  { id: 'envelopes', name: 'Sealed Envelopes', emoji: '✉️', desc: 'An envelope for every mood — “Open when…”.', box: { title: 'Open When…', subtitle: 'A letter for every mood', icon: '✉️', theme: 'lavender', layout: 'envelopes', decor: 'hearts' }, sample: [['🥺', 'Open when you miss me', 'Close your eyes… I am right here. 💞'], ['😄', 'Open when you need a smile', 'Smile now, that is an order! 😁']] },
  { id: 'story', name: 'Our Story / Anniversary', emoji: '🌌', desc: 'A timeline of chapters with photos — great for anniversaries.', box: { title: 'Our Story', subtitle: 'Chapter by chapter, since the day we met', icon: '💍', theme: 'gold', layout: 'timeline', decor: 'hearts' }, sample: [['💞', 'The day we met', 'Tell how it all began…'], ['🌹', 'Our first date', 'Write the next chapter…']] },
  { id: 'puja', name: 'Puja & Festival Wishes', emoji: '🪔', desc: 'Swipe cards in saffron & gold — Pujo, Eid, Diwali, Christmas…', box: { title: 'শুভ পূজা', subtitle: 'পূজার শুভেচ্ছা শুধু তোমার জন্য', icon: '🪔', theme: 'saffron', layout: 'slider', decor: 'diya' }, sample: [['🪔', 'শুভ পূজা!', 'মা দুর্গা তোমার জীবন সুখ আর শান্তিতে ভরিয়ে দিন। 🙏']] },
  { id: 'boishakh', name: 'Pohela Boishakh', emoji: '🎊', desc: 'Red & white festive cards with flowers.', box: { title: 'শুভ নববর্ষ', subtitle: 'পহেলা বৈশাখের শুভেচ্ছা', icon: '🎊', theme: 'crimson', layout: 'slider', decor: 'flowers' }, sample: [['🎊', 'শুভ নববর্ষ!', 'নতুন বছরের প্রথম সকালে তোমাকে অনেক ভালোবাসা। 🌸']] }
];

// ---------- helpers ----------
function toast(m, t = 'ok') { const e = h('div', { class: 'toast ' + t }, m); $('#toasts').append(e); setTimeout(() => e.classList.add('out'), 3200); setTimeout(() => e.remove(), 3700); }
async function api(u, m = 'GET', b) {
  const r = await fetch(u, { method: m, headers: b ? { 'content-type': 'application/json' } : {}, body: b ? JSON.stringify(b) : undefined });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && !['/api/login', '/api/admin/password'].includes(u)) { showLogin(); throw new Error('Please log in again'); }
  if (!r.ok) throw Object.assign(new Error(d.error || 'Something went wrong'), { status: r.status });
  return d;
}
function modal(title, body, { actions = [], wide = false } = {}) {
  const close = () => ov.remove();
  const ov = h('div', { class: 'overlay', onmousedown: e => { if (e.target === ov) close(); } },
    h('div', { class: 'modal' + (wide ? ' wide' : '') }, h('div', { class: 'mh' }, h('h3', {}, title), h('button', { class: 'x', onclick: close }, '✕')), h('div', { class: 'mb' }, body),
      actions.length ? h('div', { class: 'mf' }, actions.map(a => h('button', { class: 'btn ' + (a.cls || ''), onclick: () => { if ((a.fn ? a.fn() : true) !== false) close(); } }, a.label))) : null));
  $('#modal-root').append(ov); return close;
}
const ask = (msg, ok = 'Delete') => new Promise(res => modal('Are you sure?', h('p', {}, msg), { actions: [{ label: 'Cancel', cls: 'ghost', fn: () => res(false) }, { label: ok, cls: 'danger', fn: () => res(true) }] }));
const mark = () => { if (!S.dirty) { S.dirty = true; updateBar(); } };
function updateBar() { $('#state').textContent = S.dirty ? '● Unsaved changes' : '✓ All changes saved'; $('#state').className = S.dirty ? 'dirty' : ''; $('#save').disabled = !S.dirty; $('#discard').hidden = !S.dirty; }
const ib = (t, f, c = '', title = '') => h('button', { class: 'ib ' + c, type: 'button', title, onclick: f }, t);
const mv = (arr, i, d, redraw) => { const j = i + d; if (j < 0 || j >= arr.length) return; [arr[i], arr[j]] = [arr[j], arr[i]]; mark(); redraw(); };
function F(label, obj, key, o = {}) {
  const i = h(o.area ? 'textarea' : 'input', { class: 'in', type: o.area ? null : (o.type || 'text'), placeholder: o.ph || '', rows: o.rows || 4 });
  i.value = obj[key] || ''; i.addEventListener('input', () => { obj[key] = i.value; mark(); if (o.on) o.on(i.value); });
  return h('label', { class: 'fld' }, h('span', { class: 'lab' }, label), i, o.hint && h('small', {}, o.hint));
}
function Sel(label, obj, key, opts, on) {
  const s = h('select', { class: 'in' }, opts.map(([v, t]) => h('option', { value: v }, t))); s.value = obj[key];
  s.addEventListener('change', () => { obj[key] = s.value; mark(); if (on) on(); }); return h('label', { class: 'fld' }, h('span', { class: 'lab' }, label), s);
}
function Tg(label, obj, key, hint, on) {
  const i = h('input', { type: 'checkbox', checked: !!obj[key] }); i.addEventListener('change', () => { obj[key] = i.checked; mark(); if (on) on(); });
  return h('div', { class: 'fld' }, h('label', { class: 'sw2' }, i, h('i'), label), hint && h('small', {}, hint));
}
function emojiField(obj, key, label = 'Icon (one emoji)') {
  const f = F(label, obj, key), inp = f.querySelector('input');
  return h('div', {}, f, h('div', { class: 'emo' }, EMO.map(e => h('button', { type: 'button', onclick: () => { obj[key] = e; inp.value = e; mark(); } }, e))));
}
function L(arr, o = {}) {   // editor for a list of strings
  const box = h('div');
  const draw = () => { box.innerHTML = '';
    arr.forEach((v, i) => { const inp = h(o.area ? 'textarea' : 'input', { class: 'in', rows: o.rows || 3, placeholder: o.ph || '' }); inp.value = v; inp.addEventListener('input', () => { arr[i] = inp.value; mark(); });
      box.append(h('div', { class: 'li' }, inp, h('div', { class: 'li-a' }, ib('↑', () => mv(arr, i, -1, draw)), ib('↓', () => mv(arr, i, 1, draw)), ib('✕', () => { arr.splice(i, 1); mark(); draw(); }, 'del')))); });
    box.append(h('button', { class: 'btn ghost sm', type: 'button', onclick: () => { arr.push(''); mark(); draw(); } }, '＋ ' + (o.add || 'Add'))); };
  draw(); return box;
}
const sec = (title, desc, ...k) => h('div', { class: 'card' }, h('h3', {}, title), desc && h('p', { class: 'mut' }, desc), k);
const photoSrc = id => { const p = S.C.photos.find(x => x.id === id); return p ? '/uploads/' + p.file : ''; };
const go = r => { const same = location.hash === '#/' + r; location.hash = '#/' + r; if (same) route(); };
const ago = t => { const s = (Date.now() - new Date(t)) / 1000; return s < 60 ? 'just now' : s < 3600 ? Math.floor(s / 60) + ' min ago' : s < 86400 ? Math.floor(s / 3600) + ' h ago' : new Date(t).toLocaleDateString(); };
let routeTok = 0;

// ---------- photos: upload / change / remove (used everywhere a photo can go) ----------
const shrink = f => new Promise((res, rej) => { const im = new Image(), u = URL.createObjectURL(f); im.onload = () => { const s = Math.min(1, 1100 / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c.toDataURL('image/jpeg', .75)); }; im.onerror = () => rej(new Error('Could not read this image')); im.src = u; });
async function uploadData(data) { const r = await api('/api/admin/photos', 'POST', { data }); S.C.photos.push(r.photo); return r.photo; }
const uploadFile = async f => uploadData(await shrink(f));
function library(obj, key, done) {
  const body = h('div'); const close = modal('Choose from my photos', body, { wide: true, actions: [{ label: 'Close', cls: 'ghost' }] });
  if (!S.C.photos.length) body.append(h('div', { class: 'empty' }, 'No photos uploaded yet.'));
  body.append(h('div', { class: 'lib' }, S.C.photos.map(p => h('img', { src: '/uploads/' + p.file, alt: '', class: obj[key] === p.id ? 'on' : '', onclick: () => { obj[key] = p.id; mark(); close(); done(); } }))));
}
function imgField(label, obj, key, o = {}) {
  const box = h('div', { class: 'fld imgf' });
  const draw = () => { box.innerHTML = '';
    const src = photoSrc(obj[key]), file = h('input', { type: 'file', accept: 'image/*', hidden: true }), busy = h('div', { class: 'imgbusy', hidden: true }, '⏳ Uploading…');
    const after = () => { if (o.on) o.on(); draw(); };
    const pick = async f => { if (!f || !f.type.startsWith('image/')) return; busy.hidden = false; try { const p = await uploadFile(f); obj[key] = p.id; mark(); toast('Photo added ✓'); after(); } catch (e) { toast(e.message, 'err'); busy.hidden = true; } };
    file.addEventListener('change', () => { pick(file.files[0]); file.value = ''; });
    const prev = h('div', { class: 'imgprev' + (src ? '' : ' none'), style: 'aspect-ratio:' + (o.ratio || '4/5'), onclick: () => file.click(), ondragover: e => { e.preventDefault(); prev.classList.add('over'); }, ondragleave: () => prev.classList.remove('over'), ondrop: e => { e.preventDefault(); prev.classList.remove('over'); pick(e.dataTransfer.files[0]); } },
      src ? h('img', { src, alt: '' }) : h('span', {}, '📷', h('br'), 'Click or drop a photo'));
    box.append(label ? h('span', { class: 'lab' }, label) : null, h('div', { class: 'imgrow' }, prev, h('div', { class: 'imgbtns' },
      h('button', { class: 'btn sm primary', type: 'button', onclick: () => file.click() }, src ? '🔄 Change photo' : '📤 Upload photo'),
      S.C.photos.length ? h('button', { class: 'btn sm', type: 'button', onclick: () => library(obj, key, after) }, '🖼 My photos') : null,
      src ? h('button', { class: 'btn sm remove', type: 'button', onclick: () => { obj[key] = ''; mark(); after(); } }, '🗑 Remove photo') : null, file, busy))); };
  draw(); return box;
}
async function uploadMany(files, make, msg) {   // several photos at once -> one new item each
  files = [...files].filter(f => f.type.startsWith('image/')); if (!files.length) return 0;
  const bar = h('i'); msg.innerHTML = ''; msg.append(h('div', {}, h('b', {}, 'Uploading…'), h('div', { class: 'prog' }, bar))); let ok = 0;
  for (let k = 0; k < files.length; k++) { try { const p = await uploadFile(files[k]); make(p); ok++; } catch (e) { toast(e.message, 'err'); } bar.style.width = ((k + 1) / files.length * 100) + '%'; }
  msg.innerHTML = ''; if (ok) { mark(); toast(ok + ' photo' + (ok > 1 ? 's' : '') + ' added ✓'); } return ok;
}
function dropZone(title, sub, onFiles) {
  const file = h('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true });
  file.addEventListener('change', () => { onFiles(file.files); file.value = ''; });
  const dz = h('div', { class: 'drop', onclick: () => file.click(), ondragover: e => { e.preventDefault(); dz.classList.add('over'); }, ondragleave: () => dz.classList.remove('over'), ondrop: e => { e.preventDefault(); dz.classList.remove('over'); onFiles(e.dataTransfer.files); } }, h('b', {}, title), h('span', { class: 'mut' }, sub), file);
  return dz;
}

// ---------- dashboard ----------
const unread = () => S.replies.filter(r => r.from === 'visitor' && !r.read).length;
function storageSteps() {
  return h('ol', { class: 'steps' }, h('li', {}, 'Open your project on ', h('b', {}, 'vercel.com'), ' → ', h('b', {}, 'Storage'), ' tab.'), h('li', {}, 'Click ', h('b', {}, 'Create / Connect'), ' → choose ', h('b', {}, 'Upstash Redis'), ' (free plan is enough) → connect it to this project (all environments).'),
    h('li', {}, 'Go to ', h('b', {}, 'Deployments'), ' → latest deployment → ', h('b', {}, '⋯ → Redeploy'), '. (Without redeploying the new database is not picked up.)'), h('li', {}, 'Open /admin again, edit something and press ', h('b', {}, 'Save & go live'), '.'));
}
function storageModal() { modal('One-time setup needed', h('div', {}, h('p', {}, 'Your site is on Vercel, which has no permanent disk. Right now nothing you save or upload here can go live. Add a free database once:'), storageSteps()), { actions: [{ label: 'OK', cls: 'primary' }] }); }
function dashboard() {
  const C = S.C, lc = C.boxes.reduce((n, b) => n + (b.letters || []).length, 0), warns = [];
  if (S.me.defaultPass) warns.push(['You are still using the default admin password.', 'Change password', 'settings']);
  if (C.sitePinOn !== false && C.sitePin === '1234') warns.push(['The website entrance PIN is still the default 1234.', 'Change PIN', 'settings']);
  if (C.sitePinOn === false || !C.sitePin) warns.push(['The website entrance PIN is off — anyone with the link can open the site.', 'Set PIN', 'settings']);
  if (C.boxes.some(b => b.pin === '1234')) warns.push(['A box still uses the default PIN 1234.', 'Change PIN', 'boxes']);
  if (!C.togetherSince) warns.push(['Tip: set “together since” to show a live Love Timer.', 'Set date', 'birthday']);
  const stat = (i, n, t) => h('div', { class: 'stat' }, h('b', {}, n), h('span', {}, i + ' ' + t));
  const last = S.replies.filter(r => r.from === 'visitor').slice(-3).reverse();
  return h('div', {},
    h('div', { class: 'stats' }, stat('🎁', C.boxes.length, 'Boxes'), stat('💌', lc, 'Letters'), stat('📸', C.photoLetters.length + C.gallery.length, 'Photos'), stat('💬', unread(), 'New replies')),
    warns.length ? sec('Needs attention', '', warns.map(w => h('div', { class: 'warn' }, h('span', {}, '⚠️ ' + w[0]), w[1] && h('button', { class: 'btn sm', onclick: () => go(w[2]) }, w[1])))) : null,
    sec('Quick actions', '', h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => go('letters') }, '💌 Write a letter'), h('button', { class: 'btn', onclick: () => go('photos') }, '📸 Photo letters'), h('button', { class: 'btn', onclick: () => go('boxes') }, '🎁 New box'), h('button', { class: 'btn', onclick: () => go('birthday') }, '🎂 Birthday page'),
      h('a', { class: 'btn', href: '/', target: '_blank', rel: 'noopener' }, '🌐 Open site ↗'))),
    sec('Latest replies from the site', '', last.length ? last.map(m => h('div', { class: 'msg' + (m.read ? '' : ' new'), style: 'cursor:pointer', onclick: () => go('replies/' + m.scope + '.' + m.item) }, h('div', { class: 'mt' }, h('span', {}, metaOf(m.scope, m.item).title + ' · ' + ago(m.at)), m.read ? '' : h('b', {}, 'NEW')), h('p', {}, m.body))) : h('div', { class: 'empty' }, 'No replies yet 💌')));
}

// ---------- boxes ----------
function boxCard(b, i, draw) {
  const dark = DARK[b.theme], letters = (b.letters || []).length;
  return h('div', { class: 'bcard', style: 'background:' + (GRAD[b.theme] || GRAD.rose) + ';color:' + (dark ? '#f5e8ff' : '#4a1630') },
    h('div', { class: 'ic' }, b.icon || '💌'), h('h4', {}, b.title || 'Untitled'), h('p', {}, b.subtitle || ''),
    h('div', { class: 'tags' }, h('span', { class: 'tag' }, (KINDS.find(k => k[0] === b.kind) || [0, b.kind])[1].split(' (')[0]), b.kind === 'letters' ? h('span', { class: 'tag' }, letters + ' letters') : null, b.kind === 'letters' ? h('span', { class: 'tag' }, (LAYOUTS.find(l => l[0] === b.layout) || LAYOUTS[0])[1]) : null, b.pin ? h('span', { class: 'tag' }, '🔒 PIN') : null, b.unlockAt ? h('span', { class: 'tag' }, '📅 ' + b.unlockAt) : null),
    h('div', { class: 'acts' }, h('button', { class: 'btn sm', onclick: () => editBox(b, draw) }, '✏️ Edit'), b.kind === 'letters' ? h('button', { class: 'btn sm', onclick: () => go('letters/' + b.id) }, '💌 Letters') : null,
      ib('↑', () => mv(S.C.boxes, i, -1, draw)), ib('↓', () => mv(S.C.boxes, i, 1, draw)),
      ib('⧉', () => { const c = JSON.parse(JSON.stringify(b)); c.id = rid('b'); c.title += ' (copy)'; (c.letters || []).forEach(l => { l.id = rid('l'); }); S.C.boxes.splice(i + 1, 0, c); mark(); draw(); }),
      ib('🗑', async () => { if (await ask('Delete the box “' + (b.title || 'Untitled') + '” and all its letters?')) { S.C.boxes.splice(i, 1); mark(); draw(); } }, 'del')));
}
function editBox(b, after) {
  const body = h('div'), draw = () => { body.innerHTML = '';
    body.append(F('Title', b, 'title'), F('Short description', b, 'subtitle'), emojiField(b, 'icon'), Sel('Type', b, 'kind', KINDS, draw));
    if (b.kind === 'letters') body.append(h('div', { class: 'grp' }, h('h4', {}, '🎨 Layout & design'), Sel('Layout (how the letters look)', b, 'layout', LAYOUTS), Sel('Floating decoration', b, 'decor', DECORS),
      h('div', { class: 'fld' }, h('span', { class: 'lab' }, 'Colors'), h('div', { class: 'sw' }, THEMES.map(t => h('button', { type: 'button', class: b.theme === t[0] ? 'on' : '', title: t[2], style: 'background:' + t[1], onclick: () => { b.theme = t[0]; mark(); draw(); } })))), Tg('Visitors can reply to each letter', b, 'replies', 'Replies appear in Admin → Replies, where you can answer them.'))); 
    else body.append(h('div', { class: 'fld' }, h('span', { class: 'lab' }, 'Card color'), h('div', { class: 'sw' }, THEMES.map(t => h('button', { type: 'button', class: b.theme === t[0] ? 'on' : '', title: t[2], style: 'background:' + t[1], onclick: () => { b.theme = t[0]; mark(); draw(); } })))));
    if (b.kind === 'link') body.append(F('Link (https://… or /page)', b, 'target'));
    if (b.kind === 'letters') body.append(h('div', { class: 'grp' }, h('h4', {}, '🔒 Protection (optional)'), F('Secret PIN for this box', b, 'pin', { hint: 'Letters stay hidden until this PIN is typed. Leave empty for an open box.' }), F('Opens on', b, 'unlockAt', { type: 'date', hint: 'The box stays locked until this date (Bangladesh time).' }), F('Message while locked', b, 'lockMessage'))); };
  draw(); modal('Edit box', body, { wide: true, actions: [{ label: 'Done', cls: 'primary', fn: () => { after(); } }] });
}
function presetPicker(draw) {
  const body = h('div'), close = modal('Choose a preset for your new box', body, { wide: true, actions: [{ label: 'Cancel', cls: 'ghost' }] });
  const mk = p => { const b = { id: rid('b'), kind: 'letters', pin: '', unlockAt: '', lockMessage: '', target: '', replies: true, ...(p ? p.box : { title: 'New box', subtitle: '', icon: '💌', theme: 'rose', layout: 'accordion', decor: 'hearts' }), letters: (p ? p.sample : []).map(([emoji, title, text]) => ({ id: rid('l'), emoji, title, photoId: '', body: text })) };
    S.C.boxes.push(b); mark(); close(); draw(); editBox(b, draw); };
  body.append(h('p', { class: 'mut' }, 'A preset is a ready-made layout + design. You can change every part afterwards.'),
    h('div', { class: 'presets' }, PRESETS.map(p => h('button', { type: 'button', class: 'preset', style: 'background:' + GRAD[p.box.theme] + ';color:' + (DARK[p.box.theme] ? '#f5e8ff' : '#4a1630'), onclick: () => mk(p) },
      h('span', { class: 'pe' }, p.emoji), h('b', {}, p.name), h('small', {}, p.desc), h('em', {}, (LAYOUTS.find(l => l[0] === p.box.layout) || [0, ''])[1])))),
    h('button', { class: 'btn ghost', style: 'margin-top:12px', onclick: () => mk(null) }, '✨ Start from scratch (choose layout & design myself)'));
}
function boxesPage() {
  const C = S.C, grid = h('div', { class: 'bgrid' });
  const draw = () => { grid.innerHTML = ''; C.boxes.forEach((b, i) => grid.append(boxCard(b, i, draw)));
    grid.append(h('button', { class: 'bnew', onclick: () => presetPicker(draw) }, '＋ New box')); };
  draw();
  return h('div', {}, sec('Home page', 'The first page visitors see. Every box is a gift-box card that opens its own page.', F('Title', C, 'hubTitle'), F('Sentence under the title', C, 'hubSubtitle')), grid);
}

// ---------- letters ----------
function editLetter(l, after, serial) {
  const body = h('div'), cnt = h('small', {}, (l.body || '').length + ' characters — no limit'), draw = () => { body.innerHTML = '';
    body.append(h('p', { class: 'mut' }, 'Letter #' + serial), emojiField(l, 'emoji', 'Emoji'), F('Title', l, 'title'), imgField('Photo for this letter (optional)', l, 'photoId'),
      F('Letter (Bangla or English) — as long as you like', l, 'body', { area: 1, rows: 12, on: v => { cnt.textContent = v.length + ' characters — no limit'; } }), cnt); };
  draw(); modal('Edit letter', body, { wide: true, actions: [{ label: 'Done', cls: 'primary', fn: () => { after(); } }] });
}
function lettersPage(arg) {
  const C = S.C, lbx = C.boxes.filter(b => b.kind === 'letters');
  if (!lbx.length) return h('div', { class: 'empty' }, 'Create a letter box first (Home & Boxes).');
  const box = lbx.find(b => b.id === arg) || lbx[0], arr = box.letters, msg = h('div');
  const src = h('div', { class: 'lsrc' }, lbx.map(b => h('a', { class: 'src' + (b.id === box.id ? ' on' : ''), href: '#/letters/' + b.id }, h('span', {}, (b.icon || '💌') + ' ' + b.title), h('em', {}, (b.letters || []).length))),
    h('a', { class: 'src', href: '#/photos' }, h('span', {}, '📸 Photo Letters page'), h('em', {}, '→')));
  const list = h('div'), draw = () => { list.innerHTML = '';
    if (!arr.length) list.append(h('div', { class: 'empty' }, 'No letters yet. Write the first one 💌'));
    arr.forEach((l, i) => list.append(h('div', { class: 'lrow' }, h('div', { class: 'no' }, '#' + (i + 1)), l.photoId ? h('img', { src: photoSrc(l.photoId), alt: '' }) : h('div', { class: 'em' }, l.emoji || '💌'),
      h('div', { class: 'lt' }, h('b', {}, l.title || '(untitled)'), h('p', {}, (l.body || '').replace(/\s+/g, ' ') || 'No text yet'), h('small', {}, (l.body || '').length + ' characters')),
      h('div', { class: 'li-a' }, h('button', { class: 'btn sm', onclick: () => editLetter(l, draw, i + 1) }, '✏️ Edit'), ib('↑', () => mv(arr, i, -1, draw)), ib('↓', () => mv(arr, i, 1, draw)),
        ib('⧉', () => { arr.splice(i + 1, 0, { ...l, id: rid('l'), title: (l.title || '') + ' (copy)' }); mark(); draw(); }),
        ib('🗑', async () => { if (await ask('Delete the letter “' + (l.title || 'untitled') + '”?')) { arr.splice(i, 1); mark(); draw(); } }, 'del')))));
    list.append(h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { const l = { id: rid('l'), emoji: '💌', title: '', photoId: '', body: '' }; arr.push(l); mark(); draw(); editLetter(l, draw, arr.length); } }, '＋ New letter'),
      dropZone('📸 Add letters from photos', 'Choose many photos — you get one letter per photo, in order', async f => { await uploadMany(f, p => arr.push({ id: rid('l'), emoji: '💌', title: '', photoId: p.id, body: '' }), msg); draw(); }))); };
  draw();
  const head = sec((box.icon || '💌') + ' ' + box.title, box.subtitle || '', h('div', { class: 'row' }, h('button', { class: 'btn sm', onclick: () => editBox(box, () => route()) }, '⚙️ Box settings'), h('span', { class: 'badge' }, (LAYOUTS.find(x => x[0] === box.layout) || LAYOUTS[0])[1]), box.pin ? h('span', { class: 'badge' }, '🔒 PIN ' + box.pin) : null, box.unlockAt ? h('span', { class: 'badge' }, '📅 opens ' + box.unlockAt) : null, box.replies === false ? h('span', { class: 'badge' }, 'replies off') : h('span', { class: 'badge g' }, '💬 replies on')),
    h('p', { class: 'mut', style: 'margin-top:10px' }, 'Letters show on the site in this order (#1 first). Every letter has no length limit and can have its own photo.'));
  return h('div', { class: 'split' }, src, h('div', {}, head, msg, list));
}

// ---------- photo letters (own photos + own letters, separate from the birthday page) ----------
function editPhotoLetter(l, after, serial) {
  const body = h('div'), cnt = h('small', {}, (l.body || '').length + ' characters — no limit'), draw = () => { body.innerHTML = '';
    body.append(h('p', { class: 'mut' }, 'Photo letter #' + serial), imgField('Photo', l, 'photoId'), F('Caption under the photo (optional)', l, 'caption'), F('Letter title', l, 'title'),
      F('Letter — as long as you like', l, 'body', { area: 1, rows: 12, on: v => { cnt.textContent = v.length + ' characters — no limit'; } }), cnt); };
  draw(); modal('Edit photo letter', body, { wide: true, actions: [{ label: 'Done', cls: 'primary', fn: () => { after(); } }] });
}
function photosPage() {
  const C = S.C, arr = C.photoLetters, msg = h('div'), grid = h('div', { class: 'pgrid' });
  const draw = () => { grid.innerHTML = ''; if (!arr.length) grid.append(h('div', { class: 'empty', style: 'grid-column:1/-1' }, 'No photo letters yet. Upload your first photo 📸'));
    arr.forEach((l, i) => grid.append(h('div', { class: 'pcard' }, l.photoId ? h('img', { src: photoSrc(l.photoId), alt: '' }) : h('div', { class: 'noimg' }, '📷 no photo'),
      h('div', { class: 'pb' }, h('div', {}, h('b', {}, '#' + (i + 1) + ' ' + (l.title || 'Untitled')), ' ', h('span', { class: 'badge' + ((l.body || '').trim() ? ' g' : '') }, (l.body || '').trim() ? '✍️ letter' : 'no letter')),
        h('small', {}, l.caption || 'no caption'), h('div', { class: 'acts' }, h('button', { class: 'btn sm', onclick: () => editPhotoLetter(l, draw, i + 1) }, '✏️ Edit'), ib('↑', () => mv(arr, i, -1, draw)), ib('↓', () => mv(arr, i, 1, draw)),
          ib('🗑', async () => { if (await ask('Delete this photo letter?')) { arr.splice(i, 1); mark(); draw(); } }, 'del')))))); };
  draw();
  return h('div', {}, sec('📸 Photo Letters page', 'This page has its own photos and its own letters — nothing here is connected to the Birthday website. Every photo has one letter; visitors can reply to each.',
    h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { const l = { id: rid('p'), photoId: '', caption: '', title: '', body: '' }; arr.push(l); mark(); draw(); editPhotoLetter(l, draw, arr.length); } }, '＋ New photo letter'))),
    dropZone('📤 Drag & drop photos here', 'or click — each photo becomes a new photo letter (you write the letter afterwards)', async f => { await uploadMany(f, p => arr.push({ id: rid('p'), photoId: p.id, caption: '', title: '', body: '' }), msg); draw(); }), msg, grid);
}

// ---------- birthday page (+ its own gallery photos) ----------
function pairs(arr) {
  const box = h('div'), draw = () => { box.innerHTML = '';
    arr.forEach((x, i) => { const a = h('input', { class: 'in', placeholder: 'Button label' }), b = h('input', { class: 'in', placeholder: 'Caption shown under the photo frame' }); a.value = x.label || ''; b.value = x.caption || '';
      a.oninput = () => { x.label = a.value; mark(); }; b.oninput = () => { x.caption = b.value; mark(); };
      box.append(h('div', { class: 'li' }, a, b, h('div', { class: 'li-a' }, ib('↑', () => mv(arr, i, -1, draw)), ib('↓', () => mv(arr, i, 1, draw)), ib('✕', () => { arr.splice(i, 1); mark(); draw(); }, 'del')))); });
    box.append(h('button', { class: 'btn ghost sm', onclick: () => { arr.push({ label: '', caption: '' }); mark(); draw(); } }, '＋ Add button')); };
  draw(); return box;
}
function galleryEditor() {
  const arr = S.C.gallery, msg = h('div'), grid = h('div', { class: 'pgrid' });
  const draw = () => { grid.innerHTML = ''; if (!arr.length) grid.append(h('div', { class: 'empty', style: 'grid-column:1/-1' }, 'No gallery photos yet 📸'));
    arr.forEach((g, i) => grid.append(h('div', { class: 'pcard' }, h('div', { class: 'pb' }, imgField('', g, 'photoId'), F('Caption', g, 'caption', { ph: 'empty = a new cute line every time' }), h('div', { class: 'acts' }, h('b', {}, '#' + (i + 1)), ib('↑', () => mv(arr, i, -1, draw)), ib('↓', () => mv(arr, i, 1, draw)), ib('🗑', async () => { if (await ask('Remove this photo from the gallery?')) { arr.splice(i, 1); mark(); draw(); } }, 'del')))))); };
  draw();
  return h('div', {}, h('div', { class: 'row', style: 'margin:8px 0' }, h('button', { class: 'btn primary', onclick: () => { arr.push({ id: rid('g'), photoId: '', caption: '' }); mark(); draw(); } }, '＋ Add one photo')),
    dropZone('📤 Drag & drop photos here', 'or click — add as many as you like', async f => { await uploadMany(f, p => arr.push({ id: rid('g'), photoId: p.id, caption: '' }), msg); draw(); }), msg, grid);
}
function birthdayPage() {
  const C = S.C, lab = h('div', { class: 'two' }, LABELS.map(([k, t, a]) => F(t, C.labels, k, { area: a, rows: 2 })));
  return h('div', {},
    sec('Envelope & title', 'What she sees first on the birthday page.', F('Envelope heading', C, 'intro'), h('div', { class: 'two' }, F('Main title (🎂 is added)', C, 'title'), F('Small line above the title', C, 'subtitle'))),
    sec('The main letter', 'Typed out letter by letter when she opens the envelope. One box = one paragraph.', L(C.letter, { area: 1, rows: 4, add: 'Add paragraph' })),
    sec('📸 Love Gallery photos', 'These photos belong only to the birthday page. They are not linked to the Photo Letters page.', F('Gallery title', C, 'galleryTitle'), galleryEditor()),
    sec('“This is us” buttons', 'Little buttons that change the caption under the picture.', pairs(C.chips)),
    sec('My Promises', 'One promise per row.', L(C.promises, { add: 'Add promise' })),
    sec('Hug button messages', 'Shown one after another each time she taps “Send you a hug”.', L(C.hug, { add: 'Add message' })),
    sec('Love Timer', 'Pick the date you got together to show a live timer.', h('div', { class: 'two' }, F('Together since', C, 'togetherSince', { type: 'date', hint: 'Leave empty to hide the timer.' }), F('Timer text', C, 'togetherLabel'))),
    sec('Texts & labels', 'Change any title or button text on the birthday page. Leave a box empty to use the original text.', lab));
}

// ---------- auto text ----------
const gen = list => { const t = list[Math.random() * list.length | 0], p = a => a[Math.random() * a.length | 0]; return p(t.emoji) + ' ' + p(t.starts) + ' ' + p(t.ends); };
function themeSet(key, title, desc) {
  const list = S.C[key], box = h('div'), out = h('div'), draw = () => { box.innerHTML = '';
    list.forEach((t, i) => { const e = h('input', { class: 'in' }), a = h('textarea', { class: 'in', rows: 4 }), b = h('textarea', { class: 'in', rows: 4 });
      e.value = t.emoji.join(' '); a.value = t.starts.join('\n'); b.value = t.ends.join('\n');
      e.oninput = () => { t.emoji = e.value.split(/\s+/).filter(Boolean); mark(); }; a.oninput = () => { t.starts = a.value.split('\n').map(x => x.trim()).filter(Boolean); mark(); }; b.oninput = () => { t.ends = b.value.split('\n').map(x => x.trim()).filter(Boolean); mark(); };
      box.append(h('div', { class: 'grp' }, h('div', { class: 'row', style: 'justify-content:space-between;margin-top:10px' }, h('h4', {}, 'Theme ' + (i + 1)), list.length > 1 ? ib('🗑', () => { list.splice(i, 1); mark(); draw(); }, 'del') : null),
        h('label', { class: 'fld' }, h('span', { class: 'lab' }, 'Emojis for this theme (separate with spaces)'), e),
        h('div', { class: 'two' }, h('label', { class: 'fld' }, h('span', { class: 'lab' }, 'Beginnings (one per line)'), a), h('label', { class: 'fld' }, h('span', { class: 'lab' }, 'Endings (one per line)'), b)))); }); };
  draw();
  return sec(title, desc, box, h('div', { class: 'row', style: 'margin-top:12px' }, h('button', { class: 'btn sm', onclick: () => { list.push({ emoji: ['💖'], starts: ['My love,'], ends: ['you are my everything!'] }); mark(); draw(); } }, '＋ Add theme'),
    h('button', { class: 'btn sm', onclick: () => { out.innerHTML = ''; const ok = list.every(t => t.emoji.length && t.starts.length && t.ends.length); if (!ok) { out.append(h('p', { class: 'mut' }, 'Every theme needs at least 1 emoji, 1 beginning and 1 ending.')); return; } for (let k = 0; k < 5; k++) out.append(h('div', { class: 'sample' }, gen(list))); } }, '🎲 Preview 5 samples')), out);
}
const generatorsPage = () => h('div', {}, themeSet('momentThemes', 'Our Cute Moments', 'Endless new lines: a random beginning + a random ending from one theme, with that theme’s emoji. More beginnings/endings = more variety.'),
  themeSet('reasonThemes', 'Reasons I love you', 'Same idea for the “Another reason” button.'), themeSet('photoThemes', 'Photo captions', 'The cute/naughty line typed under a photo when you left its caption empty.'));

// ---------- replies: every letter's conversation ----------
function metaOf(scope, item) {
  if (scope === 'chat') return { title: '💬 Direct messages', sub: 'Messages written on the website', letter: null };
  if (scope === 'photos') { const l = S.C.photoLetters.find(x => x.id === item); return { title: '📸 Photo letter' + (l ? ' · ' + (l.title || 'untitled') : ' (deleted)'), sub: 'Photo Letters page', letter: l ? { title: l.title, body: l.body, photo: photoSrc(l.photoId), emoji: '📸' } : null }; }
  const b = S.C.boxes.find(x => x.id === scope), l = b && (b.letters || []).find(x => x.id === item);
  return { title: (b ? (b.icon || '') + ' ' + b.title : scope) + ' · ' + (l ? (l.title || 'untitled') : 'deleted letter'), sub: b ? b.title : '', letter: l ? { title: l.title, body: l.body, photo: photoSrc(l.photoId), emoji: l.emoji } : null };
}
function threadList() {
  const m = new Map([['chat.main', { key: 'chat.main', scope: 'chat', item: 'main', msgs: [], last: '' }]]);
  S.replies.forEach(r => { const k = r.scope + '.' + r.item; if (!m.has(k)) m.set(k, { key: k, scope: r.scope, item: r.item, msgs: [], last: '' }); const t = m.get(k); t.msgs.push(r); t.last = r.at; });
  return [...m.values()].sort((a, b) => (b.last || '').localeCompare(a.last || ''));
}
function navBadge() { const n = unread(), b = $('#nav a[data-r="replies"] .bd'); if (b) { b.textContent = n; b.hidden = !n; } }
async function loadReplies() { S.replies = (await api('/api/admin/replies')).replies; navBadge(); }
async function repliesPage(arg) {
  await loadReplies();
  const threads = threadList(), cur = threads.find(t => t.key === arg) || threads.find(t => t.msgs.some(r => r.from === 'visitor' && !r.read)) || threads[0];
  const side = h('div', { class: 'lsrc thl' }, threads.map(t => { const u = t.msgs.filter(r => r.from === 'visitor' && !r.read).length, lm = t.msgs[t.msgs.length - 1];
    return h('a', { class: 'src' + (t.key === cur.key ? ' on' : ''), href: '#/replies/' + t.key }, h('span', { class: 'tt' }, h('b', {}, metaOf(t.scope, t.item).title), h('small', {}, lm ? (lm.from === 'admin' ? 'You: ' : '') + lm.body.slice(0, 40) : 'No messages yet')), u ? h('em', { class: 'unr' }, u) : null); }));
  const meta = metaOf(cur.scope, cur.item), view = h('div');
  const drawMsgs = h('div', { class: 'conv' }), draw = () => { drawMsgs.innerHTML = '';
    if (!cur.msgs.length) drawMsgs.append(h('div', { class: 'empty' }, 'No messages yet.'));
    cur.msgs.forEach(r => drawMsgs.append(h('div', { class: 'cb ' + (r.from === 'admin' ? 'mine' : 'theirs') }, h('div', { class: 'ct' }, r.body), h('small', {}, (r.from === 'admin' ? 'You' : 'She/He') + ' · ' + new Date(r.at).toLocaleString() + ' '), ib('🗑', async () => { if (!await ask('Delete this message?')) return; try { await api('/api/admin/replies/' + r.id, 'DELETE'); S.replies = S.replies.filter(x => x.id !== r.id); cur.msgs = cur.msgs.filter(x => x.id !== r.id); draw(); navBadge(); } catch (e) { toast(e.message, 'err'); } }, 'del sm')))); };
  draw();
  const ta = h('textarea', { class: 'in', rows: 3, placeholder: 'Write your reply… (Ctrl+Enter to send)' }), send = async () => { const body = ta.value.trim(); if (!body) return ta.focus();
    try { const d = await api('/api/admin/replies', 'POST', { scope: cur.scope, item: cur.item, body }); S.replies = d.replies; cur.msgs = S.replies.filter(r => r.scope === cur.scope && r.item === cur.item); ta.value = ''; draw(); toast('Reply sent ✓ (live on the site)'); } catch (e) { toast(e.message, 'err'); } };
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); send(); } });
  view.append(h('div', { class: 'card' }, h('h3', {}, meta.title), meta.letter ? h('details', { class: 'orig', open: true }, h('summary', {}, 'The letter'), h('div', { class: 'olt' }, meta.letter.photo ? h('img', { src: meta.letter.photo, alt: '' }) : null, h('div', {}, h('b', {}, (meta.letter.emoji || '') + ' ' + (meta.letter.title || '')), h('p', {}, meta.letter.body || '')))) : h('p', { class: 'mut' }, meta.sub),
    drawMsgs, h('div', { class: 'fld' }, ta), h('div', { class: 'row', style: 'margin-top:8px' }, h('button', { class: 'btn primary', onclick: send }, '💌 Send reply'), h('span', { class: 'mut' }, 'Your reply appears under the letter on the site, like a conversation.'))));
  const unreadHere = cur.msgs.some(r => r.from === 'visitor' && !r.read);
  if (unreadHere) api('/api/admin/replies/read', 'POST', { scope: cur.scope, item: cur.item }).then(() => { S.replies.forEach(r => { if (r.scope === cur.scope && r.item === cur.item) r.read = true; }); navBadge(); }).catch(() => {});
  return h('div', { class: 'split' }, side, view);
}

// ---------- settings ----------
function settingsPage() {
  const C = S.C, pw = { current: '', next: '', again: '' };
  const wa = F('WhatsApp number', C, 'whatsapp', { hint: 'The “Send on WhatsApp” button on the birthday page opens this number. Example: 01794608874 or +8801794608874.' });
  const imp = h('input', { type: 'file', accept: 'application/json,.json', hidden: true });
  imp.addEventListener('change', async () => { try { const o = JSON.parse(await imp.files[0].text()); if (!o || !Array.isArray(o.boxes)) throw new Error('This is not a backup file'); S.C = { ...S.C, ...o, photos: S.C.photos }; mark(); toast('Backup loaded — press “Save & go live” to apply'); route(); } catch (e) { toast(e.message, 'err'); } imp.value = ''; });
  return h('div', {},
    sec('🔐 Website entrance PIN', 'Visitors must type this PIN before they can see anything on the website. Change it any time, then press “Save & go live”.', Tg('Ask for the PIN when someone opens the website', C, 'sitePinOn', 'Turn off to let everyone with the link in.'),
      h('div', { class: 'two' }, F('Entrance PIN', C, 'sitePin', { hint: 'Numbers or letters, 3–20 characters. Changing it logs everybody out of the site.' }), F('Heading on the PIN screen', C, 'gateTitle')), F('Small text under the heading', C, 'gateHint')),
    sec('Contact', 'Where visitors’ letters go.', wa, h('div', { class: 'fld' }, h('span', { class: 'lab' }, 'Quick-reply buttons in the message box'), L(C.quick, { add: 'Add reply' }))),
    sec('Auto text with AI', '', Tg('Use Claude AI to write brand-new lines', C, 'useAI', S.status.ai ? 'AI key found on the server ✓' : 'Needs ANTHROPIC_API_KEY on the server. Without it the built-in generator is used.')),
    sec('Security', 'Change the admin password (this is the password for this admin panel, not the website PIN).', h('div', { class: 'two' }, F('Current password', pw, 'current', { type: 'password' }), h('div')), h('div', { class: 'two' }, F('New password (min 6)', pw, 'next', { type: 'password' }), F('Repeat new password', pw, 'again', { type: 'password' })),
      h('button', { class: 'btn primary', style: 'margin-top:12px', onclick: async () => { if (pw.next !== pw.again) return toast('The new passwords do not match', 'err'); try { await api('/api/admin/password', 'POST', { current: pw.current, next: pw.next }); S.me.defaultPass = false; toast('Password changed ✓'); route(); } catch (e) { toast(e.message, 'err'); } } }, 'Change password')),
    sec('Backup', 'Download all your texts, boxes and letters. Photos stay on the server.', h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(S.C, null, 2)], { type: 'application/json' })), download: 'love-universe-backup-' + new Date().toISOString().slice(0, 10) + '.json' }); document.body.append(a); a.click(); a.remove(); } }, '⬇️ Export backup'), h('button', { class: 'btn', onclick: () => imp.click() }, '⬆️ Import backup'), imp)),
    sec('System', '', h('p', {}, 'Storage: ', h('b', {}, { files: 'Files on this server', redis: 'Upstash Redis ✓', none: '⚠️ Not set up (Vercel)' }[S.status.storage] || '—')), S.status.storage === 'none' ? storageSteps() : null));
}

// ---------- shell ----------
const PG = { dashboard, boxes: boxesPage, letters: lettersPage, photos: photosPage, birthday: birthdayPage, replies: repliesPage, generators: generatorsPage, settings: settingsPage };
function buildNav() { const nav = $('#nav'); nav.innerHTML = ''; for (const k in PAGES) nav.append(h('a', { 'data-r': k, href: '#/' + k, onclick: () => $('#sb').classList.remove('open') }, h('span', {}, PAGES[k][1]), PAGES[k][0], k === 'replies' ? h('span', { class: 'bd', hidden: true }) : null)); navBadge(); }
async function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/'), r = PG[parts[0]] ? parts[0] : 'dashboard'; S.route = [r, parts[1] || ''];
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('on', a.dataset.r === r)); $('#ptitle').textContent = PAGES[r][1] + ' ' + PAGES[r][0];
  const tok = ++routeTok, v = $('#view'); v.innerHTML = '';
  let node; try { node = await PG[r](parts[1] || ''); } catch (e) { node = h('div', { class: 'empty' }, 'Could not load this page: ' + e.message); }
  if (tok !== routeTok) return; v.innerHTML = '';
  if (S.status.storage === 'none') v.append(h('div', { class: 'card alert' }, h('h3', {}, '⚠️ One-time setup: add a database'), h('p', {}, 'Your changes cannot go live yet — Vercel has no permanent storage. This takes about 2 minutes:'), storageSteps()));
  v.append(node); window.scrollTo(0, 0);
}
function validate() {
  for (const k of ['momentThemes', 'reasonThemes', 'photoThemes']) if (!S.C[k].length || !S.C[k].every(t => t.emoji.length && t.starts.length && t.ends.length)) { toast('Auto text: every theme needs at least 1 emoji, 1 beginning and 1 ending', 'err'); go('generators'); return false; }
  if (S.C.sitePinOn !== false && !String(S.C.sitePin || '').trim()) { toast('Type an entrance PIN, or turn the entrance PIN off', 'err'); go('settings'); return false; }
  return true;
}
async function save() {
  if (S.status.storage === 'none') return storageModal();
  if (!validate()) return; const b = $('#save'); b.disabled = true;
  try { await api('/api/admin/content', 'PUT', S.C); S.C = await api('/api/admin/content'); S.dirty = false; updateBar(); toast('Saved — your site is live ✓'); route(); } catch (e) { toast(e.message, 'err'); b.disabled = false; }
}
function showLogin() { $('#app').hidden = true; $('#login').hidden = false; setTimeout(() => $('#pw').focus(), 50); }
async function boot() {
  try { S.me = await api('/api/admin/me'); } catch { return showLogin(); }
  if (!S.me.authed) return showLogin();
  try { [S.C, S.status] = await Promise.all([api('/api/admin/content'), api('/api/admin/status')]); S.replies = (await api('/api/admin/replies')).replies; } catch (e) { return toast(e.message, 'err'); }
  S.dirty = false; $('#login').hidden = true; $('#app').hidden = false; buildNav(); updateBar(); route();
}
$('#go').onclick = async () => { try { await api('/api/login', 'POST', { password: $('#pw').value }); $('#pw').value = ''; $('#lerr').textContent = ''; boot(); } catch (e) { $('#lerr').textContent = e.message; } };
$('#pw').onkeydown = e => { if (e.key === 'Enter') $('#go').click(); };
$('#logout').onclick = async () => { await api('/api/logout', 'POST', {}).catch(() => {}); S.dirty = false; showLogin(); };
$('#save').onclick = save;
$('#discard').onclick = async () => { if (await ask('Discard all unsaved changes?', 'Discard')) { S.C = await api('/api/admin/content'); S.dirty = false; updateBar(); route(); } };
$('#burger').onclick = () => $('#sb').classList.toggle('open');
addEventListener('hashchange', () => { if (S.C) route(); });
addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && S.C) { e.preventDefault(); if (S.dirty) save(); } });
addEventListener('beforeunload', e => { if (S.dirty) { e.preventDefault(); e.returnValue = ''; } });
setInterval(() => { if (S.C && !document.hidden) loadReplies().catch(() => {}); }, 45000);   // new-reply badge
window.ADMIN = { S, go, route, save, boot };
boot();
})();
