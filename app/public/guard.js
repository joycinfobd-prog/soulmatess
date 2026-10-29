// Website entrance PIN. Asks for the PIN (set in Admin -> Settings) before any page shows.
(() => {
  const st = document.createElement('style'); st.id = 'gst'; st.textContent = 'html{visibility:hidden}'; document.head.appendChild(st);
  const show = () => { const e = document.getElementById('gst'); if (e) e.remove(); };
  function build(g) {
    const o = document.createElement('div');
    o.style.cssText = 'position:fixed;inset:0;z-index:999999;display:grid;place-items:center;padding:20px;background:linear-gradient(160deg,#ffe0ec,#ffb3cf);font-family:Quicksand,"Hind Siliguri",system-ui,sans-serif;color:#4a1730';
    o.innerHTML = '<div style="background:rgba(255,255,255,.75);backdrop-filter:blur(8px);border-radius:24px;padding:30px 24px;width:min(340px,100%);text-align:center;box-shadow:0 18px 44px rgba(214,51,108,.28)">' +
      '<div style="font-size:46px">🔐</div><h2 style="font:italic 700 26px/1.2 \'Cormorant Garamond\',\'Hind Siliguri\',serif;color:#d6336c;margin:6px 0"></h2><p style="margin:0 0 14px;opacity:.85;font-size:14px"></p>' +
      '<input id="gpin" type="password" inputmode="numeric" autocomplete="off" placeholder="• • • •" style="width:100%;padding:12px;border:1px solid #f0b3c8;border-radius:14px;font:600 20px Quicksand,sans-serif;text-align:center;letter-spacing:8px;background:#fff;color:#3a1226">' +
      '<button id="ggo" style="margin-top:12px;width:100%;border:0;border-radius:999px;padding:12px;font:700 15px Quicksand,sans-serif;color:#fff;background:linear-gradient(135deg,#ff5d8f,#d6336c);cursor:pointer;box-shadow:0 6px 16px rgba(214,51,108,.3)">Open ♥</button>' +
      '<div id="gerr" style="color:#b0244f;font-weight:700;font-size:12px;min-height:18px;margin-top:10px"></div></div>';
    o.querySelector('h2').textContent = g.title || 'Our little secret 💖'; o.querySelector('p').textContent = g.hint || '';
    document.documentElement.appendChild(o); document.documentElement.style.overflow = 'hidden'; show();
    const inp = o.querySelector('#gpin'), err = o.querySelector('#gerr');
    const go = async () => {
      const pin = inp.value.trim(); if (!pin) return inp.focus();
      try { const r = await fetch('/api/gate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ pin }) }), d = await r.json().catch(() => ({})); if (r.ok) return location.reload(); err.textContent = d.error || 'Try again'; inp.value = ''; inp.focus(); }
      catch { err.textContent = 'No connection. Try again 💔'; }
    };
    o.querySelector('#ggo').onclick = go; inp.onkeydown = e => { if (e.key === 'Enter') go(); }; setTimeout(() => inp.focus(), 60);
  }
  fetch('/api/gate', { credentials: 'same-origin' }).then(r => r.json()).then(g => (g.needed ? build(g) : show())).catch(show);
})();
