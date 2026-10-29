// shared helpers for hub / box / letter / chat pages
const DECOR = { hearts: ['✦', '♥', '♡'], diya: ['🪔', '✨', '🌼'], flowers: ['🌸', '🌼', '🌺', '✿'], stars: ['✦', '⭐', '✧'], none: [] };
window.L = {
  $: s => document.querySelector(s),
  api: (u, o) => fetch(u, o).then(async r => { const d = await r.json().catch(() => ({})); if (!r.ok) throw Object.assign(new Error(d.error || 'Error'), { status: r.status, data: d }); return d; }),
  // real "back": go to the previous page if it was ours, otherwise to a safe fallback
  back(fallback) { let ok = false; try { ok = new URL(document.referrer).origin === location.origin; } catch {} if (ok && history.length > 1) history.back(); else location.href = fallback || '/'; },
  burst(el, n = 8) { const r = el.getBoundingClientRect(); for (let i = 0; i < n; i++) { const e = document.createElement('span'); e.className = 'pop'; e.textContent = ['❤️', '💖', '✨', '💕'][i % 4]; e.style.left = r.left + r.width / 2 + 'px'; e.style.top = r.top + 'px'; e.style.setProperty('--dx', (Math.random() - .5) * 160 + 'px'); e.style.setProperty('--dy', -40 - Math.random() * 90 + 'px'); document.body.appendChild(e); setTimeout(() => e.remove(), 1100); } },
  decor: DECOR.hearts, frame: '♥ ♡ ♥ ♡ ♥',
  setDecor(n) { this.decor = DECOR[n] || DECOR.hearts; this.frame = ({ hearts: '♥ ♡ ♥ ♡ ♥', diya: '🪔 ✦ 🪔 ✦ 🪔', flowers: '❀ ✿ ❀ ✿ ❀', stars: '✦ ✧ ✦ ✧ ✦', none: '' })[n] || ''; },
  // a letter's conversation: replies so far + a box to write a new reply
  thread(o) {
    const w = document.createElement('div'); w.className = 'thr'; let list = o.replies || [];
    const fmt = t => { try { return new Date(t).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); } catch { return ''; } };
    const lw = document.createElement('div'); lw.className = 'thr-l'; w.append(lw);
    const draw = () => { lw.innerHTML = ''; list.forEach(r => { const b = document.createElement('div'); b.className = 'bub ' + (r.from === 'admin' ? 'me' : 'you'); const t = document.createElement('div'); t.className = 'bt'; t.textContent = r.body; const m = document.createElement('small'); m.textContent = (r.from === 'admin' ? '💌 ' : '') + fmt(r.at); b.append(t, m); lw.append(b); }); };
    draw();
    if (o.canReply !== false) {
      const f = document.createElement('div'); f.className = 'thr-f'; f.innerHTML = '<textarea rows="2" placeholder="Write your reply… 💬"></textarea><button class="btn" type="button">Send ♥</button><div class="err"></div>';
      const ta = f.querySelector('textarea'), bt = f.querySelector('button'), er = f.querySelector('.err');
      bt.onclick = async () => { const body = ta.value.trim(); if (!body) return ta.focus(); bt.disabled = true; er.textContent = '';
        try { const d = await L.api('/api/reply', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ scope: o.scope, item: o.item, body, pin: sessionStorage.getItem('pin_' + o.scope) || '' }) }); list = d.replies; ta.value = ''; draw(); L.burst(bt, 5); }
        catch (e) { er.textContent = e.message; } bt.disabled = false; };
      w.append(f);
    }
    return w;
  }
};
setInterval(() => { const d = L.decor; if (!d.length) return; const e = document.createElement('span'); e.className = 'fl'; e.textContent = d[Math.random() * d.length | 0]; e.style.left = Math.random() * 100 + 'vw'; e.style.fontSize = 8 + Math.random() * 10 + 'px'; e.style.color = ['#ffb84d', '#ff5d8f', '#fff'][Math.random() * 3 | 0]; document.body.appendChild(e); setTimeout(() => e.remove(), 5000); }, 900);
